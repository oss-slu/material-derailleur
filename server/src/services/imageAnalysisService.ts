// src/services/imageAnalysisService.ts
import { GoogleGenAI, createUserContent, createPartFromBase64 } from '@google/genai';
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// --- Env / client ---
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
if (!API_KEY) {
  console.warn('[imageAnalysis] GOOGLE_GEMINI_API_KEY is not set');
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Types ---
export interface ImageTag {
  description: string;
  confidence: number;
  category: 'item_type' | 'condition' | 'damage' | 'other';
}
export interface AnalysisResult {
  tags: ImageTag[];
  rawResponse: string;
  analysisTimestamp: Date;
  optedOut: boolean;
}

// --- Helpers ---
function toJson<T>(v: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
}
function getBase64(imagePath: string): string {
  return fs.readFileSync(imagePath).toString('base64');
}
function getMimeType(imagePath: string): string {
  const ext = path.extname(imagePath).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return map[ext] || 'image/jpeg';
}
function parseGeminiResponse(response: string): ImageTag[] {
  const tags: ImageTag[] = [];
  const itemTypeKeywords = [
    'furniture','chair','table','desk','bed','cabinet','shelf','clothing','textiles',
    'bedding','electronics','appliance','kitchenware','tool','book','lamp','sofa','bicycle','bike','computer','laptop'
  ];
  const damageKeywords = [
    'damage','damaged','broken','crack','cracked','dent','stain','stained','tear','torn','rust','scratch','scratched','wear','worn','chipped','bent'
  ];
  const conditionKeywords = [
    'new','excellent','good','fair','poor','used','vintage','refurbished','mint','like-new'
  ];

  const terms = response
    .toLowerCase()
    .split(/[,\.\;\n]/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && t.length < 80);

  const uniq = new Set(terms);
  uniq.forEach(term => {
    let category: ImageTag['category'] = 'other';
    let confidence = 0.75;

    if (itemTypeKeywords.some(k => term.includes(k))) { category = 'item_type'; confidence = 0.85; }
    else if (damageKeywords.some(k => term.includes(k))) { category = 'damage'; confidence = 0.8; }
    else if (conditionKeywords.some(k => term.includes(k))) { category = 'condition'; confidence = 0.8; }

    const description = term.charAt(0).toUpperCase() + term.slice(1);
    if (confidence >= 0.5) tags.push({ description, confidence, category });
  });

  // dedupe and cap
  return Array.from(new Map(tags.map(t => [t.description.toLowerCase(), t])).values()).slice(0, 15);
}

// --- Main ---
export async function analyzeImageTags(
  imagePath: string,
  donatedItemId: number,
  optOutAnalysis = false,
): Promise<AnalysisResult> {
  const result: AnalysisResult = {
    tags: [],
    rawResponse: '',
    analysisTimestamp: new Date(),
    optedOut: optOutAnalysis,
  };

  if (optOutAnalysis) return result;
  if (!API_KEY) throw new Error('GOOGLE_GEMINI_API_KEY is missing');
  if (!fs.existsSync(imagePath)) throw new Error(`Image file not found: ${imagePath}`);

  const base64 = getBase64(imagePath);
  const mimeType = getMimeType(imagePath);

  const prompt = `Analyze this donated item image and provide a concise, comma-separated list of terms covering:
1) item type/category (e.g., bicycle, computer)
2) condition (e.g., used, good, poor)
3) visible damage (e.g., scratch, dent, rust, tear)
4) key characteristics (e.g., color, material, notable accessories)
Keep it short and practical for donation triage.`;

  // Models valid with @google/genai consumer API
  const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastErr: unknown = null;

  for (const model of MODELS) {
    try {
      const resp = await ai.models.generateContent({
        model,
        contents: [
          createUserContent([
            prompt,
            createPartFromBase64(base64, mimeType),
          ]),
        ],
      });
      const text = resp.text ?? 'No description available';
      result.rawResponse = text;
      result.tags = parseGeminiResponse(text);

      await saveTags(donatedItemId, result.tags, imagePath);
      console.log(`[imageAnalysis] Success with model "${model}" — ${result.tags.length} tags`);
      return result;
    } catch (err) {
      console.warn(`[imageAnalysis] Model "${model}" failed; trying next…`, err);
      lastErr = err;
    }
  }

  throw new Error(`Image analysis failed: ${lastErr instanceof Error ? lastErr.message : 'Unknown error'}`);
}

async function saveTags(donatedItemId: number, tags: ImageTag[], imagePath: string): Promise<void> {
  const payload = toJson({
    tags,
    imagePath,
    analyzedAt: new Date().toISOString(),
    version: 2,
  });
  await prisma.donatedItem.update({
    where: { id: donatedItemId },
    data: { analysisMetadata: payload },
  });
}

export async function getImageTags(donatedItemId: number): Promise<ImageTag[]> {
  const item = await prisma.donatedItem.findUnique({
    where: { id: donatedItemId },
    select: { analysisMetadata: true },
  });
  if (!item?.analysisMetadata) return [];
  const meta = item.analysisMetadata as Prisma.JsonObject;
  return (meta['tags'] ?? []) as unknown as ImageTag[];
}

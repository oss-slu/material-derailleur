// src/services/imageAnalysisService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Ensure the API key is present at process start
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
if (!API_KEY) {
  // Don't throw—allow server to start, but error clearly on first use
  console.warn('[imageAnalysis] GOOGLE_GEMINI_API_KEY is not set');
}
const genAI = new GoogleGenerativeAI(API_KEY);

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

/** Make any value JSON-safe for Prisma JSON fields */
function toJson<T>(v: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
}

/** Read image as base64 from a filesystem path */
function getBase64Image(imagePath: string): string {
  const buf = fs.readFileSync(imagePath);
  return buf.toString('base64');
}

/** Guess mime from extension */
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

/** Lightweight NLP bucketing of comma/line-separated terms from the model */
function parseGeminiResponse(response: string): ImageTag[] {
  const tags: ImageTag[] = [];

  const itemTypeKeywords = [
    'furniture','chair','table','desk','bed','cabinet','shelf','clothing',
    'textiles','bedding','electronics','appliance','kitchenware','tool','book',
    'lamp','sofa','bicycle','bike','computer','laptop'
  ];
  const damageKeywords = [
    'damage','damaged','broken','crack','cracked','dent','stain','stained',
    'tear','torn','rust','scratch','scratched','wear','worn','chipped','bent'
  ];
  const conditionKeywords = [
    'new','excellent','good','fair','poor','used','vintage','refurbished',
    'mint','like-new'
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

    if (itemTypeKeywords.some(k => term.includes(k))) {
      category = 'item_type'; confidence = 0.85;
    } else if (damageKeywords.some(k => term.includes(k))) {
      category = 'damage'; confidence = 0.8;
    } else if (conditionKeywords.some(k => term.includes(k))) {
      category = 'condition'; confidence = 0.8;
    }

    // Capitalize for display
    const description = term.charAt(0).toUpperCase() + term.slice(1);

    if (confidence >= 0.5) {
      tags.push({ description, confidence, category });
    }
  });

  // dedupe by description
  return Array.from(
    new Map(tags.map(t => [t.description.toLowerCase(), t])).values()
  ).slice(0, 15);
}

/**
 * Analyze an image file on disk, save tags into donatedItem.analysisMetadata,
 * and return the structured result.
 */
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

  if (optOutAnalysis) {
    console.log(`[imageAnalysis] Opted out for donatedItem ${donatedItemId}`);
    return result;
  }

  if (!API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY is missing');
  }

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  const base64 = getBase64Image(imagePath);
  const mimeType = getMimeType(imagePath);

  // Use a small cascade of known-good models (names valid for @google/generative-ai)
  const modelCandidates = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
  ];

  const prompt = `Analyze this donated item image and provide a concise, comma-separated list of terms covering:
1) item type/category (e.g., bicycle, computer)
2) condition (e.g., used, good, poor)
3) visible damage (e.g., scratch, dent, rust, tear)
4) key characteristics (e.g., color, material, notable accessories)
Keep it short and practical for donation triage.`;

  let lastErr: unknown = null;

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const response = await model.generateContent([
        // You can put the image first or the text first; both are fine.
        { inlineData: { data: base64, mimeType } },
        { text: prompt },
      ]);

      const text = response.response.text() || 'No description available';
      result.rawResponse = text;
      result.tags = parseGeminiResponse(text);

      await saveTags(donatedItemId, result.tags, imagePath);
      console.log(`[imageAnalysis] Success using model "${modelName}" — ${result.tags.length} tags`);
      return result;
    } catch (err) {
      console.warn(`[imageAnalysis] Model "${modelName}" failed; trying next…`, err);
      lastErr = err;
    }
  }

  // If we get here, all candidates failed
  throw new Error(
    `Image analysis failed: ${lastErr instanceof Error ? lastErr.message : 'Unknown error'}`
  );
}

/** Persist tags JSON to donatedItem.analysisMetadata */
async function saveTags(
  donatedItemId: number,
  tags: ImageTag[],
  imagePath: string,
): Promise<void> {
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

/** Read back tags from Prisma JSON */
export async function getImageTags(donatedItemId: number): Promise<ImageTag[]> {
  const item = await prisma.donatedItem.findUnique({
    where: { id: donatedItemId },
    select: { analysisMetadata: true },
  });

  if (!item?.analysisMetadata) return [];
  const meta = item.analysisMetadata as Prisma.JsonObject;
  return (meta['tags'] ?? []) as unknown as ImageTag[];
}

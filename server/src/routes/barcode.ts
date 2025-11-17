import express, { Request, Response } from 'express';
import bwipjs from 'bwip-js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/barcode/:donatedItemId?format=svg|png
router.get('/api/barcode/:donatedItemId', async (req: Request, res: Response) => {
	const donatedItemId = String(req.params.donatedItemId || '').trim();
	if (!donatedItemId) {
		return res.status(400).json({ message: 'donatedItemId is required' });
	}

	const format = String(req.query.format || 'png').toLowerCase(); // png|svg

	try {
		if (format === 'svg') {
			const svgBuffer = await bwipjs.toBuffer({
				bcid: 'code128',
				text: donatedItemId,
				scale: 3, // scaling for printable resolution
				height: 15,
				includetext: true,
				textxalign: 'center',
				paddingwidth: 10,
				paddingheight: 10,
				// explicit format request for SVG output
				format: 'svg',
			} as any);
			const svgString = svgBuffer.toString('utf8');

			if (process.env.SAVE_BARCODES === 'true') {
				const outDir = path.join(process.cwd(), 'storage', 'barcodes');
				if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
				fs.writeFileSync(path.join(outDir, `${donatedItemId}.svg`), svgString, 'utf8');
			}

			res.type('image/svg+xml').send(svgString);
			return;
		}

		// default: PNG
		const pngBuffer = await bwipjs.toBuffer({
			bcid: 'code128',
			text: donatedItemId,
			scale: 3,
			height: 15,
			includetext: true,
			textxalign: 'center',
			paddingwidth: 10,
			paddingheight: 10,
		});

		if (process.env.SAVE_BARCODES === 'true') {
			const outDir = path.join(process.cwd(), 'storage', 'barcodes');
			if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
			fs.writeFileSync(path.join(outDir, `${donatedItemId}.png`), pngBuffer);
		}

		res.type('image/png').send(pngBuffer);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Barcode generation error:', err);
		res.status(500).json({ message: 'Failed to generate barcode' });
	}
});

export default router;

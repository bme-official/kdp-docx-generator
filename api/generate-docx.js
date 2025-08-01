// /api/generate-docx.js
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title = 'タイトル未設定', author = '著者不明', content = '' } = req.body ?? {};

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
        new Paragraph({ text: `著者：${author}` }),
        new Paragraph({ text: '' }),
        ...String(content).split('\n').map(line => new Paragraph(line)),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);

  const fileName = `${String(title || 'untitled').replace(/[\\/:*?"<>|]/g, '_')}_KDP原稿.docx`;
  const { url } = await put(fileName, buffer, {
    access: 'public',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  return res.status(200).json({ downloadUrl: url });
}

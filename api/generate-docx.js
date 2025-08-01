import { NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export const config = {
  runtime: 'edge', // Vercel Edge Functions でもOK
}

export default async function handler(req) {
  const { title, author, content } = await req.json()

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 28 })],
          }),
          new Paragraph({ text: `著者：${author}` }),
          ...content.split('\n').map(
            (line) => new Paragraph({ text: line.trim() })
          ),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  const base64 = Buffer.from(buffer).toString('base64')

  return NextResponse.json({
    filename: `${title}_KDP原稿.docx`,
    base64,
  })
}

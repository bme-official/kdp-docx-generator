// /api/generate-docx.js
import { Document, Packer, Paragraph, TextRun } from 'docx'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { title = 'タイトル未設定', author = '著者不明', content = '' } = req.body

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 32 })],
          }),
          new Paragraph({ text: `著者：${author}` }),
          new Paragraph({ text: '' }),
          ...content.split('\n').map((line) => new Paragraph(line)),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${title}_KDP原稿.docx"`
  )
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
  res.send(buffer)
}

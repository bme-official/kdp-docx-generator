// このファイルは Edge Function ではなく Node.js Function として動作します
import { Document, Packer, Paragraph, TextRun } from 'docx'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { title, author, content } = req.body

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
  res.setHeader('Content-Disposition', `attachment; filename="${title}_KDP原稿.docx"`)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.send(buffer)
}

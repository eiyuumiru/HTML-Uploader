import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filename = uploadedFile.originalFilename || uploadedFile.newFilename || 'index.html';
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: 'text/html',
    });

    try {
      fs.unlinkSync(uploadedFile.filepath);
    } catch (e) { }

    return res.status(200).json({
      url: blob.url,
      filename: filename,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: error.message || 'Upload failed',
    });
  }
}

import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
    // Parse multipart form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const filename = uploadedFile.originalFilename || uploadedFile.newFilename || 'index.html';
    
    // Read file buffer
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    // Upload to Vercel Blob Storage
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: 'text/html',
    });

    // Clean up temp file
    try {
      fs.unlinkSync(uploadedFile.filepath);
    } catch (e) {
      // Ignore cleanup errors
    }

    // Return the public URL
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


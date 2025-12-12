import { get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  try {
    // Get file from Vercel Blob Storage
    const blob = await get(filename);
    
    // Fetch the actual content
    const response = await fetch(blob.url);
    const content = await response.text();

    // Set proper headers for HTML content
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    return res.status(200).send(content);
  } catch (error) {
    console.error('View file error:', error);
    return res.status(404).json({
      error: 'File not found',
    });
  }
}


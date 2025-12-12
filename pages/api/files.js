import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // List all blobs (HTML files)
    const { blobs } = await list({
      prefix: '', // Get all files, or specify a prefix to filter
    });

    // Filter HTML files and format response
    const htmlFiles = blobs
      .filter((blob) => blob.pathname.endsWith('.html'))
      .map((blob) => ({
        filename: blob.pathname,
        url: blob.url,
        uploadedAt: blob.uploadedAt,
        size: blob.size,
      }))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)); // Sort by date, newest first

    return res.status(200).json({
      files: htmlFiles,
      count: htmlFiles.length,
    });
  } catch (error) {
    console.error('List files error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to list files',
    });
  }
}


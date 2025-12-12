import { list, del } from '@vercel/blob';

export default async function handler(req, res) {
    try {
        const { blobs } = await list({ prefix: '' });

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const expiredBlobs = blobs.filter((blob) => {
            const uploadedAt = new Date(blob.uploadedAt);
            return uploadedAt < twentyFourHoursAgo;
        });

        const deletedUrls = [];
        for (const blob of expiredBlobs) {
            await del(blob.url);
            deletedUrls.push(blob.pathname);
        }

        return res.status(200).json({
            message: 'Cleanup completed',
            deletedCount: deletedUrls.length,
            deletedFiles: deletedUrls,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return res.status(500).json({
            error: error.message || 'Cleanup failed',
        });
    }
}

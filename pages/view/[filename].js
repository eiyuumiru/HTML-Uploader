import { list } from '@vercel/blob';

export async function getServerSideProps(context) {
    const { filename } = context.params;

    try {
        const { blobs } = await list({ prefix: '' });
        const blob = blobs.find(b => b.pathname === filename || b.pathname === decodeURIComponent(filename));

        if (!blob) {
            return { notFound: true };
        }

        const response = await fetch(blob.url);
        const htmlContent = await response.text();

        return {
            props: { htmlContent, filename },
        };
    } catch (error) {
        console.error('Error fetching file:', error);
        return { notFound: true };
    }
}

export default function ViewHTMLPage({ htmlContent, filename }) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
                width: '100%',
                minHeight: '100vh',
                margin: 0,
                padding: 0,
            }}
        />
    );
}

import { list } from '@vercel/blob';

export const config = {
    api: {
        responseLimit: false,
    },
};

export async function getServerSideProps(context) {
    const { filename } = context.params;

    try {
        // List blobs to find the matching file
        const { blobs } = await list({
            prefix: '',
        });

        // Find the blob with matching filename
        const blob = blobs.find(b => b.pathname === filename || b.pathname === decodeURIComponent(filename));

        if (!blob) {
            return {
                notFound: true,
            };
        }

        // Fetch the HTML content
        const response = await fetch(blob.url);
        const htmlContent = await response.text();

        return {
            props: {
                htmlContent,
                filename,
            },
        };
    } catch (error) {
        console.error('Error fetching file:', error);
        return {
            notFound: true,
        };
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

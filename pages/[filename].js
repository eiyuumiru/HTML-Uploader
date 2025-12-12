import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ViewFile() {
  const router = useRouter();
  const { filename } = router.query;
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filename) return;

    const fetchFile = async () => {
      try {
        // Fetch file content from API
        const response = await fetch(`/api/view?filename=${encodeURIComponent(filename)}`);
        if (!response.ok) {
          throw new Error('File not found');
        }
        const content = await response.text();
        setHtmlContent(content);
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('Không tìm thấy file');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [filename]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>⚠️ {error}</p>
        <a href="/" style={styles.backLink}>
          ← Quay lại trang chủ
        </a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{filename}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  error: {
    color: '#dc3545',
    fontSize: '18px',
    marginBottom: '20px',
  },
  backLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '16px',
  },
};


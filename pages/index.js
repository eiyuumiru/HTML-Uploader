import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/html') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Vui lòng chọn file HTML');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file HTML');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedUrl(`${window.location.origin}/view/${encodeURIComponent(data.filename)}`);
        setUploadedFilename(data.filename);
        setFile(null);
        document.getElementById('fileInput').value = '';
        loadFiles();
      } else {
        setError(data.error || 'Upload thất bại');
      }
    } catch (err) {
      setError('Lỗi: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (response.ok) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Lỗi load files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <>
      <Head>
        <title>HTML Uploader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Mali:wght@400;600;700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="container">
        <div className="main-card">
          <h1 className="title">HTML Uploader</h1>
          <p className="subtitle">Upload và chia sẻ file HTML của bạn</p>

          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                id="fileInput"
                type="file"
                accept=".html,text/html"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="fileInput" className="file-label hand-card">
                {file ? (
                  <span>
                    📄 <span className="hl-yellow">{file.name}</span>
                  </span>
                ) : (
                  '📁 Chọn file HTML'
                )}
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`upload-btn hand-card ${uploading || !file ? 'disabled' : ''}`}
            >
              {uploading ? '⏳ Đang upload...' : '✨ Upload ngay'}
            </button>
          </div>

          {error && (
            <div className="error-note sticky-note" style={{ transform: 'rotate(1deg)' }}>
              <span className="scribble-underline">⚠️ Lỗi</span>
              <p>{error}</p>
            </div>
          )}

          {uploadedUrl && (
            <div className="success-note sticky-note" style={{ transform: 'rotate(-1deg)' }}>
              <span className="scribble-underline">✅ Upload thành công!</span>
              <div className="url-box">
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="url-link"
                >
                  {uploadedUrl}
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    alert('Đã copy URL! 📋');
                  }}
                  className="copy-btn hand-card"
                >
                  📋 Copy URL
                </button>
              </div>
            </div>
          )}

          <div className="files-section">
            <div className="files-header">
              <h2 className="section-title">
                <span className="hl-pink">📋 Files đã upload</span>
              </h2>
              <button onClick={loadFiles} className="refresh-btn hand-card">
                🔄
              </button>
            </div>

            {loadingFiles ? (
              <p className="loading-text">Đang tải...</p>
            ) : files.length === 0 ? (
              <p className="no-files">Chưa có file nào</p>
            ) : (
              <div className="files-list">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="file-item sticky-note"
                    style={{
                      transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index % 3) * 0.5}deg)`,
                    }}
                  >
                    <a
                      href={`/view/${encodeURIComponent(file.filename)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      <span className="hl-blue">{file.filename}</span>
                    </a>
                    <span className="file-date">
                      {new Date(file.uploadedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          scroll-behavior: smooth;
          background-color: #fff7ea;
          background-image: url('https://www.transparenttextures.com/patterns/lined-paper-2.png');
          padding: 40px 20px;
          font-family: 'Patrick Hand', system-ui, sans-serif;
          color: #1f2937;
          text-rendering: optimizeLegibility;
          letter-spacing: 0.01em;
        }

        .main-card {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          background-color: #fffaf3;
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          border: 3px solid #1f2937;
          padding: 50px 40px;
          box-shadow: 8px 8px 0px #000000, 0 0 0 4px #fffaf3;
          transform: rotate(-0.5deg);
        }

        .title {
          font-family: 'Pacifico', cursive;
          font-weight: 400;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 2px 2px 4px rgba(255, 107, 107, 0.2);
          text-align: center;
          margin-bottom: 15px;
          transform: rotate(0.5deg);
        }

        .subtitle {
          font-family: 'Mali', cursive;
          font-size: 1.2rem;
          color: #4b5563;
          text-align: center;
          margin-bottom: 40px;
          transform: rotate(-0.3deg);
        }

        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
        }

        .file-label {
          display: block;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Mali', cursive;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0369a1;
        }

        .file-label:hover {
          transform: scale(1.02) rotate(0deg) !important;
        }

        .upload-btn {
          padding: 18px 35px;
          background-color: #fffaf3;
          color: #1f2937;
          border: 3px solid #1f2937;
          font-family: 'Mali', cursive;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 6px 6px 0px #000000;
          transform: rotate(0.3deg);
        }

        .upload-btn:hover:not(.disabled) {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 8px 8px 0px #000000;
        }

        .upload-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: rotate(0deg);
        }

        .error-note {
          background-color: #fff9c4;
          border: 2px solid #be123c;
          color: #1f2937;
          margin-bottom: 25px;
        }

        .success-note {
          background-color: #fff9c4;
          border: 2px solid #0369a1;
          color: #1f2937;
          margin-bottom: 25px;
        }

        .url-box {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .url-link {
          color: #0369a1;
          word-break: break-all;
          text-decoration: underline;
          font-family: 'Patrick Hand', sans-serif;
          font-size: 0.95rem;
        }

        .copy-btn {
          padding: 10px 20px;
          background-color: #fffaf3;
          color: #1f2937;
          border: 2px solid #1f2937;
          font-family: 'Mali', cursive;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 4px 4px 0px #000000;
          transform: rotate(-0.5deg);
          align-self: flex-start;
        }

        .copy-btn:hover {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 5px 5px 0px #000000;
        }

        .files-section {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 3px dashed #d7c2a8;
        }

        .files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .section-title {
          font-family: 'Mali', cursive;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          transform: rotate(-0.3deg);
        }

        .refresh-btn {
          padding: 12px 18px;
          background-color: #fffaf3;
          color: #1f2937;
          border: 2px solid #1f2937;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 4px 4px 0px #000000;
          transform: rotate(0.5deg);
        }

        .refresh-btn:hover {
          transform: scale(1.1) rotate(0deg) !important;
          box-shadow: 5px 5px 0px #000000;
        }

        .files-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .file-item {
          background-color: #fff9c4;
          border: 2px solid #1f2937;
          padding: 20px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .file-item:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 10;
          box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.15);
        }

        .file-link {
          text-decoration: none;
          font-family: 'Mali', cursive;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .file-date {
          color: #4b5563;
          font-size: 0.9rem;
          font-family: 'Patrick Hand', sans-serif;
        }

        .loading-text,
        .no-files {
          text-align: center;
          color: #4b5563;
          padding: 30px;
          font-family: 'Mali', cursive;
          font-size: 1.1rem;
        }

        /* Studygram Components */
        .sticky-note {
          position: relative;
          width: 100%;
          min-height: 120px;
          padding: 25px 20px;
          background-color: #fff9c4;
          color: #1f2937;
          font-size: 1rem;
          line-height: 1.6;
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
          border: 2px solid #1f2937;
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hand-card {
          position: relative;
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          border: 3px solid #1f2937;
          background-color: #fffaf3;
          transition: all 0.3s ease;
          box-shadow: 6px 6px 0px #000000;
        }

        .hl-yellow {
          background: linear-gradient(
            to top,
            rgba(255, 245, 157, 0.9) 55%,
            transparent 55%
          );
          padding: 0.02em 0.14em;
        }

        .hl-blue {
          background: linear-gradient(
            to top,
            rgba(179, 229, 252, 0.9) 55%,
            transparent 55%
          );
          padding: 0.02em 0.14em;
        }

        .hl-pink {
          background: linear-gradient(
            to top,
            rgba(255, 205, 210, 0.9) 55%,
            transparent 55%
          );
          padding: 0.02em 0.14em;
        }

        .scribble-underline {
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='12' viewBox='0 0 214 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 10C41 4 79 4 118 6c39 2 58-3 94-4' fill='none' stroke='%23fb7185' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 100% 1em;
          display: inline-block;
          padding-bottom: 0.2em;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px 10px;
          }

          .main-card {
            padding: 30px 20px;
            transform: rotate(0deg);
          }

          .files-list {
            grid-template-columns: 1fr;
          }

          .file-item {
            transform: rotate(0deg) !important;
          }
        }
      `}</style>
    </>
  );
}

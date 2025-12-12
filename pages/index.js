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
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/html') {
      setFile(selectedFile);
      setError(null);
    } else if (selectedFile) {
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

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/html') {
      setFile(droppedFile);
      setError(null);
    } else if (droppedFile) {
      setError('Vui lòng chọn file HTML');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <>
      <Head>
        <title>HTML Uploader | Yuki</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎉</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Upload và chia sẻ file HTML dễ dàng" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Mali:wght@400;600;700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page-container">
        {/* Header */}
        <header className="header">
          <h1 className="logo">HTML Uploader</h1>
          <p className="tagline">Upload & Chia sẻ file HTML</p>
        </header>

        {/* Upload Card */}
        <main className="main-content">
          <div className="upload-card hand-card">
            <div className="washi-tape"></div>

            <h2 className="card-title">
              <span className="hl-pink">📤 Upload File</span>
            </h2>

            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="fileInput"
                type="file"
                accept=".html,text/html"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="fileInput" className="file-label">
                {isDragging ? (
                  <>
                    <div className="file-icon">✏️</div>
                    <span className="file-text drop-text">Ném file vào đây!</span>
                  </>
                ) : (
                  <>
                    <div className="file-icon">📁</div>
                    <span className="file-text">
                      {file ? file.name : 'Chọn file HTML'}
                    </span>
                    {!file && <span className="file-hint">hoặc kéo thả vào đây</span>}
                  </>
                )}
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`upload-btn ${uploading || !file ? 'disabled' : ''}`}
            >
              {uploading ? (
                <><span className="spinner"></span> Đang upload...</>
              ) : (
                '✨ Upload ngay'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="message error-msg">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Success Message */}
            {uploadedUrl && (
              <div className="message success-msg">
                <span className="scribble-underline">✅ Upload thành công!</span>
                <div className="url-container">
                  <input
                    type="text"
                    value={uploadedUrl}
                    readOnly
                    className="url-input"
                  />
                  <button onClick={() => copyToClipboard(uploadedUrl)} className="copy-btn">
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
                <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                  Xem file →
                </a>
              </div>
            )}
          </div>

          {/* Files List */}
          <section className="files-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="hl-blue">📋 Files đã upload</span>
              </h2>
              <button onClick={loadFiles} className="refresh-btn" title="Làm mới">
                🔄
              </button>
            </div>

            {loadingFiles ? (
              <div className="loading-state">
                <div className="pen-writing">
                  <span className="pen">✏️</span>
                  <span className="writing-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
                <p>Đang tải...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>Chưa có file nào</p>
                <span>Upload file HTML đầu tiên của bạn!</span>
              </div>
            ) : (
              <div className="files-grid">
                {files.map((file, index) => (
                  <a
                    key={index}
                    href={`/view/${encodeURIComponent(file.filename)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-card sticky-note"
                    style={{ '--rotate': `${(index % 2 === 0 ? 1 : -1) * (1 + (index % 3) * 0.5)}deg` }}
                  >
                    <div className="file-card-icon">📄</div>
                    <span className="file-card-name">{file.filename}</span>
                    <span className="file-card-date">
                      {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Made with 💖 by <span className="hl-yellow">Yuki</span></p>
        </footer>
      </div>

      <style jsx>{`
        /* ===== BASE STYLES ===== */
        .page-container {
          min-height: 100vh;
          scroll-behavior: smooth;
          background-color: #FFF7EA;
          background-image: url('https://www.transparenttextures.com/patterns/lined-paper-2.png');
          font-family: 'Patrick Hand', system-ui, sans-serif;
          color: #1F2937;
          text-rendering: optimizeLegibility;
          letter-spacing: 0.01em;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ===== HEADER ===== */
        .header {
          text-align: center;
          margin-bottom: 24px;
          padding: 16px;
        }

        .logo {
          font-family: 'Pacifico', cursive;
          font-weight: 400;
          font-size: clamp(2rem, 6vw, 2.8rem);
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 2px 2px 4px rgba(255, 107, 107, 0.15);
          margin: 0;
        }

        .tagline {
          font-family: 'Mali', cursive;
          font-size: 1rem;
          color: #4B5563;
          margin: 8px 0 0;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ===== HAND CARD ===== */
        .hand-card {
          position: relative;
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          border: 3px solid #1F2937;
          background-color: #FFFAF3;
          box-shadow: 5px 5px 0px #000000;
          padding: 28px 20px 24px;
        }

        .washi-tape {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 80px;
          height: 22px;
          background-color: rgba(255, 100, 100, 0.35);
          border-radius: 2px;
        }

        .card-title {
          font-family: 'Mali', cursive;
          font-size: 1.3rem;
          font-weight: 700;
          text-align: center;
          margin: 0 0 20px;
        }

        /* ===== FILE INPUT ===== */
        .upload-area {
          position: relative;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .upload-area.dragging .file-label {
          background: rgba(3, 105, 161, 0.15);
          border-color: #0369A1;
          border-style: solid;
          transform: scale(1.02);
        }

        .drop-text {
          animation: pulse 0.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }

        .file-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          border: 2px dashed #D7C2A8;
          border-radius: 12px;
          background: #FFF7EA;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .file-label:hover {
          border-color: #0369A1;
          background: #f0f9ff;
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-text {
          font-family: 'Mali', cursive;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0369A1;
          text-align: center;
          word-break: break-word;
        }

        .file-hint {
          font-size: 0.85rem;
          color: #4B5563;
        }

        /* ===== UPLOAD BUTTON ===== */
        .upload-btn {
          width: 100%;
          padding: 14px 24px;
          background-color: #FFFAF3;
          color: #1F2937;
          border: 3px solid #1F2937;
          border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
          font-family: 'Mali', cursive;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 4px 4px 0px #000000;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .upload-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 6px 6px 0px #000000;
        }

        .upload-btn:active:not(.disabled) {
          transform: translateY(0);
          box-shadow: 2px 2px 0px #000000;
        }

        .upload-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ===== PEN WRITING ANIMATION ===== */
        .pen-writing {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pen {
          font-size: 1.8rem;
          animation: penMove 0.6s ease-in-out infinite;
          transform-origin: bottom right;
        }

        @keyframes penMove {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .writing-dots {
          display: flex;
          gap: 2px;
          font-family: 'Mali', cursive;
          font-size: 2rem;
          font-weight: 700;
          color: #1F2937;
        }

        .writing-dots span {
          opacity: 0;
          animation: dotAppear 1.2s ease-in-out infinite;
        }

        .writing-dots span:nth-child(1) { animation-delay: 0s; }
        .writing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .writing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotAppear {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }

        /* ===== MESSAGES ===== */
        .message {
          margin-top: 16px;
          padding: 16px;
          border-radius: 12px;
          font-family: 'Mali', cursive;
          text-align: center;
        }

        .error-msg {
          background: #FEE2E2;
          border: 2px solid #BE123C;
          color: #BE123C;
        }

        .success-msg {
          background: #FFF9C4;
          border: 2px solid #0369A1;
        }

        .url-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }

        .url-input {
          flex: 1;
          padding: 10px 12px;
          border: 2px solid #D7C2A8;
          border-radius: 8px;
          font-family: 'Patrick Hand', sans-serif;
          font-size: 0.9rem;
          background: #FFFAF3;
          min-width: 0;
        }

        .copy-btn {
          padding: 10px 14px;
          background: #FFFAF3;
          border: 2px solid #1F2937;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: #FFF7EA;
        }

        .view-link {
          display: inline-block;
          margin-top: 12px;
          color: #0369A1;
          font-weight: 600;
          text-decoration: none;
        }

        .view-link:hover {
          text-decoration: underline;
        }

        /* ===== FILES SECTION ===== */
        .files-section {
          width: 100%;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Mali', cursive;
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
        }

        .refresh-btn {
          padding: 8px 12px;
          background: #FFFAF3;
          border: 2px solid #1F2937;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          box-shadow: 2px 2px 0px #000000;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          transform: translateY(-1px);
          box-shadow: 3px 3px 0px #000000;
        }

        /* ===== STATES ===== */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 16px;
          color: #4B5563;
        }

        .loading-state p {
          font-family: 'Mali', cursive;
          font-size: 1rem;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 32px 16px;
          color: #4B5563;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-family: 'Mali', cursive;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 4px;
        }

        .empty-state span {
          font-size: 0.9rem;
        }

        /* ===== FILES GRID ===== */
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        /* ===== STICKY NOTE ===== */
        .sticky-note {
          position: relative;
          min-height: 100px;
          padding: 16px 12px;
          background-color: #FFF9C4;
          color: #1F2937;
          border: 2px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
          transform: rotate(var(--rotate, 0deg));
          transition: all 0.25s ease;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .sticky-note:hover {
          transform: scale(1.05) rotate(0deg);
          box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.12);
          z-index: 10;
        }

        .file-card-icon {
          font-size: 1.8rem;
        }

        .file-card-name {
          font-family: 'Mali', cursive;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
          word-break: break-word;
          line-height: 1.3;
        }

        .file-card-date {
          font-size: 0.75rem;
          color: #4B5563;
        }

        /* ===== HIGHLIGHTS ===== */
        .hl-yellow {
          background: linear-gradient(to top, rgba(255, 245, 157, 0.9) 55%, transparent 55%);
          padding: 0.02em 0.14em;
        }

        .hl-blue {
          background: linear-gradient(to top, rgba(179, 229, 252, 0.9) 55%, transparent 55%);
          padding: 0.02em 0.14em;
        }

        .hl-pink {
          background: linear-gradient(to top, rgba(255, 205, 210, 0.9) 55%, transparent 55%);
          padding: 0.02em 0.14em;
        }

        .scribble-underline {
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='12' viewBox='0 0 214 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 10C41 4 79 4 118 6c39 2 58-3 94-4' fill='none' stroke='%23fb7185' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 100% 0.8em;
          display: inline-block;
        }

        /* ===== FOOTER ===== */
        .footer {
          margin-top: 32px;
          text-align: center;
          padding: 16px;
          color: #4B5563;
          font-size: 0.9rem;
        }

        .footer p {
          margin: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 480px) {
          .page-container {
            padding: 16px 12px;
          }

          .hand-card {
            padding: 24px 16px 20px;
            border-width: 2px;
            box-shadow: 4px 4px 0px #000000;
          }

          .file-label {
            padding: 20px 12px;
          }

          .files-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .sticky-note {
            min-height: 90px;
            padding: 14px 10px;
          }

          .file-card-icon {
            font-size: 1.5rem;
          }

          .file-card-name {
            font-size: 0.8rem;
          }
        }

        @media (min-width: 768px) {
          .page-container {
            padding: 32px;
          }

          .main-content {
            max-width: 520px;
          }

          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
        }
      `}</style>
    </>
  );
}

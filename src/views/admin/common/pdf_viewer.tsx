import * as React from 'react'

import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const PdfViewerView = () => {
  const pdfUrl = 'https://minio.txuapp.com/backend/c2aea99b-725e-45b9-947a-4166eacba2c8_Control%20Plane-Worker.pdf'

  return (
    <div>
      <h1>Pdf Viewer</h1>

      <div style={{ height: '100vh' }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer fileUrl={pdfUrl} />
        </Worker>
      </div>
    </div>
  )
}

export default PdfViewerView

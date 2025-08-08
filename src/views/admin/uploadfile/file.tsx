import { useState } from 'react'
import * as React from 'react'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Link } from '@mui/material'

const UploadFileView = () => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')
  const [fileUploaded, setFileUploaded] = useState<string>('')

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()

    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:8080/upload-file/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const json = await res.json()

        setMessage(`Tải lên thành công! URL:`)
        setFileUploaded(json.url)
      } else {
        setMessage('Tải lên thất bại')
      }
    } catch (error) {
      setMessage('Lỗi kết nối tới server')
    }
  }

  return (
    <div>
      <h1>Upload file</h1>
      <input type='file' onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Tải lên</button>
      <p>{message}</p>

      {fileUploaded != '' ? (
        <Link
          href={fileUploaded}
          target='_blank'
          rel='noopener noreferrer'
          underline='hover'
          sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
          {fileUploaded}
        </Link>
      ) : (
        ''
      )}
    </div>
  )
}

export default UploadFileView

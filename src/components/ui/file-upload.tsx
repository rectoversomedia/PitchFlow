"use client"

import { useState, useCallback } from "react"
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  path?: string
}

interface FileUploadProps {
  folder?: string
  accept?: string
  maxFiles?: number
  maxSize?: number // in MB
  onUploadComplete?: (files: UploadedFile[]) => void
  className?: string
}

export function FileUpload({
  folder = "general",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxFiles = 5,
  maxSize = 10,
  onUploadComplete,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleUpload = useCallback(
    async (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList)
      setError(null)

      // Validate max files
      if (files.length + fileArray.length > maxFiles) {
        setError(`Maksimal ${maxFiles} file`)
        return
      }

      setUploading(true)

      const uploadedFiles: UploadedFile[] = []

      for (const file of fileArray) {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`File "${file.name}" terlalu besar (max ${maxSize}MB)`)
          continue
        }

        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("folder", folder)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()

          if (data.success) {
            uploadedFiles.push({
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: data.data.filename,
              size: data.data.size,
              type: data.data.type,
              url: data.data.publicUrl,
              path: data.data.storagePath,
            })
          } else {
            setError(data.error || "Upload gagal")
          }
        } catch (err) {
          console.error("Upload error:", err)
          setError("Upload gagal")
        }
      }

      setUploading(false)
      const newFiles = [...files, ...uploadedFiles]
      setFiles(newFiles)
      onUploadComplete?.(newFiles)
    },
    [files, maxFiles, maxSize, folder, onUploadComplete]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files)
      }
    },
    [handleUpload]
  )

  const handleDelete = useCallback(
    async (file: UploadedFile) => {
      if (!file.path) return

      try {
        const response = await fetch(`/api/upload?path=${encodeURIComponent(file.path)}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          const newFiles = files.filter((f) => f.id !== file.id)
          setFiles(newFiles)
          onUploadComplete?.(newFiles)
        }
      } catch (err) {
        console.error("Delete error:", err)
      }
    },
    [files, onUploadComplete]
  )

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept={accept}
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          disabled={uploading}
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Mengupload...</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag & drop file di sini, atau{" "}
                <span className="text-blue-600 font-medium">klik untuk upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maksimal {maxFiles} file, {maxSize}MB per file
              </p>
            </>
          )}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.url && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Lihat
                  </a>
                )}
                <button
                  onClick={() => handleDelete(file)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple file list display component
interface FileListProps {
  files: UploadedFile[]
  onDelete?: (file: UploadedFile) => void
}

export function FileList({ files, onDelete }: FileListProps) {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (files.length === 0) return null

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {file.url && (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Lihat
              </a>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(file)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

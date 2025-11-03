'use client'

import { ChangeEvent, useState } from 'react'
import { compressImage, formatFileSize, validateImageType, validateImageSize } from '@/lib/utils/image'

interface PetImageUploadProps {
  name: string
  error?: string
  initialImageUrl?: string | null
}

export function PetImageUpload({ name, error, initialImageUrl }: PetImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<string>('')
  const [isCompressing, setIsCompressing] = useState(false)
  const [validationError, setValidationError] = useState<string>('')

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      // Clear preview if no file selected
      setPreview(null)
      setFileName('')
      setFileSize('')
      setValidationError('')
      return
    }

    // Validate image type
    if (!validateImageType(file)) {
      setValidationError('Please select a JPEG or PNG image')
      setPreview(null)
      setFileName('')
      setFileSize('')
      return
    }

    // Validate image size
    if (!validateImageSize(file)) {
      setValidationError('Image size must be less than 20MB')
      setPreview(null)
      setFileName('')
      setFileSize('')
      return
    }

    setValidationError('')
    setIsCompressing(true)

    try {
      let fileToUse = file

      // Try to compress the image, but fall back to original if it fails
      try {
        const compressedFile = await compressImage(file)

        // Create a new File object with the compressed data
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(compressedFile)

        // Update the input element with compressed file
        if (e.target.files) {
          e.target.files = dataTransfer.files
        }

        fileToUse = compressedFile
      } catch (compressionErr) {
        console.warn('Image compression failed, using original file:', compressionErr)
        // Continue with original file if compression fails
      }

      // Display file info
      setFileName(file.name)
      setFileSize(formatFileSize(fileToUse.size))

      // Generate preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.onerror = () => {
        setValidationError('Failed to read image file. Please try again.')
      }
      reader.readAsDataURL(fileToUse)
    } catch (err) {
      console.error('Error processing image:', err)
      setValidationError('Failed to process image. Please try again.')
    } finally {
      setIsCompressing(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    setFileName('')
    setFileSize('')
    setValidationError('')

    // Clear the file input
    const fileInput = document.getElementById(name) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {/* File input */}
        <label
          htmlFor={name}
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-slate-300 bg-white hover:bg-slate-100 h-10 py-2 px-4"
        >
          {isCompressing ? 'Processing...' : preview ? 'Change Image' : 'Choose Image'}
        </label>
        <input
          type="file"
          id={name}
          name={name}
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
          disabled={isCompressing}
          className="sr-only"
        />

        {/* File info */}
        {fileName && (
          <div className="flex-1 text-sm text-slate-600">
            <p className="font-medium truncate">{fileName}</p>
            <p className="text-xs">{fileSize}</p>
          </div>
        )}

        {/* Clear button */}
        {preview && (
          <button
            type="button"
            onClick={clearImage}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Remove
          </button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-4">
          <div className="relative w-full max-w-md h-64 bg-slate-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Validation error */}
      {validationError && (
        <p className="text-sm text-red-600">{validationError}</p>
      )}

      {/* Server error */}
      {error && !validationError && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Help text */}
      {!error && !validationError && (
        <p className="text-sm text-slate-500">
          JPEG or PNG, max 20MB. Images will be automatically compressed.
        </p>
      )}
    </div>
  )
}

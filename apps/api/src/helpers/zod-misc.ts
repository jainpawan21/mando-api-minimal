import { z } from '@hono/zod-openapi'

import type { ZodType } from 'zod'

export const jsonContent = <T extends ZodType>(type: T) => {
  return {
    'application/json': {
      schema: type,
    },
  }
}

export const queryAllRequestQuerySchema = z.object({
  page: z.coerce.number().optional().default(1).openapi({
    default: 1,
    example: 1,
    description: 'Page number (1-indexed)',
  }),
  perPage: z.coerce.number().optional().default(10).openapi({
    default: 10,
    example: 10,
    description: 'Items per page (1-indexed)',
  }),
  filter: z.string().optional().openapi({
    default: '',
    example: 'some text',
    description: 'Filter by name',
  }),
})

export const preprocessArray = (val: unknown) => {
  // If it's already an array, return as is
  if (Array.isArray(val)) {
    return val
  }
  // If it's a string, split it by comma
  if (typeof val === 'string') {
    return val.split(',').filter(Boolean)
  }
  // If it's undefined, return undefined (for optional)
  return val
}

export const allowedAssetMimeTypes = [
  'application/pdf', // .pdf
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.oasis.opendocument.presentation', // .odp
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/html', // .html
  'text/html;charset=utf-8', // .html
  'text/markdown', // .md
  'text/plain', // .txt
  'text/plain;charset=utf-8', // .txt
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
  'image/gif', // .gif
  'image/webp', // .webp
  'image/svg+xml', // .svg
  'image/avif', // .avif
  'image/apng', // .apng
  'image/bmp', // .bmp
  'image/tiff', // .tiff
  'image/tiff;baseline', // .tiff
  'image/tiff;subtype=planar', // .tiff
  'image/tiff;subtype=rgb', // .tiff
  // video
  'video/mp4', // .mp4
  'video/webm', // .webm
  'video/ogg', // .ogg
  'video/avi', // .avi
  'video/mov', // .mov
  'video/wmv', // .wmv
  'video/flv', // .flv
  'video/mkv', // .mkv
  // audio
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'audio/ogg', // .ogg
  'audio/webm', // .webm
  // stream
  'application/octet-stream', // .stream
]

const assetFileType = z
  .custom<File>(v => v instanceof File)
  // fileSize // 5 GB
  .refine(
    file => {
      return file.size <= 1024 * 1024 * 1024 * 5
    },
    {
      message: 'File size is bigger that 5GB',
    }
  )
  // FileType
  .refine(
    file => {
      return allowedAssetMimeTypes.includes(file.type)
    },
    {
      message: 'File type is not allowed',
    }
  )
  .openapi({
    type: 'string',
    format: 'binary',
  })

export const allowedProcessedMimeTypes = [
  'application/pdf', // .pdf
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.oasis.opendocument.presentation', // .odp
  'text/html', // .html
  'text/html;charset=utf-8', // .html
  'text/markdown', // .md
  'text/plain', // .txt
  'text/plain;charset=utf-8', // .txt
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
]

const processedFileType = z
  .custom<File>(v => v instanceof File)
  // fileSize // 10 MB
  .refine(file => file.size <= 1024 * 1024 * 10, {
    message: 'File size is bigger that 10MB',
  })
  // FileType
  .refine(
    file => {
      return allowedProcessedMimeTypes.includes(file.type)
    },
    {
      message: 'File type is not allowed',
    }
  )
  .openapi({
    type: 'string',
    format: 'binary',
  })

export const commonRules = {
  assetFile: assetFileType,

  assetFiles: z.union([
    assetFileType.transform(file => [file]),
    z
      .array(assetFileType)
      // Min count
      .min(1, { message: 'Min File count are 1' })
      // Max count
      .max(10, { message: 'Max File count are 10' }),
  ]),

  processedFile: processedFileType,
  processedFiles: z.union([
    processedFileType.transform(file => [file]),
    z
      .array(processedFileType)
      // Min count
      .min(1, { message: 'Min File count are 1' })
      // Max count
      .max(10, { message: 'Max File count are 10' }),
  ]),
}

// src/lib/s3-upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-artist-images-bucket';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

// File type configurations
export const FILE_TYPES = {
  IMAGE: {
    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
    maxSize: MAX_IMAGE_SIZE,
    folder: 'artists' as string,
    description: 'JPG, PNG, or WebP (max 5MB)',
  },
  PDF: {
    types: ['application/pdf'],
    maxSize: MAX_PDF_SIZE,
    folder: 'documents' as string,
    description: 'PDF (max 10MB)',
  },
  ALL_DOCUMENTS: {
    types: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],
    maxSize: MAX_PDF_SIZE,
    folder: 'uploads' as string ,
    description: 'PDF, JPG, PNG, or WebP (max 10MB)',
  }
};

export type FileTypeCategory = keyof typeof FILE_TYPES;

/**
 * Generate a unique filename with proper folder structure
 */
export function generateUniqueFilename(
  originalFilename: string, 
  folder: string = 'uploads'
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  const sanitizedName = originalFilename
    .split('.')[0]
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .substring(0, 50); // Limit filename length
  
  return `${folder}/${timestamp}-${random}-${sanitizedName}.${extension}`;
}

/**
 * Validate file based on category
 */
export function validateFile(
  file: File, 
  category: FileTypeCategory = 'ALL_DOCUMENTS'
): { valid: boolean; error?: string } {
  const config = FILE_TYPES[category];
  
  if (!config.types.includes(file.type)) {
    const allowedTypes = config.types
      .map(t => t.split('/')[1].toUpperCase())
      .join(', ');
    return { 
      valid: false, 
      error: `Only ${allowedTypes} files are allowed` 
    };
  }
  
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
    return { 
      valid: false, 
      error: `File must be less than ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate image file (backward compatibility)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  return validateFile(file, 'IMAGE');
}

/**
 * Validate PDF file
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  return validateFile(file, 'PDF');
}

/**
 * Get presigned URL for client-side upload
 * (Recommended - more secure, no file passes through your server)
 */
export async function getPresignedUploadUrl(
  filename: string, 
  contentType: string,
  folder?: string
) {
  // Determine folder based on content type if not specified
  if (!folder) {
    if (contentType.startsWith('image/')) {
      folder = FILE_TYPES.IMAGE.folder;
    } else if (contentType === 'application/pdf') {
      folder = FILE_TYPES.PDF.folder;
    } else {
      folder = FILE_TYPES.ALL_DOCUMENTS.folder;
    }
  }

  const key = generateUniqueFilename(filename, folder);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    // Add metadata for better tracking
    Metadata: {
      'original-filename': filename,
      'upload-timestamp': Date.now().toString(),
    },
  });
  
  // URL expires in 5 minutes
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  
  // Return both the presigned URL and the final public URL
  const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
  return {
    uploadUrl: presignedUrl,
    publicUrl,
    key,
    folder,
    originalFilename: filename,
  };
}

/**
 * Get presigned URL specifically for images
 */
export async function getPresignedImageUploadUrl(filename: string, contentType: string) {
  return getPresignedUploadUrl(filename, contentType, FILE_TYPES.IMAGE.folder);
}

/**
 * Get presigned URL specifically for PDFs
 */
export async function getPresignedPDFUploadUrl(filename: string, contentType: string) {
  return getPresignedUploadUrl(filename, contentType, FILE_TYPES.PDF.folder);
}

/**
 * Direct server-side upload
 * (Use if you need to process/validate the file on server)
 */
export async function uploadToS3(
  file: Buffer, 
  filename: string, 
  contentType: string,
  folder?: string
) {
  if (!folder) {
    if (contentType.startsWith('image/')) {
      folder = FILE_TYPES.IMAGE.folder;
    } else if (contentType === 'application/pdf') {
      folder = FILE_TYPES.PDF.folder;
    } else {
      folder = FILE_TYPES.ALL_DOCUMENTS.folder;
    }
  }

  const key = generateUniqueFilename(filename, folder);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    Metadata: {
      'original-filename': filename,
      'upload-timestamp': Date.now().toString(),
    },
  });
  
  await s3Client.send(command);
  
  const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
  return {
    publicUrl,
    key,
    folder,
    originalFilename: filename,
  };
}

/**
 * Client-side helper to upload file using presigned URL
 */
export async function uploadFileToPresignedUrl(
  file: File,
  presignedUrl: string
): Promise<Response> {
  return fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is an image
 */
export function isImageFile(contentType: string): boolean {
  return contentType.startsWith('image/');
}

/**
 * Check if file is a PDF
 */
export function isPDFFile(contentType: string): boolean {
  return contentType === 'application/pdf';
}
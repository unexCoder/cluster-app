// src/app/actions/upload-image.ts
'use server';

import {
  getPresignedUploadUrl,
  getPresignedImageUploadUrl,
  getPresignedPDFUploadUrl,
  FILE_TYPES,
  type FileTypeCategory
} from '@/lib/s3-upload';


/**
 * Image upload URL generator (backward compatibility)
 */
export async function getImageUploadUrl(filename: string, contentType: string) {
  try {
    const allowedTypes = FILE_TYPES.IMAGE.types;

    if (!allowedTypes.includes(contentType)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.',
      } as const;
    }

    const result = await getPresignedImageUploadUrl(filename, contentType);

    return {
      success: true,
      uploadUrl: result.uploadUrl,
      publicUrl: result.publicUrl,
      key: result.key,
      folder: result.folder,
      originalFilename: result.originalFilename,
    } as const;
  } catch (error) {
    console.error('Error generating image upload URL:', error);
    return {
      success: false,
      error: 'Failed to generate upload URL',
    } as const;
  }
}

// /**
//  * Generic file upload URL generator
//  */
// export async function getFileUploadUrl(
//   filename: string,
//   contentType: string,
//   category: FileTypeCategory = 'ALL_DOCUMENTS'
// ) {
//   try {
//     const allowedTypes = FILE_TYPES[category].types;

//     if (!allowedTypes.includes(contentType)) {
//       const typesList = allowedTypes
//         .map(t => t.split('/')[1].toUpperCase())
//         .join(', ');
//       return {
//         success: false,
//         error: `Invalid file type. Only ${typesList} are allowed.`,
//       };
//     }

//     const result = await getPresignedUploadUrl(filename, contentType);

//     return {
//       success: true,
//       ...result,
//     };
//   } catch (error) {
//     console.error('Error generating upload URL:', error);
//     return {
//       success: false,
//       error: 'Failed to generate upload URL',
//     };
//   }
// }

/**
 * PDF upload URL generator
 */
export async function getPDFUploadUrl(filename: string, contentType: string) {
  try {
    const allowedTypes = FILE_TYPES.PDF.types;

    if (!allowedTypes.includes(contentType)) {
      return {
        success: false,
        error: 'Invalid file type. Only PDF files are allowed.',
      } as const;
    }

    const result = await getPresignedPDFUploadUrl(filename, contentType);

    return {
      success: true,
      uploadUrl: result.uploadUrl,
      publicUrl: result.publicUrl,
      key: result.key,
      folder: result.folder,
      originalFilename: result.originalFilename,
    } as const;
  } catch (error) {
    console.error('Error generating PDF upload URL:', error);
    return {
      success: false,
      error: 'Failed to generate upload URL',
    } as const;
  }
}

// Generic file upload URL generator
export async function getFileUploadUrl(
  filename: string, 
  contentType: string,
  category: FileTypeCategory = 'ALL_DOCUMENTS'
) {
  try {
    const allowedTypes = FILE_TYPES[category].types;
    
    if (!allowedTypes.includes(contentType)) {
      const typesList = allowedTypes
        .map(t => t.split('/')[1].toUpperCase())
        .join(', ');
      return {
        success: false,
        error: `Invalid file type. Only ${typesList} are allowed.`,
      } as const;
    }

    const result = await getPresignedUploadUrl(filename, contentType);

    return {
      success: true,
      uploadUrl: result.uploadUrl,
      publicUrl: result.publicUrl,
      key: result.key,
      folder: result.folder,
      originalFilename: result.originalFilename,
    } as const;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return {
      success: false,
      error: 'Failed to generate upload URL',
    } as const;
  }
}

/* Document upload (PDF or Image)*/
export async function getDocumentUploadUrl(filename: string, contentType: string) {
  return getFileUploadUrl(filename, contentType, 'ALL_DOCUMENTS');
}
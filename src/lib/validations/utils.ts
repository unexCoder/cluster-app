// lib/validations/utils.ts
import { z } from 'zod';
import type { ValidationErrors } from '../../../types/types';

export const validateWithSchema = <T extends z.ZodSchema>(
  schema: T,
  data: unknown,
  fieldMapping?: Record<string, string>
): { isValid: boolean; errors: ValidationErrors; data?: z.infer<T> } => {
  try {
    const validatedData = schema.parse(data);
    return {
      isValid: true,
      errors: {},
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      
      error.issues.forEach((issue) => { // Changed from 'errors' to 'issues'
        const field = issue.path[0] as string;
        const mappedField = fieldMapping?.[field] || field;
        errors[mappedField] = issue.message;
      });
      
      return {
        isValid: false,
        errors,
      };
    }
    
    return {
      isValid: false,
      errors: { _general: 'An unexpected error occurred' },
    };
  }
};
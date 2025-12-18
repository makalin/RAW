/**
 * Form handling utilities
 */

import { Signal, state } from './index.js';

export type ValidationRule<T = any> = {
  validate: (value: T) => boolean;
  message: string;
};

export type FormField<T = any> = {
  value: Signal<T>;
  error: Signal<string>;
  touched: Signal<boolean>;
  dirty: Signal<boolean>;
  rules: ValidationRule<T>[];
  validate: () => boolean;
  reset: () => void;
};

/**
 * Creates a form field with validation
 */
export function field<T>(
  initialValue: T,
  rules: ValidationRule<T>[] = []
): FormField<T> {
  const value = state(initialValue);
  const error = state('');
  const touched = state(false);
  const dirty = state(false);
  const initial = initialValue;
  
  const validate = (): boolean => {
    for (const rule of rules) {
      if (!rule.validate(value.val)) {
        error.val = rule.message;
        return false;
      }
    }
    error.val = '';
    return true;
  };
  
  const reset = () => {
    value.val = initial;
    error.val = '';
    touched.val = false;
    dirty.val = false;
  };
  
  // Auto-validate on change
  value._subscribers.add(() => {
    dirty.val = value.val !== initial;
    if (touched.val) {
      validate();
    }
  });
  
  return {
    value,
    error,
    touched,
    dirty,
    rules,
    validate,
    reset,
  };
}

/**
 * Common validation rules
 */
export const validators = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validate: (value: T) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value != null && value !== '';
    },
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),
  
  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
  
  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value >= min,
    message: message || `Must be at least ${min}`,
  }),
  
  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value <= max,
    message: message || `Must be at most ${max}`,
  }),
};

/**
 * Creates a form with multiple fields
 */
export function form<T extends Record<string, FormField<any>>>(
  fields: T
): {
  fields: T;
  validate: () => boolean;
  reset: () => void;
  values: () => Record<keyof T, any>;
  isValid: Signal<boolean>;
} {
  const isValid = state(true);
  
  const validate = (): boolean => {
    let valid = true;
    Object.values(fields).forEach((field) => {
      if (!field.validate()) {
        valid = false;
      }
    });
    isValid.val = valid;
    return valid;
  };
  
  const reset = () => {
    Object.values(fields).forEach((field) => {
      field.reset();
    });
    validate();
  };
  
  const values = (): Record<keyof T, any> => {
    const result: any = {};
    Object.entries(fields).forEach(([key, field]) => {
      result[key] = field.value.val;
    });
    return result;
  };
  
  // Update isValid when any field changes
  Object.values(fields).forEach((field) => {
    field.value._subscribers.add(() => {
      validate();
    });
  });
  
  return {
    fields,
    validate,
    reset,
    values,
    isValid,
  };
}


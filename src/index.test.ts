/**
 * Unit tests for RAW framework
 */

import { describe, it, expect, beforeEach } from './test-utils.js';
import { state, html, mount } from './index.js';
import { computed } from './computed.js';
import { effect } from './effect.js';
import { field, validators, form } from './forms.js';

describe('RAW Framework', () => {
  describe('state', () => {
    it('should create a signal with initial value', () => {
      const count = state(0);
      expect(count.val).toBe(0);
    });
    
    it('should update signal value', () => {
      const count = state(0);
      count.val = 10;
      expect(count.val).toBe(10);
    });
    
    it('should notify subscribers on change', () => {
      const count = state(0);
      let notified = false;
      
      count._subscribers.add(() => {
        notified = true;
      });
      
      count.val = 10;
      expect(notified).toBe(true);
    });
  });
  
  describe('computed', () => {
    it('should create computed signal', () => {
      const a = state(5);
      const b = state(10);
      const sum = computed(() => a.val + b.val);
      
      expect(sum.val).toBe(15);
    });
    
    it('should update when dependencies change', () => {
      const a = state(5);
      const b = state(10);
      const sum = computed(() => a.val + b.val);
      
      a.val = 20;
      expect(sum.val).toBe(30);
    });
  });
  
  describe('forms', () => {
    it('should create form field', () => {
      const nameField = field('', [validators.required()]);
      expect(nameField.value.val).toBe('');
      expect(nameField.error.val).toBe('');
    });
    
    it('should validate required field', () => {
      const nameField = field('', [validators.required()]);
      nameField.touched.val = true;
      const isValid = nameField.validate();
      
      expect(isValid).toBe(false);
      expect(nameField.error.val).toBe('This field is required');
    });
    
    it('should create form with multiple fields', () => {
      const loginForm = form({
        email: field('', [validators.required(), validators.email()]),
        password: field('', [validators.required(), validators.minLength(6)]),
      });
      
      expect(loginForm.fields.email.value.val).toBe('');
      expect(loginForm.fields.password.value.val).toBe('');
    });
  });
});


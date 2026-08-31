import { describe, it, expect } from '@jest/globals';
import { required, isEmail, validateContact, validateDeal, validateTask } from '../assets/utils/validators.js';

describe('NovaCRM validators', () => {
  it('required works', () => {
    expect(required('')).toBe(false);
    expect(required('ok')).toBe(true);
  });
  it('email validation', () => {
    expect(isEmail('a@b.com')).toBe(true);
    expect(isEmail('x')).toBe(false);
  });
  it('validateContact', () => {
    const e = validateContact({ name: '', email: 'bad' });
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
  });
  it('validateDeal', () => {
    expect(validateDeal({ title: 'Deal', value: 100 })).toEqual({});
    expect(validateDeal({ title: '', value: -1 }).title).toBeTruthy();
  });
  it('validateTask', () => {
    expect(validateTask({ title: '' }).title).toBeTruthy();
  });
});
// coverage note

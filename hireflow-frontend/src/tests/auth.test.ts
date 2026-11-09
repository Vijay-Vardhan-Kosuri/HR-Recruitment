import { describe, it, expect } from 'vitest';

describe('auth helpers', () => {
  it('validates email format', () => {
    const ok = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    expect(ok('superadmin@hireflow.io')).toBe(true);
    expect(ok('bad')).toBe(false);
  });
});
// pr

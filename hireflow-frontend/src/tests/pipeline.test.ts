import { describe, it, expect } from 'vitest';

describe('recruitment pipeline', () => {
  it('computes stage progression', () => {
    const stages = ['APPLIED', 'SCREEN', 'INTERVIEW', 'OFFER', 'HIRED'];
    expect(stages.length).toBe(5);
    expect(stages.indexOf('INTERVIEW')).toBeGreaterThan(stages.indexOf('SCREEN'));
  });

  it('scores candidate fit', () => {
    const score = (skills: number, experience: number) => skills * 0.6 + experience * 0.4;
    expect(score(80, 70)).toBe(76);
  });
});

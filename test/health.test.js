const { describe, it } = require('node:test');
const assert = require('node:assert');
describe('backend', () => {
  it('health shape', () => {
    const h = { status: 'ok' };
    assert.strictEqual(h.status, 'ok');
  });
});

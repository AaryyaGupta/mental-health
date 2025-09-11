// Simple input sanitization & escaping helpers
// Strips disallowed HTML tags and escapes angle brackets to mitigate XSS.

function basicStrip(input) {
  if (typeof input !== 'string') return input; // non-strings returned untouched
  // Trim and normalize whitespace length
  let value = input.trim();
  // Remove common zero-width & control characters except newline & tab
  value = value.replace(/[\u200B-\u200D\uFEFF\u0000-\u001F]/g, '');
  return value;
}

function escapeHtml(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeText(input, { maxLength = 2000 } = {}) {
  let value = basicStrip(input);
  if (typeof value === 'string') {
    if (value.length > maxLength) value = value.slice(0, maxLength);
    value = escapeHtml(value);
  }
  return value;
}

function sanitizeObjectFields(obj, fields, opts) {
  if (!obj) return;
  fields.forEach(f => {
    if (Object.prototype.hasOwnProperty.call(obj, f)) {
      obj[f] = sanitizeText(obj[f], opts);
    }
  });
}

module.exports = { sanitizeText, sanitizeObjectFields, escapeHtml };

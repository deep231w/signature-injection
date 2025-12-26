const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
  page: String,
  xPercent: String,
  yPercent: String,
  widthPercent: String,
  heightPercent: String,
  fontSizePercent: String,
  text: String,
});

const PdfSchema = new mongoose.Schema({
  pdfId: String,
  originalHash: String,
  signedHash: String,
  signatures: [SignatureSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PdfSchema', PdfSchema);

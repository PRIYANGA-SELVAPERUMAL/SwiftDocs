// server/models/CertificateRequest.js

const mongoose = require("mongoose");

const CertificateRequestSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  proofFile: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected", "Approved"],
    default: "Pending",
  },
  reviewedBy: {
    type: String, // You can change to ObjectId if you have a separate Verifier model
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("CertificateRequest", CertificateRequestSchema);

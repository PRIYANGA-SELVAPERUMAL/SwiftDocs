const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    email: { type: String }, // optional
    rollNumber: { type: String, required: true },
    department: { type: String, required: true },
    eventName: { type: String, required: true },
    purpose: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Rejected", "Approved"],
      default: "Pending",
    },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentName: String,
  regNo: String,
  department: String,
  documentType: String,
  purpose: String,
  proofFile: String,
  status: { type: String, enum:["Pending","Reviewed","Rejected","Approved"], default:"Pending" },
  verifierComment: String,
  adminComment: String,
  pdfFile: String
},{ timestamps:true });

module.exports = mongoose.model("Request", requestSchema);

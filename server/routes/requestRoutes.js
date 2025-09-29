const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// Create new request
router.post("/", async (req, res) => {
  try {
    const { studentName, email, rollNumber, department, eventName, purpose, description } = req.body;

    if (!studentName || !rollNumber || !department || !eventName || !purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRequest = new Request({
      studentName,
      email: email || "",
      rollNumber,
      department,
      eventName,
      purpose,
      description,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Request submission error:", err);
    res.status(500).json({ error: "Failed to submit request", details: err.message });
  }
});

// Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status (Verifier / Admin)
router.put("/:id", async (req, res) => {
  try {
    const { status, comment } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status, comment },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

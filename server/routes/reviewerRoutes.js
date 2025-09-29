const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// Get all pending requests for verifier
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find({ status: "Pending" });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve / Reject request (Verifier)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // Map verifier action to status
    let newStatus = "";
    if (status === "Approved" || status === "Reviewed") newStatus = "Reviewed"; // Approved by verifier
    else if (status === "Rejected" || status === "Rejected by Reviewer") newStatus = "Rejected by Reviewer";

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

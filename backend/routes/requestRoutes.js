const router = require("express").Router();
const multer = require("multer");
const Request = require("../models/Request");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ---------- Multer File Upload ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// ---------- Student submits request ----------
router.post("/", upload.single("proofFile"), async (req, res) => {
  try {
    const newReq = new Request({
      studentName: req.body.studentName,
      regNo: req.body.regNo,
      department: req.body.department,
      documentType: req.body.documentType,
      purpose: req.body.purpose,
      proofFile: req.file?.filename,
      status: "Pending"
    });
    await newReq.save();
    res.json({ message: "Request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Get all requests ----------
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const requests = await Request.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Get requests by student ----------
router.get("/myrequests/:studentName", async (req, res) => {
  try {
    const requests = await Request.find({ studentName: req.params.studentName });
    res.json(requests.length ? requests : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Get requests by status ----------
router.get("/status/:status", async (req, res) => {
  try {
    const requests = await Request.find({ status: req.params.status });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Verifier approves/rejects ----------
router.patch("/verify/:id", async (req, res) => {
  try {
    const { status, verifierComment } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status, verifierComment },
      { new: true }
    );
    res.json(request || { message: "Request not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Helper function to generate PDF ----------
const generateCertificatePDF = (request, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Header
      doc.font("Times-Bold")
         .fontSize(24)
         .text("AMRITA VISHWA VIDYAPEETHAM", { align: "center" });
      
      doc.moveDown(0.5);
      doc.fontSize(12)
         .text("Ettimadai, Coimbatore - 641112, Tamil Nadu, India", { align: "center" });
      
      doc.moveDown(2);
      
      // Certificate Title
      doc.fontSize(20)
         .text(`${request.documentType.toUpperCase()} CERTIFICATE`, { align: "center" });
      
      // Horizontal line
      doc.moveDown(1);
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      
      doc.moveDown(2);

      // Main content
      doc.font("Times-Roman")
         .fontSize(14)
         .text(`This is to certify that `, { continued: true })
         .font("Times-Bold")
         .text(`${request.studentName}`, { continued: true })
         .font("Times-Roman")
         .text(`, Registration No. `, { continued: true })
         .font("Times-Bold")
         .text(`${request.regNo}`, { continued: true })
         .font("Times-Roman")
         .text(`, was a bonafide student of Amrita Vishwa Vidyapeetham.`);
      
      doc.moveDown(2);

      // Student Details Box
      const boxY = doc.y;
      doc.rect(70, boxY, 450, 120)
         .stroke();
      
      // Blue left border
      doc.rect(70, boxY, 5, 120)
         .fill('#4A90A4');
      
      doc.fillColor('black');
      doc.font("Times-Bold")
         .fontSize(12)
         .text("Student Details:", 90, boxY + 15);
      
      doc.font("Times-Roman")
         .fontSize(11)
         .text(`Name: ${request.studentName}`, 90, boxY + 35)
         .text(`Registration Number: ${request.regNo}`, 90, boxY + 50)
         .text(`Department: ${request.department}`, 90, boxY + 65)
         .text(`Purpose: ${request.purpose}`, 90, boxY + 80);

      doc.y = boxY + 140;
      doc.moveDown(1);

      doc.fontSize(12)
         .text("This certificate is issued in good faith and for the stated purpose only.");
      
      doc.moveDown(4);

      // Signature and Seal
      const signatureY = doc.y;
      
      // Signature line
      doc.moveTo(50, signatureY)
         .lineTo(200, signatureY)
         .stroke();
      
      doc.text("Registrar", 50, signatureY + 10)
         .text("Authorized Signatory", 50, signatureY + 25);

      // Official Seal (circle)
      doc.circle(450, signatureY - 20, 30)
         .stroke();
      doc.fontSize(8)
         .text("OFFICIAL", 430, signatureY - 25)
         .text("SEAL", 440, signatureY - 15);

      // Footer
      doc.moveDown(3);
      doc.fontSize(9)
         .text(`Certificate No: CERT/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`, 50, doc.page.height - 100)
         .text(`Date: ${new Date().toLocaleDateString()}`, 400, doc.page.height - 100);

      doc.end();

      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// ---------- Admin approves/rejects & generate PDF ----------
router.patch("/admin/:id", async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    let pdfFileName = request.pdfFile;

    if (status === "Approved") {
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, "../uploads/");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      pdfFileName = `certificate_${request.regNo}_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, pdfFileName);

      // Generate PDF and wait for completion
      await generateCertificatePDF(request, filePath);
      
      // Verify file was created
      if (!fs.existsSync(filePath)) {
        throw new Error("PDF generation failed - file not created");
      }
    }

    // Update request in database
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        adminComment, 
        pdfFile: pdfFileName 
      },
      { new: true }
    );

    res.json({ 
      message: status === "Approved" ? "Request approved & PDF generated successfully" : "Request updated successfully", 
      request: updatedRequest 
    });

  } catch (err) {
    console.error("Admin approval error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Download PDF ----------
router.get("/download/:id", async (req, res) => {
  try {
    const reqData = await Request.findById(req.params.id);
    if (!reqData) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (!reqData.pdfFile) {
      return res.status(404).json({ error: "No PDF file available for this request" });
    }

    const filePath = path.join(__dirname, "../uploads/", reqData.pdfFile);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      return res.status(500).json({ error: "PDF file is empty" });
    }

    // Set proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${reqData.studentName}_${reqData.regNo}.pdf"`);
    
    // Send file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error downloading file" });
        }
      }
    });

  } catch (err) {
    console.error("Download route error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Preview certificate in browser ----------
router.get("/preview/:id", async (req, res) => {
  try {
    const reqData = await Request.findById(req.params.id);
    if (!reqData) return res.status(404).send("Request not found");

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate Preview</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              padding: 50px; 
              background-color: #f5f5f5;
            }
            .certificate {
              background: white;
              padding: 40px;
              border: 2px solid #4A90A4;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              max-width: 800px;
              margin: 0 auto;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #4A90A4; 
              margin-bottom: 10px;
            }
            .subtitle { 
              font-size: 12px; 
              color: #666; 
              margin-bottom: 20px;
            }
            .cert-title {
              font-size: 20px;
              font-weight: bold;
              text-decoration: underline;
              margin: 20px 0;
            }
            .content { 
              font-size: 14px; 
              line-height: 1.6; 
              text-align: center; 
              margin: 30px 0;
            }
            .details-box {
              border: 1px solid #ddd;
              border-left: 4px solid #4A90A4;
              padding: 20px;
              margin: 20px 0;
              background: #f9f9f9;
              text-align: left;
            }
            .details-title {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .details-item {
              margin: 5px 0;
            }
            .footer {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .signature {
              text-align: center;
              border-top: 1px solid black;
              width: 200px;
              padding-top: 5px;
            }
            .seal {
              border: 2px solid #4A90A4;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f0f8ff;
            }
            .cert-info {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              font-size: 10px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">AMRITA VISHWA VIDYAPEETHAM</div>
              <div class="subtitle">Ettimadai, Coimbatore - 641112, Tamil Nadu, India</div>
              <div class="cert-title">${reqData.documentType.toUpperCase()} CERTIFICATE</div>
            </div>
            
            <hr style="border: 1px solid #4A90A4; margin: 20px 0;">
            
            <div class="content">
              <p>This is to certify that <strong>${reqData.studentName}</strong>, 
              Registration No. <strong>${reqData.regNo}</strong>, 
              was a bonafide student of Amrita Vishwa Vidyapeetham.</p>
            </div>

            <div class="details-box">
              <div class="details-title">Student Details:</div>
              <div class="details-item"><strong>Name:</strong> ${reqData.studentName}</div>
              <div class="details-item"><strong>Registration Number:</strong> ${reqData.regNo}</div>
              <div class="details-item"><strong>Department:</strong> ${reqData.department}</div>
              <div class="details-item"><strong>Purpose:</strong> ${reqData.purpose}</div>
            </div>

            <div class="content">
              <p>This certificate is issued in good faith and for the stated purpose only.</p>
            </div>

            <div class="footer">
              <div>
                <div class="signature">
                  <div><strong>Registrar</strong></div>
                  <div style="font-size: 12px;">Authorized Signatory</div>
                </div>
              </div>
              <div class="seal">
                <div style="text-align: center; font-size: 8px; font-weight: bold; color: #4A90A4;">
                  <div>OFFICIAL</div>
                  <div>SEAL</div>
                </div>
              </div>
            </div>

            <div class="cert-info">
              <span>Certificate No: CERT/${new Date().getFullYear()}/${Date.now().toString().slice(-4)}</span>
              <span>Date: ${new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
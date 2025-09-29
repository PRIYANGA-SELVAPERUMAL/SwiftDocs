const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateBonafidePDF(request) {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(__dirname, '../uploads', `${request._id}.pdf`);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const logoPath = path.join(__dirname, '../assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 30, { width: 80 });
  }

  doc
    .fontSize(18)
    .font('Times-Bold')
    .text('Amrita Vishwa Vidyapeetham, Chennai Campus', {
      align: 'center'
    });

  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .font('Times-Roman')
    .text('Vengal, Thiruvallur District, Tamil Nadu - 601103', {
      align: 'center'
    });

  doc.moveDown(2);
  doc
    .fontSize(16)
    .font('Times-Bold')
    .text('BONAFIDE CERTIFICATE', {
      align: 'center',
      underline: true
    });

  doc.moveDown(2);

  const content = `This is to certify that Mr./Ms. ${request.name}, bearing the registration number ${request.regNumber}, is a bonafide student of Amrita Vishwa Vidyapeetham, Chennai Campus. The student is currently pursuing their academic studies during the current academic year.

This certificate is being issued upon their request for the purpose of "${request.purpose}".`;

  doc
    .fontSize(13)
    .font('Times-Roman')
    .text(content, {
      align: 'justify',
      lineGap: 6
    });

  doc.moveDown(3);
  doc
    .fontSize(12)
    .text(`Date: ${new Date(request.dateRequested).toLocaleDateString()}`, {
      align: 'left'
    });

  doc.moveDown(2);
  doc
    .font('Times-Bold')
    .text('Registrar / Head of Institution', {
      align: 'right'
    });

  doc.end();
}

module.exports = { generateBonafidePDF };

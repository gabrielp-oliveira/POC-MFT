const PDFDocument = require("pdfkit");
const fs = require("fs");
const logger = require("../util/logging/winston").log;

async function createPdfWithText(text, res) {
  try {
    logger.info('Starting transform text into pdf.')
    const doc = new PDFDocument();
    doc.fontSize(12);
    // doc.pipe(fs.createWriteStream("output.pdf"));
    doc.text(text);
    doc.end();
    logger.info('finish transform text into pdf.')

    return doc.pipe(res);
  } catch (error) {
    console.error(error);
    logger.error("Error login API.");
    res.send('erro')
  }
}

module.exports = createPdfWithText;

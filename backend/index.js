const express = require('express');
const cors= require("cors");
const fs= require('fs');
const {PDFDocument, rgb, StandardFonts} =require('pdf-lib');
const shahash = require('./utils/hashBuffer.js');
const PdfSchema = require('./models/Pdf-schema.js');

require('dotenv').config();
require('./db/db.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.post("/sign-pdf", async(req,res)=>{
  try{
    const {pdfId , signatures}=req.body;
    const pdfBytes= fs.readFileSync(`./pdfs/${pdfId}`);
    const originalHash= shahash(pdfBytes);
    console.log('sha256 type:', typeof shahash);


    const pdfDoc= await PDFDocument.load(pdfBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    signatures.forEach(sig => {
      const page = pdfDoc.getPage(sig.page - 1);
      const { width, height } = page.getSize();

      const boxWidth = sig.widthPercent * width;
      const boxHeight = sig.heightPercent * height;
      const fontSize = sig.fontSizePercent * height;

      const boxX = sig.xPercent * width;
      const boxY = height - (sig.yPercent * height) - boxHeight;

      const textWidth = font.widthOfTextAtSize(sig.text, fontSize);

      const textX = boxX + (boxWidth - textWidth) / 2;
      const textY = boxY + (boxHeight - fontSize) / 2;

      page.drawText(sig.text, {
        x: textX,
        y: textY,
        size: fontSize,
        font, 
        color: rgb(0, 0, 0),
      });
    });

    const signedPdfBytes = await pdfDoc.save();
    const signedHash= shahash(signedPdfBytes);
    console.log("original pdf hash , signedhash- ", originalHash, signedHash);

    fs.writeFileSync(`./signed/signed-${pdfId}`, signedPdfBytes);

    const newSignedPdf =await PdfSchema.create({
      pdfId,
      originalHash,
      signedHash,
      signatures
    })

    res.status(200).json({
      url:`/signed/signed-${pdfId}`,
      newSignedPdf:newSignedPdf
    })
    console.log("signed pdf url- ", `/signed/signed-${pdfId}`);

    console.log("payload inside api= ", pdfId, signatures);

  }catch(e){
    console.log("internal server error ", e);
    res.status(500).json({
      error:"internal server error"
    })
  }
  

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.post("/sign-pdf", async(req,res)=>{
  try{
    const {pdfId , signatures}=req.body;

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

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRef } from 'react';
import { PDFcontainer } from './components/PDFcontainer';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {

  const fileInputRef= useRef(null);

  const [pdf, setPdf]=useState(null);
  const [isPdfAdded, setIsPdfAdded]=useState(false);
  const [signaturModaleOpen, setSignatureModalOpen]=useState(false);


  const handleclick= ()=>{
    fileInputRef.current?.click();
  }

  const handleDrop= (e)=>{
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      console.log("Dropped file:", file);
      setPdf(file)
      setIsPdfAdded(true)
    } else {
      alert("Only PDF files allowed");
    }
  }

  const handleFileChange =(e)=>{
    const file = e.target.files?.[0];
    if (file) {
      setPdf(file);
      setIsPdfAdded(true);
      console.log("Selected file:", file);
    }
  }


  return (
    <div className='app'>

      {/* pdf section */}
      <div className='pdf-section'>

        {!isPdfAdded &&
        
          <div 
            className='pdf-upload-section' 
            onClick={handleclick}  
            onDrop={handleDrop}  
            onDragOver={(e) => e.preventDefault()}   
          >
            <p>Drag or clcik here to upload pdf</p>

            <input 
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        }

        {/* pdf render if uploaded */}

        {pdf && 
          <PDFcontainer 
            isSignatureModalOpen={signaturModaleOpen} 
            onCloseSignatureModal={()=>setSignatureModalOpen(false)} 
            pdfFile={pdf}
          />
        }
      </div>

      {/* signature section */}
      <div className='signature-section'>
        <p className='signature-heading'>Signature section</p>

        <div className='button-sec'>
          <button 
            className='signature-btn'
            onClick={()=>setSignatureModalOpen(!signaturModaleOpen)}
          >
            Add signature
          </button>

          <button className='submit-btn'>SUBMIT</button>
        </div>
      </div>
    </div>
  )
}

export default App

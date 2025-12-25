import { Document, Page } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { SignatureBox } from "./SignatureBox";
import { SignatureModal } from "./SignatureModal";

export function PDFcontainer({ pdfFile ,isSignatureModalOpen, onCloseSignatureModal}) {

  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const pageRefs= useRef([]);
  const [activeSignature, setActiveSignature] = useState(false);
  const [signature , setSignature]=useState();
  const [activePage, setActivePage]=useState();

  const [signatures, setSignatures] = useState([]);


  useEffect(() => {
  if (!pageRefs.current.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = Number(entry.target.dataset.page);
          setActivePage(pageNumber);
        }
      });
    },
    {
      root: document.querySelector(".pdf-container"),
      threshold: 0.6, 
    }
  );

  pageRefs.current.forEach((page) => {
    if (page) observer.observe(page);
  });

  return () => observer.disconnect();
}, [numPages]);

useEffect(()=>{
  console.log("signatures / cords- ",signatures);
},[signatures]);

  return (
    <div className="pdf-container">
      <Document file={pdfFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
          <div 
            key={i} 
            className="pdf-page-wrapper" 
            ref={(el)=>(pageRefs.current[i]=el)}
            data-page={i+1}

          >
            <Page
              pageNumber={i + 1}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />

            {/* { activeSignature && activePage === i+1 && 
              <SignatureBox 
                addedSignature={signature} 
                pageRef={{current:pageRefs.current[i]}} 
              />} */}
              {signatures
                .filter(sig=>sig.page ===i+1)
                .map(sig=>(
                  <SignatureBox
                    key={sig.id}
                    addedSignature={sig.text}
                    pageRef={{current:pageRefs.current[i]}}
                    onChange={(coords)=>{
                      setSignatures(prev=>
                        prev.map(s=>
                          s.id ==sig.id ? {...s , ...coords} :s
                        )
                      )
                    }}
                  />
                ))}
          </div>
        ))}
      </Document>

      <div className="pdf-controls">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(2, s + 0.1))}>+</button>
      </div>

      {/* add signature modal section */}
      {isSignatureModalOpen && 
        <SignatureModal 
          onSave={(text)=>{
            // setSignature(text);
            // setActiveSignature(true);
            setSignatures(prev=>[
              ...prev,
              {
                id:crypto.randomUUID(),
                page:activePage,
                text
              }
            ])
          }}
          onClose={onCloseSignatureModal}
        />
      }
    </div>
  );
}

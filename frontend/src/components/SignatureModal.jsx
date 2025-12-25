import { useState } from "react";
import { TextSignature } from "./signatureType/TextSignature";
import { DrawSignature } from "./signatureType/DrawSignature";

export function SignatureModal({ onClose, onSave }) {
    const [signatureType, setSignatureType]=useState(1);
    const [textSignature, setSetSignature]=useState(null);

  return (
    <div className="signature-modal-overlay">
      <div className="signature-modal">

        {/* Top */}
        <div className="signature-modal-header">
          <button onClick={()=>setSignatureType(0)}>Draw signature</button>
          <button onClick={()=>setSignatureType(1)}>Write Text</button>
        </div>

        {/* Middle */}
        <div className="signature-modal-body">
        {signatureType ? 
            <TextSignature 
                setTextSignature={setSetSignature}
            />
            :<DrawSignature/>}
        </div>

        {/* Bottom */}
        <div className="signature-modal-footer">

            <button className="close-btn" onClick={onClose}>Cancel</button>
            <button className="add-btn" onClick={()=>{
                onSave(textSignature)
                onClose()
                }}
            >
                Add Signature
            </button>

        </div>

      </div>
    </div>
  );
}

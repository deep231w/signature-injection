export function TextSignature ({setTextSignature}){
    return (
        <div className="text-signature">
            <input 
                onChange={(e)=>setTextSignature(e.target.value)}
                type="text" placeholder="Write signature" 
            />
        </div>
    )
}
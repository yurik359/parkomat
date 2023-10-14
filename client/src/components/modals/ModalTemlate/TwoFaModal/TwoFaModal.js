import ModalTemplate from "../ModalTemplate";
import './twoFaModal.css'
import { useNavigate, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { checkTwoFa } from "../../../../services/requests";
import { useState } from "react";
import { useDispatch } from "react-redux";
const TwoFaModal = ({ isOpen,qrDataURL,temporaryToken,onClose }) => {
    const [twoFaValue,setTwoFaValue] = useState('')
    const [twoFaError,setTwoFaError] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const checkTwoFaToken= async () => {
        try {
            const res = await checkTwoFa({twoFaValue,temporaryToken})
       if(res.data&&res.data.accessToken){
       
        setTwoFaError(false)
        localStorage.setItem("accessToken", res.data.accessToken);
       
        navigate("/dashboard"); 
        onClose(false)
       } else {
        setTwoFaError(true)
       }
        } catch (error) {
            console.log(error)
        }
        
       
        
    }
  return (
    <ModalTemplate isOpen={isOpen} onClose={()=>onClose(false)}>

      <div className="two-fa__container">
        <div className="two-fa__qr" style={{display:!qrDataURL?'none':'flex',flexDirection:'column',alignItems:'center'}}>
        <span>Scan by Google Authenticator to enable two-factor authentication</span>
      <img src={qrDataURL} alt="" style={{width:200,height:200}}/>
      </div>
      <div className="two-fa__input">
        <span>Enter your two-fa pin</span>
        <input type="password" placeholder='Pin'value={twoFaValue} onChange={(e)=>setTwoFaValue(e.target.value)} />
        <button onClick={checkTwoFaToken}>Submit</button>
        </div>
      
      </div>
      {twoFaError&&<span>wrong pin</span>}
    </ModalTemplate>
  );
};

export default TwoFaModal;

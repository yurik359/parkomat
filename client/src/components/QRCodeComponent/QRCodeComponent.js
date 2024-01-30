import QRCode from 'react-qr-code';
import QRCodenew from 'qrcode.react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import './qrCode.css'
import { useTranslation } from "../../services/translations";
import ModalTemplate from "../modals/ModalTemlate/ModalTemplate";
const QRCodeComponent = ({data,showQr,setShowQr,nameSlotQr}) => {
  
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
  const qrCanvasRef = useRef(null);
    const handleClickOutside = (e) => {
        if (
          e.target.classList.contains("qr-code-container") &&
          !e.target.classList.contains("qr-popup")
        ) {
            setShowQr(false);
        }
      };
      const downloadQRCode = () => {
        const canvas = document.getElementById('qrcode-canvas');
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = nameSlotQr;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  return (
    // <div className='qr-code-container' style={{display:showQr?'flex':'none'}}onClick={handleClickOutside}>
      <ModalTemplate isOpen={showQr} onClose={()=>setShowQr(false)}> 
 <div style={{display:'flex',flexDirection:"column",alignItems:'center'}} >
        <div style={{fontSize:'20px',marginBottom:'20px',textAlign:'center',padding:5}}>{t('qrMessage')}</div>
    
        
      <QRCodenew id="qrcode-canvas" value={data} size={250} />
      <button onClick={downloadQRCode} className='download-btn'>{t('download')}</button>
      </div>
       </ModalTemplate> 
    // </div> 
  );
};

export default QRCodeComponent;
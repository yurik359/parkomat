import QRCode from 'react-qr-code';
import './qrCode.css'
const QRCodeComponent = ({data,showQr,setShowQr}) => {
    const handleClickOutside = (e) => {
        if (
          e.target.classList.contains("qr-code-container") &&
          !e.target.classList.contains("qr-popup")
        ) {
            setShowQr(false);
        }
      };
  return (
    <div className='qr-code-container' style={{display:showQr?'flex':'none'}}onClick={handleClickOutside}>
 <div className="qr-popup">
        <div style={{fontSize:'20px',marginBottom:'20px'}}>scan yor code</div>
      <QRCode value={data} />
      </div>
    </div>
  );
};

export default QRCodeComponent;
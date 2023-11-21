import React from 'react';
import './modalTemplate.css'
const ModalTemplate = ({ isOpen, onClose, children }) => {
    
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay"  onClick={(e)=>{
      if (e.target === e.currentTarget) {
        return onClose()} 
        }}>
      <div className="modalX">
        <button onClick={onClose} className='modal-button'>X</button>
       
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalTemplate;

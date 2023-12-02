import "./slotItem.css";

import { useDispatch, useSelector } from "react-redux";
import { addIndexParkomat, changeClickedParkomat } from "./slotItemSlice";
import parking from '../../services/img/Rectangle28.png'
import trash from '../../services/img/trash.svg'
import edit from '../../services/img/editBtn.svg'
import qrIcon from '../../services/img/qrIcon2.svg'
const SlotItem = ({
  slotInfo: { nameOfslot, address,location, payment, formPic, notes, _id },
  index,setCloseDeleteModal,handleOpenEdit,qrCodeGenetating
}) => {
  const dispatch = useDispatch();
  const { indexOfParkomat, clickedParkomat } = useSelector(
    (state) => state.slotItemSlice
  );
  const handleDeleteBtn = () => {
    // if (indexOfParkomat == null) return;
    dispatch(addIndexParkomat(_id));
    setCloseDeleteModal(false);
  };
  const handleQrCode = () => {
    dispatch(addIndexParkomat(_id));
    qrCodeGenetating()
  }
  // const { formValues:{locationValue:{address:{}}} } = useSelector(
  //   (state) => state.addParkomatSlice
  // );
  // const [clickedParkomat,setClickedParkomat] = useState(false)
  // const selectParkomatItem = () => {
  //   if (clickedParkomat == true && indexOfParkomat == _id) {

  //     dispatch(addIndexParkomat(null));
  //     dispatch(changeClickedParkomat(false));
  //   } else {
  //     dispatch(changeClickedParkomat(true));
  //     dispatch(addIndexParkomat(_id));
  //   }
  // };
  return (
    
    <div
      className="slot-item"
      // onClick={selectParkomatItem}
      style={{
        background:
          indexOfParkomat == _id && clickedParkomat ? "#a3caf1" : null,
        
      }}
    >
      
      <img src={formPic||parking} alt="" />
      <div className="name-payment">
        <div className="slot__name">{nameOfslot}</div>
        <div className="slots__btns">
            {/* <div className="slots__qr-btn slot-btn"
            // onClick={qrCodeGenetating}
            >
             Get <span >Qr-code</span>
            </div> */}
            {/* <div
              className="slots__edit-btn slot-btn"
              // onClick={handleOpenEdit}
            ></div> */}
            <div style={{display:'flex',alignItems:'center'}}>
             <img src={qrIcon} style={{width:24,height:21}} onClick={handleQrCode}/>
            <img src={edit} style={{width:32,height:28,margin:'0px 5px 0 5px'}} onClick={()=>handleOpenEdit(_id)}/>
            <img src={trash} style={{width:20,height:25}} onClick={handleDeleteBtn}/>
            </div>
            {/* <div
              className="slots__delete-btn slot-btn"
              // onClick={handleDeleteBtn}
            ></div> */}
            <div className="slot__payment">{payment.namePayment}</div>
          </div>
        
      </div>
      <div className="slot-item__location">
     {address}
      
      </div>
      <div className="slot-item__line"></div>
      <div className="slot-item__description">{notes}</div>
    </div>
  );
};

export default SlotItem;

import "./slotItem.css";

import { useDispatch, useSelector } from "react-redux";
import { addIndexParkomat, changeClickedParkomat } from "./slotItemSlice";
import parking from '../../services/img/Rectangle28.png'

const SlotItem = ({
  slotInfo: { nameOfslot, location, payment, formPic, notes, uid },
  index,
}) => {
  const dispatch = useDispatch();
  const { indexOfParkomat, clickedParkomat } = useSelector(
    (state) => state.slotItemSlice
  );
  const { formValues:{locationValue:{address:{}}} } = useSelector(
    (state) => state.addParkomatSlice
  );
  // const [clickedParkomat,setClickedParkomat] = useState(false)
  const selectParkomatItem = () => {
    if (clickedParkomat == true && indexOfParkomat == uid) {
      console.log(indexOfParkomat)
      dispatch(addIndexParkomat(null));
      dispatch(changeClickedParkomat(false));
    } else {
      dispatch(changeClickedParkomat(true));
      dispatch(addIndexParkomat(uid));
    }
  };
  return (
    
    <div
      className="slot-item"
      onClick={selectParkomatItem}
      style={{
        background:
          indexOfParkomat == uid && clickedParkomat ? "#a3caf1" : null,
        
      }}
    >
      
      <img src={formPic||parking} alt="" />
      <div className="name-payment">
        <div className="slot__name">{nameOfslot}</div>
        <div className="slot__payment">{payment.namePayment}</div>
      </div>
      <div className="slot-item__location">
     {location.address}
      
      </div>
      <div className="slot-item__line"></div>
      <div className="slot-item__description">{notes}</div>
    </div>
  );
};

export default SlotItem;

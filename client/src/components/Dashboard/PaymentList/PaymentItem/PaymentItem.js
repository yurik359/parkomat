import './PaymentItem.css'
import { useTranslation } from "../../../../services/translations";
import { useSelector } from "react-redux";
import { useState,useEffect } from 'react';
const PaymentItem = ({itemInfo,arrayItems}) => {
  const [hideProcessingItem,setHideProcessingItem] = useState(false)
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
 
 
  useEffect(() => {
    if (itemInfo.order_status === 'processing') {
      const hasApprovedElement = arrayItems.some(el => el.order_id === itemInfo.order_id && el.order_status === 'declined'||el.order_status === 'approved');
      if (hasApprovedElement) {
        setHideProcessingItem(hasApprovedElement);
      }
    }
    return ()=>setHideProcessingItem(false)
  }, [arrayItems, itemInfo]);
  console.log(itemInfo,hideProcessingItem)

 return (
    <div className="down-section__trans-item" style={{display:hideProcessingItem?'none':'flex'}}>
    <div className="down-section__check-price">
  
      <span>{itemInfo.amount/100}$</span>
    </div>
    <div className="down-section__typeOf-payment">{itemInfo.paymentSystem||'Payment system'}</div>
    <div className="down-section__status" style={{background:itemInfo.order_status=='approved'?'#22c68c':'red'}}>{t(itemInfo.order_status)}</div>
    <div className="down-section__date">{itemInfo.createdAt}</div>
  </div>
 )
}

export default PaymentItem
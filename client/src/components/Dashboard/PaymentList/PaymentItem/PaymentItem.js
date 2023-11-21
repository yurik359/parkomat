import './PaymentItem.css'

const PaymentItem = ({itemInfo}) => {
 return (
    <div className="down-section__trans-item">
    <div className="down-section__check-price">
      <input type="checkbox" />
      <span>{itemInfo.amount/100}$</span>
    </div>
    <div className="down-section__typeOf-payment">Fondy</div>
    <div className="down-section__status">{itemInfo.order_status}</div>
    <div className="down-section__date">{itemInfo.order_time}</div>
  </div>
 )
}

export default PaymentItem
import './paymentList.css'
import PaymentItem from './PaymentItem/PaymentItem'
const PaymentList = ({paymentStat}) => {
  console.log(paymentStat)
return (
    <div className="dashboard__down down-section">
    {/* <div className="down-section__nav">
      <select name="" id="">
        <option value="filterr">Filter</option>
      </select>
      {/* <input type="text" placeholder="Search" />
      <div className="down-section__btns">
        <div className="down-section__edit-btn"></div>
        <div className="down-section__delete-btn"></div>
      </div> */}
   
    <div className="down-section__transactions">
        {paymentStat&&paymentStat.allPaymentsArray&&
        paymentStat.allPaymentsArray.map((e,i)=>{
            return <PaymentItem itemInfo = {e} arrayItems={paymentStat.allPaymentsArray}key={i}/>
        })}
    
    
      
     </div>
   
  </div>
)
}

export default PaymentList
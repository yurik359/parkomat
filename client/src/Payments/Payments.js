import './payments.css'
import PaymentSlotItem from '../components/PaymentSlotItem/PaymentSlotItem'
import { useSelector } from 'react-redux'
import { saveEndpointInfo } from '../services/requests'
import { useEffect, useState } from 'react'
const Payments = () => {
const {paymentsInfo}  = useSelector(state=>state.slotsSlice)
const [endPointData,setEndPointData] = useState(null)
console.log(paymentsInfo)
useEffect(()=>{
    if(paymentsInfo.endpointOptions&&paymentsInfo.endpointOptions.length>=1) {
        const obj = paymentsInfo.endpointOptions[0]
        setEndPointData({
            endpoint:obj.endpoint,
            method:obj.method,
            amount:obj.amount,
            currency:obj.currency,
            period:obj.period,
        })
    }
},[paymentsInfo])
useEffect(()=>{console.log(endPointData)},[endPointData])
const handleSaveEndpointInfo = async (e) => {
    e.preventDefault()
    
   await saveEndpointInfo({
    endpoint:e.target[0].value,
    method:e.target[1].value,
    amount:e.target[2].value,
    currency:e.target[3].value,
    period:e.target[4].value,
})

}
    return (
        <div className='payment-page wrapper'>
            <PaymentSlotItem paymentsInfo={paymentsInfo} title={'Fondy'} placeholder={'merchant id'}/>
            <PaymentSlotItem paymentsInfo={paymentsInfo} title={'Stripe'} placeholder={'Publish api'} />
            <form action="" onSubmit={handleSaveEndpointInfo} className='payment-page__options-form'>
            <div className="payment-page__options endpoint-options">
                <h3>Endpoint options</h3>
                <div className='endpoint-options_endpoint'>
                    <span style={{fontWeight:550,marginBottom:3,marginTop:5}}>Endpoint</span>
                    
                    <div className='endpoint-options_endpoint-container'>
                <input required type="text" value={endPointData?.endpoint} onChange={(e)=>setEndPointData({...endPointData,endpoint:e.target.value})}placeholder='endpoint' /> 
                <select style={{marginLeft:5}} required name="" id="" value={endPointData?.method} onChange={(e)=>setEndPointData({...endPointData,method:e.target.value})}>
                    <option value="Post">Post</option>
                    <option value="Get">Get</option>
                </select>
                </div>
                </div>
                <div className="endpoint-options__fields-container">
                    <span style={{alignSelf:'center',marginTop:'17px',padding:5,fontWeight:600}}>Fields</span>
                <div className='endpoint-options__field-item'>
                    <span>Amount = </span>
                    <input type="text" required value={endPointData?.amount} onChange={(e)=>setEndPointData({...endPointData,amount:e.target.value})} placeholder='Amount' />
                </div>
                <div className='endpoint-options__field-item'>
                    <span>Currency = </span>
                    <input type="text" required value={endPointData?.currency} onChange={(e)=>setEndPointData({...endPointData,currency:e.target.value})} placeholder='Currency' />
                </div>
                <div className='endpoint-options__field-item'>
                    <span>Period = </span>
                    <input type="text" required value={endPointData?.period} onChange={(e)=>setEndPointData({...endPointData,period:e.target.value})} placeholder='Period' />
                </div>
                </div>
                <button type='submit'>Save</button>
            </div>
            </form>
        </div>
    )

}

export default Payments
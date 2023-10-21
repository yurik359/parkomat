import './paymentSlotItem.css'
import fondy from '../../services/img/Fondy.png'
import { useEffect, useState } from 'react'
import { savePaymentInfo } from '../../services/requests'
import { useSelector } from 'react-redux'
const PaymentSlotItem = ({paymentsInfo}) => {
    const [merchantId,setMerchantId] = useState('')
    const [secretKey, setSecretKey]  = useState('') 
    const [saved,setSaved] = useState(null)
    const { accessToken } = useSelector((state) => state.mainSlice);
    const saveInfo = async () => {
        const res= await savePaymentInfo({type:'fondy',secretKey,merchantId,accessToken})
        if(res&&res.status===200){
                setSaved(res.data.message)
        }
    }

    useEffect(()=>{
      
        if(paymentsInfo&&paymentsInfo.fondy&&paymentsInfo.fondy.merchantId&&paymentsInfo.fondy.secretKey){
            console.log(paymentsInfo)
            setMerchantId(paymentsInfo.fondy.merchantId)
            setSecretKey(paymentsInfo.fondy.secretKey)
        }
        
    },[paymentsInfo])
    return (
        <div className='payment-slot__container'>
           
            <img src={fondy} alt="" />
            <h3 className='payment-slot__title'>Fondy</h3>
            <input type="text" value={merchantId} onChange={(e)=>setMerchantId(e.target.value)} placeholder='merchant ID' />
            <input type="text" value={secretKey} onChange={(e)=>setSecretKey(e.target.value)} placeholder='Secret Key' />
            <button onClick={saveInfo}>save</button>
            {saved&&<span>{saved}</span>}
        </div>
    )
}


export default PaymentSlotItem
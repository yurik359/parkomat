import './paymentSlotItem.css'
import fondy from '../../services/img/Fondy.png'
import { useEffect, useState } from 'react'
import { savePaymentInfo } from '../../services/requests'
import { useSelector } from 'react-redux'
const PaymentSlotItem = ({paymentsInfo,title,placeholder}) => {
    const [merchantId,setMerchantId] = useState('')
    const [paymentApiKey,setPaymentApiKey] = useState('')
    const [secretKey, setSecretKey]  = useState('') 
    const [saved,setSaved] = useState(null)
    const { accessToken } = useSelector((state) => state.mainSlice);
    const saveInfo = async () => {
      
            const res= await savePaymentInfo({type:title,secretKey,paymentApiKey,accessToken})
         
        if(res&&res.status===200){
                setSaved(res.data.message)
        }
    }

    useEffect(()=>{
      console.log(paymentsInfo)
        if(paymentsInfo){
          const paymentSystem = paymentsInfo.filter(e=>e.paymentSystem===title)
          if(paymentSystem.length>=1){
            setPaymentApiKey(paymentSystem[0].paymentApiKey)
            setSecretKey(paymentSystem[0].secretKey)
          }
            
        }
        
    },[paymentsInfo])
    return (
        <div className='payment-slot__container'>
           
            <img src={title==='Stripe'?'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg':fondy} alt="" />
            <h3 className='payment-slot__title'>{title}</h3>
            <input type="text" value={paymentApiKey} onChange={(e)=>setPaymentApiKey(e.target.value)} placeholder={placeholder} />
            <input type="text" value={secretKey} onChange={(e)=>setSecretKey(e.target.value)} placeholder='Secret Key' />
            <button onClick={saveInfo}>save</button>
            {saved&&<span>{saved}</span>}
        </div>
    )
}


export default PaymentSlotItem
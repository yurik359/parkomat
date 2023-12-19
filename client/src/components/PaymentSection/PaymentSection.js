import './paymentSection.css'
import { addCard,howMuchToPay,payCommission} from '../../services/requests'
import { useEffect,useState } from 'react'


const PaymentSection = () => {
    const [unpaidTransaction,setUnpaidTransaction] = useState(null)
    const [totalComission,setTotalComission] = useState(null)
    const handleAddCard =async () => {
        try {
             const res = await addCard()
             if(res&&res.data.response&&res.data.response.checkout_url) {
                window.open(res.data.response.checkout_url);
             }
             
        } catch (error) {
            
        }
    }
    const getInfoToPay = async () => {
        const res= await howMuchToPay()
        console.log(res)
        if(res&&res.data) {
            const {allTransaction,userPaidForAllTime} = res.data
            setUnpaidTransaction((allTransaction*0.014-userPaidForAllTime)/0.014)
            setTotalComission(allTransaction*0.014-userPaidForAllTime)
         }
    }
   useEffect(()=>{
    getInfoToPay()
   
   },[])
   const handlePayCommission =async  () => {
    if(totalComission>0.1) {
        const res = await payCommission(totalComission);
        console.log(res)
        if(res&&res.data&&res.data.response.checkout_url) {
            window.open(res.data.response.checkout_url);
        }
    }


   }
    return (
        <div className="current-week">
        <span >Unpaid transactions: {unpaidTransaction}</span>
        <span style={{margin:'5px 0 5px 0'}}>Commission: {totalComission} </span>
        <div style={{display:'flex'}}>
        <button style={{marginRight:'5px'}} onClick={handlePayCommission}>Pay</button>
        <button onClick={handleAddCard}>add card</button>
        </div>
      </div>
    )
}


export default PaymentSection
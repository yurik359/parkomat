import './paymentSection.css'
import { addCard,howMuchToPay,payCommission} from '../../services/requests'
import { useEffect,useState } from 'react'
import { useTranslation } from "../../services/translations";
import { useSelector } from 'react-redux';
const PaymentSection = () => {
 
    const [unpaidTransaction,setUnpaidTransaction] = useState(null)
    const [totalComission,setTotalComission] = useState(null)
    const { language  } = useSelector(
        (state) => state.slotsSlice
      );
      const {t}= useTranslation(language)
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
            setUnpaidTransaction(
                
                    (allTransaction*0.014-userPaidForAllTime)/0.014
                )
                const commission = allTransaction*0.014-userPaidForAllTime
                setTotalComission(Number(parseFloat(commission).toFixed(2)))
            }
            
         
    }
   useEffect(()=>{
    getInfoToPay()
   
   },[unpaidTransaction,totalComission])
   const handlePayCommission =async  () => {
    if(totalComission>0.1) {
        const res = await payCommission(totalComission);
        
        console.log(res)
        if(res&&res.data&&res.data.response.checkout_url) {
            window.open(res.data.response.checkout_url);
        }
    }


   }
    return (<>
    {totalComission>0.1?<div className="current-week">
            <div className='current-week__titles'>
        <span style={{marginRight:'10px'}} >{t('unpaidTransaction')}:{unpaidTransaction}</span>
        <span style={{marginRight:'10px'}} >{t('commission')}:{totalComission}$ </span>
        </div>
        <div className='current-week__buttons'style={{display:'flex'}}>
          
        <button style={{marginRight:'5px'}} onClick={handlePayCommission}>{t('pay')}</button>
        <button onClick={handleAddCard}>{t('addCard')}</button>
       
        </div>
      </div>:null}
    </>
        
    )
}


export default PaymentSection  
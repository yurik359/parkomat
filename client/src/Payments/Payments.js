import './payments.css'
import PaymentSlotItem from '../components/PaymentSlotItem/PaymentSlotItem'
import { useSelector } from 'react-redux'
const Payments = () => {
const {paymentsInfo}  = useSelector(state=>state.slotsSlice)

    return (
        <div className='payment-page wrapper'>
            <PaymentSlotItem paymentsInfo={paymentsInfo} />
        </div>
    )

}

export default Payments
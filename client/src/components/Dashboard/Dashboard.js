import "./dashboard.css";
import graphic from "../../services/img/Group66.png";
import line from "../../services/img/Vector26.png";
import arrow from "../../services/img/Group68.png";
import circle from "../../services/img/Group81.png";
import PaymentList from "./PaymentList/PaymentList";
import { useState, useEffect } from "react";
import BarChart from "../BarChart/BarChart";
import PieChart from "../PieChart/PieChart";
import { getPaymentStatistic,getTimeRange,getListItems } from "../../services/requests";
import { useTranslation } from "../../services/translations";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
  const [paymentStat,setPaymentStat] = useState(null) 
  const [parkomatItemsList,setParkomatItemsList] = useState([])
  const [barData,setBarData] = useState([])
  const [pieData,setPieData] = useState([])
  const [showDateInput,setShowDateInput] = useState(false) 
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDAte] = useState('')
  const lol = async () => {
    try {
      const res =  await getPaymentStatistic();
if(res&&res.data) {
  
}
    } catch (error) {
      console.log(error)
    }
}

const sortItems = async () => {
  try {
      const res = await getListItems()
      
          if(res.data&&res.data.length>=1) {
            setParkomatItemsList(res.data)
          }
  } catch (error) {
      console.log(error)
  }


}
  useEffect(()=>{
    sortItems()
  },[])
  const getDateToFilter = async(e) => {
    if(e==='DateRange'){
      setShowDateInput(true)
    } else {
      setEndDAte('')
      setStartDate('')
      setShowDateInput(false)
    }
    const today = new Date(); // Поточна дата
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Вчора

// Встановити час 00:00:00 для сьогодньої дати
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

    // Поточний тиждень
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999)
    // Минулий тиждень
    const startOfLastWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate() - 7);
    endOfLastWeek.setHours(23, 59, 59, 999)
    // Поточний місяць
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999)
    // Минулий місяць
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999)
   const dateToFilter = e==='today'?{start:startOfDay,end:endOfDay} : 
   e==='yesterday'? {start:startOfYesterday,end:endOfYesterday} : 
   e==='CurrentWeek'?{start:startOfWeek,end:endOfWeek} :
   e==='lastWeek'?{start:startOfLastWeek,end:endOfLastWeek} :
   e==='Month'?{start:startOfMonth,end:endOfMonth} :
   e==='LastMonth'?{start:startOfLastMonth,end:endOfLastMonth}:
   e==='DateRange'?{start:startDate,end:endDate}:null
  if(dateToFilter){
    if(parkomatItemsList) {
      
      const parkomatIdList = parkomatItemsList.map(e=>{
        return e._id
      })
     
      const res = await getTimeRange({dateToFilter,parkomatIdList})
      
      if(res.data&&res.data.pie) {
        setPieData(res.data.pie)
      }
      if(res.data&&res.data.bar) {
      
        setBarData(res.data.bar)
        }
    if(res.data&&res.data) {
      console.log(res.data)
      setPaymentStat(res.data.sumTransactions[0])
    }
    }
    
    // if(res.data&&res.data.pie) {
     
    // }
    
  
  }
 const test = {end:'sad',start:'asdsa'}
  }
useEffect(()=> {
  setTimeout(()=>{
    const selectedValue = document.getElementById("ranges").value;
   
  getDateToFilter(selectedValue)},1)
  
},[parkomatItemsList])
const today = new Date().toISOString().split('T')[0]
useEffect(()=>{
if(startDate&&endDate) {
  
  getDateToFilter('DateRange')
}
},[startDate,endDate])

console.log(paymentStat)
  return (
    <>
    { <div className="dashboard-background">
    <div className="dashboard wrapper">
      <div className="dashboard__upper">
        <div className="dashboard__graphics">
          <div className="dashboard__graphics-header">
            <div className="dashboard__title">{t('earningsReport')}</div>
            <div className="dashboard__filter-block" >
            <select onChange={(e)=>getDateToFilter(e.target.value)} name="" id="ranges">
              
              <option value="today">{t('today')}</option>
              <option value="yesterday">{t('yesterday')}</option>
              <option value="CurrentWeek">{t('curentWeek')}</option>
              <option value="lastWeek">{t('lastWeek')}</option>

              <option selected value="Month">{t('CurrentMonth')}</option>
              <option value="LastMonth">{t('LastMonth')}</option>
              <option value="DateRange">{t('dateRange')}</option>

            </select>
            <div className={`dashbard__date-inputs ${!showDateInput?'hidden':''} `} >
            <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} max={endDate?endDate:today} />
            <input type="date" value={endDate} onChange={(e)=>setEndDAte(e.target.value)}max={today} min={startDate}/>
            </div>
            </div>
          </div>
          <div className="dashboard__grapchics-main grapchics-main">
            <div className="grapchics-main__left-column">
              {<div className="grapchics-main__earn-number">${paymentStat&&paymentStat.totalSum?paymentStat.totalSum/100:0}</div>}
              
              <div className="grapchics-main__total-earn">
                <img src={graphic} alt="" />
                <span>your total earnings</span>
              </div>
              <div className="grapchics-main__footer">
                <div className="grapchics-main__percent-line">
                  <img src={line} alt="" />

                  <div className="grapchics-main__percent">
                    <img
                      className="grapchics-main__arrow"
                      src={arrow}
                      alt=""
                    />

                    <span>12%</span>
                  </div>
                </div>
                <div className="grapchics-main__footer-description">
                  Update your payment method
                </div>
              </div>
            </div>
            {/* <div className="grapchics-main__main-graphic">
            <div  className='grapchics-main__xnumber'>
              <ul>
                <li>400</li>
                <li>300</li>
                <li>200</li>
                <li>100</li>
                <li>0</li>
               
              </ul>
            </div>
            <div className="grapchics-main__columns">

            </div>
            </div> */}
            <BarChart barData={barData}/>
          </div>
        </div>
        
        <div className="dashboard__middle">
          <div className="dashboard__middle-item">
            <div className="dashboard__middle-title">
              <div className="dashboard__indicator"></div>
              <div className="dashboard__indicator-description">{t('sumOfTransaction')}</div>
            </div>
            <div className="dashboard__statistic-number">${paymentStat&&paymentStat.totalSum?paymentStat.totalSum/100:0}</div>
            
            <div className="dashboard__loader"></div>
          </div>
          <div className="dashboard__middle-item">
            <div className="dashboard__middle-title">
              <div className="dashboard__indicator"></div>
              <div className="dashboard__indicator-description">{t('totalTransation')}</div>
            </div>
            <div className="dashboard__statistic-number">{paymentStat&&paymentStat.allTransaction?paymentStat.allTransaction:0}</div>
            <div className="dashboard__loader"></div>
          </div>
          <div className="dashboard__middle-item">
            <div className="dashboard__middle-title">
              <div className="dashboard__indicator"></div>
              <div className="dashboard__indicator-description">{t('approved')}</div>
            </div>
            <div className="dashboard__statistic-number">{paymentStat&&paymentStat.countApproved?paymentStat.countApproved:0}</div>
            <div className="dashboard__loader"></div>
          </div>
        </div>
       
        <PaymentList paymentStat={paymentStat}/>
      </div>
      <div className="dashboard__payment-info payment-info">
        {/* <img src={circle} alt="" style={{ padding: "20px 0" }} /> */}
        <PieChart pieData={pieData} parkomatItemsList={parkomatItemsList}/>
        <div className="payment-info__text">
          <div className="payment-info__title">Lorem Ipsum</div>
          <div className="payment-info__count">{paymentStat&&paymentStat.countApproved?paymentStat.countApproved:0}</div>
          <div className="payment-info__additional-info">
            Update your payment method
          </div>
        </div>
        <div className="payment-info__footer" style={{ padding: "20px 0" }}>
          <div className="payment-info__indicator"></div>
          <span>Lorem Ipsum</span>
        </div>
      </div>
    </div>
  </div>}
   </>
  );
};

export default Dashboard;

import "./main.css";
import HeaderMain from "../../headerMain/HeaderMain";
import PagesRouter from "../../PagesRouter/PagesRouter";
import Slots from "../../Slots/Slots";
import Payments from "../../../Payments/Payments";
import Dashboard from "../../Dashboard/Dashboard";
import { Routes, Route,Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "./mainSlice";
import { useEffect, useState } from "react";
import { getPaymentsSystems } from "../../../services/requests";
import { changePaymentsInfo } from "../../Slots/slotsSlice";
const DefaultComponent = () => {
  
  return <Navigate to="/dashboard" replace/>
}
const Main = () => {
  const [errorAuth,setErrorAuth] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    
    getPaymentsSystems()
    .then(res=>{
      console.log(res)
      if(res){
      dispatch(changePaymentsInfo(res.data))}
      })

    const accessToken = localStorage.getItem("accessToken");
    dispatch(setAccessToken(accessToken));
  }, []);

  return (
    <div className="main">
      <HeaderMain />
      
      <Routes>
        <Route path="slots" element={<Slots />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="payments" element={<Payments />} />
        <Route path='*' element={<DefaultComponent/>} />
      </Routes>
    </div>
  );
};

export default Main;

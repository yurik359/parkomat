import "./main.css";
import HeaderMain from "../../headerMain/HeaderMain";
import PagesRouter from "../../PagesRouter/PagesRouter";
import Slots from "../../Slots/Slots";
import Payments from "../../../Payments/Payments";
import Dashboard from "../../Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "./mainSlice";
import { useEffect } from "react";
import { getPaymentsSystems } from "../../../services/requests";
import { changePaymentsInfo } from "../../Slots/slotsSlice";
const Main = () => {
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    getPaymentsSystems()
    .then(res=>dispatch(changePaymentsInfo(res.data)))

    const accessToken = localStorage.getItem("accessToken");
    dispatch(setAccessToken(accessToken));
  }, []);

  return (
    <div className="main">
      <HeaderMain />
      <Routes>
        <Route path="slots" element={<Slots />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="payments" element={<Payments />} />
      </Routes>
    </div>
  );
};

export default Main;

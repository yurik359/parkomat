import "./main.css";
import HeaderMain from "../../headerMain/HeaderMain";
import PagesRouter from "../../PagesRouter/PagesRouter";
import Slots from "../../Slots/Slots";
import Dashboard from "../../Dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "./mainSlice";
import { useEffect } from "react";
const Main = () => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  useEffect(() => {
    dispatch(setAccessToken(accessToken));
  }, []);

  return (
    <div className="main">
      <HeaderMain />
      <Routes>
        <Route path="slots" element={<Slots />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default Main;

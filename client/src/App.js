import Login from './components/Pages/login/Login'
import Register from './components/Pages/register/Register';

import Main from './components/Pages/main/Main';

import './App.css';
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import ChangePassword from './components/Pages/changePassword/ChangePassword';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import ThankYouPage from './components/Pages/thankyouPage/ThankYouPage';
const App=()=> {
  const [data, setData] = useState(localStorage.getItem('accessToken'));
 
  const navigate = useNavigate();

    const ProtectedRoute = ({ children }) => {
     const accessToken= localStorage.getItem('accessToken')
        if (!accessToken) {
          
          return <Navigate to="/login" />;
        } 
        return children;
      };
      const LoginRoute = () => {
       const accessToken= localStorage.getItem('accessToken')
  
        if (accessToken !== null && accessToken !== undefined) {
          
          return <Navigate to="/dashboard" />;
        } else {return <Login />;}
        
      };



  return (
    
 
  <Routes>


        <Route path="/login" element={<LoginRoute/>} />

      
        <Route path="/register" element={<Register />} />
        <Route path="/recover-page" element={<ChangePassword />} />
        <Route path="/thankYou" element={<ThankYouPage />} />
       
        <Route path="/*" element={<ProtectedRoute><Main/> </ProtectedRoute>}/>
    
   
  </Routes>


    
    
  )
}

export default App;

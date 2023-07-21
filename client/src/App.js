import Login from './components/Pages/login/Login'
import Register from './components/Pages/register/Register';

import Main from './components/Pages/main/Main';

import './App.css';
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import ChangePassword from './components/Pages/changePassword/ChangePassword';
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
const App=()=> {
  // const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  // const {accessToken} = useSelector(state=>state.mainSlice)
 
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
       console.log(accessToken)
        if (accessToken !== null && accessToken !== undefined) {
          console.log('hopa')
          return <Navigate to="/dashboard" />;
        } else {return <Login />;}
        
      };
      // useEffect(() => {
      //   const updatedAccessToken = localStorage.getItem('accessToken');
      //   if (updatedAccessToken !== accessToken) {
      //     // Перенаправляем на /login, если accessToken изменился и не существует
      //     if (!updatedAccessToken) {
      //       navigate('/login');
      //     }
      //     setAccessToken(updatedAccessToken);
      //   }
      // }, [accessToken, navigate]);


  return (
    
 
  <Routes>


        <Route path="/login" element={<LoginRoute/>} />

        {/* accessToken?<Navigate to='/dashboard'/>: */}
        <Route path="/register" element={<Register />} />
        <Route path="/recover-page" element={<ChangePassword />} />

       
        <Route path="/*" element={<ProtectedRoute><Main/> </ProtectedRoute>}/>
    
   
  </Routes>


    
    
  )
}

export default App;

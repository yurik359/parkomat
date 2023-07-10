import Login from './components/Pages/login/Login'
import Register from './components/Pages/register/Register';

import Main from './components/Pages/main/Main';

import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChangePassword from './components/Pages/changePassword/ChangePassword';
function App() {
    const ProtectedRoute = ({ children }) => {
      const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          
          return <Navigate to="/login" />;
        }
        return children;
      };
  return (
    <>
 <BrowserRouter>
  <Routes>
    <Route path="/*" element={ <ProtectedRoute><Main/> </ProtectedRoute>}/>
    
    
    <Route path="register" element={<Register />} />
    <Route path="login" element={<Login />} />
    <Route path="recover-page" element={<ChangePassword/>} />
  </Routes>
</BrowserRouter>

    
    </>
  )
}

export default App;

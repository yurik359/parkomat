import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ToLogin from "../components/ToLogin/ToLogin";

const api = axios.create({
  baseURL: 'http://localhost:4001', 
});


api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  
  if (accessToken) {
    config.headers['x-access-token'] = accessToken;
  }

  return config;
});

// const ToLogi = () => {
//   const navigate=useNavigate()
//  return navigate('/login')
  
// }


api.interceptors.response.use(
  (response) => {
    
    
    return response;
  },
  (error) => {
   
    if (error.response.data&&error.response.data.message === 'token expired') {
      
       localStorage.removeItem('accessToken');
       window.location.href = '/login'
    }
   return error
  }
);
    

export const deleteParkomatItem = (payload) => api.delete('/deleteParkomat',{params:{indexOfParkomat:payload.indexOfParkomat}})
export const recoverPassword    = (payload) => api.post('/sendEmail',payload)
export const changePassword     = (payload) => api.post('/changePassword',payload)
export const login              = (payload) => api.post('/login',payload)
export const register           = (payload) => api.post('/register',payload)
export const getListItems       = ()        => api.get('/getParkomatList')
export const createParkomat     = (payload) => api.post('/addParkomat',payload)
export const editParkomat       = (payload) => api.put('/updateParkomat',payload)
export const getPlaceId         = (id)      => api.get('/getPlaceId'+id)
export const getAddresses       = (payload) => api.get(`/getAddresses?address=${payload}`)
export const checkTwoFa         = (payload) => api.post('/checkTwoFa',payload)
export const savePaymentInfo    = (payload) => api.post('/savePaymentInfo',payload)
export const getPaymentsSystems = ()      =>   api.get('/getPaymentsSystems')
export const getPaymentStatistic= ()          => api.get('/getPaymentStatystic') 
export const getTimeRange       = (payload)          => api.post(`/getTimeRange`,payload) 
export const handleGET = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    return data
}
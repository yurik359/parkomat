import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


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


api.interceptors.response.use(
  (response) => {
    
    if (response.status === 403) {

      return localStorage.removeItem('accessToken');
    }
    return response;
  },
  (error) => {
    
    return Promise.reject(error);
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


export const handleGET = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    return data
}
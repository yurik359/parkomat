import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const useHandlePOST = () => {
  const navigate = useNavigate();

  const handlePOST = async (url, payload) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if ( res.status === 403) {
        localStorage.removeItem('accessToken')
        navigate('/login');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err.status)
      console.log(err);
    }
  };

  return handlePOST;
};


 export const baseUrl = 'http://176.117.76.79:4001/';
    export  const deleteItemAPI  = baseUrl + 'deleteParkomat'
    export  const recoverAPI     = baseUrl + 'sendEmail'
    export  const changePassAPI  = baseUrl + 'changePassword'
    export  const loginAPI       = baseUrl + 'login'
    export  const registerAPI    = baseUrl + 'register'
    export  const getListAPI     = baseUrl + 'getParkomatList'








export const handleGET = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    return data
}
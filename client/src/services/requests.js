import { useNavigate } from "react-router-dom";
import { useHistory } from 'react-router-dom';

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



export const handleGET = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    return data
}
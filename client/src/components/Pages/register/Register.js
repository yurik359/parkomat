import { useState } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";

import { setAccessToken } from "../main/mainSlice";
import { useDispatch,useSelector } from "react-redux";
import { parsePhoneNumber, isValidNumber } from 'libphonenumber-js';
import parkomatPic from "../../../services/img/Frame2.png";
import { register } from "../../../services/requests";
import PhoneNumberInput from "../../PhoneInput/PhoneInput";
import {isPossiblePhoneNumber} from 'react-phone-number-input';
import TwoFaModal from "../../modals/ModalTemlate/TwoFaModal/TwoFaModal";
import { setTwoFaModal } from "../login/loginSlice";
const Register = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [qrDataURL,setQrDataURL] = useState('')
  const [temporaryToken,setTemporaryToken] = useState('')
  const [twoFaModal,setTwoFaModal] = useState(false)
  const [valid, setValid] = useState(null);
  const [response,setResponse] = useState(null)


  const formValidate = (e) => {
   
    if (e.target[0].value.trim().length < 2) {
      setValid("Імя повинно містити мінімум 2 символи");
      return false;
    }
    if (e.target[4].value !== e.target[5].value) {
      setValid("Паролі не співпадають");
      return false;
    }
    
    // const phoneNumber =e.target[1].value
    // console.log(phoneNumber.length!==10)
    if(!isPossiblePhoneNumber(e.target[2].value)) {
      setValid("wrong number")
      return false
    }
     if (e.target[4].value.length < 7) {
      setValid("Пароль повинен містити мінімум 7 символів");
      return false;
    }
    setValid(null);
    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formValidate(e)) {
      
     try {
      const res=  await register( {
        organizationName: e.target[0].value,
        email: e.target[3].value,
        password: e.target[4].value,
        phoneNumber:e.target[2].value.replace(/\s+/g, ''),
        twoFa:e.target[6].checked
        

      })
     
      
      // if(res.data.status&&res.data.status=="401"){
      //   return setResponse(res.data.message)
      // }
      if(res&&res.data){
        const data = res.data
        if(e.target[6].checked&&data.temporaryToken&&data.qrDataURL) {
          setQrDataURL(data.qrDataURL)
          setTemporaryToken(data.temporaryToken)
          setTwoFaModal(true)
        } else {
          
          navigate("/dashboard");
          localStorage.setItem("accessToken", data.token);
        }
      }
      
    
      
      setResponse(null)
      
     } catch (error) {
      if(error.response.status&&error.response.status=="401"){
        return setResponse(error.response.data.message)
      }
      console.log(error)
     }
      
      
      
     
    }
  };
  return (
    <>
      <div className="register-page">
        <form onSubmit={handleSubmit} className="form-register">
          <div className="form-name">Sign up</div>
          <input required type="text" placeholder="Organization Name" />
          <PhoneNumberInput/>
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required type="password" placeholder="Confirm password" />
          {valid && <span className="validation">{valid}</span>}
          <div className="two-factor-container">  <input type="checkbox" />Enable Two Factor Authentication</div>
          
          <div className="policy">
            {" "}
            By signing up you are agree to our <span>Terms and Services</span>
          </div>
          {response&&<span>{response}</span>}
          <button>
            Sign Up <div class="right-arrow"></div>
          </button>
          <div className="form__have-account">
            Are you already have account?{" "}
            <Link to="/login">
              <span>Log in</span>
            </Link>
          </div>
        </form>
        <div className='parkomatReg-pic'></div>
        {/* <img src={parkomatPic} alt="" /> */}
        <div className="register-blur"></div>
        
      </div>
      <TwoFaModal isOpen={twoFaModal} onClose={setTwoFaModal} temporaryToken={temporaryToken} qrDataURL={qrDataURL}/>
    </>
  );
};

export default Register;

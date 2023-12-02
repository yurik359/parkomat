import "./login.css";
import { useNavigate, Link } from "react-router-dom";

import ModalForgetPass from "../../modalForgetPass/ModalForgetPass";
import { useDispatch } from "react-redux";
import { setForgotPassword,setTwoFaModal } from "./loginSlice";
import { useState, useEffect } from "react";
import parking from "../../../services/img/Frame.png";
import { setAccessToken } from "../main/mainSlice";
import { useSelector } from "react-redux";
import TwoFaModal from "../../modals/ModalTemlate/TwoFaModal/TwoFaModal";
import { login } from "../../../services/requests";

const Login = () => {
  const { accessToken } = useSelector((state) => state.mainSlice);

  const [temporaryToken,setTemporaryToken] = useState('')
  const [twoFaModal,setTwoFaModal] = useState(false)
  const dispatch = useDispatch();
const navigate = useNavigate()
  
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        email: e.target[0].value,
        password: e.target[1].value,
      });

      // if(res.data.twoFa) {
      //   console.log(res)
      // }
      
if(res&&res.data&&res.data.twoFa) {
  setTwoFaModal(true)
setTemporaryToken(res.data.temporaryToken)
}else if(res&&res.data&&res.data.token) {
  navigate("/dashboard");
  localStorage.setItem("accessToken", res.data.token);
}
console.log(res.response.data)
if (
  res.response.data.message &&
  res.response.data.message == "wrong password or email"
) {

  setError(res.response.data.message);
}
      // if (res) {
      //   const data = res.data;
      //   console.log(data)
      //   if(data.qrDataURL) {
      //     setQrDataURL(data.qrDataURL)
          
      //   }
      //   if(data.temporaryToken) {
      //     console.log(data)
      //     setTemporaryToken(data.temporaryToken)
      //   }
      //   setTwoFaModal(true)

      //   // if (data.message && data.token) {
        
      //   // }
      // }
    } catch (error) {
      console.log('lolol')
      
    }
  };

  const forgotPasswordClicked = () => {
    dispatch(setForgotPassword(true));
  };
  return (
    <>
      <div className="login-page ">
        <div className="blur">zxchbbn </div>
        <div className="blur-blue">zxchbbn </div>
        <div className="form-login">
          <form onSubmit={handleSubmit}>
            <div className="form__name">Log in</div>
            <input required type="email" placeholder="Email" />
            <input required type="password" placeholder="Password" />
            <div
              className="form__forgot-password"
              onClick={forgotPasswordClicked}
            >
              Forgot Password?
            </div>
            {error && <span>{error}</span>}
            <button>
              Log In <div class="right-arrow"></div>
            </button>
            <div className="form__have-account">
              You don't have an account?{" "}
              <Link to="/register">
                <span>Sign up</span>
              </Link>
            </div>
          </form>
        </div>
        <div className="login-pic"></div>

        <ModalForgetPass />
        <TwoFaModal temporaryToken={temporaryToken} isOpen={twoFaModal} onClose={setTwoFaModal}/>
      </div>
    </>
  );
};

export default Login;

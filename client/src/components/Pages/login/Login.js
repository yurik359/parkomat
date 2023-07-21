import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useHandlePOST } from "../../../services/requests";
import ModalForgetPass from "../../modalForgetPass/ModalForgetPass";
import { useDispatch } from "react-redux";
import { setForgotPassword } from "./loginSlice";
import { useState } from "react";
import parking from "../../../services/img/Frame.png";
import { setAccessToken } from "../main/mainSlice";
import { useSelector } from "react-redux";
import { loginAPI } from "../../../services/requests";
const Login = () => {
  const {accessToken} =useSelector(state=>state.mainSlice)
  const dispatch = useDispatch();
  const handlePOST = useHandlePOST();
  
  const navigate = useNavigate();
  const [error,setError] = useState(null)
  console.log(accessToken)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await handlePOST(loginAPI, {
      email: e.target[0].value,
      password: e.target[1].value,
    });
  
    if(res.message&&res.message=='wrong password or email') {
      setError(res.message)

    }
    if (res&&res.message&&res.token) {
      setError(null)

      localStorage.setItem("accessToken", res.token);
      // dispatch(setAccessToken(res.token))
      
     navigate("/dashboard")
      
    }

    
  };
console.log(error)
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
            {error&&<span>{error}</span>}
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
      </div>
    </>
  );
};

export default Login;

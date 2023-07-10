import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { useHandlePOST } from "../../../services/requests";
import ModalForgetPass from "../../modalForgetPass/ModalForgetPass";
import { useDispatch } from "react-redux";
import { setForgotPassword } from "./loginSlice";
import parking from "../../../services/img/Frame.png";
const Login = () => {
  const dispatch = useDispatch();
  const handlePOST = useHandlePOST();
  const url = "http://176.117.76.79:4001/login";
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { message, token } = await handlePOST(url, {
      email: e.target[0].value,
      password: e.target[1].value,
    });

    localStorage.setItem("accessToken", token);
    navigate("/dashboard");
  };

  const forgotPasswordClicked = () => {
    dispatch(setForgotPassword(true));
  };
  return (
    <>
      <div className="login-page">
        <div className="blur">zxchbbn </div>
        <div className="blur-blue">zxchbbn </div>
        <div className="form-login">
          <form onSubmit={handleSubmit}>
            <div className="form__name">Log in</div>
            <input required type="email" placeholder="email" />
            <input required type="password" placeholder="Password" />
            <div
              className="form__forgot-password"
              onClick={forgotPasswordClicked}
            >
              Forgot Password?
            </div>
            <button>
              Log in <div class="right-arrow"></div>
            </button>
            <div className="form__have-account">
              You don't have an account?{" "}
              <Link to="/register">
                <span>Sign up</span>
              </Link>
            </div>
           
          </form>
        </div>
        <img className="login-pic" src={parking} alt="" />
        <ModalForgetPass />
      </div>
    </>
  );
};

export default Login;

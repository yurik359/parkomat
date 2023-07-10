import {  useState } from "react";
import "./headerMain.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const HeaderMain = () => {
  const [isActive, setIsActive] = useState(
    window.location.pathname.substring(1)
  );
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <div className="header__background">
      <div className="header__conainer wrapper">
        <div className="header__title">PayParking</div>
        <div className="header__navigate">
          <ul>
            <li className={isActive == "dashboard" ? "dot" : null}>
              <Link to="dashboard" onClick={() => setIsActive("dashboard")}>
                Dashboard
              </Link>
            </li>

            <li className={isActive == "slots" ? "dot" : null}>
              <Link to="slots" onClick={() => setIsActive("slots")}>
                Slots
              </Link>{" "}
            </li>
          </ul>
        </div>
        <div className="header__log" onClick={logOut}>
          Log Out
        </div>
      </div>
    </div>
  );
};

export default HeaderMain;

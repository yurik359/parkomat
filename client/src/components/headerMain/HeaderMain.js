import {  useEffect, useState } from "react";
import styles from  "./headerMain.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../Pages/main/mainSlice";
import { useDispatch,useSelector } from "react-redux";
import { addParkomats,changeLanguage } from "../Slots/slotsSlice";
import PaymentSection from "../PaymentSection/PaymentSection";
import { useTranslation } from "../../services/translations";

const HeaderMain = () => {
 console.log(styles)
  const dispatch=useDispatch();
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
  const [isActive, setIsActive] = useState(
    window.location.pathname.substring(1)
  );
  console.log('lolio')
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('accessToken', null);
    dispatch(addParkomats([]))
    
    navigate("/login")
  
   
  };
  const setLanguage = (lang) => {
    localStorage.setItem('lang',lang)
    dispatch(changeLanguage(lang))
  }
  useEffect(()=>{
    const language= localStorage.getItem('lang');
    console.log(language)
    if(language) {
      dispatch(changeLanguage(language))
    }
    
  },[])

  
  return (
    <div className="header__background">
      <div className="header__conainer wrapper">
        <div className="header__title">PayParking</div>
        <div className="header__navigate">
          <ul>
            <li className={isActive === "dashboard" ? 'header__navigate-item' : null}>
              <Link to="dashboard" onClick={() => setIsActive("dashboard")}>
              {t('dashboard')}
              </Link>
            </li>

            <li className={isActive === "slots" ? 'header__navigate-item' : null}>
              <Link to="slots" onClick={() => setIsActive("slots")}>
              {t('slots')}
              </Link>
            </li>
            <li className={isActive === "payments" ? 'header__navigate-item' : null}>
              <Link to="payments"  onClick={() => setIsActive("payments")}>
              {t('payments')}
              </Link>
            </li>
          </ul>
        </div>
        <div style={{fontSize:language==='fr'?"12.5px":'16px'}}className="header__log" onClick={logOut}>
        {t('logOut')} <div class="right-arrow"></div>
        </div>
        <select name="" id="" value={language} className="header__language" onChange={(e)=>setLanguage(e.target.value)}>
          <option value="en">en</option>
          <option value="ua">ua</option>
          <option value="fr">fr</option>
          <option value="de">de</option>
          <option value="pl">pl</option>
          <option value="es">es</option>
        </select>
       
      </div>
      <PaymentSection/>
    </div>
  );
};

export default HeaderMain;

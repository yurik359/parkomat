import {  useEffect, useState } from "react";
import styles from  "./headerMain.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../Pages/main/mainSlice";
import { useDispatch,useSelector } from "react-redux";
import { addParkomats,changeLanguage } from "../Slots/slotsSlice";
import PaymentSection from "../PaymentSection/PaymentSection";
import { useTranslation } from "../../services/translations";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import HeaderNavigate from "../HeaderNavigate/HeaderNavigate";
import ChangeLanguage from "../ChangeLanguage/ChangeLanguage";
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
  const [showBurger,setShowBurger] = useState(false)
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
        <div className="header__navigate-desktop">
        <HeaderNavigate setIsActive={setIsActive} isActive={isActive}/>
        </div>
        <div style={{fontSize:language==='fr'?"12.5px":'16px'}}className="header__log" onClick={logOut}>
        {t('logOut')} <div class="right-arrow"></div>
        </div>
        
        <div className={`header__burger-menu ${showBurger?'burger-close':''}`} onClick={()=>setShowBurger((state)=>!state)}>
          <span></span>
        </div>
        <div className="header__navigate-desktop">
        <ChangeLanguage setLanguage={setLanguage} language={language}/>
        </div>
       
      </div>
      <BurgerMenu showBurger={showBurger} setIsActive={setIsActive} isActive={isActive} language={language} setLanguage={setLanguage} logOut={logOut}/>
     
       <PaymentSection/>
      
    </div>
  );
};

export default HeaderMain;

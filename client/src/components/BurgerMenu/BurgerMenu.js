import './burgerMenu.css'
import HeaderNavigate from '../HeaderNavigate/HeaderNavigate'
import ChangeLanguage from '../ChangeLanguage/ChangeLanguage'
import { useTranslation } from "../../services/translations";
const BurgerMenu = ({showBurger,setIsActive,isActive,setLanguage,language,logOut}) => {
   
        
        
    
   
      const {t}= useTranslation(language)
    return (
        <div className={`burger_background ${showBurger?'':'burger_transition'}`}style={{height:document.body.scrollHeight}}  >
            <div className="burger_container">
            <HeaderNavigate setIsActive={setIsActive} isActive={isActive}/>
            <ChangeLanguage setLanguage={setLanguage} language={language}/>
            <div style={{padding:language==='fr'?'5px 10px 5px 5px':'5px 14px 5px 10px',width:language==='fr'?111:104}}className="header__log burger-logout" onClick={logOut}>
        {t('logOut')} <div class="right-arrow"></div>
        </div>
            </div>
        </div>
    )
}

export default BurgerMenu
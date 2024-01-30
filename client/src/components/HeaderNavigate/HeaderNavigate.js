
import { Link } from "react-router-dom";
import { useTranslation } from "../../services/translations";
import { addParkomats,changeLanguage } from "../Slots/slotsSlice";
import { useSelector } from "react-redux";
import './headerNavigate.css'
const HeaderNavigate = ({setIsActive,isActive}) => {
    const { language  } = useSelector(
        (state) => state.slotsSlice
      );
      const {t}= useTranslation(language)
    return (
        <div className="header__navigate burger-navigate">
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
    )
}

export default HeaderNavigate
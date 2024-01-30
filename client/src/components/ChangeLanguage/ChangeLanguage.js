


const ChangeLanguage = ({language,setLanguage}) => {
    return (
        <select name="" id="" value={language} className="header__language" onChange={(e)=>setLanguage(e.target.value)}>
          <option value="en">en</option>
          <option value="ua">ua</option>
          <option value="fr">fr</option>
          <option value="de">de</option>
          <option value="pl">pl</option>
          <option value="es">es</option>
        </select>
    )
}

export default ChangeLanguage
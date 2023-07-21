import { useState } from "react";
import "./changePassword.css";
import { useHandlePOST } from "../../../services/requests";
import { changePassAPI } from "../../../services/requests";
import { useNavigate } from "react-router";
const ChangePassword = () => {
  const navigate = useNavigate();
  const handlePOST = useHandlePOST();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const [password, setPassword] = useState("");
  const [consfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
const [response,setResponse] = useState(false)
  const changePass = async () => {
    if (password.length < 7) {
      return setError("minimum 7 characters");
    }
    if (password !== consfirmPassword) {
      setError("Password mismatch");
      console.log("dont");
    } else {
      const res = await handlePOST(changePassAPI, { code, password });
     
      if(res&&res.message){
        setResponse(res.message)
        if(res.status=='ok') {
          setTimeout(()=>{
            console.log('lyap')
            navigate('/login')},3000)
        }
      }
      setConfirmPassword("");
      setPassword("");
      
      
    }
  };
  return (
    <div className="change-password">
      <input
        type="password"
        value={password}
        placeholder="new password"
        onChange={(e) => setPassword(e.target.value)}
        name=""
        id=""
      />
      <input
        type="password"
        value={consfirmPassword}
        placeholder="confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="change-password__btn" onClick={changePass}>
        submit{" "}
      </div>
      <span>{response&&response}</span>
    </div>
  );
};

export default ChangePassword;

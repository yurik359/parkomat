import { useState } from "react";
import "./changePassword.css";
import { useHandlePOST } from "../../../services/requests";
const ChangePassword = () => {
  const handlePOST = useHandlePOST();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const [password, setPassword] = useState("");
  const [consfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  const changePass = () => {
    if (password.length < 7) {
      return setError("minimum 7 characters");
    }
    if (password !== consfirmPassword) {
      setError("Password mismatch");
      console.log("dont");
    } else {
      handlePOST("http://176.117.76.79:4001/changePassword", { code, password });
      setConfirmPassword("");
      setPassword("");
    }
  };
  return (
    <div className="change-password">
      <input
        type="text"
        value={password}
        placeholder="new password"
        onChange={(e) => setPassword(e.target.value)}
        name=""
        id=""
      />
      <input
        type="text"
        value={consfirmPassword}
        placeholder="confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="change-password__btn" onClick={changePass}>
        submit{" "}
      </div>
    </div>
  );
};

export default ChangePassword;

import { GoogleLogin } from "@react-oauth/google"
import jwt_decode from 'jwt-decode'
const GoogleLoginButton = () => {
    const googleResponse = (credentialResponse) => {
        const credentialResponseDecoded = jwt_decode(credentialResponse.credential)
        console.log(credentialResponseDecoded)
    }
return (
    <GoogleLogin
    onSuccess={googleResponse}
    onError={() => {
      console.log('Login Failed');
    }}
  />
)
}

export default GoogleLoginButton
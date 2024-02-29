import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  return (
    <div className="google-login-button">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const credential = credentialResponse?.credential;
          if (credential) {
            const decoded = jwtDecode(credential); // Aquí ya no especificamos el tipo
            console.log(decoded.name);
            navigate('/chatrooms', { state: { userName: decoded.name } });
          } else {
            console.log('Error al hacer login');
          }
        }}
        onError={() => {
          console.log('Error al hacer login');
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;

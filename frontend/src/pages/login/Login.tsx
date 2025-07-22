import { FormContainer, LoginContainer, Title } from './styles.login';
import GoogleButton from 'react-google-button';
import signInWithGoogle from '../../firebase/signInWithGoogle';
import { useNavigate } from 'react-router-dom';
import { getAdditionalUserInfo } from 'firebase/auth';
import { warmUpServer } from '../../firebase/warmupFirebase';
import { fetchFirebaseUserInformation } from '../../firebase/UserInformation';

const Login = () => {
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <FormContainer>
        <Title>הכנס</Title>
        <GoogleButton
          label='הכנס עם גוגל'
          type="dark"
          onClick={() => signInWithGoogle()
            .then(async (res) => {
              const additionUserInfo = getAdditionalUserInfo(res);
              const userInfo = await fetchFirebaseUserInformation().then(data => data);

              const currentRole = userInfo?.role;
              const desiredDisplayLanguage = userInfo?.desiredDisplayLanguage;

              if (additionUserInfo?.isNewUser || !currentRole || !desiredDisplayLanguage) {
                navigate("/register");
              } else {
                navigate("/guide");
              }
            })
            .then(warmUpServer)
          }
        />
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
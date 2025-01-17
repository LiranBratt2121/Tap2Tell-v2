import { FormContainer, LoginContainer, Title } from './styles.login';
import GoogleButton from 'react-google-button';
import signInWithGoogle from '../../firebase/signInWithGoogle';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <LoginContainer>
      <FormContainer>
        <Title>הכנס</Title>
        <GoogleButton
          label='הכנס עם גוגל'
          type="dark"
          onClick={() => signInWithGoogle().then(() => navigate("/dashboard"))}
        />
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
import { useNavigate } from 'react-router-dom';
import { Button, FormContainer, Header, RadioContainer, RadioImage, RegisterContainer, Title } from './styles.register';
import { imageAssets } from '../../components/showcaseLetter/assetManger';
import { useState } from 'react';
import { updateUserInformation } from '../../firebase/UserInformation';
import { UserRole } from './types.register';

const Register = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('');
    const navigate = useNavigate();

    const handleContinue = async () => {
        if (selectedRole === '') {
            alert('בחר סוג משתמש');
            return;
        }

        const success = await updateUserInformation({ isFirstLogin: true, role: selectedRole });

        if (success) {
            navigate('/guide');
        } else {
            navigate('/login');
            alert('הייתה בעיה בהרשמה, נסה שוב');
        }
    }

    return (
        <RegisterContainer>
            <FormContainer>
                <Title>ברוך הבא</Title>

                <Header>סוג משתמש</Header>
                <RadioContainer>
                    <RadioImage src={imageAssets.Student}
                        onClick={() => setSelectedRole(prevRole => prevRole === 'student' ? '' : 'student')}
                        style={{
                            opacity: selectedRole === '' || selectedRole === 'student' ? 1 : 0.5,
                            transform: selectedRole === 'student' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                    <RadioImage src={imageAssets.Teacher}
                        onClick={() => setSelectedRole(prevRole => prevRole === 'teacher' ? '' : 'teacher')}
                        style={{
                            opacity: selectedRole === '' || selectedRole === 'teacher' ? 1 : 0.5,
                            transform: selectedRole === 'teacher' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                </RadioContainer>

                <Button onClick={handleContinue}>
                    המשך
                </Button>
            </FormContainer>
        </RegisterContainer>
    )
}

export default Register

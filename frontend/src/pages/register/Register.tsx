import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, FormContainer, Header, RadioContainer, RadioImage, RegisterContainer, Title, Text } from './styles.register';
import { imageAssets } from '../../components/showcaseLetter/assetManger';
import { updateFirebaseUserInformation } from '../../firebase/FirebaseUserInformation';
import { UserRole } from './types.register';

const roles: { type: UserRole, label: string, image: string }[] = [
    { type: 'student', label: 'תלמיד', image: imageAssets.Student },
    { type: 'teacher', label: 'מורה', image: imageAssets.Teacher },
];

const Register = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('');
    const navigate = useNavigate();

    const handleRoleClick = (role: UserRole) => {
        setSelectedRole(prevRole => prevRole === role ? '' : role);
    };

    const handleContinue = async () => {
        if (!selectedRole) {
            alert('בחר סוג משתמש');
            return;
        }

        const success = await updateFirebaseUserInformation({ isFirstLogin: true, role: selectedRole });

        if (success) {
            navigate('/guide');
        } else {
            alert('הייתה בעיה בהרשמה, נסה שוב');
            navigate('/login');
        }
    };

    const getStyle = (role: UserRole, isText: boolean=false) => ({
        opacity: !selectedRole || selectedRole === role ? 1 : 0.5,
        transform: selectedRole === role && isText ? 'scale(1.05)' : selectedRole === role ? 'scale(1.1)' : 'scale(1)', // For text, smaller scale.
        transition: 'all 0.3s ease',
    });

    return (
        <RegisterContainer>
            <FormContainer>
                <Title>ברוך הבא</Title>

                <Header>סוג משתמש</Header>

                <RadioContainer>
                    {roles.map(({ type, label, image }) => (
                        <div key={type}>
                            <RadioImage
                                src={image}
                                onClick={() => handleRoleClick(type)}
                                style={getStyle(type)}
                            />
                            <Text style={getStyle(type, true)}>{label}</Text>
                        </div>
                    ))}
                </RadioContainer>

                <Button onClick={handleContinue}>
                    המשך
                </Button>
            </FormContainer>
        </RegisterContainer>
    );
};

export default Register;

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserDisplayLanguage, UserRole } from '../../firebase/interfaces';
import { updateFirebaseUserInformation } from '../../firebase/UserInformation';
import { SelectionGroup } from '../../components/selectionGroup/SelectionGroup';
import { useTranslation } from 'react-i18next';
import setTaps2tellLanguage from '../../i18n/setLanguage';
import { languages, roles } from '../../components/selectionGroup/options';
import { SendButton } from '../../components/buttons/SendButton';
import { Container, FormContainer } from '../../components/container/PageContainer';
import { Title } from '../../components/selectionGroup/styles.selectionGroup';
import AcceptButton from '../../components/buttons/AcceptButton';

const Register = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('');
    const [selectedLang, setSelectedLang] = useState<UserDisplayLanguage>('');
    const { i18n } = useTranslation();

    const navigate = useNavigate();
    const handleContinue = async () => {
        if (!selectedRole) {
            alert('בחר סוג משתמש');
            return;
        }

        if (!selectedLang) {
            alert('בחר שפת תצוגה מועדפת');
            return;
        }

        const success = await updateFirebaseUserInformation({
            isFirstLogin: true,
            role: selectedRole,
            desiredDisplayLanguage: selectedLang
        });

        if (success) {
            setTaps2tellLanguage(i18n);
            navigate('/guide');
        } else {
            alert('הייתה בעיה בהרשמה, נסה שוב');
            navigate('/login');
        }
    };

    return (
        <Container>
            <FormContainer>
                <Title>ברוך הבא</Title>

                <SelectionGroup
                    title="Account type / סוג משתמש"
                    options={roles}
                    selected={selectedRole}
                    onSelect={setSelectedRole}
                />

                <SelectionGroup
                    title="Preffered language / שפת תצוגה מועדפת"
                    options={languages}
                    selected={selectedLang}
                    onSelect={setSelectedLang}
                />

                <AcceptButton size={48} onClick={handleContinue}>המשך</AcceptButton>
            </FormContainer>
        </Container>
    );
};

export default Register;

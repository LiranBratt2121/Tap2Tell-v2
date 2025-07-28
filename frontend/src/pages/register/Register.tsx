import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, FormContainer, RegisterContainer, Title } from './styles.register';
import { imageAssets } from '../../components/showcaseLetter/assetManger';
import { UserDisplayLanguage, UserRole } from '../../firebase/interfaces';
import { updateFirebaseUserInformation } from '../../firebase/UserInformation';
import { SelectionGroup } from './component/SelectionGroup';
import { useTranslation } from 'react-i18next';
import setTaps2tellLanguage from '../../i18n/setLanguage';

const roles: { type: UserRole, label: string, image: string }[] = [
    { type: 'student', label: 'תלמיד', image: imageAssets.Student },
    { type: 'teacher', label: 'מורה', image: imageAssets.Teacher },
];

const languages: { type: UserDisplayLanguage, label: string, image: string }[] = [
    { type: 'he', label: 'עברית', image: imageAssets.Hebrew },
    { type: 'en', label: 'English', image: imageAssets.English },
]

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
        <RegisterContainer>
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

                <Button onClick={handleContinue}>המשך</Button>
            </FormContainer>
        </RegisterContainer>
    );
};

export default Register;

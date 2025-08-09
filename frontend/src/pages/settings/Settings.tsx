import { useState } from 'react'
import { Container, FormContainer } from '../../components/container/PageContainer';
import { Header } from '../../components/text/Text';
import { UserRole, UserDisplayLanguage, FirebaseUserInformation } from '../../firebase/interfaces';
import { languages, roles } from '../../components/selectionGroup/options';
import { SelectionGroup } from '../../components/selectionGroup/SelectionGroup';
import { t } from 'i18next';
import { SendButton } from '../../components/buttons/SendButton';
import { updateFirebaseUserInformation } from '../../firebase/UserInformation';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/buttons/BackButton';
import setTaps2tellLanguage from '../../i18n/setLanguage';
import i18n from '../../i18';

const Settings = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('');
  const [selectedLang, setSelectedLang] = useState<UserDisplayLanguage>('');
  const navigate = useNavigate();

  const handlePress = async () => {
    if (!(selectedRole && selectedLang)) {
      console.error('Please select both a role and a language');

      return;
    }

    const userInfo: FirebaseUserInformation = {
      role: selectedRole,
      isFirstLogin: false,
      desiredDisplayLanguage: selectedLang,
    };

    const success = await updateFirebaseUserInformation(userInfo);

    if (success) {
      console.log('User information updated successfully');
      setTaps2tellLanguage(i18n)
      alert(t("Settings updated successfully"));
    } else {
      console.error('Failed to update user information');
    }

    navigate("/dashboard");
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/dashboard")}>{t("Back")}</BackButton>
      <FormContainer>
        <Header>{t("Settings")}</Header>
        <SelectionGroup
          title={t("Account type")}
          options={roles}
          selected={selectedRole}
          onSelect={setSelectedRole}
        />

        <SelectionGroup
          title={t("Preferred language")}
          options={languages}
          selected={selectedLang}
          onSelect={setSelectedLang}
        />

        <SendButton onClick={handlePress}>{t("Save Settings")}</SendButton>
      </FormContainer>
    </Container>
  )
}

export default Settings

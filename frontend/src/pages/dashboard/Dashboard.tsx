import React, { useEffect } from 'react'
import { Container, DashboardContainer, Header, LettersContainer} from './styles.dashboard'
import { letters } from './utils'
import LetterBox from '../../components/letterBox/LetterBox'
import { AdminDashboardManager } from '../adminDashboard/v2/manager'
import { isAdminMailConnected } from '../../firebase/isAdminMail'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import setTaps2tellLanguage from '../../i18n/setLanguage'
import SettingsButton from './components/SettingsButton';
import { SendButton } from '../../components/buttons/SendButton';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AdminDashboardManager.getInstance().initialize()
  }, []);

  useEffect(() => {
    setTaps2tellLanguage(i18n)
  }, [])

  return (
    <Container>
      <DashboardContainer>
        <SettingsButton onClick={() => navigate("/settings")} />
        <LettersContainer>
          <Header>{t("chooseLetter")}</Header>
          {letters.map((l) => <LetterBox letter={l} key={l} />)}
        </LettersContainer>
      </DashboardContainer>
      {isAdminMailConnected() && <SendButton onClick={() => navigate("/adminDashboard")}>{t("adminDashboard")}</SendButton>}
    </Container>
  );
}

export default Dashboard

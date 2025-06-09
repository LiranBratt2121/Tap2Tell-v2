import React, { useEffect } from 'react'
import { Container, DashboardContainer, Header, LettersContainer } from './styles.dashboard'
import { letters } from './utils'
import LetterBox from '../../components/letterBox/LetterBox'
import { AdminDashboardManager } from '../adminDashboard/manager'
import { isAdminMailConnected } from '../../firebase/isAdminMail'
import { Button } from "../../pages/register/styles.register"
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AdminDashboardManager.getInstance().initialize()
  }, []);

  return (
    <Container>
      <DashboardContainer>
        <LettersContainer>
          <Header>בחרו אות</Header>
          {letters.map((l) => <LetterBox letter={l} key={l} />)}
        </LettersContainer>
      </DashboardContainer>
      {isAdminMailConnected() && <Button onClick={() => navigate("/adminDashboard")}>דאשבורד למנהלים</Button>}
    </Container>
  );
}

export default Dashboard

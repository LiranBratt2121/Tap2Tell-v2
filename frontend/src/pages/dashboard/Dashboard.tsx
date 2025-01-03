import React from 'react'
import { DashboardContainer, Header, LettersContainer } from './styles.dashboard'
import { letters } from './utils'
import LetterBox from '../../components/letterBox/LetterBox'

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <LettersContainer>
        <Header>בחרו אות</Header>
        {letters.map((l) => <LetterBox letter={l} key={l} />)}
      </LettersContainer>
    </DashboardContainer>
  );
}

export default Dashboard

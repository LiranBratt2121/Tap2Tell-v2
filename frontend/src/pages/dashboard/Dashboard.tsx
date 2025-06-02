import React, { useEffect } from 'react'
import { DashboardContainer, Header, LettersContainer } from './styles.dashboard'
import { letters } from './utils'
import LetterBox from '../../components/letterBox/LetterBox'
import { fetchCollection } from '../../firebase/UserInformation'

const Dashboard: React.FC = () => {
  useEffect(() => {
    fetchCollection("letters").then(res => res?.forEach((doc) => {
      const id = doc.id;
      const data = doc.data()
      console.log(`${id} => ${JSON.stringify(data)}`)
    }));
  }, []); 

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

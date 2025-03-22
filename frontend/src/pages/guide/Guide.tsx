import { useNavigate } from 'react-router-dom'
import { GuideContainer, Header, MainContainer } from './styles.guide'
import { videoAssets } from '../../components/showcaseLetter/utils'

const Guide = () => {
    const navigate = useNavigate()
    
    return (
        <MainContainer>
            <Header>איך משחקים</Header>
            <GuideContainer controls playsInline autoPlay={true} onEnded={() => navigate('/dashboard')}>
                <source src={videoAssets.Guide} type="video/mp4"/>
            </GuideContainer>
        </MainContainer>
    )
}

export default Guide

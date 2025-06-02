import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GuideContainer, Header, MainContainer, SkipButton } from './styles.guide'
import { videoAssets } from '../../components/showcaseLetter/assetManger'
import { fetchFirebaseUserInformation, updateFirebaseUserInformation } from '../../firebase/UserInformation'

const Guide = () => {
    const navigate = useNavigate()
    const [showSkip, setShowSkip] = useState(false)

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const userInfo = await fetchFirebaseUserInformation();

                if (userInfo === null) {
                    setShowSkip(false);
                    return;
                }

                // Show skip button if user is NOT new
                if (userInfo.isFirstLogin) {
                    updateFirebaseUserInformation({ isFirstLogin: false, role: userInfo.role });
                    setShowSkip(false);
                } else {
                    setShowSkip(true);
                }
            } catch (error) {
                console.error("Error fetching user information. ERROR LOG: " + error);
                setShowSkip(false);
            }
        };

        checkUserStatus();
    }, []);

    return (
        <MainContainer>
            <Header>איך משחקים</Header>
            <GuideContainer controls playsInline autoPlay={true} onEnded={() => navigate('/dashboard')}>
                <source src={videoAssets.Guide} type="video/mp4" />
            </GuideContainer>

            {showSkip && (
                <SkipButton onClick={() => navigate('/dashboard')}>
                    דלג
                </SkipButton>
            )}
        </MainContainer>
    )
}

export default Guide
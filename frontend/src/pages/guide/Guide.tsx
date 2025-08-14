import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { GuideContainer, Header, MainContainer } from './styles.guide'
import { videoAssets } from '../../components/showcaseLetter/assetManger'
import { fetchFirebaseUserInformation, updateFirebaseUserInformation } from '../../firebase/UserInformation'
import { isIOS, isSafari } from "react-device-detect"
import { useTranslation } from 'react-i18next'
import { FirebaseUserInformation } from '../../firebase/interfaces'

const Guide = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [_, setShowSkip] = useState(false)
    const [guideVideoSrc, setGuideVideoSrc] = useState("");
    const [userInfo, setUserInfo] = useState<FirebaseUserInformation | null>(null);

    useEffect(() => {
        const fetchUserInformation = async () => {
            try {
                const user = await fetchFirebaseUserInformation();
                setUserInfo(user);
            } catch (error) {
                console.error("Error fetching user information:", error);
                setUserInfo(null);
            }
        }

        fetchUserInformation();
    }, []);

    useEffect(() => {
        const setVideoLanguage = async () => {
            if (!userInfo) {
                console.error("User information is not available.");
                return;
            }

            setGuideVideoSrc(
                userInfo.desiredDisplayLanguage === 'en' ? videoAssets.GuideEnglish :
                    userInfo.desiredDisplayLanguage === 'he' ? videoAssets.Guide :
                        videoAssets.GuideEnglish // Default to Hebrew if no language is set
            );
        }

        const checkUserStatus = async () => {
            try {
                if (userInfo === null) {
                    setShowSkip(false);
                    return;
                }

                // Show skip button if user is NOT new
                if (userInfo.isFirstLogin) {
                    updateFirebaseUserInformation({ isFirstLogin: false, role: userInfo.role, desiredDisplayLanguage: userInfo.desiredDisplayLanguage ?? "he" });
                    setShowSkip(false);
                } else {
                    setShowSkip(true);
                }
            } catch (error) {
                console.error("Error fetching user information. ERROR LOG: " + error);
                setShowSkip(false);
            }
        };

        checkUserStatus().then(() => {
            setVideoLanguage();
        });
    }, [userInfo]);

    return (
        <MainContainer>
            <Header>{t("howToPlay")}</Header>
            <GuideContainer key={guideVideoSrc} src={guideVideoSrc} playsInline autoPlay muted={isIOS || isSafari} onEnded={() => navigate('/dashboard')}>
            </GuideContainer>

            {/* {showSkip && (
                <SkipButton onClick={() => navigate('/dashboard')}>
                    {t("skipGuide")}
                </SkipButton>
            )} */}
        </MainContainer>
    )
}

export default Guide
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { letters } from '../dashboard/utils';
import { IoMdReturnLeft } from "react-icons/io";
import { Camera, CameraProps, CameraType } from 'react-camera-pro';
import { Back, Button, CameraContainer, CameraView } from './styles.capture';
import { isBase64 } from './utis';
import uploadToStorage from '../../firebase/uploadToStorage';

const Capture: React.FC = () => {
    const { letter } = useParams();
    const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
    const [errors, setErrors] = useState(false);

    const navigate = useNavigate();

    const cameraRef = useRef<CameraType>(null);

    useEffect(() => {
        const updateAspectRatio = () => {
            const { innerWidth, innerHeight } = window;
            const ratio = innerWidth / innerHeight;

            console.log(`ratio ${ratio}`)
            if (ratio > 1.75) {
                setAspectRatio(2.3);
                return;
            }

            setAspectRatio(ratio > 0.6 ? (16 / 9) : (9 / 16));
        };

        updateAspectRatio();

        window.addEventListener('resize', updateAspectRatio);
        window.addEventListener('orientationchange', updateAspectRatio);

        return () => {
            window.removeEventListener('resize', updateAspectRatio);
            window.removeEventListener('orientationchange', updateAspectRatio);
        };
    }, []);

    useEffect(() => {
        if (!letter || !(letters as string[]).includes(letter)) {
            setErrors(true);
            navigate("/dashboard");
        }
    }, [letter, navigate]);

    if (errors) {
        return null;
    }

    const videoConstraints: Omit<CameraProps, "errorMessages"> = {
        facingMode: 'environment',
        aspectRatio: aspectRatio,
    };

    const handleCapture = async () => {
        const screenshot = cameraRef.current?.takePhoto('base64url') as string;

        if (!isBase64(screenshot)) {
            return;
        }

        const url = await uploadToStorage(screenshot);
        navigate(`/result/${url}`);
    };


    return (
        <CameraContainer>
            <CameraView>
                <Camera
                    ref={cameraRef}
                    aspectRatio={videoConstraints.aspectRatio}
                    facingMode={videoConstraints.facingMode}
                    errorMessages={{}}
                />

                <Back
                    onClick={() => navigate("/dashboard")}
                >
                    <IoMdReturnLeft />
                </Back>

                <Button
                    onClick={handleCapture}
                >

                </Button>
            </CameraView>
        </CameraContainer>
    );
};

export default Capture;

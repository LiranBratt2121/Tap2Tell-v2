import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { letters } from '../dashboard/utils';

const Capture: React.FC = () => {
    const { letter } = useParams();
    const [errors, setErrors] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!letter || !(letters as string[]).includes(letter)) {
            setErrors(true);
            navigate("/dashboard");
        }
    }, [letter, navigate]);

    if (errors) {
        return null;
    } 

    return (
        <>
            <h1>letter: {letter}</h1>
        </>
    );
};

export default Capture;

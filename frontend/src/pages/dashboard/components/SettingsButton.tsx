import React from 'react'
import { CiSettings } from 'react-icons/ci';
import { SettingsButtonStyled } from '../styles.dashboard';

interface SettingsButtonProps {
    onClick: () => void;
}

const SettingsButton = ({ onClick }: SettingsButtonProps) => {
    return (
        <SettingsButtonStyled onClick={onClick}>
            <CiSettings />
        </SettingsButtonStyled>            
    )
}

export default SettingsButton

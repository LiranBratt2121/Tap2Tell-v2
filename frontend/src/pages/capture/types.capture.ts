import { Letters } from "../../components/letterBox/types.letterBox";

type Prediction = {
    letter: Letters;
    confidence: number;
}

export const cameraErrorMessages = {
    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
    switchCamera: 'It is not possible to switch camera to a different one because there is only one video device accessible.',
    canvas: 'Canvas is not supported.'
};

export type { Prediction };
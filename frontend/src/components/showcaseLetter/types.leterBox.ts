import { Letters } from "../letterBox/types.letterBox"

interface ShowcaseProps {
    letter: Letters;
}

type LetterAssetsProps = { [letter: string]: { image: string; audio: string } };
export type { ShowcaseProps, LetterAssetsProps };
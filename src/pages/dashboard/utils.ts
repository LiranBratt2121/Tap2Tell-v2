import { Letters } from "../../components/letterBox/types.letterBox";

export const letters: Letters[] = ['Alef', 'Bet', 'Gimel', 'Dalet', 'He', 'Vav', 'Zayin', 'Het', 'Tet', 'Yod', 'Kaf', 'Lamed', 'Mem', 'Nun', 'Samech', 'Ayin', 'Peh', 'Tsadeh', 'Qof', 'Resh', 'Shin', 'Tav']

const getUrl = (letter: string) => {
    return `src/assets/media/${letter}.png`;
}

const images = letters.map((letter) => getUrl(letter));

export const letters2images = Object.fromEntries(
    letters.map((key, index) => [key, images[index]]),
);

// Import images
import AlefImage from "../../assets/media/Alef.png";
import BetImage from "../../assets/media/Bet.png";
import GimelImage from "../../assets/media/Gimel.png";
import DaletImage from "../../assets/media/Dalet.png";
import HeImage from "../../assets/media/He.png";
import VavImage from "../../assets/media/Vav.png";
import ZayinImage from "../../assets/media/Zayin.png";
import HetImage from "../../assets/media/Het.png";
import TetImage from "../../assets/media/Tet.png";
import YodImage from "../../assets/media/Yod.png";
import KafImage from "../../assets/media/Kaf.png";
import LamedImage from "../../assets/media/Lamed.png";
import MemImage from "../../assets/media/Mem.png";
import NunImage from "../../assets/media/Nun.png";
import SamechImage from "../../assets/media/Samech.png";
import AyinImage from "../../assets/media/Ayin.png";
import PehImage from "../../assets/media/Peh.png";
import TsadehImage from "../../assets/media/Tsadeh.png";
import QofImage from "../../assets/media/Qof.png";
import ReshImage from "../../assets/media/Resh.png";
import ShinImage from "../../assets/media/Shin.png";
import TavImage from "../../assets/media/Tav.png";

// Import audio
import AlefAudio from "../../assets/audio/Alef.mp3";
import BetAudio from "../../assets/audio/Bet.mp3";
import GimelAudio from "../../assets/audio/Gimel.mp3";
import DaletAudio from "../../assets/audio/Dalet.mp3";
import HeAudio from "../../assets/audio/He.mp3";
import VavAudio from "../../assets/audio/Vav.mp3";
import ZayinAudio from "../../assets/audio/Zayin.mp3";
import HetAudio from "../../assets/audio/Het.mp3";
import TetAudio from "../../assets/audio/Tet.mp3";
import YodAudio from "../../assets/audio/Yod.mp3";
import KafAudio from "../../assets/audio/Kaf.mp3";
import LamedAudio from "../../assets/audio/Lamed.mp3";
import MemAudio from "../../assets/audio/Mem.mp3";
import NunAudio from "../../assets/audio/Nun.mp3";
import SamechAudio from "../../assets/audio/Samech.mp3";
import AyinAudio from "../../assets/audio/Ayin.mp3";
import PehAudio from "../../assets/audio/Peh.mp3";
import TsadehAudio from "../../assets/audio/Tsadeh.mp3";
import QofAudio from "../../assets/audio/Qof.mp3";
import ReshAudio from "../../assets/audio/Resh.mp3";
import ShinAudio from "../../assets/audio/Shin.mp3";
import TavAudio from "../../assets/audio/Tav.mp3";

// Additional audio for success and failure
import SuccessAudio from "../../assets/audio/Success.mp3";
import FailureAudio from "../../assets/audio/faliure.mp3";

// Video
import GuideVideo from "../../assets/video/guide.mp4";

// Other
import Counter from "../../assets/audio/Counter.mp3"
import SuccessBells from "../../assets/audio/successBells.mp3"

// Images
import Teacher from "../../assets/media/teacher.png";
import Student from "../../assets/media/student.png";

import Hebrew from "../../assets/media/hebrew.png";
import English from "../../assets/media/english.png";

import { LetterAssetsProps } from "./types.leterBox";


export const letterAssets: LetterAssetsProps = {
    Alef: { image: AlefImage, audio: AlefAudio },
    Bet: { image: BetImage, audio: BetAudio },
    Gimel: { image: GimelImage, audio: GimelAudio },
    Dalet: { image: DaletImage, audio: DaletAudio },
    He: { image: HeImage, audio: HeAudio },
    Vav: { image: VavImage, audio: VavAudio },
    Zayin: { image: ZayinImage, audio: ZayinAudio },
    Het: { image: HetImage, audio: HetAudio },
    Tet: { image: TetImage, audio: TetAudio },
    Yod: { image: YodImage, audio: YodAudio },
    Kaf: { image: KafImage, audio: KafAudio },
    Lamed: { image: LamedImage, audio: LamedAudio },
    Mem: { image: MemImage, audio: MemAudio },
    Nun: { image: NunImage, audio: NunAudio },
    Samech: { image: SamechImage, audio: SamechAudio },
    Ayin: { image: AyinImage, audio: AyinAudio },
    Peh: { image: PehImage, audio: PehAudio },
    Tsadeh: { image: TsadehImage, audio: TsadehAudio },
    Qof: { image: QofImage, audio: QofAudio },
    Resh: { image: ReshImage, audio: ReshAudio },
    Shin: { image: ShinImage, audio: ShinAudio },
    Tav: { image: TavImage, audio: TavAudio },
};

export const additionalAssets = {
    Success: SuccessAudio,
    Failure: FailureAudio,
    Counter: Counter,
    SuccessBells: SuccessBells
};

export const videoAssets = {
    Guide: GuideVideo
};

export const imageAssets = {
    Teacher,
    Student,
    Hebrew,
    English
}
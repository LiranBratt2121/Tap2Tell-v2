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
import CurrentEnglishAudio from "../../assets/audio/currentLetterEnglish.mp3";


// Import English audio for each letter
import AlefEnglishAudio from "../../assets/audio/AlefEnglish.mp3";
import BetEnglishAudio from "../../assets/audio/BetEnglish.mp3";
import GimelEnglishAudio from "../../assets/audio/GimelEnglish.mp3";
import DaletEnglishAudio from "../../assets/audio/DaletEnglish.mp3";
import HeEnglishAudio from "../../assets/audio/HeiEnglish.mp3";
import VavEnglishAudio from "../../assets/audio/VavEnglish.mp3";
import ZayinEnglishAudio from "../../assets/audio/ZineEnglish.mp3";
import HetEnglishAudio from "../../assets/audio/HetEnglish.mp3";
import TetEnglishAudio from "../../assets/audio/TetEnglish.mp3";
import YodEnglishAudio from "../../assets/audio/YudEnglish.mp3";
import KafEnglishAudio from "../../assets/audio/KafEnglish.mp3";
import LamedEnglishAudio from "../../assets/audio/LamedEnglish.mp3";
import MemEnglishAudio from "../../assets/audio/MemEnglish.mp3";
import NunEnglishAudio from "../../assets/audio/NunEnglish.mp3";
import SamechEnglishAudio from "../../assets/audio/SamechEnglish.mp3";
import AyinEnglishAudio from "../../assets/audio/AinEnglish.mp3";
import PehEnglishAudio from "../../assets/audio/PehEnglish.mp3";
import TsadehEnglishAudio from "../../assets/audio/TsadikEnglish.mp3";
import QofEnglishAudio from "../../assets/audio/KufEnglish.mp3";
import ReshEnglishAudio from "../../assets/audio/ReishEnglish.mp3";
import ShinEnglishAudio from "../../assets/audio/ShinEnglish.mp3";
import TavEnglishAudio from "../../assets/audio/TafEnglish.mp3";

// Additional audio for success and failure
import SuccessAudio from "../../assets/audio/Success.mp3";
import FailureAudio from "../../assets/audio/faliure.mp3";

import SuccessEnglish from "../../assets/audio/successEnglish.mp3";
import FailureEnglish from "../../assets/audio/failureEnglish.mp3";

// Video
import GuideVideo from "../../assets/video/guide.mp4";
import GuideVideoEnglish from "../../assets/video/guideEnglish.mp4";

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
    Alef: { image: AlefImage, audio: AlefAudio, audioEnglish: AlefEnglishAudio },
    Bet: { image: BetImage, audio: BetAudio, audioEnglish: BetEnglishAudio },
    Gimel: { image: GimelImage, audio: GimelAudio, audioEnglish: GimelEnglishAudio },
    Dalet: { image: DaletImage, audio: DaletAudio, audioEnglish: DaletEnglishAudio },
    He: { image: HeImage, audio: HeAudio, audioEnglish: HeEnglishAudio },
    Vav: { image: VavImage, audio: VavAudio, audioEnglish: VavEnglishAudio },
    Zayin: { image: ZayinImage, audio: ZayinAudio, audioEnglish: ZayinEnglishAudio },
    Het: { image: HetImage, audio: HetAudio, audioEnglish: HetEnglishAudio },
    Tet: { image: TetImage, audio: TetAudio, audioEnglish: TetEnglishAudio },
    Yod: { image: YodImage, audio: YodAudio, audioEnglish: YodEnglishAudio },
    Kaf: { image: KafImage, audio: KafAudio, audioEnglish: KafEnglishAudio },
    Lamed: { image: LamedImage, audio: LamedAudio, audioEnglish: LamedEnglishAudio },
    Mem: { image: MemImage, audio: MemAudio, audioEnglish: MemEnglishAudio },
    Nun: { image: NunImage, audio: NunAudio, audioEnglish: NunEnglishAudio },
    Samech: { image: SamechImage, audio: SamechAudio, audioEnglish: SamechEnglishAudio },
    Ayin: { image: AyinImage, audio: AyinAudio, audioEnglish: AyinEnglishAudio },
    Peh: { image: PehImage, audio: PehAudio, audioEnglish: PehEnglishAudio },
    Tsadeh: { image: TsadehImage, audio: TsadehAudio, audioEnglish: TsadehEnglishAudio },
    Qof: { image: QofImage, audio: QofAudio, audioEnglish: QofEnglishAudio },
    Resh: { image: ReshImage, audio: ReshAudio, audioEnglish: ReshEnglishAudio },
    Shin: { image: ShinImage, audio: ShinAudio, audioEnglish: ShinEnglishAudio },
    Tav: { image: TavImage, audio: TavAudio, audioEnglish: TavEnglishAudio },
};


export const additionalAssets = {
    Success: SuccessAudio,
    Failure: FailureAudio,
    SuccessEnglish: SuccessEnglish,
    FailureEnglish: FailureEnglish,
    CurrentEnglishAudio: CurrentEnglishAudio,

    Counter: Counter,
    SuccessBells: SuccessBells
};

export const videoAssets = {
    Guide: GuideVideo,
    GuideEnglish: GuideVideoEnglish
};

export const imageAssets = {
    Teacher,
    Student,
    Hebrew,
    English
}
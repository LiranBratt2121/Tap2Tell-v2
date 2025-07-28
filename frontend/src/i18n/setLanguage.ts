import { i18n } from 'i18next';
import { fetchFirebaseUserInformation } from "../firebase/UserInformation";

const setTaps2tellLanguage = async (i18n: i18n) => {
  try {
    const user = await fetchFirebaseUserInformation();
    const lang = user?.desiredDisplayLanguage || "he";
    await i18n.changeLanguage(lang);
  } catch (err) {
    console.error("Error setting language:", err);
    await i18n.changeLanguage("he");
  }
};

export default setTaps2tellLanguage;

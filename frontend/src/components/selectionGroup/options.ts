import { UserDisplayLanguage, UserRole } from "../../firebase/interfaces";
import { imageAssets } from "../showcaseLetter/assetManger";

export const roles: { type: UserRole, label: string, image: string }[] = [
    { type: 'student', label: 'תלמיד', image: imageAssets.Student },
    { type: 'teacher', label: 'מורה', image: imageAssets.Teacher },
];

export const languages: { type: UserDisplayLanguage, label: string, image: string }[] = [
    { type: 'he', label: 'עברית', image: imageAssets.Hebrew },
    { type: 'en', label: 'English', image: imageAssets.English },
]
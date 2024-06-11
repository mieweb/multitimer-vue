import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const cssLib = args[0];
const theme = args[1];

const mainScssPath = path.join(process.cwd(), './styles/Design-System/MIE-Design-System.scss');

const designSystemImport = "@import './node_modules/MIE-Styles/Design-System/design-system';";
const themeScss = {
    default: "@import './node_modules/MIE-Styles/Brand/theme-default/theme-default.scss';",
    pink: "@import './node_modules/MIE-Styles/Brand/theme-pink/theme-pink.scss';",
    green: "@import './node_modules/MIE-Styles/Brand/theme-green/theme-green.scss';"
};
const thirdPartyScss = {
    bootstrap: "@import './node_modules/MIE-Styles/Third-Party/bootstrap/bootstrap.scss';",
    tailwind: "@import './node_modules/MIE-Styles/Third-Party/tailwind/tailwind.scss';",
    default: "@import './node_modules/MIE-Styles/Third-Party/no-third-party.scss';",
};


const mainScssContent = `${thirdPartyScss[cssLib]}\n${designSystemImport}\n${themeScss[theme]}`;

fs.writeFileSync(mainScssPath, mainScssContent);

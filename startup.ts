
export const Starter = async () => {
    if (global.Startup != "OK") {
        if (global.Startup == "PENDING") {
            await new Promise(r => setInterval(() => { if (global.Startup != "PENDING") r(null); else console.log("WAITING...") }, 100))
        }
        else {
            global.Startup = "PENDING";
            await (await import("@/startup.ts")).Run()
            global.Startup = "OK";
        }
    }
}

import SiteConfig from "@/common/SiteConfig";
global.cdn = (url: string) => {
    if (url.startsWith("/files")) {
        return SiteConfig.sitefiles + url.replace(/\/files\//g, "/")
    }
    else {
        return url
    }
}
import path from "path"

import Declarations from "@/backend/ROOT/Declarations";
// import Stats from "@/backend/ROOT/Stats";
import Lang from "@/backend/ROOT/Lang";
import Expirations from "@/backend/ROOT/Expirations";
// import Websocket from "@/backend/ROOT/Websocket";
import OnExit from "@/backend/ROOT/OnExit";
import TimeOffset from "@/backend/ROOT/TimeOffset";
import Mongo from "@/backend/ROOT/Mongo";
// import FinancialGrapher from "@/backend/ROOT/FinancialGrapher";
import S10 from "@/backend/ROOT/Schedule/S10";
import S30 from "@/backend/ROOT/Schedule/S30";
import M1 from "@/backend/ROOT/Schedule/M1";
import M5 from "@/backend/ROOT/Schedule/M5";
import M15 from "@/backend/ROOT/Schedule/M15";
import M30 from "@/backend/ROOT/Schedule/M30";
import H1 from "@/backend/ROOT/Schedule/H1";

import JM1 from "@/backend/ROOT/Schedule/Job/JM1";

import JM5 from "@/backend/ROOT/Schedule/Job/JM5";
import JM15 from "@/backend/ROOT/Schedule/Job/JM15";
import JM30 from "@/backend/ROOT/Schedule/Job/JM30";
import JH1 from "@/backend/ROOT/Schedule/Job/JH1";
import JD1 from "@/backend/ROOT/Schedule/Job/JD1";
import importer from "@/frontend/components/qecomps/importer";


declare global {
    interface String {
        betweenxy(str1: string, str2: string, startindex?: number): string;
    }
}

export const Run = async () => {

    global.DEVMODE = process.env.DEVMODE?.toString()?.trim()?.toLowerCase()?.includes("true") as any;
    global.BUILDMODE = process.env.BUILDMODE?.toString()?.trim()?.toLowerCase() == "true";
    global.nodeenv = process.env.NODE_ENV
    global.devmode = global.DEVMODE || process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test"
    console.log("DEV-MODE:", process.env.DEVMODE)
    console.log("Starting declarations... (1)")
    Declarations();
    console.log("Starting Expirations... (4)")
    Expirations();

    OnExit();

    console.log("Starting Async - TimeOffset... (7)")
    await TimeOffset();
    console.log("Starting Async - Mongo... (8)")
    await Mongo();
    console.log("Starting Lang... (9)")
    await Lang();
    // await FinancialGrapher();
    // await Websocket();

    // new Worker("./crack/upload.js")
    console.log("Starting Data sources...")
    global.declared = true;

    S10();
    S30();
    M1();
    M5();
    M15();
    M30();
    H1();

    JM1();
    JM5();
    JM15();
    JM30();
    JH1();
    JD1();

    global.devmode = process.env.DEVMODE == "true"

    if (global.devmode) {
        let list = getAllFiles("./backend/API", '')
        let m = importer("./backend/ROOT/apier.ts") as typeof import('@/backend/ROOT/apier')
        m.Refresh(list)
    }
    else if (!global.apilistset) {
        let list = getAllFiles("./backend/API", '')
        let m = importer("./backend/ROOT/apier.ts") as typeof import('@/backend/ROOT/apier')
        m.Refresh(list)
        global.apilistset = true;
    }

    // console.log("Starting Email...")
    // Email();




    console.log("declaration finished...✅")

}



function getAllFiles(dirPath, rootPath) {
    let results = [];
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const relativePath = fullPath.replace(rootPath, '');
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getAllFiles(fullPath, rootPath));
        } else {
            results.push(relativePath.replace(/\\/g, '/').slice(7).slice(0, -3).replace("/API/", "/api/"));
        }
    });
    return results;
}

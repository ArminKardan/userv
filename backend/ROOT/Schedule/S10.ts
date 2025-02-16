import path from "path"
import importer from "@/frontend/components/qecomps/importer"

export default async () => {
    setInterval(async () => {
        global.devmode = process.env.DEVMODE == "true"
        if (!API?.["request"]) {
            console.log("starting APIs...")
        }
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

    }, 10000)
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

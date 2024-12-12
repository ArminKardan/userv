import { createContext, useContext } from 'react';
import { ZType } from './Component';
const Context = createContext(null);
export default Context;




export const SSRGlobal = (pgid: any = null, lang = null): ZType => {
    if (!pgid && typeof window == "undefined" && lang) {
        return { user: { path: "" } as any, lang, root: "", styles: {} } as any
    }
    let pageid = pgid || useContext(Context)
    
    if (!global.ssrpool) {
        global.ssrpool = {}
    }
    if (!global.ssrpool[pageid]) {
        global.ssrpool[pageid] = {}
    }
    if (pgid && typeof window == "undefined") {
        setTimeout(() => {
            // console.log("deleting pageid:", pageid)
            delete global.ssrpool[pageid]
        }, 15000)
    }

    return global.ssrpool[pageid]
}

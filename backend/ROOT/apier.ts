
// import fs from 'fs'

// import rolecheck from '@/common/rolecheck'
import importer from '@/frontend/components/qecomps/importer'

const rolecheck = (check: Array<string>, role: Array<string>): boolean => {
    for (let r of role) {
        if (check.includes(r as any)) {
            return true
        }
    }
    return false
}


export const Refresh = async (list: Array<string>) => {

    if (!global.API) global.API = {} as any

    for (let el of list) {
        let path = el.slice(4)

        if (typeof global.fs == "undefined") {
            global.fs = require("fs")
        }
        let code = global.fs.readFileSync("./backend" + el.replace(/\/api\//g,"/API/") + ".ts", "utf8")
        let m = code.indexOf("API:API")
        if (m < 0) {
            m = code.indexOf(`API: API`)
            if (m < 0) {
                m = code.indexOf(`API : API`)
            }
        }
        let l = code.slice(code.indexOf("declare global"), code.indexOf("}", m) + 1)
        let newx = `declare global { interface API { "${el.slice(5)}": (T: T) => R } var API: API }`
        if (l != newx) {
            code = code.replace(l, newx)
            fs.writeFileSync("./backend" + el.replace(/\/api\//g,"/API/")  + ".ts", code, "utf8")
        }

        global.API[path.slice(1)] = async (body) => {
            return await api("http://127.0.0.1:" + process.env.PORT + el, { ...body, passcode: process.env.PASSCODE })
        }
    }
}

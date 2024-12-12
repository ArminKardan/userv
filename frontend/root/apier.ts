
// import fs from 'fs'

export const Refresh = async (list: Array<string>) => {

    if (!global.API) global.API = {} as any

    for (let el of list) {
        let path = el.slice(4)
        global.API[path.slice(1)] = async (body) => {
            //console.log("api url:", el);
            return await api(el, body)
        }
    }
}

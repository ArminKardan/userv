
const fs = require("fs")
import SiteConfig from '../common/SiteConfig'

export default (emailuid, type, id, norepeat = false) => {
    let runner = async () => {
        console.log("Notiiiify:", {
            emailuid, type, id
        })
    }
    runner()
}
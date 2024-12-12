
// const fs = require('fs')

export const RefreshLangs = async (lng) => {

    let dbx = null
    if (global.db) {
        dbx = global.db
    }
    else {
        dbx = global.udb
    }
    let fa = dbx.collection("zlang-" + lng);
    let docs = await fa.find({}).project({ _id: 0 }).toArray()
    global.langs[lng] = {} as any
    for (let doc of docs) {
        global.langs[lng][doc.k] = doc.v
    }
}

export default async () => {
    // let fs = require('fs')
    if (!global.langlist) {
        global.langs = {};
        global.langlist = []

        RefreshLangs("ar")
        global.langlist.push({ code: "ar", name: 'العربية', dir: "rtl" })

        RefreshLangs("de")
        global.langlist.push({ code: "de", name: 'deutsch', dir: "ltr" })

        RefreshLangs("en")
        global.langlist.push({ code: "en", name: 'english', dir: "ltr" })

        RefreshLangs("es")
        global.langlist.push({ code: "es", name: 'español', dir: "ltr" })

        RefreshLangs("fa")
        global.langlist.push({ code: "fa", name: 'فارسی', dir: "rtl" })

        RefreshLangs("fr")
        global.langlist.push({ code: "fr", name: 'français', dir: "ltr" })

        RefreshLangs("id")
        global.langlist.push({ code: "id", name: 'bahasa', dir: "ltr" })

        RefreshLangs("ja")
        global.langlist.push({ code: "ja", name: '日本語', dir: "ltr" })

        RefreshLangs("ko")
        global.langlist.push({ code: "ko", name: '한국어', dir: "ltr" })

        RefreshLangs("pt")
        global.langlist.push({ code: "pt", name: 'português', dir: "ltr" })

        RefreshLangs("ru")
        global.langlist.push({ code: "ru", name: 'русский', dir: "ltr" })

        RefreshLangs("ur")
        global.langlist.push({ code: "ur", name: 'اُردُو', dir: "rtl" })

        RefreshLangs("tr")
        global.langlist.push({ code: "tr", name: 'Türkçe', dir: "ltr" })

        RefreshLangs("zh")
        global.langlist.push({ code: "zh", name: '中國人', dir: "ltr" })

    }
}

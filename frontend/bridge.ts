import crossstyles from "@/styles/crossstyles";
import SerialGenerator from "./components/qecomps/SerialGenerator";
declare global {
    var bridge: {
        send: (data: any) => Promise<any>
    }
    var nexus: {
        subscribe: (channel: string) => Promise<void>,
        unsubscribe: (channel: string) => Promise<void>,
        channels: () => Promise<Array<string>>,
        msgreceiver: (specs: { from: string, body: string, itsme: boolean, itsbro: boolean, channel: string }) => void,
        isconnected: () => Promise<boolean>,
        connected: boolean,
        api: (specs: { app: string, cmd: string, body?: any, jid?: string, prioritize_public?: boolean }) => Promise<any>,
        sendtojid: (jid: string, body: string) => Promise<any>,
        sendtochannel: (channel: string, body: string) => Promise<any>,
    }
    var myjid: string
    function uploader(specs: { title: string, text: string, maxmb?: number, max_age_sec?: number, style?: string }): Promise<{ url: string }>;
    function alerter(title: string | any, text?: string | Element, style?: any, watermark?: string): Promise<void>;
    function success(text: string, fast?: boolean): void
    function error(text: string): void
    function prompter(title: string, text?: string, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
        selectonclick?: boolean,
        type?: "text" | "number" | "url" | "email" | "tel"): Promise<string>
    function confirmer(title: any, text?: string | Element, oktext?: string, canceltext?: string): Promise<boolean>
    function picker(items: Array<{
        key: any, title1?: any, title2?: any, image?: any,
        imageprop?: any, righticon?: any, highlight?: boolean
    }>): Promise<string>;
    function selector(sync: () => Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>,
        on: (key: any) => Promise<void>
    ): Promise<void>;

}
export const init = () => {
    die()
    global.mcb = {}

    global.picker = async (items: Array<{
        key: any, title1?: any, title2?: any, image?: any,
        imageprop?: any, righticon?: any, highlight?: boolean
    }>) => {
        return (await send({ api: "picker", items , crossstyles })).result
    }

    global.error = async (text: string) => {
        return (await send({ api: "error", text, crossstyles })).result
    }

    global.success = async (text: string, fast: boolean = false) => {
        return (await send({ api: "success", text, fast, crossstyles })).result
    }

    global.confirmer = async (title: string, text?: string, oktext?: string, canceltext?: string) => {
        return (await send({ api: "confirmer", title, text, oktext, canceltext, crossstyles })).result
    }
    global.prompter = async (title: string, text?: string, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
        selectonclick?: boolean,
        type?: "text" | "number" | "url" | "email" | "tel") => {
        return (await send({ api: "prompter", title, text, maxlen, small, defaulttext, style, selectonclick, type, crossstyles })).result
    }
    global.alerter = async (title: string | any, text?: string | Element, style?: any, watermark?: string) => {
        return await send({ api: "alerter", title, text, style, watermark , crossstyles})
    }
    global.log = async (obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }) => {
        return await send({ api: "log", ...obj, crossstyles })
    }
    global.closelog = async () => {
        return await send({ api: "closelog" })
    }
    global.uploader = async (specs) => {
        return (await send({ api: "uploader", specs, crossstyles }))?.url || null
    }

    global.nexus = {
        subscribe: async (channel: string) => {
            return await send({ api: "nexus.subscribe", channel })
        },
        unsubscribe: async (channel: string) => {
            return await send({ api: "nexus.unsubscribe", channel })
        },
        channels: async () => {
            return await send({ api: "nexus.channels" })
        },
        msgreceiver: () => { },

        connected: false,

        isconnected: async () => {
            let c = (await send({ api: "nexus.connected" }))
            global.nexus.connected = c
            if (c.connected && !global.nexusfirstconnect) {
                global.myjid = c.myjid
                await global.nexusconnected?.func?.()
            }
            return c
        },
        api: async (specs: { app: string, cmd: string, body?: any, jid?: string, prioritize_public?: boolean }) => {
            return await send({ api: "nexus.api", specs })
        },
        sendtojid: async (jid: string, body: string) => {
            return await send({ api: "nexus.sendtojid", jid, body })
        },
        sendtochannel: async (channel: string, body: string) => {
            return await send({ api: "nexus.sendtochannel", channel, body })
        },
    }

    window.addEventListener('message', async (event) => {
        try {
            let data = QSON.parse(event.data)

            if (data.api == "nexusmsg") {
                nexus.msgreceiver?.({ from: data.from, body: data.body, itsme: data.itsme, itsbro: data.itsbro, channel: data.channel })
            }
            else if (data.api == "nexusconnected") {
                if (!global.nexusfirstconnect) {
                    global.nexusfirstconnect = true
                    global.myjid = data.myjid
                    await global.nexusconnected?.func?.()
                }
                nexus.connected = true
            }
            else if (data.mid) {
                let mid = data.mid
                delete data.mid
                global.mcb[mid]?.(data)
            }
        } catch { }
    })

    setTimeout(async () => {
        if (!global.nexus.connected) {
            await global.nexus.isconnected()
        }
    }, 1000);
}

export const die = () => {
    window["removeAllMessageListeners"]();
}

export const send = (data) => {
    let mid = SerialGenerator(6)
    let rp = new Promise(r => {
        global.mcb[mid] = (resp) => {
            r(resp)
        }
    })
    window.parent.postMessage(QSON.stringify({ ...data, mid }), "*",);
    return rp as any
}


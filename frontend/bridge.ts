import SerialGenerator from "./components/qecomps/SerialGenerator";
declare global {

    var bridge: {
        send: (data: any) => Promise<any>
    }

    var nexus: {
        subscribe: (channel: string) => Promise<void>,
        unsubscribe: (channel: string) => Promise<void>,
        channels: () => Promise<Array<string>>,
        msgreceiver: (from: string, body: string) => void,
        isconnected: () => Promise<boolean>,
        connected: boolean,
        api: (specs: { app: string, cmd: string, body?: any, jid?: string, prioritize_public?: boolean }) => Promise<any>,
        sendtojid: (jid: string, body: string) => Promise<any>,
        sendtochannel: (channel: string, body: string) => Promise<any>,
    }

    function uploader(specs: { title: string, text: string, maxmb?: number, style?: string }): Promise<{ url: string }>;
    function alerter(title: string | any, text?: string | Element, style?: any, watermark?: string): Promise<void>;
}
export const init = () => {
    die()
    global.mcb = {}

    global.uploader = async (specs) => {
        return await send({ api: "uploader", ...specs })
    }
    global.alerter = async (title: string | any, text?: string | Element, style?: any, watermark?: string) => {
        return await send({ api: "alerter", title, text, style, watermark })
    }
    global.nexus = {
        subscribe: async (channel: string) => {
            return await send({ api: "bridge.subscribe", channel })
        },
        unsubscribe: async (channel: string) => {
            return await send({ api: "bridge.unsubscribe", channel })
        },
        channels: async () => {
            return await send({ api: "bridge.channels" })
        },
        msgreceiver: (from: string, body: string) => { },

        connected: false,

        isconnected: async () => {
            let c = (await send({ api: "bridge.connected" })).connected
            global.nexus.connected = c
            if (c && !global.nexusfirstconnect) {
                await global.nexusconnected?.func?.()
            }
            return c
        },
        api: async (specs: { app: string, cmd: string, body?: any, jid?: string, prioritize_public?: boolean }) => {
            return await send({ api: "bridge.api", specs })
        },
        sendtojid: async (jid: string, body: string) => {
            return await send({ api: "bridge.sendtojid", jid, body })
        },
        sendtochannel: async (channel: string, body: string) => {
            return await send({ api: "bridge.sendtochannel" })
        },
    }

    window.addEventListener('message', async (event) => {
        try {
            let data = QSON.parse(event.data)

            if (data.api == "nexusmsg") {
                nexus.msgreceiver?.(data.from, data.body)
            }
            else if (data.api == "nexusconnected") {
                if (!global.nexusfirstconnect) {
                    global.nexusfirstconnect = true
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


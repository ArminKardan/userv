import SerialGenerator from "./components/qecomps/SerialGenerator";

export const init = () => {
    die()
    global.mcb = {}

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

    window.addEventListener('message', (event) => {
        try {
            let data = QSON.parse(event.data)

            if (data.api == "nexusmsg") {
                nexus.msgreceiver?.(data.from, data.body)
            }
            else if (data.api == "nexusconnected") {
                console.log("userv: nexus connected...")
                nexus.connected
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


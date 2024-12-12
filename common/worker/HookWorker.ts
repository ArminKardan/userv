import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";

let debug = false

export type WorkerMake = {
    app: string,
    wid: string,
    fastclose: boolean,
    owneremail: string,
    private: boolean,
    wslinks: Array<string>,
    image: string,
    owneruid: string,
    busy: boolean,
    config: { state: "connected" | "connecting" | "disconnected" | "finished" },
    onmessage: Array<(msg: { [key in string]: any }) => void>,
    onclose: Array<() => void>,
    send: (data: { [key in string]: any }, timeout?: number) => Promise<{ [key in string]: any }>,
    connect: () => void,
    close: () => void
    release: () => void
}

const MakeWorkerObj = (worker) => {

    if (worker.wslinks?.length > 0) {
        let ws = null;
        let cbs = {};
        let onmessage = []
        let onclose = []
        let config = { state: "disconnected" }
        let employerid = SerialGenerator(10)
        worker.wslinks.sort(() => 0.5 - Math.random());

        let wslink = worker.wslinks[0] + `/hook?data=${encodeURIComponent(JSON.stringify(
            {
                app: worker.app,
                wid: worker.wid,
                owneruid: worker.owneruid,
                securekey: worker.securekey,
                employerid,
            }
        ))}`;


        let connect = () => {

            debug ? console.log("connecting (0): ", config.state) : null

            if (config.state == "connected" || config.state == "connecting" || config.state == "finished") {
                return;
            }
            debug ? console.log("reconnecting (0)...") : null
            config.state = "connecting"

            setTimeout(() => {
                debug ? console.log("reconnecting (1) from timeout...") : null
                if (config.state == "connecting" || config.state == "disconnected") {
                    config.state = "disconnected";
                    debug ? console.log("reconnecting (2) from timeout...") : null
                    connect()
                }
            }, 10000);

            if (typeof window == "undefined") {
                let watchdog = 0;
                const WebsocketClient = require("ws")
                ws = new WebsocketClient(wslink, {
                    rejectUnauthorized: false,
                    timeout: 0,
                });

                ws.on('open', function open() {
                    debug ? console.log("WS Connected (0)...") : null
                    config.state = "connected";
                    let c = setInterval(() => {
                        if (watchdog++ > 4) {
                            clearInterval(c);
                            ws?.close?.();
                            onclose.forEach(func => {
                                return func({ reason: "ping timeout", code: 0 })
                            })

                            debug ? console.log("watchdog timeout (0)...") : null
                            clearInterval(c)
                            if (config.state == "connected") {
                                debug ? console.log("watchdog timeout (1)...") : null
                                config.state = "disconnected";
                                debug ? console.log("watchdog timeout (2)...") : null
                                setTimeout(() => connect(), 2000)
                            }
                        }
                        else {
                            ws.send("QE|PING|QE")
                        }
                    }, 5000)
                });
                ws.on('close', (event) => {
                    // debug ? console.log("closed (0)...") : null
                    // if (config.state == "connected") {
                    //     debug ? console.log("closed (1)...") : null
                    //     config.state = "disconnected"; 
                    //     setTimeout(()=> connect(), 5000)
                    // }
                })
                ws.on('error', () => {
                })

                ws.on('message', function message(data) {
                    if (data == "QE|PONG|QE") {
                        watchdog = 0;
                        return;
                    }
                    let message = JSON.parse(data);

                    if (cbs[message.mid]) {
                        cbs[message.mid].cb(message);
                        delete cbs[message.mid]
                    }
                    else {
                        obj.onmessage.forEach((func) => {
                            func(message);
                        })
                    }
                    if (message.disconnect) {
                        config.state = "finished";
                        ws?.close?.();//force close command from worker
                    }
                });

            }
            else {

                ws = new WebSocket(wslink);
                let watchdog = 0;
                ws.onopen = function (e) {
                    debug ? console.log("WS Connected (0)...") : null
                    config.state = "connected";
                    let c = setInterval(() => {
                        if (watchdog++ > 4) {
                            clearInterval(c);
                            ws?.close?.();
                            for (let k of Object.keys(cbs)) {
                                cbs[k].cb({ error: "target closed" })
                            }
                            onclose.forEach(func => {
                                return func({ reason: "ping timeout", code: 0 })
                            })

                            clearInterval(c)
                            if (config.state == "connected") {
                                config.state = "disconnected";
                                ws?.close()
                                setTimeout(() => connect(), 2000)
                            }

                        }
                        else {
                            ws.send("QE|PING|QE")
                        }
                    }, 5000)
                };

                ws.onmessage = function (event) {
                    watchdog = 0;
                    if (event.data.includes("QE")
                        && (event.data.includes("PONG") || event.data.includes("PING"))
                        && event.data.includes("|")
                    ) {
                        return;
                    }

                    let message = JSON.parse(event.data);
                    if (cbs[message.mid]) {
                        cbs[message.mid].cb(message);
                        delete cbs[message.mid]
                    }
                    else {
                        obj.onmessage.forEach((func) => {
                            func(message);
                        })
                    }

                    if (message.disconnect) {
                        config.state = "finished";
                        ws?.close?.();//force close command from worker
                    }
                };

                ws.onclose = function (event) {

                    // for (let k of Object.keys(cbs)) {
                    //     cbs[k].cb({ error: "target closed" })
                    // }

                    // if (config.state == "connected") { config.state = "disconnected"; connect() }

                    // onclose.forEach(func => {
                    //     return func({ reason: event.reason, code: event.code })
                    // })
                    // worker.connected = false;
                    // connect()
                    //     r(false);
                };

                ws.onerror = function (error) { };
            }

        }


        let obj: WorkerMake = {
            ...worker,
            connection: ws,
            onmessage,
            onclose,
            config,
            send: (data: { [key in string]: any }, timeout: number = 60): Promise<{ [key in string]: any }> => {
                if (config.state != "connected") {
                    return { code: -2000, error: "hooker is not connected." } as any
                }
                return new Promise(resolve => {
                    let mid = new global.ObjectId().toString();

                    let msg = JSON.stringify({
                        mid,
                        ...data,
                    })
                    let c = setTimeout(() => {
                        resolve({ error: "timeout" })
                    }, timeout * 1000);

                    cbs[mid] = {
                        mid,
                        cb: (ob) => { clearTimeout(c); resolve(ob); }
                    }
                    try {
                        ws.send(msg)
                    } catch { }
                })
            },
            close: () => { try { ws.close() } catch { }; config.state = "finished" },
            connect,
            release: async () => {
                await API["worker/release"]({ app: obj.app, wid: obj.wid, owneruid: obj.owneruid })
                obj.close()
            }

        }

        return { code: 0, worker: obj }
    }

    return { code: -2, message: "worker registered but not started." };
}


export default async (specs: { app: string, wid?: string, securekey: string, owneruid: string }) => {

    // let json = await API["worker/get"]({ app: specs.app, wid: specs.wid, owneruid: specs.owneruid, })

    let json = await (await fetch("https://qepal.com/api/worker/get", {
        method: "POST",
        body: JSON.stringify({
            app: specs.app, wid: specs.wid, owneruid: specs.owneruid,
        })
    })).json()

    // console.log("Worker find result:", json)

    if (json.code == 0 && json.worker) {
        json.worker = { ...json.worker, securekey: specs.securekey }
        return MakeWorkerObj(json.worker)
    }

}
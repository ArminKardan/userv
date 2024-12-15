import { ObjectId } from "mongodb"
import HookWorker from "./HookWorker"
import { SSRGlobal } from "@/frontend/components/qecomps/Context"


export type WorkerSpecs = {
    app?: string,
    wid?: string, owneruid?: string, code: number, message?: string, wslinks?: string[]
};

export default async (
    specs: {
        app: string,
        wid?: string,
        owneruid?: string | ObjectId,
        securekey?: string,
        z?: any,
        debugmsg?: string
    }
) => {

    let workerspecs = await (await fetch("https://qepal.com/api/worker/findfree", {
        method: "POST",
        body: JSON.stringify({
            app: specs.app,
            wid: specs.wid,
            owneruid: (specs.owneruid || "").toString() as any
        })
    })).json()

    let securekey = specs.securekey
    if (!securekey) {
        if (typeof window != "undefined") {
            securekey = specs.z?.user?.securekey
        }
        else {
            securekey = global.OwnerSecret
        }
    }
    if (workerspecs && workerspecs.code == 0) {
        
        let hook = await HookWorker({
            app: workerspecs.app,
            wid: workerspecs.wid,
            owneruid: workerspecs.owneruid,
            securekey
        })

        // console.log("HOOKER HOOK:", hook);

        if (hook && hook.code == 0) {
            // console.log("Hooked successfully with debug message:", debugmsg);
            await hook.worker.connect()
            let c = 0, counter = 0;
            let result = await new Promise(r => {
                let c = setInterval(() => {
                    if (hook.worker.config.state == "connected") {
                        r(true)
                        clearInterval(c)
                        return
                    }
                    if (counter++ > 30) {
                        r(false)
                        clearInterval(c)
                        return
                    }
                }, 300);
            })
            // console.log("PASSED 1:", result)
            if (!result) {
                return null
            }
            return hook.worker
        }
        return null;
    }
    else// no free worker found.
    {
        return null;
    }

}
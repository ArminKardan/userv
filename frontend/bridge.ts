import SerialGenerator from "./components/qecomps/SerialGenerator";

export const init = ()=>{
    die()
    global.mcb = {}

    global.nexus = {
        subscribe: async (channel:string)=>{
            return await send({api:"bridge.subscribe"})
        },
        unsubscribe: async (channel:string)=>{
            return await send({api:"bridge.unsubscribe"})
        },
        channels:async ()=>{
            return await send({api:"bridge.channels"})
        },
        msgreceiver: (from:string, body:string)=>{
            return null
        },
        connected:async ()=>{
            return await send({api:"bridge.connected"})
        },
        api: async (specs: { app: string, name: string, body: any, jid?: string, prioritize_public: boolean })=> {
            return await send({api:"bridge.api", specs})
        },
        sendtojid: async (jid: string, body: string) => {
            return await send({api:"bridge.sendtojid"})
        },
        sendtochannel: async (channel: string, body: string) => {
            return await send({api:"bridge.sendtochannel"})
        },
    }



    window.addEventListener('message', (event) => {
      try{
        let data = QSON.parse(event.data)
        
        if(data._wid && data.on)
        {
            let _wid =data._wid 
            delete data._wid
            delete data.on
            global.bworker[_wid]?.on?.(data)
        }
        else if(data.mid)
        {
          let mid = data.mid
          delete data.mid
          global.mcb[mid]?.(data)
        }
      } catch{}
    })
}

export const die = ()=>{
    window["removeAllMessageListeners"]();
}

export const send = async (data)=>{
    let mid = SerialGenerator(6)
    let rp = new Promise(r=>{
        global.mcb[mid] = (resp)=>{
            r(resp)
        }
    })
    window.parent.postMessage(QSON.stringify({...data, mid}), "*",);
    return rp as any
}


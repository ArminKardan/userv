import SerialGenerator from "./components/qecomps/SerialGenerator";

export const init = ()=>{
    die()
    global.mcb = {}
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

export  const GetWorkerB = async (specs: {app: string, wid?: string, owneruid?: string})=> {

    let json = await send({api:"getworker", specs})
    if(json.code == 0)
    {
        if(!global.bworker)
        {
            global.bworker = {}
        }
        let _wid = json._wid
        global.bworker[_wid] = {}
        return {
            send:async (data)=>{
                return await send({api:"sendworker", _wid, data})
            },
            on: (cb:(data)=>void)=>{
                global.bworker[_wid].on = cb 
            },
            release: async ()=>{
                await send({api:"releaseworker", _wid})
            }
        }
    }

}
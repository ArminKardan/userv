import WindowFloat from '@/frontend/components/qecomps/WindowFloat'
import { useEffect, useState } from 'react'
import TextAreaEditFloat from '@/frontend/components/qecomps/TextAreaEditFloat'
import ReplacePro from '@/frontend/components/qecomps/ReplacePro'
import LogFloat from '@/frontend/components/qecomps/LogFloat'
import UniqueInterval from '@/frontend/components/qecomps/UniqueInterval'
import { SSRGlobal } from '../components/qecomps/Context'
import Upload from '../components/qecomps/Upload'
import Icon2Titles from '../components/qecomps/Icon2Titles'
import UserAvatar from '../components/qecomps/UserAvatar'
import Signature from '../components/qecomps/Signature'


declare global {
  function alerter(title: string | any, text?: string | Element, style?: any, watermark?: string): Promise<void>;
  function picker(items:Array<{key:any, title1?:any, title2?:any, image?:any, imageprop?:any, righticon?:any, highlight?:boolean}>): Promise<string>;
  function selector(sync:()=> Array<{key:any, title1?:any, title2?:any, image?:any, imageprop?:any, righticon?:any, highlight?:boolean}>,
    on:(key:any)=>Promise<void>
  ): Promise<void>;
  function uploader(title: string, text: string, style?: any): Promise<string>;
  function prompter(title: string, text?: string, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
    selectonclick?: boolean,
    type?: "text" | "number" | "url" | "email" | "tel"): Promise<string>
  function confirmer(title: string, text?: string | Element, oktext?: string, canceltext?: string): Promise<boolean>
}


function Toast(props) {
  let z = SSRGlobal()
  useEffect(() => {
    let to = 3000;
    if (props.fast) {
      to = 700
    }
    setTimeout(() => {
      if (document.getElementById("notifer"))
        document.getElementById("notifer").className = `${z.qestyles.notification} ${z.qestyles.show}`
    }, 200);
    const timeout = setTimeout(() => {
      if (document.getElementById("notifer"))
        document.getElementById("notifer").className = `${z.qestyles.notification} ${z.qestyles.hide}`
      setTimeout(() => {
        props.onfinish?.()
      }, to);
    }, to);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div id="notifer" className={`${z.qestyles.notification} ${z.qestyles.hide}`} style={{ backgroundColor: props.color }}>
      {props.message}
    </div>
  );
}

export default (props) => {
  let z = SSRGlobal()
  let [state, setState] = useState<any>({ show: null, title: null, text: null, oktext: null, canceltext: null })
  let uniquekey = new Date().getTime();
  window["logger"] = {}

  if (!window["loglist"]) {
    window["loglist"] = [];
  }

  if (typeof window != "undefined") {
    UniqueInterval("M1", async () => {
      console.log("sending cache...")
      let c = localStorage.getItem("cache")
      if (c) {
        await API["cache/cache"](JSON.parse(c))
        localStorage.removeItem("cache")
      }
    }, 60000)
  }

  window.closelog = () => {
    setTimeout(() => {
      setState({ show: null, })
    }, 1000);
  }

  window.success = (text: string, fast: boolean = false) => {
    setTimeout(() => {
      setState({ show: "toast", text, color: "#4CAF50", fast })
    }, 300);
  }

  window.error = (text: string) => {
    setState({ show: "toast", text, color: "maroon" })
  }

  window.confirmer = (title: string, text: string | Element, oktext: string, canceltext: string): Promise<boolean> => {
    if (text) {
      setState({ show: "confirm", title, text, oktext, canceltext })
    }
    else {
      setState({ show: "confirm", title: null, text: title })
    }

    return new Promise(r => {
      window["confirmresolve"] = (x) => { r(x) }
    })
  }

  window.alerter = (title: string | any, text: string | Element, style?: any, watermark?: string): Promise<void> => {

    if (text) {
      setState({ show: "alert", title, text, style, watermark })
    }
    else {
      if (typeof title == "string") {
        setState({ show: "alert", title: null, text: title, style, watermark })
      }
      else {
        title = JSON.stringify(title, null, 2)
        setState({ show: "alert", title: null, text: title, style, watermark, json: true })

      }
    }

    return new Promise(r => {
      window["alertresolve"] = (x) => { r(x) }
    })
  }

  window.prompter = (title: string, text: string, maxlen: number = null,
    small: boolean = false, defaulttext: string = "", style?: any, selectonclick: boolean = false,
    type: ("text" | "number" | "url" | "email" | "tel") = "text"): Promise<string> => {
    if (text) {
      setState({ show: "prompt", title, text, maxlen, small, defaulttext, style, selectonclick, type })
    }
    else {
      setState({ show: "prompt", title: null, text: title, maxlen: null, small, defaulttext, selectonclick, type })
    }

    return new Promise(r => {
      window["promptresolve"] = (x) => { r(x) }
    })
  }



  window.picker = (items): Promise<string> => {
      setState({ show: "picker", items})
    return new Promise(r => {
      window["pickerresolve"] = (x) => { r(x) }
    })
  }

  window.selector = (sync, on): Promise<void> => {
    setState({ show: "selector", sync, on})
  return new Promise(r => {
    window["selectorresolve"] = (x) => { r(x) }
  })
}




  window.uploader = (title: string, text: string, style?: any): Promise<string> => {
    if (text) {
      setState({ show: "upload", title, text })
    }

    return new Promise(r => {
      window["uploadresolve"] = (x) => { r(x) }
    })
  }


  window["logonstop"] = (cb: () => void) => {
    window["loggeronstop"] = () => { cb() };
  }

  window.log = (obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }) => {
    if (state.show != "log") {
      window["loglist"].push(obj)
      window["logger"] = {};
      setState({ show: "log" })
      setTimeout(() => {
        for (let it of window["loglist"]) {
          window["logger"]?.add?.(it)
        }
        window["loglist"] = [];
      }, 500);
    }
    else {
      if (window["loglist"].length == 0) {
        window["logger"]?.add?.(obj)
      }
      else {
        window["loglist"]?.push(obj)
      }
    }
  }

  window.login = () => {
    setState({ show: "login" })
  }

  const logchecker = () => {
    setTimeout(() => {
      if (state.show == "log") {
        logchecker();
      }
    }, 1000);
  }


  if (!state.show) {
    return null
  }
  else if (state.show == "login") {
    return <></>
  }
  else if (state.show == "toast") {
    return <Toast message={state.text} color={state.color} fast={state.fast} onfinish={() => { setState({ show: false }) }} />
  }
  else if (state.show == "prompt") {
    let width = state.style?.width;
    delete state.style?.width
    // let zIndex = state.style?.zIndex
    delete state.style?.zIndex
    return <TextAreaEditFloat title={state.title || z.lang.sysmsg} title2={state.text} maxlen={state.maxlen}
      style={{...state.style||{}, direction:z.lang.dir}} width={width} z={99999} selectonclick={state.selectonclick}
      small={state.small} value={state.defaulttext} onclose={() => {
        setState({})
        window["promptresolve"](null)
      }} on={(txt) => { window["promptresolve"](txt); setState({ show: false }) }} />
  }

  else if (state.show == "picker") {
    let width = state.style?.width;
    delete state.style?.width
    // let zIndex = state.style?.zIndex
    delete state.style?.zIndex

    return <WindowFloat title={z.lang.choose} z={99999} style={{ direction:z.lang.dir,}}
    onclose={() => { setState({})
    window["pickerresolve"](null)}}>
      <div style={{ maxHeight:400, overflowX:"scroll"}}>
    {(state.items).map(st => {

      let addr = !st.image.includes("/")?cdn("/files/" + st.image):cdn(st.image)
      let image = <img src={addr} style={{height:28, width:28, objectFit:"contain", borderRadius:5}} />
      if(st.imageprop)
      {
        image = <UserAvatar image={addr} imageprop={st.imageprop} w={30} />
      }
      return <Icon2Titles title1={st.title1} style={{ backgroundColor: st.highlight ? "#61A75A" : "#B6C8B4", marginBottom: 1 }}
        icon={image}
        title2={<Signature style={{marginTop:4}}>{st.title2}</Signature>}
        righticon={st.righticon ? <img src={cdn("/files/" + st.righticon)} style={{ width: 25 }} /> : null}
        on={async () => {
          window["pickerresolve"](st.key); setState({ show:false}) 
        }}
      />
    })}
    </div>
  </WindowFloat> 
  }



  else if (state.show == "selector") {
    let width = state.style?.width;
    delete state.style?.width
    // let zIndex = state.style?.zIndex
    delete state.style?.zIndex
    let items = state.sync()

    return <WindowFloat title={z.lang.choose} z={99999} style={{ direction:z.lang.dir,}}
    onclose={() => { setState({show:false})
    window["selectorresolve"](null)}}>
      <div style={{ maxHeight:400, overflowX:"scroll"}}>
    {(items).map(st => {

      let addr = !st.image.includes("/")?cdn("/files/" + st.image):cdn(st.image)
      let image = <img src={addr} style={{height:28, width:28, objectFit:"contain", borderRadius:5}} />
      if(st.imageprop)
      {
        image = <UserAvatar image={addr} imageprop={st.imageprop} w={30} />
      }
      return <Icon2Titles title1={st.title1} style={{ backgroundColor: st.highlight ? "#61A75A" : "#B6C8B4", marginBottom: 1 }}
        icon={image}
        title2={<Signature style={{marginTop:4}}>{st.title2}</Signature>}
        righticon={st.righticon ? <img src={cdn("/files/" + st.righticon)} style={{ width: 25 }} /> : null}
        on={async () => {
           await state.on(st.key)
           items = state.sync()
           setState({ ...state }) 
        }}
      />
    })}
    </div>
  </WindowFloat> 
  }



  else if (state.show == "upload") {


    return <WindowFloat title={state.title || z.lang.sysmsg} maxWidth={300} onclose={() => {
      setState({})
    }} style={{ direction: z.lang.dir }} z={99999} >
      <f-12>{state.text}</f-12>
      <br-x />

      {state.percent > 0 ? <br-x /> : <f-cc>
        <img src={global.cdn("/files/upload2.svg")} style={{ width: 50, height: 50, cursor: "pointer" }} onClick={() => {
          uploaders["propmpt-upload"].clear(); uploaders["propmpt-upload"].open()
        }} />
      </f-cc>}
      <br-xx />

      <f-cc class={!state.percent ? z.qestyles.none : z.qestyles.op1}>
        <Upload
          id={"propmpt-upload"}
          extensionfilter={[".jpg", ".png", '.jpeg', '.svg', '.webp']}
          maxsize={10 * 1024 * 1024} //1MB!
          singlefile
          // hidefileicons
          onclear={() => setState({ ...state, percent: null, url: null })}
          on={(url) => {

            if (url.length > 0) {
              setState({ ...state, percent: url[0].percent, url: url[0].url })
            }
            else {
              setState({ ...state })
            }
          }}
        // id={"himage"}
        />
      </f-cc>
      {state.percent > 0 ? <br-x /> : null}
      <br-x />
      {
        state.percent == 100 && state.url ? <f-cc class={z.qestyles.btnaccept}
          onClick={() => { let url = state.url; setState({ show: false }); window["uploadresolve"]?.(url);  }}>{z.lang.confirm}</f-cc> :
          <b-100 onClick={() => { uploaders["propmpt-upload"].clear(); uploaders["propmpt-upload"].open() }}
            style={{ backgroundColor: "#ACBF88" }}>
            <sp-2 />
            <f-12>
              {z.lang.upload}
            </f-12>
          </b-100>
      }
      <br-xx />

    </WindowFloat>
  }

  else if (state.show == "log") {
    return <LogFloat function={window["logger"]} onclose={() => { setState({}) }} z={1000} />
  }
  else if (state.show == "confirm") {
    return <WindowFloat title={state.title || z.lang.sysmsg} onclose={() => { window["confirmresolve"](false); setState({ show: false }) }}
      maxWidth={350} z={9999} style={{direction:z.lang.dir}}>

      {typeof state.text == "string" ? <p>{ReplacePro(state.text, "\n", <br key={"alert_" + uniquekey++} />)}</p> : state.text}
      <br-x />
      <f-cc class={z.qestyles.btnaccept} onClick={() => { window["confirmresolve"](true); setState({ show: false }) }}>{state.oktext ? state.oktext : z.lang.imsure}</f-cc>
      <br-xx />
      <f-cc class={z.qestyles.btncancel} onClick={() => { window["confirmresolve"](false); setState({ show: false }) }}>{state.canceltext ? state.canceltext : z.lang.cancel}</f-cc>
    </WindowFloat>
  }
  else if (state.show == "alert") {
    return <WindowFloat title={state.title || z.lang.sysmsg} style={{ direction:z.lang.dir}}
      onclose={() => { window["alertresolve"]?.(); setState({ show: false }) }}
      maxWidth={state.json ? "calc(min(100vw,650px))" : 450} z={10000}>
      {state.json ? <pre style={{ fontSize: 11,  direction:"ltr"}}>
        {state.text}
      </pre> : <div style={{ position: "relative", direction: state.text.startsWith("[") || state.text.startsWith("{") ? "ltr" : "inherit" }}>
        <div style={{ zIndex: 1 }}>
          {typeof state.text == "string" ? <p style={{ ...state.style, zIndex: 452 }}>
            {ReplacePro(state.text, "\n", <br key={"alert_" + uniquekey++} />)}
          </p> : state.text}
          <br-x />
          <br-xx />
          <f-cc class={z.qestyles.btnaccept} onClick={() => { window["alertresolve"]?.(); setState({ show: false }) }}>{z.lang.confirm}</f-cc>
        </div>

        {state.watermark ? <img style={{
          top: "10%", left: 'calc(50% - 35px)', objectFit: "fill",
          position: "absolute", height: "60%", opacity: 0.1
        }} src={state.watermark} /> : null}

      </div>}
    </WindowFloat>
  }

}
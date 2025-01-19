import '../styles/globals.css'
import styles from '../styles/styles.module.css'
import qestyles from '../styles/qe.module.css'
import { useEffect } from "react";
import dynamic from 'next/dynamic';
const Prompt = dynamic(() => import("@/frontend/root/Prompt.tsx").then(x => x.default), { ssr: false })
const QELoader = dynamic(() => import("@/frontend/root/QELoader.tsx").then(x => x.default), { ssr: false })


import QSON from '@/common/QSON'
import Scroller from '@/frontend/root/Scroller'
import Context from "@/frontend/components/qecomps/Context";
import { SSRGlobal } from "@/frontend/components/qecomps/Context";
import { DeclarationsBefore, DeclarationsAfter, LangRestore, APILister } from "@/frontend/root/Declarations";
import Router from 'next/router';
import { init, send } from '@/frontend/bridge';

export default function App({ Component, pageProps }) {

  if (!pageProps.data) {
    if (typeof window != "undefined")
      Router.push('/');
    return null
  }

  if (typeof window != "undefined") {
    QSON();
  }
  let props = {} as any
  try {
    props = global.QSON.parse(pageProps.data)
  } catch { }

  let z = SSRGlobal(props.pageid)

  z.root = "/" + props.langcode;
  z.styles = styles
  z.qestyles = qestyles

  // if ((z["pagepath"] && z["pagepath"] != props.href) || (!global.pageid && !z.lang)) {
  //   z.lang = props.nlangs
  // }

  if (props.nlangs) {
    z.lang = props.nlangs
  }


  if (typeof window != "undefined") {
    Scroller();
    DeclarationsBefore(props, z)
    APILister(props)
    let lng = localStorage.getItem("lang-" + props.langcode);
    if (lng && !z.lang.langfulldone) {
      z.lang = JSON.parse(lng)
      z.lang.langfulldone = true
    }
  }

  let sessionreloader: any = {};

  useEffect(() => {

    Router.events.on("routeChangeStart",async ()=>{
      let subs = Array.from(await global.nexus?.channels() || [])
      for (let channel of subs) {
        await global.nexus?.unsubscribe?.(channel)
      }
      global.nexus.msgreceiver = () => { }
      global.xmpppageloaded = false
    })

    if (!pageProps.data) {
      Router.push('/');
      return
    }

    window.reloadsession = () => {
      global.noloading = true;
      window.winscrollers = {}
      window.onunloader?.()
      sessionreloader?.run?.();
    }
    global.pageProps = props
    DeclarationsAfter(props, z)
    LangRestore(props, z)


    init();
    global.bridge = {
      send: send
    }

  },[])


  props["isPage"] = true

  return (
    <Context.Provider value={props.pageid}>
          <div id="wind" style={{ overflowY: "auto", height: "100vh" }} >
            <Prompt />
            <Component {...props} />
          </div>
        <QELoader />
    </Context.Provider>
  )
}


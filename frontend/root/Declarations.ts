import SiteConfig from '@/common/SiteConfig';
import md5 from 'crypto-js/md5';
import sha256 from 'crypto-js/sha256';
import Router from "next/router";
import { Refresh as apier } from '@/frontend/root/apier'
import { hasCookie, setCookie, getCookie, deleteCookie } from 'cookies-next';
import { send } from '../bridge';
import '@/common/Prototypes'
declare global { var pageProps: any }


export const DeclarationsAfter = (props, z) => {


  window.reload = () => {
    global.noloading = true;
    Router.push(Router.asPath)
    window.reloadsession();
  }

  window.exit = async () => {
    console.log("exit userver...")
    await send({ api: "exitsystem" })
  }

  if (props.pageid) {
    import('@/frontend/root/Progress.ts').then(x => x.Runner(props.pageid))
  }

  if (z.lang) {
    let el = document.getElementById("wind")
    if (el)
      el.style.fontFamily = z.lang.ff
    setTimeout(() => {
      let elx = document.getElementById("wind")
      if (elx)
        elx.style.fontFamily = z.lang.ff
    }, 1000);
  }

  if (!window.parentdiv) {
    window.parentdiv = document.getElementById("wind")
  }
  window.parentdiv.onscroll = (e) => {
    let target: any = e.currentTarget;
    Object.values<any>(window.winscrollers).forEach(f => f?.(target.scrollHeight, target.scrollTop))


    if (!window["gototop"] && target.scrollTop > 1000) {
      window["gototop"] = true;
      if (document?.getElementById && document.getElementById("gototop"))
        document.getElementById("gototop").style.display = "block"
    }
    else if (window["gototop"] && target.scrollTop < 200) {
      window["gototop"] = false;
      if (document?.getElementById && document.getElementById("gototop"))
        document.getElementById("gototop").style.display = "none"
    }
  }

}


export const LangRestore = (props, z) => {
  if (!z.lang.langfulldone) {
    let lng = localStorage.getItem("lang-" + props.langcode);
    if (!lng || (lng && new Date().getTime() - Number(localStorage.getItem("lang-" + props.langcode + "-exp")) > 900000)) {
      (async () => {
        let resp = await (await fetch("/api/lang?lang=" + props.langcode)).json()
        if (Object.keys(resp || {}).length > 1) {
          z.lang = resp;
          localStorage.setItem("lang-" + props.langcode, JSON.stringify(resp))
          localStorage.setItem("lang-" + props.langcode + "-exp", new Date().getTime().toString())
          // setTimeout(() => {
          //   reload()
          // }, 2000);

        }
      })()
    }
    else if (lng && !z.lang.langfulldone) {
      z.lang = JSON.parse(lng)
      z.lang.langfulldone = true
      // setTimeout(() => {
      //   reload()
      // }, 2000);
    }
  }
}

export const DeclarationsBefore = (props, z) => {

  if (window["declared"]) {
    return
  }

  if (!global.pageid)
    global.pageid = props.pageid

  window.cdn = (url: string) => {
    if (url.startsWith("/files")) {
      return SiteConfig.sitefiles + url.replace(/\/files\//g, "/")
    }
    else {
      return url
    }
  }

  window.api = async (url: string, data?: any): Promise<any> => {
    if (data) {
      return await (await fetch(url, { method: "POST", body: JSON.stringify(data) })).json()
    }
    else {
      return await (await fetch(url)).json()
    }
  }
  window.sleep = async ms => await new Promise(r => setTimeout(() => r(null), ms)) as any
  window.pageProps = props;

  window.sss = (arg1, arg2) => arg2 ? console.log(arg1, arg2) : console.log(arg1)

  // console.log("start front-end declaration...")
  String.prototype.betweenxy = function (str1, str2, startindex = 0) {
    const startIndex = this.indexOf(str1, startindex);
    if (startIndex === -1) return '';

    const endIndex = this.indexOf(str2, startIndex + str1.length);
    if (endIndex === -1) return '';

    return this.substring(startIndex + str1.length, endIndex);
  }

  class QeHeaders extends Headers {
    headers = []
    get(key: string) {
      return this.headers.find(h => h.key == key)?.value
    }

    append(key: string, value: string) {
      this.headers.push({ key, value })
    }

    delete(key: string) {
      this.headers = this.headers.filter(h => h.key != key)
    }

    forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
      for (let o of this.headers) {
        callbackfn?.(o.value, o.key, null)
      }
    }

    has(key: string) {
      return !!this.get(key)
    }

    keys(): any {
      return this.headers.map(h => h.key)
    }
    values(): any {
      return this.headers.map(h => h.value)
    }
    set(name: string, value: string): void {
      for (let i in this.headers) {
        if (this.headers[i].key == name) {
          this.headers[i].value = value
          return
        }
      }
      this.append(name, value)
    }
  }

  window.MD5 = (input: string | Buffer): string => {
    return md5(input).toString();
  }

  window.SHA256 = (input: string | Buffer): string => {
    return sha256(input).toString();
  }

  window.Round = (number, digits) => {
    if (digits >= 0) {
      return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
    }

    var factor = Math.pow(10, -digits);
    var rounded = Math.round(number / factor) * factor;

    if (digits == -1) {
      return Math.floor(rounded);
    } else {
      return Math.floor(rounded / 10) * 10;
    }
  }

  window.workers = []

  global.cdn = (url: string) => {
    if (url.startsWith("/files")) {
      return SiteConfig.sitefiles + url.replace(/\/files\//g, "/")
    }
    else {
      return url
    }
  }


  global.api = async (url: string, data?: any): Promise<any> => {
    if (data) {
      return await (await fetch(url, { method: "POST", body: JSON.stringify(data) })).json()
    }
    else {
      return await (await fetch(url)).json()
    }
  }

  window.reload = () => {
    global.noloading = true;
    Router.push(Router.asPath);
  }


  if (typeof window.ObjectId == "undefined") {
    window.ObjectId = class {
      toString() {
        let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        return (
          timestamp +
          'xxxxxxxxxxxxxxxx'
            .replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16))
        );
      }
    }
  }


  (function () {
    var originalAddEventListener = window.addEventListener;
    var originalRemoveEventListener = window.removeEventListener;
    var listeners = [];

    // Override addEventListener to track message event listeners
    window.addEventListener = function (type, listener, options) {
      if (type === 'message') {
        listeners.push({ type: type, listener: listener, options: options });
      }
      return originalAddEventListener.call(window, type, listener, options);
    };

    // Override removeEventListener to keep the list up-to-date
    window.removeEventListener = function (type, listener, options) {
      if (type === 'message') {
        listeners = listeners.filter(l => l.listener !== listener);
      }
      return originalRemoveEventListener.call(window, type, listener, options);
    };

    // Function to remove all message event listeners
    window["removeAllMessageListeners"] = function () {
      for (var l of listeners) {
        originalRemoveEventListener.call(window, l.type, l.listener, l.options);
      }
      listeners = [];
    };
  })();

  window["declared"] = true;
}



export const APILister = (props) => {
  let apistored = localStorage.getItem("apilist")

  setCookie("pageid", props.pageid, { sameSite: "lax", maxAge: 365 * 24 * 3600000, partitioned:true })

  if (props.apilist?.length > 0) {
    // console.log("Refreshing apis from server...")
    setCookie("apilistexpire", new Date(new Date(props.date).getTime() + 24 * 3600).toISOString(), { sameSite: "lax", maxAge: 24 * 3600000 , partitioned:true})
    localStorage.setItem("apilist", JSON.stringify(props.apilist))
    apier(props.apilist)
  }
  else if (apistored) {
    // console.log("Refreshing apis from localstorage...")
    apistored = JSON.parse(apistored)
    if (Object.keys(global.API || {}).length == 0) {
      apier(apistored as any)
    }
  }
  else {
    setTimeout(() => {
      console.log("api-expire-reload")
      deleteCookie("apilistexpire")
      window.location.reload()
    }, 2000);
  }
}
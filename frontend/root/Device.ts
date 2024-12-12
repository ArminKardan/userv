import { SSRGlobal } from "../components/qecomps/Context";

if (!global.DeviceCB) {
  global.DeviceCB = {}
}


global.sendtodevice = (obj, expire, devc = null) => {
  // let device = global.device;
  let device = devc || global.device
  let mid = new global.ObjectId().toString();
  if (obj.data instanceof Buffer) {
    if (device.wsopen) {
      let { api, data, ...params } = obj;

      let o = Buffer.concat([
        Buffer.from(mid), //mid (24 bytes)
        Buffer.from(obj.api.padEnd(48, "*")), //api 48 bytes
        Buffer.from(JSON.stringify(params).padEnd(200, " ")),
        Buffer.from(obj.data)// data bytes
      ])
      device.ws.send(o);
      return new Promise(r => {
        global.DeviceCB[mid] = (ob) => {
          r(ob);
        }
      })
    }
  }
  else {
    if (device.wsopen) {
      // console.log("Sending by ws...")
      device.ws.send(JSON.stringify({ mid, ...obj }))
      return new Promise(r => {
        global.DeviceCB[mid] = (ob) => {
          r(ob);
        }
        if (expire > 0) {
          setTimeout(() => {
            r(null)
          }, expire);
        }
      })
    }
    else {
      if (typeof Android != "undefined") {
        Android?.run?.(JSON.stringify({ mid, ...obj }))
        return new Promise(r => {
          global.DeviceCB[mid] = (ob) => {
            r(ob);
          }
        })
      }
      else //try windows and the others
      {
        let winchrome: any = (window as any).chrome
        winchrome?.webview?.postMessage(JSON.stringify({ mid, ...obj }))
        return new Promise(r => {
          global.DeviceCB[mid] = (ob) => {
            r(ob);
          }
          if (expire > 0) {
            setTimeout(() => {
              r(null)
            }, expire);
          }
        })
      }
    }
  }
}


if (typeof global.device != "object") {
  global.device = { ws: null, software: null, send: global.sendtodevice, wsopen: false, wsport: 0, version: 0, platform: null }
}

export default async () => {

  let z = SSRGlobal()
  let pageProps = global.pageProps

  window.FromAndroid = (ob) => {
    let obj = { ...ob };
    try {
      if (obj?.mid) {
        let keys = Object.keys(obj)
        for (let k of keys) {
          if (k.endsWith("64")) {
            obj[k.split("64").join("")] = Buffer.from(obj[k], 'base64');
            delete obj[k]
          }
        }
        global.DeviceCB[obj?.mid]?.(obj);
      }
    }
    catch (e) { }
  }

  let winchrome: any = (window as any).chrome
  winchrome?.webview?.addEventListener('message', (msg) => {
    try {
      var obj = JSON.parse(msg.data);
      if (obj?.mid) {
        let keys = Object.keys(obj)
        for (let k of keys) {
          if (k.endsWith("64")) {
            obj[k.split("64").join("")] = Buffer.from(obj[k], 'base64');
            delete obj[k]
          }
        }
        global.DeviceCB[obj?.mid]?.(obj);
      }
    }
    catch { }
  })

  if (global.device.software == null) {
    ; (async () => {

      // console.log("from....")
      // let pagepath = JSON.parse(pageProps?.data||"{}")?.session?.path
      // let queryString = null

      // if(pagepath)
      // {
      //   queryString = new URLSearchParams(pagepath);
      // }


      let dev = await global.sendtodevice({
        api: "device",
        uid: z.user.uid,
        cdn: z.user.cdn,
        path: JSON.parse(pageProps.data).session.path,
        // service:queryString?.["servid"]
      }, 500, global.device);


      if (!dev) {
        dev = {
          software: "qesuite",
          platform: "browser",
          version: 0.0,
        }
      }


      global.device = ({ ...dev, send: global.sendtodevice })

      if (dev.wsport > 0) {

        let ws = null;

        let connect = () => {

          // console.log("trying to connect ... (port: "+ dev.wsport+")")
          ws = new WebSocket('ws://127.0.0.1:' + dev.wsport);
          ws.onopen = () => {
            // console.log("connected to qesuite...")
            global.device.wsopen = true;
            global.device.ws = ws;
          };
          ws.onmessage = async function (event) {
            if (typeof event.data == 'object')//
            {
              let bin = Buffer.from(await event.data.arrayBuffer());
              let mid = bin.slice(0, 24).toString('utf8')
              let data = bin.slice(24);
              try {
                global.DeviceCB[mid]?.(data);
              }
              catch { }
            }
            else if (typeof event.data == 'string') {
              let o = JSON.parse(event.data)
              if (o.val54954231) {
                global.DeviceCB[o.mid]?.(o.val54954231);
              }
              else {
                global.DeviceCB[o.mid]?.(o);
              }
            }

          };

          ws.onclose = () => {
            setTimeout(() => {
              global.device.wsopen = false;
              console.log("ws reconnect...")
              connect();
            }, 10000)
          }
        }
        connect();
      }
    })();
  }
}

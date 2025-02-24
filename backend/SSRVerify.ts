
import { ObjectId } from 'mongodb'
import rolecheck from "@/common/rolecheck"
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { getCookie } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Cacher from "./Cacher";
import requestIp from 'request-ip'
import { URL } from 'url'
import SiteConfig from '@/common/SiteConfig';
import { RoleName } from '@/global';
declare global {
  function SSRVerify(context: GetServerSidePropsContext, cached?: boolean): Promise<SSRSession>;
  function Prosper(obj: any, context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ [key: string]: any; }>>;
}
export type SSRSession = {
  uid: string,
  name: string,
  image: string,
  imageprop: {
    zoom: number,
    x: number,
    y: number,
    portion: number,
    refw: number
  },
  lang: string,
  cchar: string,
  unit: string,
  workspace: string,
  servid: ObjectId,
  servsecret: string,
  usedquota: number,
  quota: number,
  quotaunit: string,
  status: "approved" | "rejected" | "waiting",
  regdate: number,
  expid: ObjectId,
  role: string | null,
  rolecheck: (check: Array<RoleName>) => boolean,
  path: string,
  devmod: boolean,
  userip: string,
  pageid: string,
}
export const Prosper = async (obj, context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> => {

  // let sprops = getServerSidePropsX
  let langcode = context.query.lang

  let apilist = []

  let cookies = await import("cookies-next")

  let noapi = true;
  if (
    !global.devmode &&
    cookies.hasCookie("apilistexpire", { req: context.req, res: context.res })) {
    try {
      let apilistexpire = new Date(cookies.getCookie("apilistexpire", { req: context.req, res: context.res })).getTime()
      if (apilistexpire > new Date().getTime()) {
        noapi = false
      }
    } catch { }
  }

  if (noapi) {
    apilist = getAllFiles("./backend/API", '')
  }

  if (!obj.props) {
    obj.props = {} as any
  }

  if (obj.props) {
    obj.props["href"] = context.req.url
    obj.props["langcode"] = langcode
    obj.props["apilist"] = apilist
    obj.props["date"] = new Date().toISOString()
  }
  obj.props = { data: QSON.stringify(obj.props) }
  obj.notFound = obj.notFound
  obj.redirect = obj.redirect
  return obj
}

export default async (context: GetServerSidePropsContext, cached: boolean = false): Promise<SSRSession> => {

  if (!global.langs["fa"]) {
    await new Promise(r => setInterval(() => global.langs["fa"] ? r(null) : null, 200))
  }


  let session = JSON.parse((context?.query?.session as string) || `{}`)
  if (!global.sessioner) {
    global.sessioner = {}
  }

  let sid = ""
  let cookies = await import("cookies-next")
  if (!session?.uid) {
    if (cookies.hasCookie("sid", { req: context.req, res: context.res })) {
      try {
        sid = cookies.getCookie("sid", { req: context.req, res: context.res })
        session = global.sessioner?.[sid]
      } catch { }
    }
  }
  else {
    sid = MD5(context?.query?.session as string || "")
    if (!global.sessioner) {
      global.sessioner = {}
    }
    cookies.setCookie("sid", sid, { req: context.req, res: context.res, sameSite:"none", secure:true })
    global.sessioner[sid] = session
  }



  if (session) {
    session.sid = sid
  }

  // let cookies = await import("cookies-next")
  // if (session?.uid) {
  //   cookies.deleteCookie("session", { req: context.req, res: context.res })
  //   cookies.setCookie("session", JSON.stringify(session), { req: context.req, res: context.res, partitioned: true })
  // }
  // else {
  //   if (cookies.hasCookie("session", { req: context.req, res: context.res })) {
  //     try {
  //       session = cookies.getCookie("session", { req: context.req, res: context.res })
  //       session = JSON.parse(decodeURIComponent(session))
  //     } catch { }
  //   }
  // }

  let userip = (requestIp.getClientIp(context.req)?.replace("::ffff:", "")) || "::"
  var lang = context.resolvedUrl.substr(1, 3)
  lang = lang.replace(/\?/g, "");

  if (lang[2] == "/" || !lang[2]) {
    lang = lang.substr(0, 2);
  }
  else {
    lang = "fa"
  }

  // const session = await Session(context.req, context.res)

  if (session?.uid) {
    session.uid = new ObjectId(session.uid.toString())
  }

  if (session?.servid) {
    session.servid = new ObjectId(session.servid.toString())
  }



  let srv = {} as any
  let user = null;
  let localuser = null
  if (session.servid) {

    if (devmode)
      global._srvs = []

    srv = global._srvs.find(s => s.servid == session.servid && s.servsecret == session.servsecret)

    if (global.devmode || !srv || (new Date().getTime() - srv.created) > 60000) {
      srv = await api("https://qepal.com/api/userv/servid", {
        uid: session.uid ? session.uid.toString() : null,
        usersecrethash: session.usersecrethash,
        servid: session.servid,
      })
      if (srv) {
        global._srvs.push({ ...srv, created: new Date().getTime(), servid: session.servid, servsecret: session.servsecret })
      }
    }


    if (!srv) {
      return { //fully illegal request
        code: -100,
        userip
      } as any
    }

    delete srv?.created
    delete srv?.servsecret

    if (session.uid && session.usersecrethash && srv && srv.code == 0) {
      let u = global.udb.collection("users")
      localuser = await u.findOne({ uid: session.uid })

      if (!localuser) {
        await udb.collection("users").insertOne({
          uid: session.uid,
          lastseen: new Date().toISOString(),
          userip: userip,
          role: [],
          services: [
            {
              servid: srv.servid,
              usersecrethash: session.usersecrethash,
            }
          ]
        })
      }
      else {
        let se = localuser.services.find(ss => ss.usersecrethash == session.usersecrethash)
        if (localuser.lang != session.lang
          || Math.abs(localuser.lastseen - new Date().getTime()) > 120000
          || localuser.userip != session.userip
        ) {
          await udb.collection("users").updateOne({ uid: session.uid }, {
            $set: {
              uid: session.uid,
              lastseen: new Date().toISOString(),
              userip: userip,
            }
          })

          if (!se) {
            await udb.collection("users").updateOne({ uid: session.uid }, {
              $addToSet: {
                services: {
                  servid: srv.servid,
                  usersecrethash: session.usersecrethash,
                }
              }
            })
          }
        }
      }
    }
    if (user && !user.role) {
      user.role = []
    }
  }


  let devmod = ((typeof window != "undefined" ? window.location.hostname : process.env.DOMAIN).split(".").length > 2)

  if (session.servid) {
    session.servid = new ObjectId(session.servid)
  }
  if (session.expid) {
    session.expid = new ObjectId(session.expid)
  }

  let pageid = getCookie("pageid", { req: context.req }) || SerialGenerator(10)

  // delete session.query.session
  // delete session.query.lang

  let path = new URL(SiteConfig.address + context.resolvedUrl).pathname

  VisitorUpdate(session.uid, userip, lang)

  return {
    ...session,
    ...srv,
    localuser,
    role: localuser?.role || null,
    rolecheck: (check) => rolecheck(check, localuser?.role || []),
    nodeenv: global.nodeenv,
    devmode: devmod,
    path,
    lang,
    userip,
    pageid,
  } as SSRSession

}


const VisitorUpdate = (uid: string, userip: string, lang: string) => {
  if (((!userip) && (!uid)) ||
    (typeof userip == "undefined" && !uid)
    || (typeof uid == "undefined" && !userip)) {
    return;
  }

  if (!uid) {

    if (!global.visitors[userip]) {
      global.visitors[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitors[userip].ssr) {
      global.visitors[userip].ssr = 1;
    }
    else {
      global.visitors[userip].ssr++;
    }
    global.visitors[userip].lang = lang
    global.visitors[userip].ip = userip
    global.visitors[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsM1[userip]) {
      global.visitorsM1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsM1[userip].ssr) {
      global.visitorsM1[userip].ssr = 1;
    }
    else {
      global.visitorsM1[userip].ssr++;
    }
    global.visitorsM1[userip].lang = lang
    global.visitorsM1[userip].ip = userip
    global.visitorsM1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsH1[userip]) {
      global.visitorsH1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsH1[userip].ssr) {
      global.visitorsH1[userip].ssr = 1;
    }
    else {
      global.visitorsH1[userip].ssr++;
    }
    global.visitorsH1[userip].lang = lang
    global.visitorsH1[userip].ip = userip
    global.visitorsH1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsD1[userip]) {
      global.visitorsD1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsD1[userip].ssr) {
      global.visitorsD1[userip].ssr = 1;
    }
    else {
      global.visitorsD1[userip].ssr++;
    }
    global.visitorsD1[userip].lang = lang
    global.visitorsD1[userip].ip = userip
    global.visitorsD1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)
    return;
  }


  if (!global.visitors[uid]) {
    global.visitors[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitors[uid].ssr) {
    global.visitors[uid].ssr = 1;
  }
  else {
    global.visitors[uid].ssr++;
  }
  global.visitors[uid].lang = lang
  global.visitors[uid].ip = userip
  global.visitors[uid].uid = uid
  global.visitors[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsM1[uid]) {
    global.visitorsM1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsM1[uid].ssr) {
    global.visitorsM1[uid].ssr = 1;
  }
  else {
    global.visitorsM1[uid].ssr++;
  }
  global.visitorsM1[uid].lang = lang
  global.visitorsM1[uid].ip = userip
  global.visitorsM1[uid].uid = uid
  global.visitorsM1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsH1[uid]) {
    global.visitorsH1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsH1[uid].ssr) {
    global.visitorsH1[uid].ssr = 1;
  }
  else {
    global.visitorsH1[uid].ssr++;
  }
  global.visitorsH1[uid].lang = lang
  global.visitorsH1[uid].ip = userip
  global.visitorsH1[uid].uid = uid
  global.visitorsH1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsD1[uid]) {
    global.visitorsD1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsD1[uid].ssr) {
    global.visitorsD1[uid].ssr = 1;
  }
  else {
    global.visitorsD1[uid].ssr++;
  }
  global.visitorsD1[uid].lang = lang
  global.visitorsD1[uid].ip = userip
  global.visitorsD1[uid].uid = uid
  global.visitorsD1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

}
function getAllFiles(dirPath, rootPath) {

  let path = require("path")
  let results = [];
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = fullPath.replace(rootPath, '');
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllFiles(fullPath, rootPath));
    } else {
      results.push(relativePath.replace(/\\/g, '/').slice(7).slice(0, -3).replace("/API/", "/api/"));
    }
  });
  return results;
}

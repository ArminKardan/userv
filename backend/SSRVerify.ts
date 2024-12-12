// import { getSession } from "next-auth/react"
// import requestIp from 'request-ip'

import { ObjectId } from 'mongodb'
import rolecheck from "@/common/rolecheck"
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { getCookie } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Cacher from "./Cacher";
import requestIp from 'request-ip'
import {URL} from 'url'
import SiteConfig from '@/common/SiteConfig';
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
    obj.props["tmnusd"] = global.tmnusd
    // obj.props["owneruid"] = global.OwnerUID.toString()
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

  let role = (check) => rolecheck(check, session.user.role || [])

  let session = JSON.parse((context?.query?.session as string) || `{}`)


  let cookies = await import("cookies-next")
  if (session?.uid) {
    cookies.deleteCookie("session", { req: context.req, res: context.res })
    cookies.setCookie("session", JSON.stringify(session), { req: context.req, res: context.res })
  }
  else {
    if (cookies.hasCookie("session", { req: context.req, res: context.res })) {
      try {
        session = cookies.getCookie("session", { req: context.req, res: context.res })
        session = JSON.parse(decodeURIComponent(session))
      } catch { }
    }
  }

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
    session.uid = new global.ObjectId(session.uid);
  }


  let srv = {} as any
  let user = { role: [] } as any;

  if (session.servid) {

    srv = await api("https://qepal.com/api/userv/servid", {
      servid: session.servid,
      servsecret: session.servsecret,
    })

    let u = global.udb.collection("users")
    let users = await u.find({}).project({ _id: 0 }).toArray()


    for (let usr of users) {
      if (MD5(usr.usersecret || "") == srv.usersecrethash) {
        user = usr
      }
    }
    if (!user.role) {
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

  let path = new URL(SiteConfig.address+ context.resolvedUrl).pathname

  return {
    ...session,
    ...srv,
    role: user?.role || null,
    nodeenv: global.nodeenv,
    devmode: devmod,
    path,
    lang,
    userip,
    pageid,
  } as SSRSession

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

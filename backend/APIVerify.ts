import { NextApiRequest, NextApiResponse } from "next"
import { ObjectId } from "mongodb"

import requestIp from 'request-ip'
import rolecheck from "@/common/rolecheck"


export default async (req: NextApiRequest, res: NextApiResponse): Promise<APISession> => {

  if (global.Startup != "OK") {
    if (global.Startup == "PENDING") {
      await new Promise(r => setInterval(() => { if (global.Startup != "PENDING") r(null); else console.log("WAITING...") }, 100))
    }
    else {
      global.Startup = "PENDING";
      await (await import("@/startup.ts")).Run()
      global.Startup = "OK";
    }
  }

  const userip = (requestIp.getClientIp(req)?.replace("::ffff:", "")) || "::"
  var post = req.method?.toLowerCase() == "post"

  if (req.body && typeof req.body != "string") {
    req.body = JSON.stringify(req.body)
  }
  if (req.body && !(req.body.startsWith("{") || req.body.startsWith("["))) {
    return ({ userip, body }) as any
  }
  var body = post ? JSON.parse(req.body) : null;

  if (post) {
    if (body?.expid) {
      body.expid = new global.ObjectId(body.expid)
    }
    if (body?.servid) {
      body.servid = new global.ObjectId(body.servid)
    }
    if (body?.chatid) {
      body.chatid = new global.ObjectId(body.chatid)
    }
    if (body?.msgid) {
      body.msgid = new global.ObjectId(body.msgid)
    }
    if (body?.transid) {
      body.transid = new global.ObjectId(body.transid)
    }
    if (body?.uid) {
      body.uid = new global.ObjectId(body.uid)
    }
  }

  if (process.env.PASSCODE && (body?.passcode || body?.PASSCODE) == process.env.PASSCODE) {
    return {
      name: "Service Bot",
      role: ["admin", "bot"],
      userip: "127.0.0.1",
      uid: "635111afff61db2b04928f45",
      body,
      rolecheck: (check) => rolecheck(check, ["admin", "bot"]),
      nodeenv: global.nodeenv,
    } as any
  }



  let session = JSON.parse(`{}`)
  let cookies = await import("cookies-next")

  if (cookies.hasCookie("session", { req, res })) {
    try {
      session = cookies.getCookie("session", { req, res })
      session = JSON.parse(decodeURIComponent(session))
    } catch { }
  }


  let srv = {} as any
  let user = null;

  if (session?.uid) {
    session.uid = new ObjectId(session.uid.toString())
  }

  if (session?.servid) {
    session.servid = new ObjectId(session.servid.toString())
  }

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
        // servsecret: session.servsecret,
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

  if (session.servid) {
    session.servid = new ObjectId(session.servid)
  }
  if (session.expid) {
    session.expid = new ObjectId(session.expid)
  }

  VisitorUpdate(session.uid, userip)

  return {
    ...session,
    ...srv,
    body,
    role: localuser?.role || null,
    rolecheck: (check) => rolecheck(check, localuser?.role || []),
    nodeenv: global.nodeenv,
    userip
  } as APISession
}



const VisitorUpdate = (uid, userip) => {

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
    if (!global.visitors[userip].lang)
      global.visitors[userip].lang = "fa"
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
    if (!global.visitorsM1[userip].lang)
      global.visitorsM1[userip].lang = "fa"
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
    if (!global.visitorsH1[userip].lang)
      global.visitorsH1[userip].lang = "fa"
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
    if (!global.visitorsD1[userip].lang)
      global.visitorsD1[userip].lang = "fa"
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
  if (!global.visitors[uid].lang)
    global.visitors[uid].lang = "fa"
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
  if (!global.visitorsM1[uid].lang)
    global.visitorsM1[uid].lang = "fa"
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
  if (!global.visitorsH1[uid].lang)
    global.visitorsH1[uid].lang = "fa"
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
  if (!global.visitorsD1[uid].lang)
    global.visitorsD1[uid].lang = "fa"
  global.visitorsD1[uid].ip = userip
  global.visitorsD1[uid].uid = uid
  global.visitorsD1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

}
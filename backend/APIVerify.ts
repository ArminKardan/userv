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

  if(typeof req.body != "string")
  {
    console.log("BODYYYYYYY:", req.body)
    console.log("URLLLLLL:", req.url)
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

    console.log(body)
    return {
      name: "Service Bot",
      role: ["admin", "bot"],
      userip: "127.0.0.1",
      uid: "635111afff61db2b04928f45",
      body,
      req: req,
      res: res,
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
  if (session.servid) {
    srv = await api("https://qepal.com/api/userv/servid", {
      servid: session.servid,
      servsecret: session.servsecret,
    })



    let u = global.udb.collection("users")
    let users = await u.find({}).project({ _id: 0 }).toArray()

    for (let usr of users) {
      if (MD5(usr.usersecret) == srv.usersecrethash) {
        user = usr
      }
    }
  }

  if (session.servid) {
    session.servid = new ObjectId(session.servid)
  }
  if (session.expid) {
    session.expid = new ObjectId(session.expid)
  }


  return {

    ...session,
    ...srv,
    body,
    role: user?.role || null,
    rolecheck: (check) => rolecheck(check, user?.role || []),
    nodeenv: global.nodeenv,
    userip
  } as APISession
}


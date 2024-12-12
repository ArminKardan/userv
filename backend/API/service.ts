type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "service": (T: T) => R } var API: API }
export default async function F(T: any, C: CTX,) {


  let s = db.collection("services").find({ ...(T||{}) }).project({
    uid: 1,
    cat:1,
    workspace:1,
    _id: 0,
    servid: 1,
    quota: 1,
    timequota: 1,
    glexptime: 1,
    status: 1,
    secret: 1
  }).toArray()


  return ({ code: 0, cdn: process.env.CDN, pong: true })
}

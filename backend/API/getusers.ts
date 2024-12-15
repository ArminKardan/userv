type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "getusers": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {

  type Users = {code:number, users:Array<{uid:string, name:string, image:string, imageprop:any, cchar:string}>}
  if (!C.rolecheck(["admin"])) {
    return { code: -1 } as Users
  }
  let uids = await udb.collection("users").find(T || {}).project({ _id: 0, uid: 1 }).toArray()
  let resp:Users = (await api("http://192.168.1.10:3000/api/userv/getusers", { uids: uids.map(u => u.uid.toString()) }))
  return resp as Users
}

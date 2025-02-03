import { RoleName } from "@/global";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "getusers": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {

  type Users = {code:number, users:Array<{uid:string, name:string, image:string, imageprop:any, cchar:string, signature:string,
    userip:string, lastseen:string,role:Array<RoleName>
  }>}

  // if (!C.rolecheck(["admin"])) {
  //   return { code: -1 } as Users
  // }

  let users = await udb.collection("users").find(T || {}).project({ _id: 0, uid: 1, lastseen:1, role:1, userip:1 }).toArray()

  let resp:Users = (await api("https://qepal.com/api/userv/getusers", { uids: users.map(u => u.uid.toString()) }))

  if(resp.code == 0)
  {
    for(let usr of resp.users)
    {
      let us = users.find(uu=> uu.uid.toString() == usr.uid)
      if(us)
      {
        for(let k of Object.keys(us))
        {
          usr[k] = us[k]
        }
      }
    }
  }
  return resp as Users
}

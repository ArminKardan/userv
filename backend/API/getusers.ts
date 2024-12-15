type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "getusers": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {
  if (!C.rolecheck(["admin"])) {
    return { code: -1 }
  }
  let uids = await udb.collection("users").find(T || {}).project({ _id: 0, uid: 1 }).toArray()
  return await api("http://192.168.1.10:3000/api/userv/getusers", { uids: uids.map(u => u.uid.toString()) })
}

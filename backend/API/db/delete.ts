type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "db/delete": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {
  
  if(C.status == "approved")
  {
    let c = udb.collection("test")
    let res = await c.deleteMany(T)
    return res
  }
  
  return {code: -10, msg:"you're not admin!"}

}

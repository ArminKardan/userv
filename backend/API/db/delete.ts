type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "db/delete": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {
  
  let c = udb.collection("test")
  let res = await c.deleteMany(T)
  return res
}

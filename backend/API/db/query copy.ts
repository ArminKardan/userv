type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "db/query": (T: T) => R } var API: API }
export default async function F(T: any, C: APISession,) {
  
  let c = udb.collection("test")
  let res = await c.find(T).toArray()
  return res
}

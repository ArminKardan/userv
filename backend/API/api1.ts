type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "api1": (T: T) => R } var API: API }
export default async function F(T: {reza:string}, C: APISession,) {

  console.log("helllloooooooooooooooooooo:", T.reza)
  return "yeeeeeeeeeeeeeeessssssss"
}

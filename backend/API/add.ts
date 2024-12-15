type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "add": (T: T) => R } var API: API }
export default async function F(T: {a:number, b:number}, C: APISession,) {
  return T.a + T.b
}

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "testing": (T: T) => R } var API: API }


export default async function F(T: {text: string}, C: APISession,) {
  console.log(T.text)
  return {status: 1000}
}

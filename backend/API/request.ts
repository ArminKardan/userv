type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "request": (T: T) => R } var API: API }


export default async function F(T: {url:string, headers:{[key in string]:string}, country:"DE"}, C: APISession,) {

    let data = await (await fetch("https://irmapserver.ir/api.php", {
        method: "POST",
        body: JSON.stringify({
            url:T.url,
            headers:T.headers
        })
    })).json()

  return data as {body:string, headers:{[key in string]:string}}
}

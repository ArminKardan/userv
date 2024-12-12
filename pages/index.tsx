
export default ()=> {
  return null
}

export async function getServerSideProps(context)
{
  if (global.Startup != "OK") {
    if (global.Startup == "PENDING") {
      await new Promise(r => setInterval(() => { if (global.Startup != "PENDING") r(null) }, 100))
    }
    else {
      global.Startup = "PENDING";
      await (await import("../startup.ts")).Run()
      global.Startup = "OK";
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/fa",
    },
    props:{}
  }
}

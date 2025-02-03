
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {


  onConnected(async () => {
    console.log("userv [workertest]: nexus connected myjid:", global.myjid)
  })

  return <Window title="my page" style={{ paddingBottom: 10 }}>


    <w-c style={{ gap: 3 , padding:3}}>
      <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        let json = await bridge.send({ api: "ping" })
        console.log("from parent:", json)
      }}>send ping with bridge</b-200>

      
      <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        let json = await nexus.api({ app: "mailers8", cmd: "ping" })
        console.log("nexus parent:", json)
      }}>send ping to mailer</b-200>
      <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        nexus.msgreceiver = (specs) => {
          console.log(specs)
        }
      }}>connect msgreceiver</b-200>

      <b-200  style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        nexus.subscribe("mychannel")
      }}>subscribe to my channel</b-200>

      <b-200  style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        await nexus.sendtochannel("mychannel", "something")
      }}>send something to my channel</b-200>

      <b-200  style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
        nexus.unsubscribe("mychannel")
      }}>unsubscribe from my channel</b-200>

    </w-c>




    <b-200 onClick={async () => {
      let url = await uploader({ title: "آپلود فایل", text: "فایل مورد نظر رو آپلود کنید", maxmb: 1, })
      console.log(url)
    }}>upload something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      await alerter("hiiiii")
      await alerter("bye")
    }}>alert something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      let r = await prompter("hiiiii", "yeeeeeeee")
      await alerter(r)
    }}>prompt something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      let r = await picker([
        { title1: "Item1", key: 1, image: cdn("/files/ok.svg") },
        { title1: "Item2", key: 2, image: cdn("/files/ok.svg") },
        { title1: "Item3", key: 3, image: cdn("/files/ok.svg") },
        { title1: "Item4", key: 4, image: cdn("/files/ok.svg") },
      ])
      await alerter(r)
    }}>pick something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      await selector(() => [
        { title1: "Item1", key: 1, highlight: (props.keys || []).includes(1), image: cdn("/files/fire.webp") },
        { title1: "Item2", key: 2, highlight: (props.keys || []).includes(2), image: cdn("/files/fire.webp") },
        { title1: "Item3", key: 3, highlight: (props.keys || []).includes(3), image: cdn("/files/fire.webp") },
        { title1: "Item4", key: 4, highlight: (props.keys || []).includes(4), image: cdn("/files/fire.webp") },
      ], async (key) => {
        if (!props.keys) {
          props.keys = []
        }
        props.keys.toggle(key)
        refresh()
      })

    }}>selector something</b-200>

    <b-200 onClick={async () => {
      await alerter("MD5 HASH: " + MD5("hiiii"))
      await alerter("SHA256 HASH: " + SHA256("hiiii"))
    }}>Hash Test</b-200>


    <b-200 onClick={async () => {
      Router.push("/")
    }}>goto index</b-200>

  </Window>
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  (global.Startup != "OK") ? (await (await import('@/startup.ts')).Starter()) : null

  var session = await global.SSRVerify(context)
  var { uid, name, image, imageprop, lang, cchar,
    unit, workspace, servid, servsecret,
    usedquota, quota, quotaunit, status, regdate, expid,
    role, path, devmod, userip, pageid } = session;


  let keys = ["region", "dir", "ff", "ffb", "support", "code", "textw", "txtmt"]
  let nlangs = {}
  for (let l of Object.keys(global.langs[lang])) {
    if (keys.includes(l))
      nlangs[l] = global.langs[lang][l]
  }

  let obj = await Prosper({
    props: {
      value: { v: "hiiii" },
      query: context.query,
      nlangs,
      path,
      session,
      title: "test title",
      description: "test description",
      pageid,
    },
  }, context)


  return obj

}



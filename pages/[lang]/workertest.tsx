
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {


  onConnected(async () => {
    console.log("userv [workertest]: nexus connected...")
  })

  return <Window title="my page" style={{ paddingBottom: 10 }}>

    <b-200 onClick={async () => {
      let json = await bridge.send({ api: "ping" })
      console.log("from parent:", json)
    }}>send ping with bridge</b-200>


    <b-200 onClick={async () => {
      let json = await nexus.api({ app: "mailer", cmd: "ping" })
      console.log("nexus parent:", json)
    }}>send ping to mailer</b-200>


    <b-200 onClick={async () => {
      nexus.msgreceiver = (from, body) => {
        console.log("im userv received:", from, body)
      }
    }}>connect msgreceiver</b-200>


    <b-200 onClick={async () => {
      nexus.subscribe("mychannel")
    }}>subscribe to my channel</b-200>

    <br-x />
    <b-200 onClick={async () => {
      let json = await bridge.send({ api: "upload", title: "عنوان آپلود", text: "آپلود کنیدددد", })
      console.log(json)
    }}>upload something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      await alerter("hiiiii")
      await alerter("bye")
    }}>alert something</b-200>

    <br-x />
    <b-200 onClick={async () => {
      await alerter("hiiiii")
      await alerter("bye")
    }}>alert something</b-200>

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



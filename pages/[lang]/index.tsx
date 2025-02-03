
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {


  return <Window title="examples" style={{ paddingBottom: 10 }}>

    {/* <pre>{JSON.stringify(z.user, null, 2)}</pre> */}

    <w-cc style={{gap:5, padding:5}}>
      <b-200 onClick={async () => { Router.push(z.root + "/examples/counter") }}>شمارنده</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/calculator") }}>Calculator</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/ex1") }}>Goto ex1</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/ex2") }}>Goto ex2</b-200>
      <b-200 onClick={async () => { alerter(await API["getusers"]({})) }}>Users</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/admin") }}>Admin</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/admin/users") }}>admin/users</b-200>
      <b-200 onClick={async () => { Router.push(z.root + "/workertest") }}>workertest</b-200>
    </w-cc>


    {/* <pre>{JSON.stringify(props,null,2)}</pre> */}

    {/* <pre>{JSON.stringify(z.user,null, 2)}</pre> */}
    {/* <br-x />
    <b-200 onClick={async () => { await alerter("hi!") }}>Alerter</b-200>
    <br-xxx />
    <b-200 onClick={async () => { Copy(z.user.uid); success("کپی شد") }}>Copy UID</b-200>
    <br-xxx />
    <b-200 onClick={async () => { Router.push(z.root+"/admin")}}>Admin Page</b-200>
    <br-xxx />
    <b-200 onClick={async () => { Router.push(z.root+"/calculator") }}>Calculator</b-200>
    <pre style={{ fontSize: 12 }}>{JSON.stringify(z.user, null, 2)}</pre> */}
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



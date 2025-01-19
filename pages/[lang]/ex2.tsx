
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {

  getProps(async () => {
    props.text = "hello"
    props.target = ""
  })


  return <Window title="my page" style={{ height: "900px" }}>
      <f-cc>
        <f-15 style={{color: props.color}}>{props.target}</f-15>
      </f-cc>
      <b-200 onClick={()=>{
        props.target += props.text[0]
        props.text = props.text.slice(1)
        refresh()
      }}>OK</b-200>

      <b-200 onClick={async ()=>{
       let resp = await API["ip"](null);
        alerter(resp)
     
       //  let resp = await API["api1"]({reza:"im rezaaaaaaa"});
       
      }}>RUN ON BACKEND</b-200>





<b-200 onClick={async ()=>{
       let resp = await API["insertuser"](null);
      
       alerter(resp)
      }}>INSERT TO USERS</b-200>


<b-200 onClick={async ()=>{
       let resp = await API["readusers"](null);
      
       alerter(resp)
      }}>READ USERS</b-200>





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



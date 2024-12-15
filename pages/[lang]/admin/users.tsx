
// import Bold from '@/frontend/components/qecomps/Bold';

import Bold from '@/frontend/components/qecomps/Bold';
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Router from 'next/router';



export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, dies, z) => {

  return <Window title='لیست کاربران'>
    {props.users.map(u=>{
      return <Icon2Titles title1={u.name} title2={<f-11>{u.uid}</f-11>} image={u.image}/>
    })}
  </Window>
}



import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import UserAvatar from '@/frontend/components/qecomps/UserAvatar';
import Window from '@/frontend/components/qecomps/Window';
import Icon2Titles from '@/frontend/components/qecomps/Icon2Titles';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  (global.Startup != "OK") ? (await (await import('@/startup.ts')).Starter()) : null

  var session = await global.SSRVerify(context)
  var { uid, name, image, imageprop, lang, cchar,
    unit, workspace, servid, servsecret, rolecheck,
    usedquota, quota, quotaunit, status, regdate, expid,
    role, path, devmod, userip, pageid } = session;

  let keys = ["region", "dir", "ff", "ffb", "support", "code", "textw", "txtmt"]
  let nlangs = {}
  for (let l of Object.keys(global.langs[lang])) {
    if (keys.includes(l))
      nlangs[l] = global.langs[lang][l]
  }

  // if (!rolecheck(["admin"])) {
  //   return await Prosper({
  //     redirect: {
  //       permanent: false,
  //       destination: "/fa",
  //     },
  //   }, context)
  // }

  let users = (await API["getusers"]({}))
  if (users.code == 0) {
    users = users.users as any
  }
  let obj = await Prosper({
    props: {
      value: { v: "hiiii", role },
      query: context.query,
      nlangs,
      session,
      users,
      pageid,
    },
  }, context)


  return obj

}



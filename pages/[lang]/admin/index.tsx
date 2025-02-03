
// import Bold from '@/frontend/components/qecomps/Bold';

import Bold from '@/frontend/components/qecomps/Bold';
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Router from 'next/router';



export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {
  return <>
    <br-x />
    <f-c>
      <sp-2 />
      <UserAvatar image={z.user.image} imageprop={z.user.imageprop} width={30} />
      <sp-2 />
      <f-13>Welcome <Bold>{z.user.name}</Bold></f-13>
    </f-c>
    <br-x />

    <b-200 class="bg-purple-300" onClick={async () => { Router.push(z.root) }}><f-12>Back to index page</f-12></b-200>
    <pre>ADMIN INDEX PAGE</pre>
    <pre>{JSON.stringify(z.user, null, 2)}</pre>
  </>
}



import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import UserAvatar from '@/frontend/components/qecomps/UserAvatar';

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


  if (!rolecheck(["admin"])) {
    return await Prosper({
      redirect: {
        permanent: false,
        destination: "/",
      },
    }, context)
  }

  let obj = await Prosper({
    props: {
      value: { v: "hiiii", role },
      query: context.query,
      nlangs,
      session,
      pageid,
    },
  }, context)


  return obj

}



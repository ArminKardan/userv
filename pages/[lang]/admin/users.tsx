import Bold from '@/frontend/components/qecomps/Bold';
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Router from 'next/router';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import UserAvatar from '@/frontend/components/qecomps/UserAvatar';
import Window from '@/frontend/components/qecomps/Window';
import rolecheck from '@/common/rolecheck';
import Icon3Titles from '@/frontend/components/qecomps/Icon3Titles';
import FaDigits from '@/frontend/components/qecomps/FaDigits';


export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, dies, z) => {

  return <Window title='لیست کاربران'>
    {props.users.map(u => {
      return <Icon3Titles title1={u.name} title2={<f-12 style={{marginTop:5}}>{FaDigits(u.userip)}</f-12>}  title3={new Date(u.lastseen).toLocaleString(z.lang.region)} 
      image={<UserAvatar image={u.image} imageprop={u.imageprop} w={50}/>}
      style={{ backgroundColor: rolecheck(["admin"], u.role) ? "#74A572" : "#89BF9D" }} />
    })}
    <pre>{JSON.stringify(props.users, null, 2)}</pre>
  </Window>
}

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



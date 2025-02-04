
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'
import Copy from '@/frontend/components/qecomps/Copy';
import FaDigits from '@/frontend/components/qecomps/FaDigits';

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {


  return <div style={{ direction: z.lang.dir }}>

    <Window title="Dialog Examples" style={{ paddingBottom: 10 }}>
      <w-cc style={{ gap: 5, padding: 5 }}>
        <b-200 onClick={async () => {
          await alerter("Hello world")
          await alerter(JSON.stringify({ key1: "value1", key2: "value2" }, null, 2))
          await alerter({ key1: "value1", key2: "value2" })
        }}>Alerter</b-200>

        <b-200 onClick={async () => {
          let v = await prompter("علایق", "لطفا علایق خود  را بنویسید؟")
          await alerter(v)
        }}>Prompter</b-200>

        <b-200 onClick={async () => {
          let v = await prompter("علایق", "لطفا علایق خود  را بنویسید؟", 10000, true, "متن پیشفرض")
          await alerter(v)
        }}>Prompter-options</b-200>

        <b-200 onClick={async () => {
          let url = await uploader({ title: "آپلود فایل", text: "فایل مورد نظر رو آپلود کنید", maxmb: 1, })
          console.log(url)
        }}>Upload</b-200>

        <b-200 onClick={async () => {
          let r = await picker([
            { title1: "Item1", key: 1, image: cdn("/files/ok.svg") },
            { title1: "Item2", key: 2, image: cdn("/files/ok.svg") },
            { title1: "Item3", key: 3, image: cdn("/files/ok.svg") },
            { title1: "Item4", key: 4, image: cdn("/files/ok.svg") },
          ])
          await alerter(r)
        }}>Picker</b-200>

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

        }}>Selector</b-200>

        <b-200 onClick={async () => { Copy("متتی که میخواهیم کپی شود") }}>کپی متن</b-200>

        <b-200 onClick={async () => { success("عملیات موفقیت آمیز بود") }}>توست موفق</b-200>
        <b-200 onClick={async () => { error("عملیات با خطا مواجه شد") }}>توست خطا</b-200>


        <b-200 onClick={async () => {
          await alerter(MD5("hiiii").length)
        }}>MD5</b-200>

        <b-200 onClick={async () => {
          await alerter(SHA256("hiiii").length)
        }}>SHA256</b-200>



      </w-cc>
    </Window>

    <Window title="مثال مقدماتی" style={{ paddingBottom: 10 }}>

      {/* <pre>{JSON.stringify(z.user, null, 2)}</pre> */}

      <w-cc style={{ gap: 5, padding: 5 }}>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/counter") }}>شمارنده</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/user") }}>مشخصات کاربر</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/calculator") }}>ماشین حساب</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/ex1") }}>تغییر رنگ</b-200>
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


    <Window title="API Intro Examples" style={{ paddingBottom: 10 }}>
      <w-cc style={{ gap: 5, padding: 5 }}>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/api/print") }}>Hello World</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/api/addnumbers") }}>جمع دو عدد</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/api/getuserip") }}>آی پی کاربر</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/api/ping") }}>پینگ</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/api/userlist") }}>لیست کاربران</b-200>
      </w-cc>
    </Window>

    <Window title="API Database Examples" style={{ paddingBottom: 10 }}>
      <w-cc style={{ gap: 5, padding: 5 }}>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/db/insert") }}>اضافه کردن داکیومنت</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/db/delete") }}>حذف داکیومنت</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/db/query") }}>اجرای کوئری</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/examples/db/update") }}>تغییر داکیومنت</b-200>
      </w-cc>
    </Window>


    <Window title="Admin Examples" style={{ paddingBottom: 10 }}>
      <w-cc style={{ gap: 5, padding: 5 }}>
        <b-200 onClick={async () => { Router.push(z.root + "/admin") }}>صفحه ادمین</b-200>
        <b-200 onClick={async () => { Router.push(z.root + "/admin/users") }}>لیست کاربران</b-200>
      </w-cc>
    </Window>

    <Window title="Worker Examples" style={{ paddingBottom: 10 }}>
      <w-cc style={{ gap: 5, padding: 5 }}>



        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          let json = await bridge.send({ api: "ping" })
          console.log("from parent:", json)
        }}>send ping with bridge</b-200>

        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          let json = await nexus.api({ app: "myapp", cmd: "ping" })
          console.log("nexus parent:", json)
        }}>send ping to myapp</b-200>

        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          nexus.msgreceiver = (specs) => {
            console.log(specs)
          }
        }}>connect msgreceiver</b-200>

        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          nexus.subscribe("mychannel")
        }}>subscribe to mychannel</b-200>

        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          await nexus.sendtochannel("mychannel", "something")
        }}>send something to mychannel</b-200>

        <b-200 style={{ backgroundColor: "#B1C1A3" }} onClick={async () => {
          nexus.unsubscribe("mychannel")
        }}>unsubscribe from mychannel</b-200>
      </w-cc>
    </Window>



  </div>
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



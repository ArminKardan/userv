
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import { useEffect } from 'react';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'


export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, dies, z) => {

  getProps(async () => {
    props.result = 0;
    props.firstnum = "";
    props.secondnum = "";
    props.op = null;
  })

  let action = (btn: string) => {
    if ((btn == "=") || (props.firstnum && props.secondnum && ["+", "-", "*", "/"].includes(btn))) {
      if (props.op == "+") {
        props.result = Number(props.firstnum) + Number(props.secondnum)
      }
      else if (props.op == "-") {
        props.result = Number(props.firstnum) - Number(props.secondnum)
      }
      else if (props.op == "*") {
        props.result = Number(props.firstnum) * Number(props.secondnum)
      }
      else if (props.op == "/") {
        props.result = Number(props.firstnum) / Number(props.secondnum)
      }
      props.firstnum = props.result.toString()
      props.op = btn
      props.secondnum = ""
      refresh()
      return
    }


    if (["+", "-", "*", "/"].includes(btn)) {
      props.op = btn
      refresh()
      return;
    }
    if (!props.op) {
      props.firstnum += btn
    }
    else {
      props.secondnum += btn
    }
    refresh()
  }



  let cls = "w-20 h-20 bg-pink-200 hover:bg-pink-500 cursor-pointer active:bg-pink-700"
  return <Window title="my page">
    <br-x />
    <div className=''></div>
    <b-200 onClick={async () => { Router.push(z.root) }}>Index page</b-200>
    <br-x />
    <c-x>
      <f-13> First num: {props.firstnum}</f-13>
      <f-13> Op: {props.op}</f-13>
      <f-13> Second num: {props.secondnum}</f-13>
    </c-x>

    <c-c style={{ width: 400 }}>
      <f-c class="min-h-20 min-w-100 bg-green-200" style={{ width: 400 }}>
        <sp-1 /> <f-14>{Number(props.result)}</f-14>
      </f-c>
      <f-c>
        <f-cc class={cls} onClick={() => action("7")}>7</f-cc>
        <f-cc class={cls} onClick={() => action("8")}>8</f-cc>
        <f-cc class={cls} onClick={() => action("9")}>9</f-cc>
        <f-cc class={cls} onClick={() => action("/")}>/</f-cc>
        <f-cc class={cls} onClick={() => action("*")}>*</f-cc>
      </f-c>

      <f-c>
        <f-cc class={cls} onClick={() => action("4")}>4</f-cc>
        <f-cc class={cls} onClick={() => action("5")}>5</f-cc>
        <f-cc class={cls} onClick={() => action("6")}>6</f-cc>
        <f-cc class={cls} onClick={() => action("-")}>-</f-cc>
        <f-cc class={cls} onClick={() => action("+")}>+</f-cc>
      </f-c>

      <f-c>
        <f-cc class={cls} onClick={() => action("1")}>1</f-cc>
        <f-cc class={cls} onClick={() => action("2")}>2</f-cc>
        <f-cc class={cls} onClick={() => action("3")}>3</f-cc>
        <f-cc class={cls} onClick={() => action("0")}>0</f-cc>
        <f-cc class={cls} onClick={() => action("=")}>=</f-cc>
      </f-c>

    </c-c>

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




// import Bold from '@/frontend/components/qecomps/Bold';

import Bold from '@/frontend/components/qecomps/Bold';
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Router from 'next/router';


export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onConnected, dies, z) => {

    useEffect(() => {
        props.counter = 4
        let c = setInterval(() => {
            if (props.counter == 0) {
                window.location.href = "/"
                clearInterval(c)
            }
            else
                refresh({ counter: props.counter - 1 })
        }, 1000);
        return () => {
            clearInterval(c)
        }
    }, [])


    return <c-cc style={{ width: "100vw", height: "100vh" }}>
        <img src="/404.webp" style={{ width: "70%", maxWidth: 400 }} />
        <br-x />
        <br-x />
        <f-15>We will redirect to home after {props.counter} seconds...</f-15>
    </c-cc>
}



import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';

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
            query: context.query,
            nlangs,
            session,
            pageid,
        },
    }, context)


    return obj

}



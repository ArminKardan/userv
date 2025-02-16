import { useEffect, useState } from 'react';
import User, { UserType } from '../../user';
import Head from 'next/head'
import { SSRGlobal } from './Context';
import ComponentSSR from './Componentd';
import dynamic from 'next/dynamic';
const ComponentCSR = dynamic(() => import('./Componentd.tsx').then(x => x.default), { ssr: false })



export type ZType = {
    pageProps: any, root: string,
    lang: { [key in string]: any }, user: UserType, styles: any, qestyles: any, path: string,
}

export type PageEl = (props: { [key in any]: any },
    refresh: (object?: { [key in any]: any }) => void,
    getProps: (callback: () => Promise<void>) => void,
    onConnected: (callback: () => Promise<void>) => void,
    dies: (callback: () => Promise<void>) => void,
    z: ZType) => React.JSX.Element

const convertor = (props: any, Page: PageEl, isPage: boolean, z: ZType, ssr) => {

    let die = {} as any
    let prop = { ...props }
    let noheader = props.session.noheader
    let full = props.session.full
    props = prop

    delete props.query?.session
    delete props.query?.lang
    delete props.nlangs
    delete props.session
    delete props.pageid
    delete props.href
    delete props.apilist

    useEffect(() => {
        return () => {
            die.func?.()
        }
    },[])

    let [state, setState] = useState({
        content: {
            loaded: false, ...props,
        },
    })



    if (isPage) {
        if (z["pagepath"] && z["pagepath"] != props.href) {
            state = {
                content: {
                    loaded: false, ...props,
                }
            }
        }
        z["pagepath"] = props.href
    }

    const refr = (obj) => {
        if (obj) {
            Object.keys(obj).forEach(k => {
                state.content[k] = obj[k]
            })
        }
        setState({ ...state })
    }

    if (isPage) {
        z.pageProps = state.content
    }
    else {
        for (let k of Object.keys(props)) {
            state.content[k] = props[k]
        }
    }

    let Parent = ComponentCSR;
    if (ssr) {
        Parent = ComponentSSR
    }

    return <Parent>
        {isPage && props.title ? <Head>
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta property="og:image" content={props.mainimage} />
            <meta property="og:image:alt" content={props.title} />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": props.title,
                        "image": props.mainimage,
                        "description": props.description
                    })
                }}
            />

            <link rel="icon" href="/favicon.ico" />
        </Head> : null}


        {!full ? <main className={z.qestyles.main}>
            <div className={z.qestyles.graybox} style={{ paddingTop: noheader ? 0 : 37 }} >
                {Page(state.content, refr, async (func) => {
                    if (!state["loaded"]) {
                        await func();
                        // console.log("running async...")
                        state["loaded"] = true
                        setState({ ...state })
                    }
                },
                    async (func) => {
                        if (!global.xmpppageloaded) {
                            global.xmpppageloaded = true
                            if (!state["loaded"] && global.nexus?.connected) {
                                func?.().then(() => { })
                            }
                            else {
                                global.nexusconnected = { func };
                            }
                        }
                    },

                    async (func) => {
                        die.func = func;
                    }, z)}

            </div>
        </main> : null}

        {!noheader ? <br-x style={{ height: 38 }} /> : null}

        {full ? Page(state.content, refr, async (func) => {
            if (!state["loaded"]) {
                await func();
                // console.log("running async...")
                state["loaded"] = true
                setState({ ...state })
            }
        },
            async (func) => {
                if (!global.xmpppageloaded) {
                    global.xmpppageloaded = true
                    if (!state["loaded"] && global.nexus?.connected) {
                        func?.().then(() => { })
                    }
                    else {
                        global.nexusconnected = { func };
                    }
                }
            },
            async (func) => {
                die.func = func;
            }, z) : null}

    </Parent>
}



export default (props: any, Page: PageEl, ssr: boolean = false) => {
    let isPage = !!props.pageid
    let z = SSRGlobal(props.pageid)

    // if (typeof window != "undefined") {
    //     if (!props.session?.uid) {
    //         let s = localStorage.getItem("session")
    //         if (s) {
    //             let ss = QSON.parse(s)
    //             for(let key of Object.keys(ss))
    //             {
    //                 props.session[key] = ss[key]
    //             }
                
    //         }
    //     }
    //     else {
    //         localStorage.setItem("session", QSON.stringify(props.session))
    //     }
    // }

    if (isPage) {
        if (!z.user)
            z.user = User(props.session);
        z.path = props.path
    }
    else {
        ssr = true
    }
    if (typeof props.session?.devmode != "undefined") global.devmode = props.session?.devmode
    return convertor(props, Page, isPage, z, ssr)
}

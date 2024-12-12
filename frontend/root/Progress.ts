import Router from 'next/router';
import NProgress from 'nprogress/nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { SSRGlobal } from '../components/qecomps/Context';


export const Runner = (pageid) => {

  let z = SSRGlobal(pageid)
  Router.events.on('routeChangeStart', (e) => {
    // if (global.noloading) {
    //   global.noloading = false;
    //   return;
    // }
    setTimeout(() => {
      global.onunloader = null
      let el = document.getElementById("grayer")
      if (!el) return
      el.className = z.qestyles.op0
      setTimeout(() => el.style.display = "none", 400);
      if (z.user.role.includes("admin"))
        NProgress.done()
      global.noloading = false
    }, 4000)

    global.onunloader?.()
    global.winscrollers = {}
    let el = document.getElementById("grayer")
    if (!el) return
    el.style.display = "flex"; el.className = z.qestyles.op1
    if (z.user.role.includes("admin"))
      NProgress.start()
  });
  Router.events.on('routeChangeComplete', () => {
    global.onunloader = null
    let el = document.getElementById("grayer")
    if (!el) return
    el.className = z.qestyles.op0
    setTimeout(() => el.style.display = "none", 400);
    if (z.user.role.includes("admin"))
      NProgress.done()
    global.noloading = false
  });
  Router.events.on('routeChangeError', () => {
    let el = document.getElementById("grayer")
    if (!el) return
    el.className = z.qestyles.op0
    setTimeout(() => el.style.display = "none", 400);
    if (z.user.role.includes("admin"))
      NProgress.done()
    global.noloading = false
  });
}

import React from 'react';
import { useState } from 'react';
import { SSRGlobal } from './Context';

const vote = async (item, dislike = false) => {
  if (!dislike) //liked
  {
    if (item.vliked) return

    item.vlikes = item.vlikes ? item.vlikes + 1 : 1;
    item.vdislikes = item.vdislikes ? item.vdislikes - 1 : 0;
    if (item.vlikes < 0) item.vlikes = 0;
    if (item.vdislikes < 0) item.vdislikes = 0;
    item.vliked = true;
    item.vdisliked = false;
  }
  else {
    if (item.vdisliked) return
    item.vlikes = item.vlikes ? item.vlikes - 1 : 0;
    item.vdislikes = item.vdislikes ? item.vdislikes + 1 : 1;
    if (item.vlikes < 0) item.vlikes = 0;
    if (item.vdislikes < 0) item.vdislikes = 0
    item.vliked = false;
    item.vdisliked = true;
  }

  fetch("/api/explore/videovote", {
    method: "POST",
    body: JSON.stringify({
      like: !dislike,
      dislike: dislike,
      expid: item.expid,
    })
  }).then(async r => {
    let json = await r.json();
    if (json.code == 0) {
    }
  })
}


export default (props) => {
  let z = SSRGlobal()
  var region = z.lang.region || "en-US"
  var vid = props.vid
  var containerwidth = 0;
  var dragtopercent = 0;
  var mousedown = false;

  var [item, setItem] = useState(props.item)
  props.item.vlikes = item.vlikes;
  props.item.vdislikes = item.vdislikes;
  props.item.vliked = item.vliked;
  props.item.vdisliked = item.vdisliked;

  var frameimage = global.cdn("/files/youtube1.svg")
  var playbytext = z.lang.playbyyoutube

  if (props.videoobj?.iframe?.includes("aparat")) {
    frameimage = global.cdn("/files/aparat.svg")
    playbytext = z.lang.playbyaparat
  }
  var seekedtimer = 0;

  var applyseek = () => {
    let vel = document.getElementById(props.vid) as HTMLVideoElement
    if (vel && !isNaN(seekedtimer) && isFinite(seekedtimer))
      vel.currentTime = seekedtimer
  }
  var ontimerseek = (p) => {
    if (isNaN(p)) {
      return;
    }
    let vel = document.getElementById(props.vid) as HTMLVideoElement
    if (!vel) return
    seekedtimer = Math.floor(p * vel.duration / 100);
    var h = Math.floor(seekedtimer / 3600).toString().padStart(2, "0");
    var m = Math.floor(seekedtimer % 3600 / 60).toString().padStart(2, "0");;
    var s = Math.floor(seekedtimer % 3600 % 60).toString().padStart(2, "0");;
    document.getElementById(props.subtid + "_timer").innerHTML = h + ":" + m + ":" + s
  }

  return <>
    {props.screen == "iframe" ? null : <>


      <f-cc id={props.subtid} class={z.qestyles.subtx} style={{bottom:30}}/>

      <div id={props.subtid + "_track"} style={{ opacity: 0.4 }}>
        <f-x id={props.subtid + "_timer"} style={{ color: "white", fontSize: 11, bottom: 8, left: 5, position: "absolute" }}>
          00:00:00
        </f-x>
        <f-cc id={props.subtid + "_bar"} class={z.qestyles.subtx}
          style={{ backgroundColor: "green", width: "100%", height: 4, borderRadius: 1, marginBottom: 1, }} />
      </div>


      <div id={props.subtid + "_container"} className={z.qestyles.subtx} style={{ opacity: 0 }}
        onMouseEnter={(e) => {
          containerwidth = parseInt(window.getComputedStyle(document.getElementById(props.subtid + "_container")).width.replace("px",""))
          document.getElementById(props.subtid + "_track").style.opacity = "1"
        }}
        onMouseLeave={() => {
          document.getElementById(props.subtid + "_track").style.opacity = "0.4"
        }}
        onTouchStart={(e) => {
          props.onstoptimer?.()
          containerwidth = parseInt(window.getComputedStyle(document.getElementById(props.subtid + "_container")).width.replace("px", ""))
          document.getElementById(props.subtid + "_track").style.opacity = "1"
          var bcr = e.currentTarget.getBoundingClientRect();
          var x = e.targetTouches[0].clientX - bcr.x;
          mousedown = true
          document.getElementById(props.subtid + "_bar").style.width = x + "px"
          document.getElementById(props.subtid + "_voice").style.zIndex = "-1"
          dragtopercent = (x * 100 / containerwidth);
          if (isNaN(dragtopercent)) {
            props.onresumetimer?.()
          }
          else {
            ontimerseek?.(dragtopercent)
          }
        }}
        onMouseDown={(e) => {
          props.onstoptimer?.()
          containerwidth = parseInt(window.getComputedStyle(document.getElementById(props.subtid + "_container")).width.replace("px", ""))
          mousedown = true
          document.getElementById(props.subtid + "_bar").style.width = e.nativeEvent.offsetX + "px"
          document.getElementById(props.subtid + "_voice").style.zIndex = "-1"
          dragtopercent = (e.nativeEvent.offsetX * 100 / containerwidth);
          if (isNaN(dragtopercent)) {
            props.onresumetimer?.()
          }
          else {
            ontimerseek?.(dragtopercent)
          }
        }}
        onMouseUp={() => {
          props.onresumetimer?.()
          mousedown = false
          document.getElementById(props.subtid + "_voice").style.zIndex = null
          applyseek?.();
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            props.onresumetimer?.()
            document.getElementById(props.subtid + "_track").style.opacity = "0.4"
          }, 2000)
          mousedown = false
          document.getElementById(props.subtid + "_voice").style.zIndex = null;
          applyseek?.();
        }}


        onMouseMove={(e) => {
          if (mousedown) {
            document.getElementById(props.subtid + "_bar").style.width = e.nativeEvent.offsetX + "px"
            dragtopercent = (e.nativeEvent.offsetX * 100 / containerwidth);
            ontimerseek?.(dragtopercent)
          }
        }}
        onTouchMove={(e) => {
          var bcr = e.currentTarget.getBoundingClientRect();
          var x = e.targetTouches[0].clientX - bcr.x;
          if (mousedown) {
            document.getElementById(props.subtid + "_bar").style.width = x + "px"
            dragtopercent = (x * 100 / containerwidth);
            ontimerseek?.(dragtopercent)
          }
        }}

      ></div>

      <f-cc id={props.subtid + "_voice"} class={z.qestyles.vmt} style={{direction:"ltr", right:0 }} onMouseDown={() => {
        var video = document.getElementById(vid) as HTMLVideoElement
        if (!video)
          return
        var muteimg = document.getElementById(props.item.expid + "_mute") as HTMLImageElement
        if (video.muted) {
          props.onunmute?.()
          muteimg.src = global.cdn("/files/unmute.svg")
          video.muted = false
        }
        else {
          muteimg.src = global.cdn("/files/mute.svg")
          video.muted = true
        }
      }}>
        <img className={z.qestyles.opaque} id={props.item.expid + "_mute"} src={global.cdn("/files/mute.svg")}
          style={{ width: 20, height: 20, cursor: "pointer" }} />
      </f-cc>

    </>}

    {/* <f-csb style={{
      position: "absolute", bottom: 0,backgroundColor: "#c1a076",
      paddingLeft: 10, width: "100%", fontSize: 9.5, height: 23
    }}>

      <Text value={props.screen == "iframe" ? z.lang.useqeplayer : playbytext} tmb={-1}
        image={props.screen == "iframe" ? global.cdn("/files/logocircular.webp") : frameimage} s={13} fontSize={9.5}
        islink on={() => props.changemode?.()} />


      {!props.novote ?
        <f-csb style={{ fontSize: 10, flexDirection:"row-reverse", width:110 }}>
          <f-cc>
            <lkg-v class={item.vliked ? z.qestyles.nopale : null} id={item.expid + "_vlg"} onMouseDown={(e) => {
              if (!z.user.loggedin) {
                props.loginrequired?.()
                return
              }
              props.onvlike?.()
              e.target.className = z.qestyles.nopale
              document.getElementById(item.expid + "_vlr").className = null;
              vote(item)
              setItem(JSON.parse(JSON.stringify(item)))
              props.onrefresh?.();
            }} /> <sp-3 />{(item.vlikes || 0).toLocaleString(z.lang.region)}  <sp-1 />
          </f-cc>
          <f-cc>
            <lkr-v class={item.vdisliked ? z.qestyles.nopaler : null} id={item.expid + "_vlr"} onMouseDown={(e) => {
              if (!z.user.loggedin) {
                props.loginrequired?.()
                return
              }
              props.onvdislike?.()
              e.target.className = z.qestyles.nopaler
              document.getElementById(item.expid + "_vlg").className = null;
              vote(item, true)
              setItem(JSON.parse(JSON.stringify(item)))
              props.onrefresh?.();
            }} /> <sp-3 />{(item.vdislikes || 0).toLocaleString(z.lang.region)} <sp-2 />
          </f-cc>
        </f-csb> : null}




      <div style={{ display: "flex", height: "100%", alignItems: "center", }} >
        {props.screen == "iframe" ? null : <><div style={{ height: 12, cursor: "pointer" }}><img src={global.cdn("/files/gear.svg")} style={{ width: 12, height: 12 }} /></div>
          <div style={{ color: "#434343", height: 10, lineHeight: 1.3, }}><sp-3 />AUTO<sp-2 /><sp-3 /></div>
          <div className={z.qestyles.hoverzoom} style={{ height: 15 }}
            onMouseDown={() => {
              let video = document.getElementById(vid);
              video?.requestFullscreen?.()
              props.onfullscreen?.()
            }}><img src={global.cdn("/files/fullscreen.svg")} style={{ width: 15, height: 15 }} /></div><sp-2 /></>}

        {props.screen == "iframe" ? <>
          <img src={frameimage} style={{ display: "inline-block", verticalAlign: "middle", width: 13, height: 13 }} />
          <sp-4 />
          <a style={{ display: "inline-block", verticalAlign: "middle", }}
            href={props.videoobj?.iframe}>{z.lang.orglink}</a><sp-4 />
          <img src={global.cdn("/files/extlink.svg")} style={{ display: "inline-block", verticalAlign: "middle", width: 8, height: 8, marginBottom: -1 }} />
          <sp-1 /> </> : null}

      </div>
    </f-csb> */}
    
    
    </>
}
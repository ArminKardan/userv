
import { ZType } from './Component';

const vote = async (item, dislike = false) => {
  if (!dislike) //liked
  {
    if (item.liked) return
    item.likes++;
    item.dislikes--
    if (item.likes < 0) item.likes = 0;
    if (item.dislikes < 0) item.dislikes = 0;
    item.liked = true;
    item.disliked = false;
  }
  else {
    if (item.disliked) return
    item.likes--;
    item.dislikes++
    if (item.likes < 0) item.likes = 0;
    if (item.dislikes < 0) item.dislikes = 0
    item.liked = false;
    item.disliked = true;
  }
}


export default (props: {
  item: any, refresh: (a?: any) => void, style?: CSSStyleSheet, z: ZType, nospace?: boolean,
  onlike?: () => void, ondislike?: () => void
}) => {
  let item = props.item
  var percent = 19;
  var color = null
  if (percent >= 90) {
    color = "green"
  }
  else if (percent >= 70) {
    color = "#447d00"
  }
  else if (percent >= 50) {
    color = "#428c00"
  }


  return <f-c style={{ height: 25, ...props.style }}>

    <style>{
      `lkg-s,
lkr-s,
lkr-v,
lkg-v {
  background-image: url("https://cdn.ituring.ir/qepal/likegreen.svg");
  background-repeat: no-repeat;
  background-position: center;
  height: 21px;
  width: 16px;
  background-size: contain;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  opacity: 0.6;
}

lkr-v,
lkg-v {
  height: 18px;
  width: 14px;
  opacity: 0.5;
}

lkr-s,
lkr-v {
  background-image: url("https://cdn.ituring.ir/qepal/likered3.svg");
  transform: rotate(180deg);
}

lkr-v {
  transform: rotate(180deg);
}


lkg-s:hover,
lkr-s:hover,
lkg-v:hover,
lkr-v:hover {
  transform: scale(1.2);
  opacity: 1;
}

lkr-s:hover,
lkr-v:hover {
  transform: rotate(180deg) scale(1.2);
}

`
    }</style>

    {true ? null : <f-c class={props.z.qestyles.itemalign} style={{ width: props.nospace ? null : props.z.lang.textw }}><span>{props.z.lang.rank}</span></f-c>}

    <f-csb style={{ fontSize: 10, width: 95 + ((item.dislikes + item.likes) > 1000 ? 20 : 0) }}>

      <f-cc style={{ direction: "ltr" }}>
        <lkg-s class={item.liked ? props.z.qestyles.nopale : null} onClick={(e) => {
          if (props.z.user.role.includes("admin")) {
            props.onlike?.()
            return;
          }

          (e.target as any).className = props.z.qestyles.nopale
          vote(item)
          props.refresh()
          props.onlike?.()
        }} /> <sp-3 /><span>{(item.likes || 0).toLocaleString(props.z.lang.region)}</span>
      </f-cc>
      <f-cc style={{ direction: "ltr" }}>
        <lkr-s class={item.disliked ? props.z.qestyles.nopaler : null} onClick={(e) => {
          if (!props.z.user.uid) {
            return
          }
          if (props.z.user.role.includes("admin")) {
            props.ondislike?.()
            return;
          }
          (e.target as any).className = props.z.qestyles.nopaler
          vote(item, true)
          props.refresh()
          props.ondislike?.()
        }} /> <sp-3 /><span>{(item.dislikes || 0).toLocaleString(props.z.lang.region)}</span>
      </f-cc>
    </f-csb>


  </f-c>
}
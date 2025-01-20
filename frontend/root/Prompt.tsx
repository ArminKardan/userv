import WindowFloat from '@/frontend/components/qecomps/WindowFloat'
import { useEffect, useState } from 'react'
import { SSRGlobal } from '../components/qecomps/Context'
import Icon2Titles from '../components/qecomps/Icon2Titles'
import UserAvatar from '../components/qecomps/UserAvatar'
import Signature from '../components/qecomps/Signature'

declare global {
  function selector(sync: () => Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>,
    on: (key: any) => Promise<void>
  ): Promise<void>;
}

export default (props) => {
  let z = SSRGlobal()
  let [state, setState] = useState<any>({ show: null, title: null, text: null, oktext: null, canceltext: null })
  let uniquekey = new Date().getTime();

  window.selector = (sync, on): Promise<void> => {
    setState({ show: "selector", sync, on })
    return new Promise(r => {
      window["selectorresolve"] = (x) => { r(x) }
    })
  }


  if (!state.show) {
    return null
  }
  
  else if (state.show == "selector") {
    let width = state.style?.width;
    delete state.style?.width
    // let zIndex = state.style?.zIndex
    delete state.style?.zIndex
    let items = state.sync()

    return <WindowFloat title={z.lang.choose} z={99999} style={{ direction: z.lang.dir, }}
      onclose={() => {
        setState({ show: false })
        window["selectorresolve"](null)
      }}>
      <div style={{ maxHeight: 400, overflowX: "scroll" }}>
        {(items).map(st => {

          let image = null;
          if (st.image) {
            let addr = !st.image.includes("/") ? cdn("/files/" + st.image) : cdn(st.image)
            image = <img src={addr} style={{ height: 28, width: 28, objectFit: "contain", borderRadius: 5 }} />
            if (st.imageprop) {
              image = <UserAvatar image={addr} imageprop={st.imageprop} w={30} />
            }
          }
          return <Icon2Titles title1={st.title1} style={{ backgroundColor: st.highlight ? "#61A75A" : "#B6C8B4", marginBottom: 1 }}
            icon={image}
            title2={<Signature style={{ marginTop: 4 }}>{st.title2}</Signature>}
            righticon={st.righticon ? <img src={cdn("/files/" + st.righticon)} style={{ width: 25 }} /> : null}
            on={async () => {
              await state.on(st.key)
              items = state.sync()
              setState({ ...state })
            }}
          />
        })}
      </div>
    </WindowFloat>
  }

}
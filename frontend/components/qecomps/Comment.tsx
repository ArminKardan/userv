
import Bold from './Bold'
import { SSRGlobal } from './Context'

export default (props: {
  image: string, on?: () => void,
  s?: number, title: string, comment: string
}) => {
  let z = SSRGlobal()
  return <div className={z.qestyles.cmlib} onClick={() => props.on?.()}>
    <f-x >
      <sp-2 />
      <img src={global.cdn(props.image)} style={{ height: props.s || 50, width: props.s || 50, borderRadius: 17 }} /><sp-3 />
      <c-xc>
        <f-c>
          <p style={{ paddingRight: 10 }}>
            <Bold>{props.title}</Bold> <sp-4 />
            {props.comment}</p>
        </f-c>
      </c-xc>
    </f-x>
  </div>
}

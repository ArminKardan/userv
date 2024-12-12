import Upload from './Upload'
import { useState } from 'react'
import TextBox from './TextBox'
import Circle from './Circle'
import { SSRGlobal } from './Context'

export default (props: {
  value?: any,
  body?: any,
  defaultValue?: any,
  url?: string,
  id?: string,
  title?: string,
  onlefticon?: () => void,
  onrighticon?: () => void,
  lefticon?: any,
  righticon?: any,
  extensionfilter?: any,
  on?: (any) => void,
  reload?: () => void,
}) => {
  let z = SSRGlobal()
  // var functions: any = {}
  var propval = props.value || props.body || props.url || props.defaultValue || null
  if (propval && typeof propval == "object") {
    propval = "Uploading..."
  }
  var [doc, setDoc] = useState<any>({ url: propval });
  var refresh = () => setDoc(JSON.parse(JSON.stringify(doc)))


  return <>
    <TextBox id={"txtbx_" + props.id} title={props.title} lefticon={props.lefticon} nolefticonrotate
      onlefticon={() => { props.onlefticon?.() }} defaultValue={propval} on={(n) => { doc.url = n; props.on?.(n) }}
      righticon={doc.percent ? <Circle {...{ percent: doc.percent, width: 15 }} /> : global.cdn("/files/upload2.svg")}
      onrighticon={() => { uploaders["uploadbx_" + props.id].open() }} />
    <Upload
      // functions={functions}
      extensionfilter={props.extensionfilter}
      singlefile
      hidefileicons
      on={(u) => {
        if(u[0].percent == 100)
        {
          doc.url = u; refresh(); props.on?.(u); props.reload?.()
          setTimeout(() => {
            doc.percent = null;
            refresh()
          }, 500);
        }
        else
        {
          doc.percent = u[0].percent; refresh();
        }
      }}
      id={"uploadbx_" + props.id}
      marginLeft={5}
    />
  </>
}
import { CSSProperties } from "react"
import crossstyles from "@/styles/crossstyles"
export default (props?: {
  title?: string,
  contentbgcolor?: string,
  titlebgcolor?: string,
  titlecolor?: string,
  children?: any,
  contentStyle?: CSSProperties,
  style?: CSSProperties,
}) => {
  return <>
    <c-x style={{
      paddingBottom: 5, marginBottom: 0, backgroundColor: props.contentbgcolor || "#f1e3cf",
      borderRadius: "0.5rem ", fontSize: 13, zIndex: 100, boxShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.5)", ...props.style
    }}>
      {props.title ? <f-cc style={{
        height: 25, backgroundColor: props.titlebgcolor || crossstyles.forms.titlebgcolor,
        borderRadius: "0.5rem 0.5rem 0 0",
      }}>
        <f-12 style={{ color: props.titlecolor || crossstyles.forms.titletextcolor  }}>{props.title}</f-12>
      </f-cc> : null}

      <div style={{ ...props.contentStyle }}>{props.children}</div>

    </c-x>
  </>

}
import { CSSProperties } from "react";
import { SSRGlobal } from "./Context";

export default (props: {
  icon?: string,
  image?: string,
  image2?: string,
  title?: any,
  text?: string,
  value?: string,
  icon2?: string,
  selected?: boolean, style?: CSSProperties,
  pt?: number,
  h?: number,
  w?: number,
  s?: number,
  s2?: number,
  on?: () => void,
  bold?: boolean,
  ml?: number,
  txtmt?: number,
}) => {
  let z = SSRGlobal()
  var image = props.icon || props.image;
  var image2 = props.icon2 || props.image2;
  var title = props.title || props.text || props.value;
  return <c-cc class={z.qestyles.imgtxtitem + " " + z.qestyles.hover}
    style={{
      backgroundColor: props.selected ? "#d1af85" : null,
      ...props.style, paddingTop: props.pt || (props.h ? (50 - props.h) : null),
      //  paddingTop:props.h?(50 - props.h):null 
    }} onClick={() => props.on?.()}>
    <f-ec>
      <img src={image} alt={props.title + "'s icon"}
        style={{ height: props.s || props.h || 50, width: props.s || props.w || 50, borderRadius: 5 }} onLoad={() => {

        }} />

      {image2 ? <img src={image2} alt={props.title + "'s side icon"}
        style={{
          height: props.s2 || 30, width: props.s2 || 30,
          marginLeft: z.lang.dir == "ltr" ? -15 : 0,
          marginRight: z.lang.dir == "rtl" ? -50 : 0,
          marginBottom: -5,
        }} /> : null}

    </f-ec>
    <br-xxx/>
    {typeof title == "string" ? <f-11 style={{
      fontWeight: props.bold ? 600 : 0, marginLeft: props.ml,
      textAlign: "center", marginTop: props.txtmt
    }}>
      {title}</f-11> : title}

  </c-cc>

}
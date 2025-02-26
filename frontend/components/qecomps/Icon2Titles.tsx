import { CSSProperties } from 'react'
import Bold from './Bold'
import { SSRGlobal } from './Context'


export default (props:{title?:any, raw1?:boolean, title1?:any, title2?:any,
  price1?:number, raw?:boolean, icon?:any, image?:any, nohover?:boolean,
  on?:()=>void, percent?:number, roundicon?:boolean, style?:CSSProperties, percentColor?:string,
  nobold?:boolean,unbold?:boolean, f1?:string, f2?:string, righticon?:any, onclose?:()=>void, 
}) => {
  let z = SSRGlobal()
  var alt = "icon"
  if (props.title && !props.raw1) {
    alt = props.title1?.toLowerCase() + "'s icon"
  }
  else if (props.price1 && !props.raw) {
    alt = "price " + props.price1 + "'s icon"
  }
  else {
    alt = "icon2title's icon"
  }
  let image = props.icon || props.image;

  let unbold = props.nobold || props.unbold;


  return <f-csb class={props.nohover ? null : z.qestyles.hover}
    style={{ position: "relative", backgroundColor: "#f1e3cf", borderRadius: 4, fontSize: "inherit", height: 45, ...props.style }}
    onClick={() => props.on?.()}>

    {props.percent ? <div style={{ position: 'absolute', width: props.percent + "%", height: "100%", backgroundColor: props.percentColor || "#A1C781", zIndex: 9, borderRadius: 4, }}></div> : null}

    <f-cc style={{ zIndex: 10 }}>
      <sp-2 />
      {typeof image == "string" ? <img style={{ borderRadius: props.roundicon ? "50%" : 4, width: 25, height: 25 }}
        src={global.cdn(props.icon || props.image)} alt={props.title1 + "'s Icon"} /> :
        image}
      <sp-2 />

      {props.raw ? <c-xsb>
        {props.title1 ? props.title1 : null}
        {props.title2 ? props.title2 : null}
      </c-xsb> : (unbold ? <c-xsb>

        {typeof props.title1 == "string" ? <f-12 style={{ display: "block", fontSize: props.f1 || 12, lineHeight: 1.2, whiteSpace: "pre" }}>{props.title1}</f-12> : props.title1}
        {typeof props.title2 == "string" ? <f-10 style={{ display: "block", fontSize: props.f2 || 11, lineHeight: 1.5 }}>{props.title2}</f-10> : props.title2}
      </c-xsb> : <c-xsb>

        {typeof props.title1 == "string" ? <Bold style={{ display: "block", fontSize: props.f1 || 12, lineHeight: 1.2, whiteSpace: "pre" }}>{props.title1}</Bold> : props.title1}
        {typeof props.title2 == "string" ? <Bold style={{ display: "block", fontSize: props.f2 || 11, lineHeight: 1.5 }}>{props.title2}</Bold> : props.title2}
      </c-xsb>)}

    </f-cc>
    {props.righticon || props.onclose ? <f-cse style={{
      borderTopRightRadius: 5, borderBottomRightRadius: 5,
      paddingLeft: z.lang.dir == "rtl" ? 20 : null,
      paddingRight: z.lang.dir == "ltr" ? 20 : null,
      height: 40, 
    }} >
      {props.righticon}

      {props.onclose ? <img className={z.qestyles.menubtn} src={global.cdn("/files/close.svg")} style={{ width: 20, height: 20 }} alt={alt}
        onClick={() => { props.onclose?.() }} /> : null}
    </f-cse> : null}


  </f-csb>
}
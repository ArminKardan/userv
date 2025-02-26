import { useEffect, createRef, CSSProperties, useRef } from 'react';
import { SSRGlobal } from './Context';

export default (props: {
  value?: string,
  defaultValue?: string,
  type?: string,
  id?: string,
  tight?: any,
  tightkey?: string,
  title?: string,
  direction?: string,
  style?: CSSProperties,
  sup?: string,
  lefticon?: any,
  ilm?: number | string,
  nolefticonrotate?: boolean,
  onlefticon?: () => void,
  deltxt?: boolean,
  on?: (string) => void,
  padding?: number | string,
  margin?: number | string,
  fontSize?: number | string,
  txtdir?: string,
  textAlign?: string,
  dir?: string,
  readOnly?: boolean,
  placeholder?: string,
  onenter?: () => void,
  onclick?: () => void,
  onrighticon?: () => void,
  righticon?: any,
  righttext?: string,
  norighticonrotate?: boolean,
  sr?: number,
  selectonclick?: boolean,
}) => {
  let z = SSRGlobal()
  let ref = useRef(null)
  var defaultValue = null;
  var inp = createRef<HTMLInputElement>();
  if (typeof props.value != "undefined") {
    defaultValue = props.value
  }
  if (typeof props.defaultValue != "undefined") {
    defaultValue = props.defaultValue
  }

  let selected = false;

  if (props.type == "currency" && defaultValue && (defaultValue.length > 0 || defaultValue > 0)) {
    var num = parseFloat(defaultValue.toString().split(",").join(""));
    if (isNaN(num)) {
      defaultValue = "0";
    }
    else {
      defaultValue = num.toLocaleString("en-US")
    }
  }

  if (props.tight && props.tightkey) {
    useEffect(() => {
      let c = setInterval(() => {
        if (props.tight[props.tightkey] != ref.current.value) {
          ref.current.value = props.tight[props.tightkey] || ""
        }
      }, 100);
      return () => {
        clearInterval(c)
      }
    }, [])
  }

  useEffect(() => {
    if (typeof window != "undefined") {
      if (ref.current) {
        ref.current.value = defaultValue
      }
    }
  });

  return <f-x style={{ width: "100%", flex:1, marginTop: props.title?5:0, fontSize: 12, direction: props.direction as any, ...props.style }}>
    {props.title}<sup style={{ fontSize: 8 }}>{props.sup}</sup>
    <div style={{ display: "flex", alignItems: "center", marginTop: props.title?3:0, flex:1 }}>
      {typeof props.lefticon == "string" ? <><img style={{
        cursor: "pointer", width: 28, height: 28,
        display: "inline-block", verticalAlign: "middle", transform: (props.dir || "rtl") == "rtl" && !props.nolefticonrotate ? "scaleX(-1)" : null,
        marginLeft: props.ilm, marginRight: props.ilm
      }} src={global.cdn(props.lefticon)}
        alt="" onClick={() => { props.onlefticon?.() }} />&nbsp;</> : props.lefticon}
      {props.deltxt ? <img className={z.qestyles.hover} src={global.cdn("/files/close.svg")} style={{
        width: 18, height: 18,
        position: "absolute", left: "rtl" == "rtl" ? 18 : null, right: null
      }} onClick={(e) => {
        ref.current.value = ""
        props.on?.("");
      }} /> : null}
      <textarea rows={1}
        id={props.id || props.title}
        ref={ref}
        inputMode={(props.type == "currency" ? "numeric" : (props.type)) as any}
        autoComplete={"off"}
        style={{
          width:"100%",
          ["-webkit-text" + "-security"]: props.type == "password" ? "circle" : null,
          fontFamily: "inherit", padding: props.padding || "0 5px",
          margin: props.margin || "0 0px", direction: (props.txtdir || props.dir || "inherit") as any, borderRadius: props.style?.borderRadius || 5
          , fontSize: props.fontSize, textAlign: props.textAlign as any, height: props.style?.height || 35,
          resize: "none", paddingTop: 8, overflow: "hidden", whiteSpace: "nowrap",
          overflowX: "scroll"
        }}
        // id={props.id ? props.id : props.title} key={defaultValue + "key"}
        defaultValue={props.readOnly ? undefined : (defaultValue || "")}
        readOnly={props.readOnly}
        value={props.readOnly ? defaultValue : undefined}
        disabled={props.readOnly}
        className={z.qestyles.txt3} spellCheck={false}
        placeholder={props.placeholder}
        onKeyDown={(e) => {
          if (e.code == "Enter" || e.code == "NumpadEnter" || e.key == "Enter") {
            props.onenter?.()
          }
        }}
        onChange={(e) => {
          if (props.type == "currency") {
            if (e.target.value.length > 0) {
              var num = parseFloat(e.target.value.split(",").join(""));
              if (isNaN(num)) {
                e.target.value = "";
                return;
              }
              if (e.target.value.endsWith(".")) {
                return
              }
              e.target.value = num.toLocaleString("en-US")
            }
          }
          props.on ? props.on(e.target.value) : null;
        }}
        onBlur={() => { selected = false }}
        onClick={(e) => {
          props.onclick?.();
          if (props.selectonclick) {
            if (!selected)
              e.target.select();
            selected = true;
          }
          setTimeout(() => { e.target.scrollIntoView({ behavior: 'smooth', block: "center" }); }, 300)
        }}
      />
      {typeof props.righticon == "string" ? <>&nbsp;<img style={{
        cursor: "pointer", width: (props.sr + 5) || 35, height: props.sr || 30,
        transform: (props.dir || "rtl") == 'rtl' && !props.norighticonrotate ? "scaleX(-1)" : null
      }} src={global.cdn(props.righticon)} alt="" onClick={() => props.onrighticon?.()} /></> :
        props.righticon}
      {props.righttext ? <span>{props.righttext}</span> : null}
    </div>
  </f-x>
}
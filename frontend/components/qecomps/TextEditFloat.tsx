import TextBox from './TextBox';
import WindowFloat from './WindowFloat'
import { useState } from 'react'
import { useEffect } from 'react';
import Bold from './Bold';
import { SSRGlobal } from './Context';

export default (props: {
  value?: string,
  body?: string,
  pattern?: string,
  errorstr?: string,
  on?: (string) => void,
  title?: string,
  type?: string,
  onclose?: () => void,
  maxWidth?: number | string,
  title2?: any,
  textboxdir?: string,
  sup?: string,
  ontextchange?: (string) => void,
  placeholder?: string,
  righticon?: any,
  lefticon?: any,
  onrighticon?: () => void,
  onlefticon?: () => void,
  explain?: any,
  selectonclick?: boolean
}) => {
  let z = SSRGlobal()
  var value = null
  if (typeof props.value != "undefined") {
    value = props.value;
  }
  if (typeof props.body != "undefined") {
    value = props.body;
  }
  var [txt, setTxt] = useState({ value, userinput: false })

  var onok = () => {
    if (props.pattern) {
      var rx = new RegExp(props.pattern)
      if (!rx.test(txt.value)) {
        alerter(props.errorstr)
        return;
      }
    }
    props.on ? props.on(txt.value) : null
  }


  useEffect(() => {
    if (txt.value == value && !txt.userinput) {
      let inp = document.getElementById(props.title) as HTMLInputElement;
      setTimeout(() => {
        inp.focus();
        inp.select()
        if (props.type != "number") {
          try {
            inp.setSelectionRange(0, inp.value.length)
          }
          catch { }
        }
      }, 100);
      setTimeout(() => { inp.scrollIntoView({ behavior: 'smooth', block: "center" }); }, 500)
      setTimeout(() => { inp.scrollIntoView({ behavior: 'smooth', block: "center" }); }, 900)
    }
  })

  return <WindowFloat title={props.title} onclose={() => { props.onclose?.() }}
    maxWidth={props.maxWidth}>
    <TextBox title={props.title2}
      dir={props.textboxdir}
      selectonclick={props.selectonclick}
      onclick={() => { }}
      type={props.type}
      id={props.title}
      sup={props.sup} value={value} 
      on={(t) => { txt.value = t; txt.userinput = true; props.ontextchange?.(t) }}
      placeholder={props.placeholder}
      onenter={() => { onok() }} righticon={props.righticon} lefticon={props.lefticon}
      onrighticon={() => props.onrighticon?.()}
      onlefticon={() => props.onlefticon?.()}
    />
    <br-x />
    <span style={{ fontSize: 11 }}>{props.explain}</span>
    <br-x />
    <div style={{ textAlign: "center", marginTop: 5, display: "flex", justifyContent: "center" }}>
      <f-cc class={z.qestyles.btnaccept} onClick={() => { onok() }} ><Bold>{z.lang.done}</Bold></f-cc>
    </div>
  </WindowFloat>
}
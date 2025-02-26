
import React from 'react'

export default (props: { id: string, title: string, state: any, children: any, titlebgcolor?: string, contentbgcolor?: string, contentStyle?: CSSStyleSheet }) => {

  return <>
    <div style={{
      position: "relative", display: "flex", height: 25, alignItems: "center", backgroundColor: props.titlebgcolor || "#c1a076", userSelect: "none",
      borderRadius: 3, justifyContent: "center"
    }}
      onSelect={() => { return false }}
      onClick={() => {
        let el = document.getElementById("dropdown_body_" + props.id) as HTMLElement
        if (el.style.maxHeight == "500px") {
          el.style.transition = "all 0.2s cubic-bezier(0, 1, 0, 1)";
          el.style.maxHeight = "0px";
          (document.getElementById("dropdown_title_" + props.id) as any).style.transform = null;
        }
        else {
          el.style.transition = "all 0.3s ease-out";
          el.style.maxHeight = "500px";
          (document.getElementById("dropdown_title_" + props.id) as any).style.transform = "rotate(180deg)";
        }
      }}
    >
      {props.title}
      <div id={"dropdown_title_" + props.id} style={{
        transition: "all 0.3s ease-out", position: "absolute", right: 10, paddingTop: 1,
        transform: props.state != "open" ? "" : "rotate(180deg)"
      }}>
        <img src={"https://cdn.ituring.ir/qepal/down2.svg"} alt="received transaction count" style={{ width: 10, height: 10 }} /> </div>
    </div>


    <div id={"dropdown_body_" + props.id} style={{
      overflow: "hidden", transition: "all 0.3s ease-out", maxHeight: props.state == "open" ? "500px" : "0px",
      backgroundColor: props.contentbgcolor, ...props.contentStyle
    }}>
      {props.children}
    </div>

  </>

}
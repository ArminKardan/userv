
export default (props:{verify:string, style?:CSSStyleSheet})=>{
    return <>
    {props.verify == "admin" || props.verify == "owner"?<>
        <img src={global.cdn("/files/purpletick.svg")} style={{width:15, height:15, display:"inline-block",
          verticalAlign:"middle" , ...props.style}}/></>
          :
          (props.verify && props.verify != "admin"?<>
            <img src={global.cdn("/files/bluetick.svg")} style={{width:15, height:15, display:"inline-block", filter:"saturate(120%)",
            verticalAlign:"middle", ...props.style}}/></>:null)
        }

         
    </>
}
import { SSRGlobal } from "./Context"

export default (props)=>{
    let z = SSRGlobal()
    return <span style={{fontFamily:z.lang.ffb || z.lang.ffb, fontWeight:!z.lang.ffb?600:"normal",
        ...props.style}} onClick={()=>{props.on?.()}}>{props.children}</span>
}
import { FAtoENRatio } from "./Cap"
import { SSRGlobal } from "./Context"

export default (props)=>{
    let z = SSRGlobal()
    return <f-10 style={{fontStyle:"normal",
        direction: FAtoENRatio(z.user.signature||"") > 10?"rtl":"ltr",...props.style}}>{props.children}</f-10>
}
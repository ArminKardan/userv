import { SSRGlobal } from "./Context"
export default (props) => {
    
    let z = SSRGlobal()
    return <div id={props.name + "_detail_" + props.id} 
    className={props.open ? z.qestyles.openheight : z.qestyles.closeheight}>
        {props.open ? props.children : null}
    </div>
}
import { FAtoENRatio } from "./Cap"

export default (props) => {
    let dir = FAtoENRatio(props.children || "") > 1 ? "rtl" : "ltr"
    return <f-10 style={{
        fontStyle: "normal",
        direction: dir, ...props.style
    }}>
        {props.children}
    </f-10>
}
import { SSRGlobal } from "./Context"

export default (date: Date) => {
  let z = SSRGlobal()
  return <f-c style={{ display: "inline-block", direction: "ltr" }}>
    <span>{date.toLocaleDateString(z.lang.region)}</span>
    <sp-3 />
    <span>{date.toLocaleTimeString(z.lang.region)}</span>
  </f-c>
}
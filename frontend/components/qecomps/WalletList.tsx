import WindowFloat from './WindowFloat'
import Icon3Titles from './Icon3Titles'
import { useState } from 'react'
import { SSRGlobal } from './Context'

export default (props)=>
{
  let z = SSRGlobal()
  var [form, setForm] = useState(null)
  props.functions.show = ()=>
  {
    setForm("wallets")
  }


  return form == "wallets"?<WindowFloat title={z.lang.selectwallet} onclose={()=>setForm(null)} maxWidth="24rem" z={300}>
    <div style={{maxHeight:290, overflow:"scroll"}}>
    {props.wallets?.map( x=> <Icon3Titles
      key={"wlt_"+x.Wallet+"_"+x.Logo}
      title1={<span style={{fontSize:Math.min(13.5, (window?(window.innerWidth/300):1)*(18 - x.Wallet.length * 0.22))}}>{x.Wallet}</span>}
      title2={x.Owner}
      title3={x.Bank}
      icon={x.Logo}
      on={()=>{props.selected(x.Wallet); setForm(null)}}
      />)}
      </div>

  </WindowFloat>:null
}
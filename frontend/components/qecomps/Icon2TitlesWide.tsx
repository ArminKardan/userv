import Bold from './Bold'
import { SSRGlobal } from './Context'


export default (props:{title1?:any, price1?:string,width?:number|string, 
  title2?:any,roundicon?:boolean, on?:()=>void
  height?:number|string, icon?:any, image?:any,
  bgtransparent?:boolean,  f1?:string|number, f2?:string|number, 
 })=>
{
  let z = SSRGlobal()
    var alt = "icon"
    if(props.title1)
    {
        alt = props.title1.toLowerCase()+"'s icon"
    }
    else if(props.price1)
    {
        alt = "price "+props.price1+ "'s icon"
    }

    return <div className={props.bgtransparent?z.qestyles.ic3t:styles.ic3} 
    style={{position:"relative", height:props.height, width:props.width, display:"flex", alignItems:"center"}} onClick={()=>{props.on?.()}} >
    <div style={{height:30}}>
      <img style={{borderRadius:props.roundicon?"50%":4, width:30, height:30}} src ={props.icon||props.image} alt={props.title1+"'s Icon"} /> 
    </div>
    &nbsp;&nbsp;
      <div style={{display:"flex", flexDirection:"column", justifyContent:"center", marginTop:2}}>
        {props.title1?<Bold style={{display:"block", fontSize:props.f1||13, lineHeight:1.2}}>{props.title1}</Bold>:null}
        {props.title2?<Bold style={{display:"block", fontSize:props.f2||10, lineHeight:1.5}}>{props.title2}</Bold>:null}
      </div>

      <div style={{position:"absolute", right:z.lang.dir=="ltr"?10:null, left:z.lang.dir=="rtl"?10:null}}>
        <img style={{transform:z.lang.dir=="ltr"?"rotate(-90deg)":"rotate(90deg)", width:10, height:10}} src ={global.cdn("/files/down2.svg")} alt={props.title1+"'s Icon"}/> 
      </div>
  </div>
}
import { SSRGlobal } from "./Context";

export default (props)=>
{
  let z = SSRGlobal()
  var defaultValue = props.value||props.defaultValue;
  if(props.type == "currency" && defaultValue && (defaultValue.length > 0 || defaultValue > 0))
  {
    var num= parseFloat(defaultValue.toString().split(",").join(""));
    if(isNaN(num))
    {
      defaultValue = "0";
      return;
    }
    defaultValue = num.toLocaleString("en-US")
  }

  return <div style={{width:"100%", marginTop:5,  fontSize:12, fontWeight:600 }}>
   {props.title}<sup style={{fontSize:8}}>{props.sup}</sup>
  <div style={{display:"flex", alignItems:"center", marginTop:3}}>
   {props.lefticon?<><img style={{cursor:"pointer", width:28, height:28}} src ={props.lefticon} 
   alt=""  onClick={()=>{props.onlefticon?props.onlefticon():null}}/>&nbsp;</>:null}
    <input inputMode={props.type=="currency"?"numeric":null} id={props.id?props.id:null} key={defaultValue+"key"} defaultValue={defaultValue} readOnly={props.readOnly} 
    value={props.readOnly?defaultValue:undefined}
    type={props.type||'text'} disabled={props.readOnly} 
    className={z.qestyles.txt3} style={{ width:"calc(100% - 15px)",  paddingLeft:5, marginRight:5}}  spellCheck={false}
    placeholder={""} 
    
    onChange={(e)=>
      {
        if(props.type == "currency")
        {
          if(e.target.value.length > 0)
          {
            var num= parseFloat(e.target.value.split(",").join(""));
            if(isNaN(num))
            {
              e.target.value = "";
              return;
            }
            if(e.target.value.endsWith("."))
            {
              return
            }
            e.target.value = num.toLocaleString("en-US")
          }
        }
        props.on?props.on(e.target.value):null; 
      }}
    onClick={(e)=>{setTimeout(()=>{e.target.scrollIntoView({ behavior: 'smooth',block: "center"});},300) }}/>  
    <div style={{height:30, overflowY:'hidden', width:250, marginRight:10}}>
      <img src={"/api/user/captcha?uuid="+ props.uuid} style={{height:50, marginTop:-15}} onClick={()=>{props.reload?.()}}/>
    </div>
  </div>  
</div>
}
import { SSRGlobal } from './Context';
import Window from './Window'

export default (props:{trigger:number, items:Array<any>, title:string,
  head?:any, foot?:any,
})=>
{
  let z = SSRGlobal()
  var couples = []
  var uniquekey= Math.random()*100;
  var wstyle= null
  if(props.trigger == 400)
  {
    wstyle = z.qestyles.itemlist400w
  }
  else if(props.trigger == 600)
  {
    wstyle = z.qestyles.itemlist600w
  }
  else if(props.trigger == 800)
  {
    wstyle = z.qestyles.itemlist800w
  }
  else if(props.trigger == 1024)
  {
    wstyle = z.qestyles.itemlist1024w
  }

  var sstyle= null
  if(props.trigger == 400)
  {
    sstyle = z.qestyles.itemlist400s
  }
  else if(props.trigger == 600)
  {
    sstyle = z.qestyles.itemlist600s
  }
  else if(props.trigger == 800)
  {
    sstyle = z.qestyles.itemlist800s
  }
  else if(props.trigger == 1024)
  {
    sstyle = z.qestyles.itemlist1024s
  }


  for(let i = 0; i < props.items.length; i+=2)
  {
    if((i + 1) < props.items.length)
    { 
      couples.push(<div key={uniquekey++} className={wstyle} style={{width:"100%", justifyContent:"space-evenly"}}>
          {props.items[i]}
          &nbsp;
          {props.items[i+1]}
        </div>)
    }
    else
    {
      couples.push(<div key={uniquekey++} className={wstyle}>
        {props.items[i]}
      </div>)
    }
  }
return <>

      <Window title={props.title}>
        {props.head}
        <div style={{width:"100%", textAlign:"justify", lineHeight:1.2}}>
        
        {couples}
        
        <div className={sstyle}>{props.items.map(x=>x)}</div>
        {props.foot}
        
        </div>
        </Window>

</>

    }
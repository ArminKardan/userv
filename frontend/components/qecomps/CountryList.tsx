import { useState } from 'react';
import WindowFloat from './WindowFloat';
import TextBox from './TextBox';
import Bold from './Bold';
import { SSRGlobal } from './Context';


export default (props) => {
  let z = SSRGlobal()
  var [search, setSearch] = useState(null)

  var countrylist = null;

  if (props.countries) {
    var cnt = Object.values<any>(props.countries).sort((a, b) => {
      return a.dialCode.length - b.dialCode.length
    })

    var cn = ["United States", "United Kingdom", "China", "Russia",  "Iran", "United Arab Emirates","Canada", "Australia"].reverse()

    var notinc = cnt.filter(c => {
      if (c.country == "United States") return false;
      if (c.country == "Canada") return false;
      if (c.country == "United Kingdom") return false;
      if (c.country == "Russia") return false;
      if (c.country == "China") return false;
      if (c.country == "Iran") return false;
      if (c.country == "United Arab Emirates") return false;
      if (c.country == "Australia") return false;
      return true
    })

    for (var cc of cn) {
      notinc.unshift(cnt.filter(c => c.country == cc)[0]);
    }

    cnt = notinc

    if (search) {
      cnt = cnt.filter(c => {
        if (c.dialCode.includes(search)) {
          return true
        }
        if (c.country.toLowerCase().startsWith(search.toLowerCase())) {
          return true
        }
        return false;
      })
    }


    countrylist = cnt.map((c, i) => {
      if (i < 8) {
        return <div key={"cnt_" + c.country} className={props.countryitemclass} onClick={() => {
          props.on ? props.on(c.code) : null
          props.onclose ? props.onclose() : null
        }}><div className={z.qestyles.fl} dangerouslySetInnerHTML={{ __html: c.flag }}></div>
          <Bold style={{ width: 45 }}>{c.dialCode}</Bold>  <Bold>{c.country}</Bold>
        </div>
      }
      return null;
    })

    countrylist = countrylist.filter(x => x);
  }


  return <WindowFloat title={props.title} onclose={props.onclose}>
    <div style={{ maxHeight: "70vh", direction: "ltr" }}>
      <f-c style={{ direction: z.lang.dir as any, marginBottom: 3 }}>
        <f-11 ><Bold>{props.searchtitle}</Bold></f-11>
      </f-c>
      <f-c>
        <sp-2 />
        <TextBox dir="ltr" placeholder={props.placeholder} defaultValue={search} on={t => { search = t; setSearch(search) }} />
      </f-c>
      <br-x />
      <div style={countrylist.length > 10 ? { overflow: 'hidden', overflowY: 'scroll', height: '60vh' } : null}>
        {countrylist}
      </div>
    </div>
  </WindowFloat>
}
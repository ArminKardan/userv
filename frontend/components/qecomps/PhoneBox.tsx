import { useState } from 'react';
// import CountryList from './CountryList';
import Bold from './Bold';
import { SSRGlobal } from './Context';
import CountryList from './CountryList';
import TextBox from './TextBox';
import Flag from './Flag';

export default (props: {
  defaultCChar?: string,
  title?: string,
  sup?: string,
  countryitemclass: string
  defaultPhone?: string,
  onccode: (string) => void,
  oncchar: (string) => void,
  readOnly?: boolean,
  onok?: () => void,
  on?: (string) => void,
  id: string,
  placeholder?: string,
  clist: { title: string, title2: string, }

}) => {
  let z = SSRGlobal()
  var [countries, setCountries] = useState(null);
  var [clist, setClist] = useState(false);
  var [ccode, setCCode] = useState(props.defaultCChar ? props.defaultCChar?.toLowerCase?.() : "us");

  //var cntx = localStorage.getItem("countries");
  var country = null;
  if (typeof window != "undefined") {
    if (!window.countries) {
      var getCountries = async () => {
        window.countries = await (await fetch(global.cdn("/files/countries.json"))).json();
        setCountries(window.countries)
      }
      getCountries();
    }
    else {
      if (!countries) {
        countries = window.countries
      }
    }
    var country: any = window.countries ? Object.values(countries).filter(c => (c as any).code.toLowerCase() == ccode.toLowerCase())[0] : null;

  }

  return <>
    {clist ? <CountryList countryitemclass={props.countryitemclass} countries={window.countries} title={props.clist.title} searchtitle={props.clist.title2} placeholder="Example: +1"
      on={(cc) => { setCCode(cc); props.onccode ? props.onccode(countries[cc].dialCode) : null; props.oncchar ? props.oncchar(countries[cc].code) : null }}
      onclose={() => { setClist(false) }} /> : null}
    <div style={{ width: "100%", marginTop: 5, fontSize: 12, }}>
      <Bold>{props.title}</Bold><sup style={{ fontSize: 8 }}>{props.sup}</sup>
      <f-c style={{ display: "flex", alignItems: "center", marginTop: 3, direction: "ltr" }}>
        <f-c style={{ width: "100%" }}>
          <f-cc onClick={()=>{setClist(true) }}>
            <Flag ccode={ccode}style={{ width: 30 }} />‌<sp-3 />
            <Bold style={{ fontSize: 15, marginTop: 2 }}>{country ? country.dialCode : ""} </Bold><sp-3/>
          </f-cc>
          <TextBox dir="ltr" placeholder={props.placeholder} defaultValue={props.defaultPhone} on={t => { props.on(t) }} />
        </f-c>
      </f-c>
    </div></>
}
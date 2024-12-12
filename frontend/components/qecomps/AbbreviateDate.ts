import { SSRGlobal } from "./Context";

export default (dt, forceyear = null, region=null, includsec=false, use24H=false) => {
  var date: Date = null
  let z = SSRGlobal()
  var _region = region || z.lang.region || "en-US"
  if (typeof dt == "number") {
    date = new Date(dt);

  }
  else if (typeof dt == "string") {
    date = new Date(Number(dt));
  }
  else {
    date = dt
  }
  

  if(!date) return null

  var datestr = ""
  var midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  var yesterdaymidnight = midnight.getTime() - 86400000;
  var tomorrowmidnight = midnight.getTime() + 86400000;
  var d2midnight = midnight.getTime() + 2 * 86400000;

  if (date.getTime() > tomorrowmidnight && date.getTime() < d2midnight) {
    datestr = z.lang.tomorrow
  }
  else if (date.getTime() > midnight.getTime() && date.getTime() < tomorrowmidnight) {
    datestr = date.toLocaleTimeString(_region,
      { hour: "numeric", minute: '2-digit', second:includsec?"2-digit":undefined, hour12: !use24H }).toUpperCase()
    let t = datestr.split(' ');
    if (t[1]?.includes("قبل")) t[1] = "صبح"
    datestr = t.join(' ')

  }
  else if (date.getTime() > yesterdaymidnight && date.getTime() < midnight.getTime()) {
    datestr = z.lang.yesterday
  }

  else if (date.getFullYear() == new Date().getFullYear()) {
    datestr = date.toLocaleString(_region, { day: 'numeric', month: 'short', year: forceyear ? 'numeric' : undefined });
  }
  else {
    datestr = date.toLocaleDateString(_region);
  }

  if(datestr.includes("بعد") && !datestr.includes("۱۰:"))
  {
    datestr = datestr.replace(/۰:/g,"۱۲:")
  }

  return datestr.replace(" ", " ")
}
import { SSRGlobal } from "./Context";

export default (bigger, smaller, lang="en") => {
  var bigdate = null
  let region = "fa-IR"
  let now = "now"
  let days, hours, mins
  if (typeof window == "undefined") {
    region = global.langs[lang].region
    now = global.langs[lang].now
    days = global.langs[lang].days
    hours = global.langs[lang].hours
    mins = global.langs[lang].mins
  }
  else {
    let z = SSRGlobal()
    region = z.lang.region
    now = z.lang.now
    days = z.lang.days
    hours = z.lang.hours
    mins = z.lang.mins
  }

  if (typeof bigger == "number") {
    bigdate = new Date(bigger);
  }
  else if (typeof bigger == "string") {
    bigdate = new Date(Number(bigger));
  }
  else {
    bigdate = bigger
  }

  var smalldate = null
  if (typeof smaller == "number") {
    smalldate = new Date(smaller);
  }
  else if (typeof smaller == "string") {
    smalldate = new Date(Number(smaller));
  }
  else {
    smalldate = smaller
  }

  var out = "";
  if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 86400000) {
    out = ((bigdate.getTime() - smalldate.getTime()) / 86400000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + days
  }
  else if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 3600000) {
    out = ((bigdate.getTime() - smalldate.getTime()) / 3600000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + hours
  }
  else if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 60000) {
    out = ((bigdate.getTime() - smalldate.getTime()) / 60000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + mins
  }
  else {
    out = now
  }
  return (out || "").replace(" ", " ")
}
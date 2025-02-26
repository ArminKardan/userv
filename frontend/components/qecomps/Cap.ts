export default (txt: string): string => {
    if (!txt) return ""
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}


export function FAtoENRatio(inputString) {
    inputString = inputString.replace(/ /g, "")
    let persianCount = (inputString.match(/[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C]/g) || []).length;
    console.log("Persian count:", persianCount)
    let englishCount = inputString.length;
    console.log("total count:", englishCount)
    // let englishCount = (inputString.match(/[A-Za-z]/g) || []).length;
    return englishCount ? persianCount / englishCount : 1000;
  }
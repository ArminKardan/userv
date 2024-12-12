export default (txt: string): string => {
    if (!txt) return ""
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}


export function FAtoENRatio(inputString) {
    let persianCount = (inputString.match(/[\u0600-\u06FF]/g) || []).length;
    let englishCount = inputString.length;
    // let englishCount = (inputString.match(/[A-Za-z]/g) || []).length;
    return englishCount ? persianCount / englishCount : 1000;
  }
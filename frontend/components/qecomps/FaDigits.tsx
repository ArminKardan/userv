/* eslint-disable eqeqeq */
export default (input) => {

  if(typeof input !="string")
  {
    return "Not a number"
  }
  return input.replace(/0/g,"۰")
  .replace(/1/g,"۱")
  .replace(/2/g,"۲")
  .replace(/3/g,"۳")
  .replace(/4/g,"۴")
  .replace(/5/g,"۵")
  .replace(/6/g,"۶")
  .replace(/7/g,"۷")
  .replace(/8/g,"۸")
  .replace(/9/g,"۹")
}


declare global {
  namespace QSON {
    export function parse(input: string): any;
    export function stringify(input: Object): string;
  }
}
export default () => {
  if (!global.QSON) {
    global.QSON = {
      stringify: (obj) => JSON.stringify(obj),
      parse: (str) => JSON.parse(str)
    }
  }
}
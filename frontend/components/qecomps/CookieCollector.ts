export class Fetchv2CookieCollector {
    cookies: Array<any> = [];

    SetCookie(headers: Headers) {

        headers.forEach((v, k) => {
            if (k.toLowerCase() == "set-cookie") {
                for (let pair of v.trim().split(';')) {
                    if (pair.includes("=")) {
                        const keyValue = pair.trim().split('=');
                        this.cookies = this.cookies.filter(c=> c.key != keyValue[0]);
                        break;
                    }
                }
            }
        })

        headers.forEach((v, k) => {
            if (k.toLowerCase() == "set-cookie") {
                for (let pair of v.trim().split(';')) {
                    if (pair.includes("=")) {
                        const keyValue = pair.trim().split('=');
                        this.cookies.push({key: keyValue[0], value: pair.trim().replace(keyValue[0] + "=", "")})
                        break;
                    }
                }
            }
        })
    }

    GetCookieString(onlykeys:Array<string>) {
        let str = "";
        for (let c of this.cookies) {
            if(onlykeys)
            {
                if(onlykeys.includes(c.key))
                    str += c.key + "=" + c.value + "; "
            }
            else
            {
                str += c.key + "=" + c.value + "; "
            }
        }
        return str.trim();
    }
}

export class BrowseCookieCollector {
    // cookies: any = {};
    cookies: Array<any> = [];

    SetCookie(headers: Object) {
        Object.keys(headers).forEach(key => {
            if (key.toLowerCase().includes("set-cookie")) {
                for (let pair of headers[key].trim().split(';')) {
                    if (pair.includes("=")) {
                        const keyValue = pair.trim().split('=');
                        this.cookies = this.cookies.filter(c=> c.key != keyValue[0]);
                        break;
                    }
                }
            }
        })

        Object.keys(headers).forEach(key => {
            if (key.toLowerCase().includes("set-cookie")) {
                for (let pair of headers[key].trim().split(';')) {
                    if (pair.includes("=")) {
                        const keyValue = pair.trim().split('=');
                        this.cookies.push({key: keyValue[0], value: pair.trim().replace(keyValue[0] + "=", "")})
                        break;
                    }
                }
            }
        })
    }

    GetCookieString(onlykeys:Array<string>) {
        let str = "";
        for (let c of this.cookies) {
            if(onlykeys)
            {
                if(onlykeys.includes(c.key))
                    str += c.key + "=" + c.value + "; "
            }
            else
            {
                // console.log(c.key)
                str += c.key + "=" + c.value + "; "
            }
        }
        return str.trim();
    }
}
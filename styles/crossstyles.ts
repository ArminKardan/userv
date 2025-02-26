import { CSSProperties } from "react";
export type CrossStyles = {
    forms: {
        maxWidth?: number | string,
        wz?: number,
        titlebgcolor?: string,
        titletextcolor?: string,
        style?: CSSProperties,
        contentbgcolor?: string,
        contentStyle?: CSSProperties,
        button: { confirmstyle: CSSProperties, cancelstyle: CSSProperties }
    }
}

export default {
    forms: {
        maxWidth: null,
        wz: null,
        titlebgcolor: "#80AFAF",
        titletextcolor: null,
        style: null,
        contentbgcolor: "#C4D4C4",
        contentStyle: {padding:10},
        button:
        {
            confirmstyle: { backgroundColor: "#AFD1A5", borderWidth:0.5 },
            cancelstyle: { backgroundColor: "#8E9F89" },
        }

    }
} as CrossStyles
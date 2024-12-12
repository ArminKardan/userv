import type { Db, ObjectId } from "mongodb";
// import type { Cache } from 'inmemfilecache';
// import type WebSocket from "ws";
import { WebSocket as WSSK } from "ws";
// import type {ObjectId} from 'mongodb'
import type { User } from "@/frontend/user";

import { UploadStatuses } from "@/frontend/components/qecomps/Upload";

type RoleName = "admin" | "student" | "support" | "bot" | "comment" | "commenter" | "users" | "workers"
    | "course" | "explore" | "finance" | "journal" | "mentor" | "service" | "tester" | "stats" | "service"


declare type ScheduleJob = any;

declare type never = any

import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { langType } from "./common/SiteConfig";
import type { WorkerMake } from "./common/worker/GetWorker";

declare type Visitors = { [key in string]: {
    lang: string,
    lastseen: number,
    ip: string,
    email: string,
    ssr: number,
    api: number,
} }

declare global {

    declare type NextApiRequest = NextApiRequest
    declare type NextApiResponse = NextApiResponse

    var email:{
        send: (uid: string, type: EmailMessageType, id: string, norepeat: boolean = false, langcode: langType = "fa") => Promise<void>,
        signup:(email:string, code:string, langcode:langType)=>Promise<void>,
        ping: () => Promise<any>
        worker: WorkerMake
    }
    var tmnusd: number
    var cacher:Array<{uid:string, url:string, props:any, date:number}>
    var lastcryptoverify: string

    declare namespace JSX {
        type Elm = React.HTMLAttributes<HTMLElement> & { class?: string };
        interface IntrinsicElements {
            [elemName: string]: React.DetailedHTMLProps<Elm, HTMLElement>,
        }
    }

    

    var SWebsocket: typeof import('ws');

    var workers: Array<WorkerMake>;
    function Round(number, digits): number
    function sleep(ms): Promise<any>
    type Elm = React.HTMLAttributes<HTMLElement> & { class?: string };

    interface IntrinsicElements {
        [elemName: string]: React.DetailedHTMLProps<Elm, HTMLElement>,
    }

    var uploaders: { [key in string]: { clear: () => void, open: () => void, statuses: UploadStatuses } }
    var setScroller: (id: string) => void;
    var mongo: import("mongodb").MongoClient;
    var umongo: import("mongodb").MongoClient;
    var db: import("mongodb").Db;
    var udb: import("mongodb").Db;
    var cdb: import("mongodb").Db;
    var logdb: import("mongodb").Db
    var styles: any;
    var cache: Cache;
    var main: Function;
    var nodeenv: string;
    var devmode: boolean;
    function log(obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }): void;
    function sss(arg1: any, arg2?: any): void;
    function reloadsession(): void;
    function reload(): void;
    function closejournal(): void;
    function journals(arg: { items?: any[], jids?: string[] }): void;
  
    interface String {
        betweenxy(str1: string, str2: string, startindex?: number): string;
    }


    var fs: typeof import('fs');


    var P: PConfig
    var user: User
    var lang: any
    var wlang: any
    var langs: { [key in string]: any }
    var componentids: any
    var Android: any
    interface Window {
        FromAndroid: (obj: any) => void;
        countries: any
        attachEvent: any
    }
    interface EventTarget {
        scrollIntoView: (options: ScrollIntoViewOptions | boolean) => void
        select: () => void
        value: any
    }
    var ObjectId: any
    function closelog(): void;
    function cdn(url: string): string;
    function api(url: string, data?: any): Promise<any>;
    var device: {
        send: (obj: any, expirems: number, deviceobj?: any) => void,
        ws: any,
        software: string,
        wsopen: boolean,
        wsport: number,
        version: number,
        platform: string,
    }
    function onunloader(): void;

    var fs: typeof import('fs');

    var logcache: Array<{
        t: string, ip: string, l: string, d: Date, c: string, cdn: string,
        expid: import("mongodb").ObjectId | any,
        jid: import("mongodb").ObjectId | any,
        servid: import("mongodb").ObjectId | any,
    }>
    function logfinancial(): import("mongodb").Collection
    function logactivity(): import("mongodb").Collection

    function success(text: string, fast: boolean = false): void
    function error(text: string): void
    function login(): void
    function cache(type: string, props?: any)
    function exit()
    // function alerter(title: string|any, text?: string | Element, style?: any): Promise<void>;
    // function prompter(title: string, text?: string, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
    //     selectonclick: boolean = true,
    //     type: ("text" | "number" | "url" | "email" | "tel") = "text"): Promise<string>
    // function confirmer(title: string, text?: string | Element, oktext?: string, canceltext?: string): Promise<boolean>
    var confirm: any
    var BotUID: ObjectId
    var BotSecret: string
    var OwnerUID:ObjectId
    var OwnerSecret:string
    var DEVMODE: boolean = false;
    var winscrollers: { []: () => void }
    var visitors: Visitors
    var visitorsM1: Visitors
    var visitorsH1: Visitors
    var visitorsD1: Visitors
    function fetchv2(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    var parentdiv: HTMLElement
    function MD5(input: string | Buffer): string

    interface String {
        betweenxy(str1: string, str2: string, startindex?: number): string
    }
    interface Array {
        includesid(object: any)
    }
    function Schedule(hour: number, minute: number, second: number, cb: () => ScheduleJob)
    // interface API { test2: (num: number) => Promise<string> }
    // var API: API



    declare type CTX = {
        req: NextApiRequest, res: NextApiResponse,
        post: boolean, userip: string, email: string, uid: ObjectId, follows: Array<string>,
        role: (check: Array<RoleName>) => boolean
    };

    declare type PTX = {
        req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: ParsedUrlQuery,
        limited: boolean,
        pageid:string,
        cacher:any,
        query: ParsedUrlQuery,
        resolvedUrl: string, 
        lang: string, 
        session: {
            user?: {
                id: string
                uid: string,
                name: string,
                email: string,
                image: string,
                imageprop: { x: number, y: number, zoom: number, portion: number, refw: number },
                expires: number,
                wallets: { [key in WalletName]: number },
                unit: UnitName,
                ccode: string,
                cchar: string,
                phone: string,
                esaves:Array<string>,
                jsaves:Array<string>,
                lastseen: number,
                joindate: number,
                lang: langType,
                role: Array<RoleName>,
                verify: string | null,
                suspend: boolean,
                mfaenabled: boolean,
                cmntcount: number,
                donate: boolean,
                donated: number,
                cart: Array<any>,
                unreadchats: Array<any>,
                limited: boolean,
                securekey: string,
                cdn: string,
                follows: Array<string>
            },
            path: string,
        }
        userip: string, 
        email?: string, 
        uid?: ObjectId, 
        follows: Array<string>,
        jsaves: Array<string>,
        esaves: Array<string>,
        follows?: Array<string>,
        role?: (check: Array<RoleName>) => boolean
    };
}


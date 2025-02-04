import type { Db, ObjectId } from "mongodb";
import { WebSocket as WSSK } from "ws";
import type { User } from "@/frontend/user";

import { UploadStatuses } from "@/frontend/components/qecomps/Upload";

type RoleName = "admin" | "bot"

declare type ScheduleJob = any;

declare type never = any

import type { NextApiRequest, NextApiResponse } from "next"
import { IncomingMessage, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { langType } from "./common/SiteConfig";
import type { WorkerMake } from "./common/worker/GetWorker";

declare type Visitors = { [key in string]: {
    uid:string,
    lang: string,
    lastseen: number,
    ip: string,
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


    var SWebsocket: typeof import('ws');
    var workers: Array<WorkerMake>;
    function Round(number, digits): number
    function sleep(ms): Promise<any>
    var uploaders: { [key in string]: { clear: () => void, open: () => void, statuses: UploadStatuses } }
    var setScroller: (id: string) => void;
    var umongo: import("mongodb").MongoClient;
    var udb: import("mongodb").Db;
    var db: import("mongodb").Db;
    var cdb: import("mongodb").Db;
    var styles: any;
    var main: Function;
    var nodeenv: string;
    var devmode: boolean;
    function log(obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }): void;
    function sss(arg1: any, arg2?: any): void;
    function reloadsession(): void;
    function reload(): void;
    function closejournal(): void;
    function journals(arg: { items?: any[], jids?: string[] }): void;
  
    var fs: typeof import('fs');

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

    function login(): void
    function exit()
    var DEVMODE: boolean = false;
    var winscrollers: { []: () => void }
    var visitors: Visitors
    var visitorsM1: Visitors
    var visitorsH1: Visitors
    var visitorsD1: Visitors
    
    var parentdiv: HTMLElement
    function MD5(input: string | Buffer): string
    function SHA256(input: string | Buffer): string

    interface String {
        between(str1: string, str2: string): string
    }
    interface Array {
        includesid(object: any)
        toggle(object:any)
    }

    function Schedule(hour: number, minute: number, second: number, cb: () => ScheduleJob)

    type APISession = {
        uid: string,
        name: string,
        image: string,
        imageprop: {
          zoom: number,
          x: number,
          y: number,
          portion: number,
          refw: number
        },
        cchar: string,
        unit: string,
        workspace: string,
        servid: ObjectId,
        servsecret: string,
        usedquota: number,
        quota: number,
        quotaunit: string,
        status: "approved" | "freezed" | "rejected" | "waiting",
        regdate: number,
        expid: ObjectId,
        role: Array<string>,
        rolecheck: (check:Array<RoleName>) => boolean,
        path: string,
        devmod: boolean,
        userip: string,
        body: any,
        lang,
        noheader,
        full,
        nosupport,
        float,
        code,
        servuid,
        cat,
        nodeenv,
      }
      
}


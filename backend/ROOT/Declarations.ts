import SSRVerify from '../SSRVerify'
import { Prosper } from '../SSRVerify'
import SerialGenerator from '@/frontend/components/qecomps/SerialGenerator'
import schedule from 'node-schedule'
import { ObjectId } from 'mongodb'
import Cacher from '../Cacher'
import '@/common/Prototypes'

export default () => {

    global.workers = []
    global.sss = (arg1, arg2) => arg2 ? console.log(arg1, arg2) : console.log(arg1)
    global.sleep = async ms => await new Promise(r => setTimeout(() => r(null), ms)) as any
    global.fetchv2 = async (input, init) => {
        return await fetch(input, { ...init, redirect: 'manual' })
    }

    Cacher.init();

    String.prototype.betweenxy = function (str1, str2, startindex = 0) {
        const startIndex = this.indexOf(str1, startindex);
        if (startIndex === -1) return '';

        const endIndex = this.indexOf(str2, startIndex + str1.length);
        if (endIndex === -1) return '';

        return this.substring(startIndex + str1.length, endIndex);
    }

    global.cacher = []

    global.MD5 = (data: string | Buffer) => {
        if (typeof data != "string" && !(data instanceof Buffer)) {
            return ""
        }
        const hash = crypto.createHash('md5');
        hash.update(data);
        const hashResult = hash.digest('hex');
        return hashResult;
    }

    global.SHA256 = (data: string | Buffer) => {
        if (typeof data != "string" && !(data instanceof Buffer)) {
            return ""
        }
        const hash = crypto.createHash('sha256');
        hash.update(data);
        const hashResult = hash.digest('hex');
        return hashResult;
    }

    global.Schedule = function (hour?: number, minute?: number, second?: number, cb?): any {
        const rule = new schedule.RecurrenceRule();
        if (hour >= 0) {
            rule.hour = hour;
        }
        if (minute >= 0) {
            rule.minute = minute;
        }
        if (second >= 0) {
            rule.second = second;
        }
        return schedule.scheduleJob(rule, async function () {
            cb();
        })
    }

    global.api = async (url: string, data?: any): Promise<any> => {
        if (data) {
            return await (await fetch(url, { method: "POST", body: JSON.stringify(data) })).json()
        }
        else {
            return await (await fetch(url)).json()
        }
    }

    global.QSON = {
        stringify: (obj) => JSON.stringify(obj),
        parse: (str) => JSON.parse(str)
    }


    global.Round = (number, digits) => {
        if (digits >= 0) {
            return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
        }

        var factor = Math.pow(10, -digits);
        var rounded = Math.round(number / factor) * factor;

        if (digits == -1) {
            return Math.floor(rounded);
        } else {
            return Math.floor(rounded / 10) * 10;
        }
    }

    global.BotUID = new ObjectId('635111afff61db2b04928f45')

    global._srvs = []
    var crypto = require("crypto");
    global.SSRVerify = SSRVerify;//require('../SSRVerify')
    global.Prosper = Prosper;//require('../SSRVerify')
    global.visitors = {}
    global.visitorsM1 = {}
    global.visitorsH1 = {}
    global.visitorsD1 = {}
    global.wrongserialrequests = {}
    global.logcache = []
    global.sessionemailuidmap = {};
    global.expmsgcol = {};
    global.timeoffset = 0;
    if (!global.serialGenerator) {
        global.serialGenerator = SerialGenerator
    }
    global.captchas = {};
    if (!global.fs) {
        global.fs = require('fs')
    }
    if (!global.crypto) {
        global.crypto = crypto
    }
    if (!global.gethash) {
        global.gethash1 = hash => crypto.createHash('md5').update(hash).digest("hex").substr(0, 10)
    }

    if (!global.md5) {
        global.md5 = hash => crypto.createHash('md5').update(hash).digest("hex")
    }


    global.devices = {}

    if (!global.workers) {
        global.workers = []
    }

    global.temp = {}

    global.agent = {};

    global.Datasources = {} as any;

}
import { ObjectId } from "mongodb"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

export default  {
        init:()=>{
            setInterval(()=>{
                global.cacher = global.cacher.filter(it => !(it.date + 900000 < new Date().getTime()))
            }, 900000)
        },
        page:{
            set:(context:GetServerSidePropsContext, uid:ObjectId, pr: any)=>{
                global.cacher.push({ url: context.req.url, uid: (uid || "").toString(), props: pr, date: new Date().getTime() })
            },
            get:(context, uid)=>{
                let cache = global.cacher.find(it => it.url == context.req.url && it.uid == (uid || "").toString())
                if (cache) {
                  return cache.props;
                }
            },
            delete:(uid)=>{
                global.cacher = global.cacher.filter(it => it.uid != (uid||"").toString())
            },
            deleteUrlRegexUID:(uid, regex:RegExp)=>{
                global.cacher = global.cacher.filter(it => !(regex.test(it.url) && it.uid == (uid||"").toString()) ) 
            },
            deleteUrlRegex:(regex:RegExp)=>{
                global.cacher = global.cacher.filter(it => !regex.test(it.url)) 
            }
        }
}

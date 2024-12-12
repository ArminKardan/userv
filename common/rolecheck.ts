import { RoleName } from "@/global"

export default (check:Array<string>, role:Array<string>): boolean=>{
    for(let r of (role || []))
    {
        if((check || []).includes(r as any))
        {
            return true
        }
    }
    return false
}

export const AllRoles:Array<RoleName> = ["admin" , "support" , "bot" ,"comment" , "commenter" , "users" , "workers"
    , "course" , "explore" , "finance" , "journal" , "mentor" , "service" , "tester","stats" ,"service"]

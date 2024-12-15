import rolecheck from "@/common/rolecheck";
import { langType } from "@/common/SiteConfig";
import { RoleName } from "@/global";

const user = (session): UserType => //server session from SSR
{
  if(!session.role)
  {
    session.role = []
  }
  
  return {...session, rolecheck: check => rolecheck(check, session.role)};
}

export type ServiceStatus = "approved" | "rejected" | "waiting" | "freezed" 

export type UserType = {
  uid: string,
  name: string,
  image: string,
  imageprop: { zoom: number, x: number, y: number, portion: number, refw: number },
  lang: langType,
  cchar: string,
  unit: string,
  workspace: string,
  servid: string,
  servsecret: string,
  code: number,
  usedquota: number,
  quota: number,
  cat: string,
  quotaunit: string,
  status: ServiceStatus,
  regdate: number,
  expid: string,
  role: Array<string>,
  rolecheck: (check:Array<RoleName>) => boolean,
  nodeenv: string,
  noheader:boolean,
  devmode: boolean,
  userip: string,
  crossuser:boolean,
  nologin:boolean,
  pageid: string
}

export default user;
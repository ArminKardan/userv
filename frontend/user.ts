import { langType } from "@/common/SiteConfig";

const user = (session): UserType => //server session from SSR
{
  return session;
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
  nodeenv: string,
  noheader:boolean,
  devmode: boolean,
  userip: string,
  pageid: string
}

export default user;
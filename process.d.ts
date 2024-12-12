declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    LINKEDIN_CLIENT_ID: string
    LINKEDIN_CLIENT_SECRET: string
    FACEBOOK_ID: string
    FACEBOOK_SECRET: string
    TWITTER_ID: string
    TWITTER_SECRET: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
    AUTH0_ID: string
    AUTH0_SECRET: string 
    MAINDOMAIN:string
    DOMAIN:string
    URL:string
    CDN:string
    PORT:string
    MAXCDN:string
    WEBSITE:string
    WEBSITE_INTERNAL:string
    WSPORT:number
    PASSCODE:string
    NEXTAUTH_URL:string
    NEXTAUTH_URL_INTERNAL:string
    NEXTAUTH_SECRET:string
    DATABASE_URL:string
    MONGODB_DB:string
    MONGOURL:string
    UMONGOURL:string
    EMAIL_SERVER:string
    EMAIL_FROM:string
    EMAIL_SERVER_USER:string
    EMAIL_SERVER_PASSWORD:string
    EMAIL_SERVER_HOST:string
    EMAIL_SERVER_PORT:number
  }
}

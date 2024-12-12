export default {
    URL: function(){
        if(typeof document != "undefined")
        {
            var link = document.createElement("a");
            link.href = "/";
            let st = link.href;
            st = st.substring(0, st.length - 1);
            return st
        }
        return "/"
    },
    guaranteetypes:[
        {title1:"بدون گارانتی", image:"shield.svg", key:0, bg:"#B1B5A2"},
        {title1:"گارانتی بازگشت وجه یک", image:"shield.svg", key:1},
        {title1:"گارانتی بازگشت وجه دو", image:"shield.svg", key:2},
        {title1:"گارانتی مشاوره", image:"shield.svg", key:3}
    ],
    journaltypes:[
        {
            name:"usersuccess",
            image:"https://cdn.ituring.ir/qepal/results.webp"
        },
        {
            name:"journal",
            image:"https://cdn.ituring.ir/qepal/journal.png"
        },
        {
            name:"tutorial",
            image:"https://cdn.ituring.ir/qepal/tutorial.webp"
        },
    ],
    twostepdepexpire:3600000,
    freezeperday: 15,
    sitefiles:"https://cdn.ituring.ir/qepal",
    defaultFont:"Segoe UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    address:"https://qepal.com",
    whatsapp:"+989178207012",
    whatsappstr:"+98-917-8207012",
    telegram:"qepalcom",
    telegramusername:"qeadmin",
    telegramstr:"@qepalcom",
    instagram:"qepalcom",
    email:"qepalcom@gmail.com",
    phone:"+989178207012",
    phonestr:"+98-917-8207012",
    phoneenabled:true,
    linkedin:"",
    instagramstr:"@qenews",
    youtube:"qepalcom",
    twitter:"qenewss",
    twitterstr:"@qenewss",
    skype:"qepalcom",
    aparat:"qepalcom",
    unlinkjournalwallet:{tether:0.05},
    workers:{
        mt4:{
            link:"https://qeworker.s3.ir-tbz-sh1.arvanstorage.ir/ME.7z",
            path:"./Worker/MT4",
        }
    },
    softwares:{
        qesuite:{
            name:"QE-suite",
            platforms:
            {
                android:
                {
                    key:"android",
                    minos:"Android 7.0 (API 24)",
                    version:1.25,
                    image:"https://cdn.ituring.ir/qepal/apk.svg",
                },
                windows:
                {
                    key:"windows",
                    minos:"Windows 8.1 (x64)",
                    version:2.56,
                    image:"https://cdn.ituring.ir/qepal/win.png",
                },
                macos:
                {
                    key:"macos",
                    minos:"macOS 10.14",
                    version:3.66,
                    image:"https://cdn.ituring.ir/qepal/macos.webp",
                },
                ios:
                {
                    key:"ios",
                    minos:"iOS 8.0",
                    version:1.95,
                    image:"https://cdn.ituring.ir/qepal/ios.svg",
                },
                ubuntu:
                {
                    key:"ubuntu",
                    minos:"Ubuntu v16.25",
                    version:6.18,
                    image:"https://cdn.ituring.ir/qepal/ubuntu.svg",
                },
            }
            
        }
    },

    supportdeps:[
        {
            name:"general",
            image:"https://cdn.ituring.ir/qepal/supporter.svg"
        },
        {
            name:"sell",
            image:"https://cdn.ituring.ir/qepal/supporter.svg"
        }

    ]
}

export type langType = "ar"|"de"|"en"|"es"|"fa"|"fr"|"id"|"ja"|"ko"|"pt"|"ru"|"tr"|"ur"|"zh";
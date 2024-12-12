export default async (props)=>{
    let {devhook, path, version, url, runafter} = props;
    if(devhook && devhook.connected)
    {
        let resp = await devhook.send({
            api:"update",
            path, version, url, runafter
        })
        return resp;
    }
}
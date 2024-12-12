import Cropper from 'react-easy-crop'
import Upload from './Upload'
import { useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
// import Circle from './Circle';
import { SSRGlobal } from './Context';

export default (props) => {
  // var pimage = null

  let z = SSRGlobal()
  var [crp, setCrp] = useState({
    imageSrc: z.user.image || global.cdn("/files/user.svg"),
    prevImage: z.user.image || global.cdn("/files/user.svg"),
    // prevProp: 
    // imageSrc:global.cdn("/files/user.svg"),
    crop: { x: z.user.imageprop?.x || 0, y: z.user.imageprop?.y || 0 },
    zoom: z.user.imageprop?.zoom || 1,
    aspect: z.user.imageprop?.aspect || 1,
    portion: z.user.imageprop?.portion || 1,
    refw: z.user.imageprop?.refw || 1,
  })

  useEffect(() => {
    localStorage.removeItem("uploader-profile-image")
    setCrp({ ...crp })
  }, [])
  var refreshcrp = () => {
    setCrp({ ...crp })
  }
  var onCropChange = (crop) => {
    crp.crop = crop;
    refreshcrp();
  }

  var onCropComplete = (croppedArea, croppedAreaPixels) => {
    // console.log(croppedAreaPixels.width / croppedAreaPixels.height)
  }

  var onZoomChange = (zoom) => {
    crp.zoom = zoom;
    refreshcrp();
  }


  return <>
    <WindowFloat title={z.lang.profilepic} onclose={() => props.onclose?.()}>

      <div style={{ position: "relative", height: 300, width: "100%" }}>
        <Cropper
          key={crp.imageSrc.split('/').pop()}
          image={crp.imageSrc}
          crop={crp.crop}
          zoom={crp.zoom}
          aspect={crp.aspect}
          cropShape="round"
          showGrid={true}
          onMediaLoaded={(media) => {
            crp.portion = media.naturalWidth / media.naturalHeight
            crp.refw = media.width,
              refreshcrp();
          }}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>


      <Upload
        id={"profile-image"}
        extensionfilter={[".jpg", ".png", '.jpeg', '.svg', '.webp']}
        // state={[pimage]}
        singlefile={true}
        maxsize={150000}
        on={(st) => {
          if (st.length == 0) return
          if (st[0].percent < 100) {
            crp.imageSrc = global.cdn("/files/picload.svg");
            refreshcrp();
          }
          else {
            setTimeout(() => {
              crp.imageSrc = st[0].url;
              refreshcrp()
            }, 2000);
          }

          // global.uploaders["profile-image"].clear()
        }}
      />


      <br-x />
      <f-cc class={z.qestyles.btncancel} style={{ flex: 1, backgroundColor: "#67b2d5" }} onClick={() => {
        global.uploaders["profile-image"].open()
      }}>
        {z.lang.uploadnewpic}
      </f-cc>
      <br-xx />
      <f-cc class={z.qestyles.btnaccept} style={{ flex: 1 }} onClick={async () => {
        if (!crp.imageSrc) {
          alerter("there is no image to send.");
          return;
        }

        let json = await API["user/profilepic"]({
          url: crp.imageSrc,
          zoom: crp.zoom,
          x: crp.crop.x,
          y: crp.crop.y,
          portion: crp.portion,
          refw: crp.refw,
        })
        // let json = await (await fetch('/api/user/profilepic', {
        //   method: "POST",
        //   body: JSON.stringify({

        //   })
        // })).json()

        if (json.code == 0) {
          localStorage.removeItem("uploader-profile-image")
          window.location.reload();
          props.onclose?.()

        }
        else {
          alerter(JSON.stringify(json))
        }
      }}>
        {z.lang.confirm}
      </f-cc>

      {/* <f-cc class={z.qestyles.btncancel}  style={{width:"100%"}} onClick={()=>{
      functions.open();
    }}>
      <f-cc>
        <img src ={global.cdn("/files/upload.svg")} alt="received transaction count" style={{width:20, height:20}}/> 
      &nbsp;&nbsp;<span style={{color:"#452700"}}>{z.lang.upload}</span></f-cc>
    </f-cc> */}

      <br-x />
    </WindowFloat>
  </>
}
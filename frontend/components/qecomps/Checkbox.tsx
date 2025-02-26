import { CSSProperties } from "react";
import { SSRGlobal } from "./Context";

export default (props: {
  on: (checked: boolean) => void, color?: string, defaultChecked?: boolean
}) => {


  let color = 'rgb(186, 164, 116)'
  if (props.color) {
    color = props.color
  }
  let z = SSRGlobal()
  let uid = Math.floor(Math.random() * 1000);
  return <div style={{ maxWidth: 20, maxHeight: 20 }}>

    <style jsx>
      {`
  .checkbox * {
    box-sizing: border-box;
  }
  
  .checkbox .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 1px 1px;
    border-radius: 6px;
    overflow: hidden;
    vertical-align: middle;
    transition: all 0.2s ease;
    display: inline-block;
  }
  
  .checkbox .cbx:hover {
    background: rgba(0, 119, 255, 0.06);
  }
  
  .checkbox .cbx span {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  
  .checkbox .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
  }
  
  .checkbox .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  
  .checkbox .cbx span:last-child {
    padding-left: 8px;
    line-height: 18px;
  }
  
  .checkbox .cbx:hover span:first-child {
    border-color: ${color};
  }
  
  .checkbox .inpcbx {
    position: absolute;
    visibility: hidden;
  }
  
  .checkbox .inpcbx:checked+.cbx span:first-child {
    background: ${color};
    border-color: ${color};
    animation: wave-4 0.4s ease;
  }
  
  .checkbox .inpcbx:checked+.cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  
  .checkbox .inlinesvg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
  
  @media screen and (max-width: 640px) {
    .checkbox .cbx {
      width: 100%;
      display: inline-block;
    }
  }
    `}
    </style>


    <div className={"checkbox"}>
      <input className={"inpcbx"} defaultChecked={props.defaultChecked}
        id={`chk-${uid}`} type="checkbox" onChange={(e) => {
          props.on?.(e.target.checked)
        }} autoComplete="off" />
      <label className={"cbx"} htmlFor={`chk-${uid}`}><span>
        <svg width="12px" height="10px">
          <use href={`#check-${uid}`}></use>
        </svg></span></label>

      <svg className={z.qestyles.inlinesvg}>
        <symbol id={`check-${uid}`} className="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  </div>
}
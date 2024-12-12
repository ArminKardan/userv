import { SSRGlobal } from "../Context";
import Icon2Titles from "../Icon2Titles";
import WindowFloat from "../WindowFloat";

export default (props: { on: (walleykey: string) => void, onclose?: () => void }) => {
    let z = SSRGlobal()

    return <WindowFloat title={z.lang.yourwallets} onclose={() => { props.onclose?.() }}>
        <p>{z.lang.selectwallet}</p>
        {Object.values(z.user.wallets).map(wallet=>{
            return <Icon2Titles
            nobold
            style={{ backgroundColor: "#D3EECA8E", margin: "2px 3px" }}
            title1={wallet.name}
            title2={<f-11>{"موجودی: " + (wallet.balance || 0).toLocaleString(z.lang.region)}</f-11>}
            icon={wallet.image}
            on={() => { props.on?.(wallet.key) }}
        />
        })}
    </WindowFloat>
}
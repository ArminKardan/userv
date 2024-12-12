import WindowFloat from './WindowFloat';
import Icon2Titles from './Icon2Titles';
import { SSRGlobal } from './Context';

export default (props) => {

  let z = SSRGlobal()
  return <WindowFloat title={z.lang.selectwallet} onclose={() => { props.onclose?.() }}>
    {Object.keys(z.user.wallets).map(k => {
      if (!z.user.wallets[k].donations || z.user.wallets[k].donations.length == 0) {
        return null;
      }
      let wallet = z.user.wallets[k];
      let unit = wallet.unit;
      let amount = unit.tolocalstr(wallet?.balance);
      return <Icon2Titles
        style={{ backgroundColor: props.current == k ? "#d6deb3" : "#e9d8b9", marginBottom: 3 }}
        title1={wallet.name}
        title2={z.lang.balance + ": " + amount + " " + unit.name}
        image={wallet?.image}
        on={() => { props.on?.(k) }}
      />
    })}

  </WindowFloat>
}
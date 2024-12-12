import WindowFloat from './WindowFloat'
import Bold from './Bold'
import { SSRGlobal } from './Context'

export default (props) => {
    let z = SSRGlobal()
    if (z.lang.code == "en") {
        return <WindowFloat title={z.lang.whyfee} onclose={() => { props.onclose?.() }}
            maxWidth="25rem" z={400} wz={500} >
            <p>
            The commissions you see in the system are awarded to those Active in 
            <a>network expansion project </a>
            and the payment information of commissions in full and transparently in Transactions are visible.
             Did you know that by participating in the network expansion project,
              Your fees will be <Bold>completely free</Bold> and can you even <Bold style={{color:"green"}}>earn money </Bold> this way?
            </p>
            <br />

            <f-cc class={z.qestyles.btnaccept} onClick={() => { props.onclose?.() }}>{z.lang.close}</f-cc>
            <br-xx />
        </WindowFloat>
    }
    else if (z.lang.code == "fa") {
        return <WindowFloat title={z.lang.whyfee} onclose={() => { props.onclose?.() }}
            maxWidth="25rem" z={400} wz={500} >
            <p>
                کمیسیون هایی که در سیستم میبینید به کسانی تعلق میگیرد
                که در
                
                <a>پروژه ی گسترش شبکه</a>
                &nbsp;
                فعالیت دارد
                و اطلاعات پرداخت کمیسیون ها به طور  کامل و شفاف در
                تراکنش ها قابل مشاهده میباشد.
                &nbsp;
                <br-x />
                
                آیا میدانستید که با شرکت کردن در پروژه گسترش شبکه،
                &nbsp;
                <Bold>
                    کارمزد های شما کاملا رایگان شده
                </Bold>
                &nbsp;
                و حتی میتوانید از این
                &nbsp;
                <Bold>
                    راه کسب در آمد
                </Bold>
                &nbsp;
                نمایید؟

            </p>
            <br />

            <f-cc class={z.qestyles.btnaccept} onClick={() => { props.onclose?.() }}>{z.lang.close}</f-cc>
            <br-xx />
        </WindowFloat>
    }

}
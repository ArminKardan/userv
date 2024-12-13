import { useEffect, useState } from "react";
import LWChart from '@/frontend/components/qecomps/LWChart';

import Component, { PageEl } from '@/frontend/components/qecomps/Component'
export default p => Component(p, Page);
const Page: PageEl = (props, refresh, getProps, dies, z): React.JSX.Element => {
  
  let idx = "charter_" + (props.id || "")
  let [elements, setElements] = useState<any>({});
  // let elements = {}

  useEffect(() => {
    if (typeof window != "undefined") {
      let parent = document.getElementById(idx)

      props.functions.setData = (data) => {
        let newdata = data.map(o => {
          let { time, ...rest } = o;
          return { time: time - new Date().getTimezoneOffset() * 60, ...rest }
        })
        elements.line?.setData(newdata);
        elements.chart?.timeScale()?.fitContent();
        elements.chart?.priceScale('right')?.applyOptions({
          autoScale:true
        });
      }
      props.functions.update = (data) => {
        let { time, ...rest } = data;
        elements.line?.update({ time: data.time + new Date().getTimezoneOffset() * 60, ...rest })
      }


      props.functions.AddLine = (name, data) => {
        elements.armin = elements.chart.addLineSeries(
          {
            lineStyle: 0,
            lineWidth: 1.2
          }
        )

        let newdata = data.map(o => {
          let { time, ...rest } = o;
          return { time: time - new Date().getTimezoneOffset() * 60, ...rest }
        })
        elements.armin?.setData(newdata);
        elements.chart?.timeScale()?.fitContent();
        elements.chart?.priceScale('right')?.applyOptions({
          autoScale:true
        });
      }

      props.functions.RemoveElement = (name) => {
        elements.armin?.remove()
        elements.chart?.timeScale()?.fitContent();
        elements.chart?.priceScale('right')?.applyOptions({
          autoScale:true
        });
      }

      if (parent && parent.innerHTML == "") {
        var charter = LWChart();

        elements.chart = charter.createChart(parent, {
          layout: {
            backgroundColor: '#f1e3cf',
            textColor: 'black',
          },
          timeScale: {
            borderColor: "rgba(197, 203, 206, 0.8)",
            timeVisible: true,
            secondsVisible: false,
          },
        });
        if (props.type == "candle") {
          elements.line = elements.chart.addCandlestickSeries();
        }
        else if (props.type == "bar") {
          elements.line = elements.chart.addBarSeries();
        }
        else {
          elements.line = elements.chart.addLineSeries(
            {
              lineStyle: 0,
              lineWidth: 1.2
            }
          )
        }

        // elements.line.createPriceLine({
        //   price: 10,
        //   color: '#a8793d88',
        //   lineWidth: 50,
        //   opacity:0.5,
        //   lineStyle: 0,
        //   axisLabelVisible: true,
        //   title: 'average price',
        // })


        // chart.subscribeClick((obj)=>{
        //   console.log(obj)
        // })


        elements.chart.timeScale().fitContent();
        if (window.attachEvent) {
          window.attachEvent('onresize', function () {
            elements.chart.applyOptions({
              width: parent.offsetWidth,
              height: parent.offsetHeight
            });
            elements.chart.timeScale().fitContent();
          });
        }
        else if (window.addEventListener) {
          window.addEventListener('resize', function () {
            elements.chart.applyOptions({
              width: parent.offsetWidth,
              height: parent.offsetHeight
            });
            elements.chart.timeScale().fitContent();
          }, true);
        }
      }
      if (!elements.done) {
        elements.done = true
        setElements(elements)
      }

    }

  })

  return <c-x>
    <div id={idx} style={{ ...props.style }}></div>
  </c-x>
}
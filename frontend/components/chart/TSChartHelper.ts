import { useEffect, useState } from "react";
import {
  ColorType,
  IChartApi, ISeriesApi, LineData, createChart,
  PriceScaleMode,
  LineStyle,
  LineStyleOptions,
  SeriesOptionsCommon,
  DeepPartial,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  ChartOptions
} from '@/frontend/components/qecomps/LightweightChart/types';
import { SSRGlobal } from "../qecomps/Context";

// require.resolve('qecomps/LightweightChart/production.cjs')

// import chart from '@/frontend/components/qecomps/LightweightChart/production.js'
// import dynamic from 'next/dynamic';
// const charter = dynamic(() => import('qecomps/LightweightChart/production').then(x=>x.default), { ssr: false })

export namespace TSChartHelper {
  export type CData = Array<{ time: number | string, value: number }> |
    Array<{ time: number | string, high: number, low: number, close: number, open: number, volume?: number }>


  export function DataConvert(data: CData): CData {
    return data.map(o => {
      let { time, ...rest } = o;
      return { time: time - new Date().getTimezoneOffset() * 60, ...rest }
    })
  }

  export async function InitChart(el: HTMLElement, config?: DeepPartial<ChartOptions>): Promise<IChartApi> {
    let z = SSRGlobal()
    //  enum ColorType {
    //     /** Solid color */
    //     Solid = "solid",
    //     /** Vertical gradient color */
    //     VerticalGradient = "gradient"
    //   }

    // console.log("COLOR tYPE IS:",charter)
    let charter = await import('@/frontend/components/qecomps/LightweightChart/production.js')

    return charter.createChart(el,
      config || {
        layout: {
          background: { type: ColorType.Solid, color: '#EFE5D8' },
          textColor: 'black',
          fontFamily: z.lang.ff
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
          timeVisible: true,
          secondsVisible: true
        },

      }
    )
  }

  export function Fit(chart: IChartApi) {
    let z = SSRGlobal()
    // let fraction = 0;
    // if(floatingpoint)
    let region = global.ChartRegion || z.lang.region;
    chart?.applyOptions({
      localization: {
        // priceFormatter: (price) => price.toLocaleString(z.lang.region, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
        priceFormatter: (price) => price.toLocaleString(region),
        timeFormatter: (time) => {
          if (typeof time == "number")
            return new Date(time * 1000 + (60000 * new Date().getTimezoneOffset())).toLocaleString(region)
          else if (typeof time == "string") {
            let sp = time.split("-")
            if (sp.length == 3) {
              let date = new Date(Number(sp[0]), Number(sp[1]), Number(sp[2])).getTime() / 1000;
              return new Date(date * 1000 + (60000 * new Date().getTimezoneOffset())).toLocaleString(region)
            }
          }
        },
        locale: 'fa-IR'
      }
    })
    chart?.timeScale()?.fitContent();

    chart?.priceScale('right')?.applyOptions({
      autoScale: true
    });
  }

  export function AddLine(chart: IChartApi, data: CData, option?: DeepPartial<LineStyleOptions & SeriesOptionsCommon>):
    ISeriesApi<"Line"> {

    let opts: DeepPartial<LineStyleOptions & SeriesOptionsCommon> = {
      lineStyle: LineStyle.Solid,
      lineWidth: 1,
      color: "green",
      priceLineVisible: false,
      priceScaleId: 'right',
    }
    if (option) {
      opts = { ...opts, ...option }
    }

    let line = chart?.addLineSeries(opts)
    line.setData(data as LineData[])
    Fit(chart);
    return line;
  }

  export function AddMarker(line: ISeriesApi<any>, data: Array<{
    time: number[], color: string,
    position: SeriesMarkerPosition, shape: SeriesMarkerShape
  }>): void {

    let feed: any = [];
    data.forEach(d => {
      feed.push(...d.time.map(t => {
        return {
          time: t,
          position: d.position,
          color: d.color,
          shape: d.shape
        }
      }))
    })

    feed.sort((a, b) => a.time - b.time)
    line.setMarkers(feed)
  }




  export function AddBar(chart: IChartApi, data: CData): ISeriesApi<"Bar"> {
    let line = chart?.addBarSeries({
      // lineStyle: 0,
    })
    line.setData(data as LineData[])
    Fit(chart);
    return line;
  }

  export function AddCandlestick(chart: IChartApi, data: CData, floatingpoint?: number): ISeriesApi<"Candlestick"> {
    let line = chart?.addCandlestickSeries()
    line.setData(data as LineData[])
    Fit(chart);
    return line;
  }

  export function Update(line: ISeriesApi<any>, data: any) {
    line.update(data);
  }
}


// useEffect(() => {
//   if (typeof window != "undefined") {
//     let parent = document.getElementById(idx)

//     props.functions.setData = (data) => {
//       let newdata = data.map(o => {
//         let { time, ...rest } = o;
//         return { time: time - new Date().getTimezoneOffset() * 60, ...rest }
//       })
//       elements.line?.setData(newdata);
//       elements.chart?.timeScale()?.fitContent();
//       elements.chart?.priceScale('right')?.applyOptions({
//         autoScale:true
//       });
//     }
//     props.functions.update = (data) => {
//       let { time, ...rest } = data;
//       elements.line?.update({ time: data.time + new Date().getTimezoneOffset() * 60, ...rest })
//     }


//     props.functions.AddLine = (name, data) => {
//       elements.armin = elements.chart.addLineSeries(
//         {
//           lineStyle: 0,
//           lineWidth: 1.2
//         }
//       )

//       let newdata = data.map(o => {
//         let { time, ...rest } = o;
//         return { time: time - new Date().getTimezoneOffset() * 60, ...rest }
//       })
//       elements.armin?.setData(newdata);
//       elements.chart?.timeScale()?.fitContent();
//       elements.chart?.priceScale('right')?.applyOptions({
//         autoScale:true
//       });
//     }

//     props.functions.RemoveElement = (name) => {
//       elements.armin?.remove()
//       elements.chart?.timeScale()?.fitContent();
//       elements.chart?.priceScale('right')?.applyOptions({
//         autoScale:true
//       });
//     }

//     if (parent && parent.innerHTML == "") {
//       var charter = LWChart();

//       elements.chart = charter.createChart(parent, {
//         layout: {
//           backgroundColor: '#f1e3cf',
//           textColor: 'black',
//         },
//         timeScale: {
//           borderColor: "rgba(197, 203, 206, 0.8)",
//           timeVisible: true,
//           secondsVisible: false,
//         },
//       });
//       if (props.type == "candle") {
//         elements.line = elements.chart.addCandlestickSeries();
//       }
//       else if (props.type == "bar") {
//         elements.line = elements.chart.addBarSeries();
//       }
//       else {
//         elements.line = elements.chart.addLineSeries(
//           {
//             lineStyle: 0,
//             lineWidth: 1.2
//           }
//         )
//       }

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


//     elements.chart.timeScale().fitContent();
//     if (window.attachEvent) {
//       window.attachEvent('onresize', function () {
//         elements.chart.applyOptions({
//           width: parent.offsetWidth,
//           height: parent.offsetHeight
//         });
//         elements.chart.timeScale().fitContent();
//       });
//     }
//     else if (window.addEventListener) {
//       window.addEventListener('resize', function () {
//         elements.chart.applyOptions({
//           width: parent.offsetWidth,
//           height: parent.offsetHeight
//         });
//         elements.chart.timeScale().fitContent();
//       }, true);
//     }
//   }
//   if (!elements.done) {
//     elements.done = true
//     setElements(elements)
//   }

// }

// })

// return <c-x>
//   <div id={idx} style={{ ...props.style }}></div>
// </c-x>
// }
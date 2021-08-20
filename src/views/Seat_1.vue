<template>
  <div style="width: 100%;height: 100%">
    <div id="myChart" style="width: 100%;height: 100%"></div>
    <seat-edit v-if="addOrUpdateVisible" ref="addOrUpdate"></seat-edit>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from "axios"
import SeatEdit from "@/components/seat-edit";
import {getRgbColorArray} from '@/common/utils'

var myChart;
export default {
  name: 'seat',
  components: {SeatEdit},
  data() {
    return {
      addOrUpdateVisible: false,
      documentClientHeight: 0,
      chart: null,
      baseColors: ['#91cc75', '#5470c6', '#fac858', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      areaMap: [],
      colorArray: [],
      crossMap: {
        '1跨': 'H14/1',
        '2跨': 'H14/2',
        '3跨': 'H14/3'
      },
      names: [],
      boundOffset: 2500,
      loadOption: {
        text: '拼命加载中',
        maskColor: 'rgba(255,255,255,.9)',
        spinnerRadius: 13,
        lineWidth: 5
      },
      axisConfig: {
        type: 'value',
        // axisTick: {show: false},
        // axisLabel: {show: false},
        // splitLine: {show: false},
        axisLine: {
          lineStyle: {
            color: '#c6c0c0',
            type: 'dashed'
          }
        }
      }
    }
  },
  watch: {
    $route() {
      myChart = undefined
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    init() {
      this.resetDocumentClientHeight()
      myChart = echarts.init(document.getElementById('myChart'))
      this.resizeChart()
      this.addListener()
      this.getChartData()
    },
    getChartData() {
      myChart.showLoading(this.loadOption)
      axios.get("/seat/list").then(data => {
        if (data && data.status === 200 && data.data) {
          this.renderChart(data.data)
        } else {
          myChart.hideLoading()
        }
      }).catch(e => {
        myChart.hideLoading()
      })
    },
    getChartOption(series, categories, colorArray) {
      return {
        color: colorArray,
        grid: {left: 20, top: 50, bottom: 30, right: 100},
        xAxis: [{
          type: 'value',
          // axisTick: {show: false},
          // axisLabel: {show: false},
          // splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#c6c0c0',
              type: 'dashed'
            }
          },
          position: 'bottom'
        },
        {
          type: 'value',
          // axisTick: {show: false},
          // axisLabel: {show: false},
          // splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#c6c0c0',
              type: 'dashed'
            }
          },
          inverse: true,
          position: 'top'
        }],
        yAxis: [{
          type: 'value',
          max: 20000,
          min: 0,
          // axisTick: {show: false},
          // axisLabel: {show: false},
          // splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#c6c0c0',
              type: 'dashed'
            }
          },
          position: 'left'
        }, {
          type: 'value',
          // axisTick: {show: false},
          // axisLabel: {show: false},
          // splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#c6c0c0',
              type: 'dashed'
            }
          },
          min: 20000,
          inverse: true,
          position: 'right'
        }, {
          type: 'value',
          // axisTick: {show: false},
          // axisLabel: {show: false},
          // splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#c6c0c0',
              type: 'dashed'
            }
          },
          inverse: true,
          position: 'right'
        }],
        brush: {
          toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'clear'],
          xAxisIndex: 0,
          throttleType: 'debounce',
          throttleDelay: 1000
        },
        toolbox: {
          itemSize: 25,
          left: 'center',
          feature: {
            myRefreshTool: {
              title: '刷新',
              icon: 'M3.8,33.4 M47,18.9h9.8V8.7 M56.3,20.1 C52.1,9,40.5,0.6,26.8,2.1C12.6,3.7,1.6,16.2,2.1,30.6 M13,41.1H3.1v10.2 M3.7,39.9c4.2,11.1,15.8,19.5,29.5,18 c14.2-1.6,25.2-14.1,24.7-28.5',
              onclick: () => {
                this.getChartData()
                myChart.dispatchAction({
                  type: 'restore'
                })
              }
            }
          }
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          right: 0,
          data: this.names
        },
        tooltip: { position: 'top', formatter: function (params) { return params.data[3] }
        },
        dataZoom: [ { type: 'inside', xAxisIndex: [0, 1], filterMode: 'none' },
                    { type: 'inside', yAxisIndex: [0, 1, 2], filterMode: 'none' } ],
        series: series
      };
    },
    addToListMap(map, key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    renderChart(data) {
      if (data) {
        let areaMap = new Map() // key areaId; value [x坐标，y坐标]
        let idNameMap = new Map() // key areaId; value areaName
        let seriesDataMap = new Map()  // key 跨名称; value 点数据list
        for (let key in data) {
            let crossList = data[key]
            if (crossList && crossList.length > 0) {
              crossList.forEach(e => {
                let areaName = e.areaName ? e.areaName : '无区域'
                let areaId = e.areaId ? e.areaId : 999
                let a = [e.deviceX, e.deviceY, areaName, e.deviceName, e.id]
                idNameMap.set(areaId, areaName)
                this.addToListMap(seriesDataMap, key, a)
                this.addToListMap(areaMap, areaId, [e.deviceX, e.deviceY])
              })
            }
        }
        let names = Array.from(areaMap.keys()).sort().map(e => idNameMap.get(e))
        let colorArray = getRgbColorArray(this.baseColors, names.length-1)
        // 最后一位设为灰色
        colorArray.push('#f1eaea')
        this.areaMap = areaMap
        this.colorArray = colorArray
        this.names = names
        let finalSeries = this.getFinalSeries(areaMap, idNameMap, seriesDataMap)
        let option = this.getChartOption(finalSeries, names, colorArray)
        myChart.setOption(option)
      }
      myChart.hideLoading()
    },
    getFinalSeries(areaMap, idNameMap, seriesDataMap) {
      let customSeries = this.getCustomSeriesFromMap(areaMap, idNameMap)
      let chartSeries = [
      {
        symbolSize: 7,
        symbol: 'roundRect',
        type: 'scatter',
        data: seriesDataMap.get(this.crossMap['3跨']),
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: '#d9d5d5'
        }
      },
      {
        symbolSize: 7,
        symbol: 'roundRect',
        type: 'scatter',
        data: seriesDataMap.get(this.crossMap['2跨']),
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#d9d5d5'
        }
      },
      {
        symbolSize: 7,
        symbol: 'roundRect',
        type: 'scatter',
        data: seriesDataMap.get(this.crossMap['1跨']),
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: '#d9d5d5'
        }
      }]
      return chartSeries.concat(customSeries)
    },
    getCustomSeriesFromMap(areaMap = new Map(), idNameMap) {
      let series = []
      for (let key of areaMap.keys()) {
        series.push({
          type: 'custom',
          name: idNameMap.get(key),
          renderItem: this.renderBoundary,
          animationDuration: 3000,
          silent: true,
          clip: true,
          data: [[key]]
        })
      }
      return series
    },
    renderBoundary(params, api) {
      if (api.value(0) >= 0) {
        let rectResult = this.getRectPoints(this.areaMap.get(api.value(0)), api.coord)
        return {
          type: 'polygon',
          shape: {
            points: rectResult[0],
          },
          textContent: {
            type: 'text',
            style: {
              text: params.seriesName,
              fontFamily: 'Arial',
              fontSize: 14,
              overflow: 'truncate',
              textAlign: 'center',
              textVerticalAlign: 'top'
            }
          },
          textConfig: {
            position: 'inside',
            insideFill: '#000'
          },
          style: {
            stroke: '#fff',
            color: '#000',
            fill: this.colorArray[params.seriesIndex - 1],
            lineWidth: 1,
            focus: 'self'
          }
        }
      }
    },
    // 返回 4个角的坐标 和 x轴宽度
    getRectPoints(source, cord) {
      let xMax, xMin, yMax, yMin;
      xMax = xMin = source[0][0];
      yMax = yMin = source[0][1]
      source.forEach(e => {
        xMax = Math.max(xMax, e[0])
        yMax = Math.max(yMax, e[1])
        xMin = Math.min(xMin, e[0])
        yMin = Math.min(yMin, e[1])
      })
      let points = this.getOffsetPointsData(xMin, yMin, xMax, yMax, this.boundOffset).map(cord)
      return [points, points[2][0] - points[0][0]]
    },
    getOffsetPointsData(xMin, yMin, xMax, yMax, offset) {
      let yOffset = offset / 2
      xMin -= offset
      yMin -= yOffset
      xMax += offset
      yMax += yOffset
      return [[xMin, yMin], [xMin, yMax], [xMax, yMax], [xMax, yMin]]
    },
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement['clientHeight']
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight']
      }
    },
    resizeChart () {
      if (myChart) myChart.resize()
    },
    addListener () {
      window.addEventListener('resize', () => {
        this.resizeChart()
      })
      myChart.on('brushSelected', (params) => {
        let indexArr = params.batch[0].selected[0].dataIndex;
        if (indexArr.length > 0) {
          let source = myChart.getOption().series[0].data
          let idList = []
          indexArr.forEach(e => {
            idList.push(source[e][4])
          })
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(idList)
          })
        }
      })
    }
  }
}
</script>

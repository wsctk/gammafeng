<template>
    <div>
      <div class="rowTitle"><i class="el-icon-s-data"></i><span>数据概览</span></div>
      <el-card class="cardchart card1">
        <div class="chart1 chart">
          <div class="selectbox">
            <el-select v-model="userDateValue" @change='userDateChange'>
              <el-option
                v-for="item in userDate"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class='showDate' v-if='userDateValue===2'>
               <el-date-picker
                    @change='shwoDateChange'
                    v-model="pickedUserDate"
                    type="daterange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
          </div>
          <div class='showDateNumber' v-else>{{dateBefore}} - {{date}}</div>
          <div class='explain'>未显示的日期表示没有新增人数</div>
        </div>
        <div id="echarts" class="echarts" style="width:900px; height:500px;"></div>
      </el-card>
      <el-card class="cardchart">
        <div id="echarts1" class="echarts" style="width:900px; height:500px;"></div>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      userDate: [
        {
          value: 0,
          label: '最近7天'
        }, {
          value: 1,
          label: '最近30天'
        }, {
          value: 2,
          label: '自定义选择'
        }
      ],
      userDateValue: 0,
      addedUserList: [120, 200, 150, 80, 70, 110, 130],
      addedUserDate: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      userMax: 10,
      userStep: 2,
      date: '',
      now: 0,
      dateBeforeTime: 0,
      dateBefore: '',
      pickedUserDate: [],
      userScaleList: [
        { value: 120, name: '普通用户' },
        { value: 5, name: '飞手' },
        { value: 15, name: '农资商' }
      ]
    }
  },
  created () {
    this.getScaleAmount()
    this.userDateChange()
  },
  methods: {
    async getUserAmount () {
      const msg = await this.$http.post('user/userAmount', this.$qs.stringify({ startTime: this.dateBeforeTime, endTime: this.now }))
      if (msg.data.data.length === 0) {
        return this.$message.error('当前时间段没有新增用户！')
      }
      this.addedUserList = []
      this.addedUserDate = []
      for (const item of msg.data.data) {
        this.addedUserList.push(item.amount)
        this.addedUserDate.push(item.date)
      }
      this.userMax = Math.max(...this.addedUserList)
      this.userStep = Math.floor(this.userMax / 5)
      this.drawLine()
    },
    async getScaleAmount () {
      const msg = await this.$http.get('user/userStatusAmount')
      this.userScaleList = []
      for (const item of msg.data.data) {
        item.value = item.amount
        switch (item.user_status) {
          case '0':
            item.name = '普通用户'
            break
          case '1':
            item.name = '飞手'
            break
          case '2':
            item.name = '农资商'
            break
        }
      }
      this.userScaleList = msg.data.data
      this.drawLine1()
    },
    drawLine () {
      const myChart = echarts.init(document.getElementById('echarts'))
      myChart.setOption({
        title: { text: '新增用户数', top: 10, left: 30 },
        legend: {
          top: 20,
          data: ['新增用户数']
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {c}'
        },
        xAxis: {
          type: 'category',
          data: this.addedUserDate
        },
        yAxis: [{
          type: 'value',
          min: 0,
          max: this.userMax,
          interval: this.userStep
        }],
        series: [
          {
            name: '新增用户数',
            data: this.addedUserList,
            type: 'bar',
            yAxisIndex: 0,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }
        ]
      })
    },
    drawLine1 () {
      const myChart = echarts.init(document.getElementById('echarts1'))
      myChart.setOption({
        title: {
          text: '用户组成',
          top: 10,
          left: 30
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['普通用户', '飞手', '农资商']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        series: [
          {
            name: '用户比例',
            type: 'pie',
            radius: [30, 110],
            roseType: 'radius',
            data: this.userScaleList
          }
        ]
      })
    },
    dateTransform (date) {
      const dt = new Date(date)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      return `${y}年${m}月${d}日`
    },
    userDateChange (check) {
      const now = (new Date()).valueOf()
      this.now = now
      this.date = this.dateTransform(now)
      var sevenday = now - 604800000
      this.dateBeforeTime = sevenday
      this.dateBefore = this.dateTransform(sevenday)
      switch (check) {
        case 0:
          var sevendays = now - 604800000
          this.dateBeforeTime = sevendays
          this.dateBefore = this.dateTransform(sevendays)
          break
        case 1:
          var thirtyday = now - 2592000000
          this.dateBeforeTime = thirtyday
          this.dateBefore = this.dateTransform(thirtyday)
          break
      }
      if (check === 2) {
        return 2
      }
      this.getUserAmount()
    },
    async shwoDateChange (check) {
      const msg = await this.$http.post('user/userAmount', this.$qs.stringify({ startTime: check[0], endTime: check[1] }))
      if (msg.data.data.length === 0) {
        return this.$message.error('当前时间段没有新增用户！')
      }
      this.addedUserList = []
      this.addedUserDate = []
      for (const item of msg.data.data) {
        this.addedUserList.push(item.amount)
        this.addedUserDate.push(item.date)
      }
      this.userMax = Math.max(...this.addedUserList)
      this.userStep = Math.floor(this.userMax / 5)
      this.drawLine()
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-input__inner::-webkit-input-placeholder {
    color:#606266;
  }
  .rowTitle {
    line-height:30px;
    font-size: 16px;
    font-weight: 700;
    color: #f89213;
    padding-left: 30px;
    span {
      padding-left:6px;
    }
  }
  .cardchart {
    margin:30px;
  }
  .cardchart.card1 {
    margin-top:0;
  }
  .selectbox {
    display:inline-block;
  }
  .showDateNumber {
    display:inline-block;
    margin-left: 20px;
  }
  .showDate {
    margin-left: 20px;
    display: inline-block;
  }
  .explain {
    margin:10px 20px;
    color:#40acdf !important;
  }
</style>

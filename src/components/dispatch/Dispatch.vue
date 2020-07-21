<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>派单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">派单管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户手机号" class="firInput" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber" @keydown.enter.native="queryInfomation"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderState">
          <el-select placeholder="请选择" v-model="queryInfo.orderState" @keydown.enter.native="queryInfomation">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="待指派" value="1"></el-option>
            <el-option label="待服务" value="2"></el-option>
            <el-option label="待确认" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="queryInfomation">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="订单ID" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="wechat_name" label="联系人姓名" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="phone_number" label="联系人手机号码" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="demand_mu" label="需求亩数" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="service_time" label="预约时间" min-width="200px" v-slot="scope">
              {{ scope.row.service_time}}
          </el-table-column>
          <el-table-column align="center" prop="service_location" label="飞防地址" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="note" label="备注" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="order_amount" label="订单金额(元)" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="pay_time" label="付款时间" min-width="200px" v-slot="scope">
              {{ scope.row.pay_time}}
          </el-table-column>
          <el-table-column align="center" prop="feishou_name" label="服务飞手" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="order_state_name" label="订单状态" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="create_time" label="创建时间" min-width="200px" v-slot="scope">
              {{ scope.row.create_time}}
          </el-table-column>
          <el-table-column align="center" prop="process_time" label="处理时间" min-width="200px" v-slot="scope">
              {{ scope.row.process_time}}
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="240px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="showdetails(scope.row)">详情</el-button>
              <el-button plain size="small" type="primary" @click="showAppoint(scope.row)">转派</el-button>
              <el-button plain size="small" type="warning" @click="showorderconfirm(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-pagination
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[5, 7, 10, 20]"
      :page-size="pageSize"
      :page-count="11"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="订单详情" :visible.sync="dialogVisible2" width="900px" @close="closeform">
      <el-form label-width="170px" :model="details" ref="editFormRef" label-position="right">
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单ID：">
              <el-input v-model="details.id" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人姓名：">
              <el-input v-model="details.wechat_name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系人手机号码：">
             <el-input v-model="details.phone_number" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="需求亩数：">
              <el-input v-model="details.demand_mu" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="预约时间：">
              <el-input v-model="details.service_time" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="飞防地址：">
              <el-input v-model="details.service_location" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="备注：">
              <el-input v-model="details.note" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="订单金额(元)：">
              <el-input v-model="details.order_amount" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="付款时间：">
              <el-input v-model="details.pay_time" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="服务飞手：">
              <el-input v-model="details.feishou_name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单状态：">
              <el-input v-model="details.order_state_name" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="创建时间：">
              <el-input v-model="details.create_time" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="处理时间：">
              <el-input v-model="details.process_time" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="5" v-for="item in confirmimgs" :key="item.id">
          <el-card>
            <el-image
              style="width: 65px; height: 65px"
              :src="item.pic1"
              :preview-src-list="[item.pic1]">
            </el-image>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="飞防地址：">
            <el-input v-model="details.service_location" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <div class="amap-page-container">
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
          <el-amap-marker vid="component-marker" :position="mapCenter"></el-amap-marker>
        </el-amap>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加飞手" :visible.sync="dialogVisible" width="30%" @close="picked=''">
      <el-row>
        <el-col :span="20" :offset="3">
          <el-select v-model="picked" filterable placeholder="请选择">
            <el-option
              v-for="item in addtable"
              :key="item.id"
              :label="item.phoneNumber"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addfly">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单确认" :visible.sync="dialogVisible1" width="800px">
      <el-row>
        <el-col :span="5" v-for="item in confirmimgs" :key="item.id">
          <el-card>
            <el-image
              style="width: 65px; height: 65px"
              :src="item.pic1"
              :preview-src-list="[item.pic1]">
            </el-image>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="dialogVisible1=false">取消</el-button>
        <el-button @click="confirmorder">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
// const amapManager = new AMapManager()
// const lazyamapManager = new lazyAMapApiLoaderInstance()
export default {
  data () {
    return {
      address: '',
      mapCenter: ['121.500035', '31.239250'],
      details: {},
      tableData: [],
      pageSize: 7,
      total: 100,
      pageNum: 1,
      maxPage: 14,
      queryInfo: {
        phoneNumber: '',
        orderState: '',
        pageSize: '',
        pageNum: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      appointForm: {
        feishou: ''
      },
      addtable: [],
      picked: '',
      confirmimgs: [],
      id: ''
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    async geocode () {
      const msg = await this.$http.get('https://restapi.amap.com/v3/geocode/geo', {
        params: {
          key: '27fa650ff8a558de85b5a344c6a0e7fc',
          address: this.address
        },
        withCredentials: false
      })
      if (msg.data.count === '0') {
        return this.$message.error('获取地理位置有误！')
      }
      this.mapCenter = []
      const zuobiao = msg.data.geocodes[0].location
      const comma = zuobiao.indexOf(',')
      const log = zuobiao.slice(0, comma)
      const lat = zuobiao.slice((comma + 1))
      this.mapCenter.push(log)
      this.mapCenter.push(lat)
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async getInformationList () {
      const msg = await this.$http.get('dispatcher/getDispatcherList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取派单列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount /= 100
        msg.data.rows[i].order_amount = msg.data.rows[i].order_amount.toFixed(2)
        msg.data.rows[i].create_time = this.tranformtime(msg.data.rows[i].create_time)
        msg.data.rows[i].service_time = this.tranformtime(msg.data.rows[i].service_time)
        if (msg.data.rows[i].pay_time) {
          msg.data.rows[i].pay_time = this.tranformtime(msg.data.rows[i].pay_time)
        }
        if (msg.data.rows[i].process_time) {
          msg.data.rows[i].process_time = this.tranformtime(msg.data.rows[i].process_time)
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async queryInfomation () {
      this.pageNum = 1
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('dispatcher/getDispatcherList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount /= 100
        msg.data.rows[i].order_amount = msg.data.rows[i].order_amount.toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async queryInfomationpage () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('dispatcher/getDispatcherList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount /= 100
        msg.data.rows[i].order_amount = msg.data.rows[i].order_amount.toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    tranformtime (originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const sec = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}年${m}月${d}日${hh}:${mm}:${sec}`
    },
    async showdetails (user) {
      const msg = await this.$http.get('gmTask/getTask', { params: { orderId: user.id } })
      this.id = user.id
      if (msg.status !== 200) {
        return this.$message.error('订单未确认或请求确认订单失败！')
      }
      this.confirmimgs = msg.data
      this.details = user
      this.address = user.service_location
      this.geocode()
      this.dialogVisible2 = true
    },
    closeform () {
      this.details = {}
      this.address = []
    },
    async showAppoint (order) {
      if (order.feishou_name !== '未指派') {
        return this.$message.error('飞手已指派！')
      }
      if (order.order_state !== '1') {
        return this.$message.error('此订单不满足指派飞手的条件！')
      }
      this.dialogVisible = true
      const msg = await this.$http.get('dispatcher/getFeishou')
      if (msg.status !== 200) {
        return this.$message.error('获取飞手列表失败！')
      }
      msg.data.data.checkid = order.id
      this.addtable = msg.data.data
    },
    async addfly () {
      const msg = await this.$http.post('dispatcher/dispatcher', { userId: this.picked, id: this.addtable.checkid })
      if (msg.status !== 200) {
        this.dialogVisible = false
        return this.$message.error('指派飞手失败！')
      }
      this.$message.success('指派飞手成功！')
      this.getInformationList()
      this.dialogVisible = false
    },
    async showorderconfirm (user) {
      if (user.order_state_name !== '待确认') {
        return this.$message.error('飞手尚未提交作业！')
      }
      const msg = await this.$http.get('gmTask/getTask', { params: { orderId: user.id } })
      this.id = user.id
      if (msg.status !== 200) {
        return this.$message.error('订单未确认或请求确认订单失败！')
      }
      this.dialogVisible1 = true
      this.confirmimgs = msg.data
    },
    async confirmorder () {
      const confirmResult = await this.$confirm('此操作将确认订单已完成, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const msg = await this.$http.post('gmTask/confirmTask', this.$qs.stringify({ orderId: this.id }))
      if (msg.status !== 200) {
        return this.$message.error('订单确认失败！')
      }
      this.$message.success('订单确认成功！')
      this.getInformationList()
      this.dialogVisible1 = false
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.phoneNumber && !this.queryInfo.orderState) {
        return this.getInformationList()
      }
      this.queryInfomationpage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.phoneNumber && !this.queryInfo.orderState) {
        return this.getInformationList()
      }
      this.queryInfomationpage()
    }
  }
}
</script>
<style lang="less" scoped>
.amap-demo {
  height: 500px;
}

.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}

.amap-page-container {
  position: relative;
}
 .el-popover__reference {
   margin-right:10px;
 }
 .editprice .el-input{
   margin-bottom: 5px;
 }
.el-card {
  margin: 35px 25px;
}
.tablediv {
  @media only screen and (min-width: 1129px) {
    height:515px;
  }
  @media only screen and (max-width: 1129px) {
    height:448px;
  }
}
.head {
  background-color: #fff;
  height: 88px;
}
.el-form--inline .el-form-item {
  margin-right:30px;
  margin-bottom: 25px;
}
.firInput {
  margin-left: 30px
}
.anniu {
  margin-left: 25px;
}
/deep/.el-pagination {
  text-align: center;
}
/deep/.el-pagination__jump {
  margin-left: -8px;
}
/deep/.el-pagination.is-background .btn-prev{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination.is-background .btn-next{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination.is-background .el-pager li{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination .el-select .el-input .el-input__inner {
  border-radius: 8px;
}
/deep/.el-input__inner {
  border-radius: 8px;
}
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
.main {
  height:675px;
}
</style>

<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">订单管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="订单ID：" class="firInput" prop="orderNumber">
          <el-input placeholder="请输入" v-model="queryInfo.orderNumber" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="商品名：" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="orderState">
          <el-select placeholder="请选择" v-model="queryInfo.orderState" @keydown.enter.native="queryinfo">
            <el-option label="等待付款" value="0"></el-option>
            <el-option label="等待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="queryinfo">查询</el-button>
      <el-button plain @click="resetQueryForm">重置</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="orderNumber" label="订单号" min-width="200px">
          </el-table-column>
          <el-table-column align="center" prop="goodsName" label="商品名" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="orderAmout" label="订单金额" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="paidAmout" label="实付金额" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="paidTime" label="付款时间" min-width="200px">
            <template v-slot="scope">
              <p v-if="scope.row.paidTime">{{ scope.row.paidTime | dateFormat}}</p>
              <p v-else></p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="orderState" label="订单状态" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="wechatName" label="用户昵称" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="用户手机号码" min-width="120px">
          </el-table-column>
          <!-- <el-table-column align="center" prop="logisticsCompany" label="物流公司">
          </el-table-column>
          <el-table-column align="center" prop="shipmentNumber" label="物流单号">
          </el-table-column> -->
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="address.address" label="收货地址" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="address.name" label="收货人" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="address.orderPhoneNumber" label="收货人手机号码" min-width="150px">
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="180px" v-slot="scope" fixed="right">
            <template>
              <el-button size="small" type="primary" @click="changestate(scope.row, 2)">发货</el-button>
              <el-button size="small" type="danger" @click="deleteorder(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size="pageSize"
      :page-count="11"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      total: 400,
      pageNum: 1,
      maxPage: 1,
      pageSize: 10,
      queryInfo: {
        orderNumber: '',
        goodsName: '',
        phoneNumber: '',
        orderState: '',
        pageNum: '',
        pageSize: ''
      }
    }
  },
  created () {
    this.getorderlist()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      this.pageNum = 1
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('order/orderList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询订单失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].orderState) {
          case '0':
            msg.data.rows[i].orderState = '等待付款'
            break
          case '1':
            msg.data.rows[i].orderState = '等待发货'
            break
          case '2':
            msg.data.rows[i].orderState = '已发货'
            break
          case '3':
            msg.data.rows[i].orderState = '已取消'
            break
          case '4':
            msg.data.rows[i].orderState = '已完成'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async queryinfopage () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('order/orderList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询订单失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].orderState) {
          case '0':
            msg.data.rows[i].orderState = '等待付款'
            break
          case '1':
            msg.data.rows[i].orderState = '等待发货'
            break
          case '2':
            msg.data.rows[i].orderState = '已发货'
            break
          case '3':
            msg.data.rows[i].orderState = '已取消'
            break
          case '4':
            msg.data.rows[i].orderState = '已完成'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async getorderlist () {
      const msg = await this.$http.get('order/orderList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        this.$message.error('获取订单列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].orderState) {
          case '0':
            msg.data.rows[i].orderState = '等待付款'
            break
          case '1':
            msg.data.rows[i].orderState = '等待发货'
            break
          case '2':
            msg.data.rows[i].orderState = '已发货'
            break
          case '3':
            msg.data.rows[i].orderState = '已取消'
            break
          case '4':
            msg.data.rows[i].orderState = '已完成'
            break
        }
        msg.data.rows[i].orderAmout /= 100
        msg.data.rows[i].paidAmout /= 100
        msg.data.rows[i].orderAmout = msg.data.rows[i].orderAmout.toFixed(2)
        msg.data.rows[i].paidAmout = msg.data.rows[i].paidAmout.toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async changestate (user, state) {
      const confirmResult = await this.$confirm('确定执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消操作！')
      }
      const msg = await this.$http.post('order/updateOrder', this.$qs.stringify({ id: user.id, orderState: state, version: user.version }))
      if (msg.data.code === 6) {
        return this.$message.error('操作失败！')
      }
      this.$message.success('操作成功！')
      this.getorderlist()
    },
    async deleteorder (order) {
      console.log(order)
      if (order.orderState !== '已取消') {
        return this.$message.error('只能删除状态为‘已取消’的订单！')
      }
      const confirmResult = await this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('order/deleteOrder', this.$qs.stringify({ id: order.id }))
      if (msg.status !== 200) {
        return this.$message.error('删除订单失败！')
      }
      this.$message.success('删除订单成功！')
      this.getorderlist()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.orderNumber && !this.queryInfo.goodsName && !this.queryInfo.phoneNumber && !this.queryInfo.orderState) {
        return this.getorderlist()
      }
      this.queryinfopage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.orderNumber && !this.queryInfo.goodsName && !this.queryInfo.phoneNumber && !this.queryInfo.orderState) {
        return this.getorderlist()
      }
      this.queryinfopage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1588px) {
    height:430px;
  }
  @media only screen and (max-width: 1588px) {
    height:360px;
  }
}
.main {
  height:630px;
}
.el-card {
  margin: 35px 25px;
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
/deep/.el-button--primary {
  margin-left: 30px;
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
</style>

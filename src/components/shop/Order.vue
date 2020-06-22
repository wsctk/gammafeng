<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">订单管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="订单ID：" class="firInput" prop="orderNumber">
          <el-input placeholder="请输入" v-model="queryInfo.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="商品名：" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="orderState">
          <el-select placeholder="请选择" v-model="queryInfo.orderState">
            <el-option label="等待付款" value="0"></el-option>
            <el-option label="等待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
            <el-option label="已退货" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="queryinfo">查询</el-button>
      <el-button plain @click="resetQueryForm">重置</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="orderNumber" label="订单ID">
        </el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名">
        </el-table-column>
        <el-table-column align="center" prop="orderAmout" label="订单金额">
        </el-table-column>
        <el-table-column align="center" prop="paidAmout" label="实付金额">
        </el-table-column>
        <el-table-column align="center" prop="paidTime" label="付款时间">
          <template v-slot="scope">
            {{ scope.row.paidTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderState" label="订单状态">
        </el-table-column>
        <el-table-column align="center" prop="wechatName" label="用户昵称">
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="logisticsCompany" label="物流公司">
        </el-table-column>
        <el-table-column align="center" prop="shipmentNumber" label="物流单号">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size="10"
      :page-count="11"
      :current-page="currentPage"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{total/5}}页</span>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      total: 400,
      pageNum: 1,
      currentPage: 1,
      queryInfo: {
        orderNumber: '',
        goodsName: '',
        phoneNumber: '',
        orderState: ''
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
      const msg = await this.$http.get('order/orderList', { params: this.queryInfo })
      console.log(msg)
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询订单失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].orderState) {
          case '0':
            msg.data.data[i].orderState = '等待付款'
            break
          case '1':
            msg.data.data[i].orderState = '等待发货'
            break
          case '2':
            msg.data.data[i].orderState = '已发货'
            break
          case '3':
            msg.data.data[i].orderState = '已取消'
            break
          case '4':
            msg.data.data[i].orderState = '已退货'
            break
        }
      }
      this.tableData = msg.data.data
    },
    async getorderlist () {
      const msg = await this.$http.get('order/orderList')
      console.log(msg)
      if (msg.status !== 200) {
        this.$message.error('获取订单列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].orderState) {
          case '0':
            msg.data.data[i].orderState = '等待付款'
            break
          case '1':
            msg.data.data[i].orderState = '等待发货'
            break
          case '2':
            msg.data.data[i].orderState = '已发货'
            break
          case '3':
            msg.data.data[i].orderState = '已取消'
            break
          case '4':
            msg.data.data[i].orderState = '已退货'
            break
        }
      }
      this.tableData = msg.data.data
    }
  }
}
</script>
<style lang="less" scoped>
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
// .anniu {
//   margin-left: 25px;
// }
/deep/.el-button--primary {
  margin-left: 30px;
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
/deep/.el-pagination.is-background .btn-prev {
  margin-left:825px;
}
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
</style>

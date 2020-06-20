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
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" rules="queryInfoRules">
        <el-form-item label="订单ID：" class="firInput" prop="orderid">
          <el-input placeholder="请输入" v-model="queryInfo.orderid"></el-input>
        </el-form-item>
        <el-form-item label="商品名：" prop="goodname">
          <el-input placeholder="请输入" v-model="queryInfo.goodname"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phonenumber">
          <el-input placeholder="请输入" v-model="queryInfo.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="订单状态：" prop="status">
          <el-select placeholder="请选择">
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
        <el-table-column align="center" prop="orderid" label="订单ID">
        </el-table-column>
        <el-table-column align="center" prop="goodname" label="商品名">
        </el-table-column>
        <el-table-column align="center" prop="ordermoney" label="订单金额">
        </el-table-column>
        <el-table-column align="center" prop="realpay" label="实付金额">
        </el-table-column>
        <el-table-column align="center" prop="paytime" label="付款时间">
        </el-table-column>
        <el-table-column align="center" prop="status" label="订单状态">
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="用户昵称">
        </el-table-column>
        <el-table-column align="center" prop="phonenumber" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="transformcompany" label="物流公司">
        </el-table-column>
        <el-table-column align="center" prop="transformdeal" label="物流单号">
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
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
      currentPage: 1,
      queryInfo: {
        orderid: '',
        goodname: '',
        phonenumber: ''
      },
      tableData: [],
      total: 400,
      pageNum: 1
    }
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFileds()
    },
    async queryinfo () {
      const msg = await this.$http.post()
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('查询订单失败！')
      }
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

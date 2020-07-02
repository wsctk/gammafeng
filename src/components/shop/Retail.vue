<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">分销记录</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName" @keydown.enter.native="queryretail"></el-input>
        </el-form-item>
        <el-form-item label="一级用户：" prop="firstUser">
          <el-select placeholder="请选择" v-model="queryInfo.firstUser" @keydown.enter.native="queryretail">
            <el-option
              v-for="item in tableData"
              :key="item.first_id"
              :label="item.first_name"
              :value="item.first_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级用户：" prop="secondUser">
          <el-select placeholder="请选择" v-model="queryInfo.secondUser" @keydown.enter.native="queryretail">
            <el-option
              v-for="item in tableData"
              :key="item.second_id"
              :label="item.seconde_name"
              :value="item.second_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryretail">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="did" label="分销ID" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="first_name" label="一级用户(手机号码)" min-width="150px">
          </el-table-column>
          <el-table-column align="center" prop="seconde_name" label="二级用户(手机号码)" min-width="150px">
          </el-table-column>
          <el-table-column align="center" prop="goods_name" label="分销商品" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="goods_cover" label="商品图片" min-width="70px">
            <template v-slot="scope">
              <img :src=scope.row.goods_cover style="wight:50px;height:50px" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="order_amount" label="订单金额(元)" min-width="90px">
          </el-table-column>
          <el-table-column align="center" prop="profit" label="分销收益(元)" min-width="90px">
          </el-table-column>
          <el-table-column align="center" prop="create_time" label="成单时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.create_time | dateFormat}}
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
      pageSize: 10,
      tableData: [],
      total: 400,
      pageNum: 1,
      maxPage: 1,
      queryInfo: {
        goodsName: '',
        firstUser: '',
        secondUser: '',
        pageNum: '',
        pageSize: ''
      }
    }
  },
  created  () {
    this.getInformationList()
  },
  methods: {
    async getInformationList () {
      const msg = await this.$http.get('distribution/getDistribution', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        this.$message.error('获取分销列表失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryretail () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('distribution/getDistribution', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName && !this.queryInfo.firstUser && !this.queryInfo.secondUser) {
        this.getInformationList()
      }
      this.queryretail()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.goodsName && !this.queryInfo.firstUser && !this.queryInfo.secondUser) {
        this.getInformationList()
      }
      this.queryretail()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1505px) {
    height:460px;
  }
  @media only screen and (max-width: 1505px) {
    height:380px;
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
/deep/.el-pagination{
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

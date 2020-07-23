<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>派单管理</el-breadcrumb-item>
        <el-breadcrumb-item>派单分销记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">派单分销记录</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="一级用户：" prop="firstUser" class="firInput">
          <el-select placeholder="请选择" v-model="queryInfo.firstUser" @keydown.enter.native="queryretailbtn">
            <el-option
              v-for="item in leveloneuser"
              :key="item.firstUser"
              :label="item.wechatName"
              :value="item.firstUser">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级用户：" prop="secondUser">
          <el-select placeholder="请选择" v-model="queryInfo.secondUser" @keydown.enter.native="queryretailbtn">
            <el-option
              v-for="item in leveltwouser"
              :key="item.secondUser"
              :label="item.wechatName"
              :value="item.secondUser">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="queryretailbtn">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%" row-key="did">
          <el-table-column align="center" prop="did" label="分销ID" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="first_name" label="一级用户" min-width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="seconde_name" label="二级用户" min-width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="mu_amount" label="亩数" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="order_amount" label="订单金额(元)" min-width="90px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="profit" label="分销收益(元)" min-width="90px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="create_time" label="成单时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.create_time | dateFormat}}
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      leveloneuser: [], // 一级用户
      leveltwouser: [], // 二级用户
      pageSize: 7,
      tableData: [],
      total: 100,
      pageNum: 1,
      maxPage: 14,
      queryInfo: {
        firstUser: '',
        secondUser: '',
        pageNum: '',
        pageSize: '',
        status: 0
      }
    }
  },
  created  () {
    this.getInformationList()
    this.getfirstuser()
    this.getseconduser()
  },
  methods: {
    // 获取table数据
    async getInformationList () {
      const msg = await this.$http.get('distribution/getDistribution', { params: { pageNum: this.pageNum, pageSize: this.pageSize, status: 0 } })
      if (msg.status !== 200) {
        this.$message.error('获取分销列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount = (msg.data.rows[i].order_amount /= 100).toFixed(2)
        msg.data.rows[i].profit = (msg.data.rows[i].profit /= 100).toFixed(2)
        if (msg.data.rows[i].goods_name) {
          msg.data.rows.splice(i, 1)
          i--
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 获取所有一级用户
    async getfirstuser () {
      const msg = await this.$http.get('distribution/getFirstUser', { params: { status: '0' } })
      this.leveloneuser = msg.data.data
    },
    // 获取所有二级用户
    async getseconduser () {
      const msg = await this.$http.get('distribution/getSecondUser', { params: { status: '0' } })
      this.leveltwouser = msg.data.data
    },
    // 重置搜索框
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 搜索框搜索
    async queryretailbtn () {
      this.pageNum = 1
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('distribution/getDistribution', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount = (msg.data.rows[i].order_amount /= 100).toFixed(2)
        msg.data.rows[i].profit = (msg.data.rows[i].profit /= 100).toFixed(2)
        if (msg.data.rows[i].goods_name) {
          msg.data.rows.splice(i, 1)
          i--
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 搜索之后所有结果分页
    async queryretail () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('distribution/getDistribution', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        msg.data.rows[i].order_amount = (msg.data.rows[i].order_amount /= 100).toFixed(2)
        msg.data.rows[i].profit = (msg.data.rows[i].profit /= 100).toFixed(2)
        if (msg.data.rows[i].goods_name) {
          msg.data.rows.splice(i, 1)
          i--
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 改变页面最大显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName && !this.queryInfo.firstUser && !this.queryInfo.secondUser) {
        this.getInformationList()
      }
      this.queryretail()
    },
    // 改变当前页面索引
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
  @media only screen and (min-width: 1516px) {
    height:515px;
  }
  @media only screen and (max-width: 1516px) {
    height:445px;
  }
}
.main {
  height:675px;
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

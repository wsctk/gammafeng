<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">分销记录</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="goodname">
          <el-input placeholder="请输入" v-model="queryInfo.goodname"></el-input>
        </el-form-item>
        <el-form-item label="一级用户：" prop="nativeuser">
          <el-select placeholder="请选择" v-model="queryInfo.nativeuser">
            <el-option
              v-for="item in father"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级用户：" prop="senioruser">
          <el-select placeholder="请选择" v-model="queryInfo.senioruser">
            <el-option
              v-for="item in son"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="queryretail">查询</el-button>
          <el-button plain size="small" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="did" label="分销ID">
        </el-table-column>
        <el-table-column align="center" prop="first_name" label="一级用户">
        </el-table-column>
        <el-table-column align="center" prop="seconde_name" label="二级用户">
        </el-table-column>
        <el-table-column align="center" prop="goods_name" label="分销商品">
        </el-table-column>
        <el-table-column align="center" prop="goods_cover" label="商品图片">
          <template v-slot="scope">
            <img :src=scope.row.goods_cover style="wight:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order_amount" label="订单金额">
        </el-table-column>
        <el-table-column align="center" prop="profit" label="分销收益">
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="成单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat}}
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
      currentPage: 1,
      tableData: [],
      total: 400,
      pageNum: 1,
      queryInfo: {
        goodname: '',
        nativeuser: '',
        senioruser: ''
      },
      father: {},
      son: {}
    }
  },
  created  () {
    this.getInformationList()
  },
  methods: {
    async getInformationList () {
      const msg = await this.$http.get('distribution/getDistribution')
      console.log(msg.data)
      if (msg.status !== 200) {
        this.$message.error('获取分销列表失败！')
      }
      this.tableData = msg.data
      this.father = msg.data
      this.son = msg.data
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFileds()
    },
    async queryretail () {
      const msg = this.$http.get('', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
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

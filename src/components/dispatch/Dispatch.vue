<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>派单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">派单管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户手机号" class="firInput" prop="phone_number">
          <el-input placeholder="请输入" v-model="queryInfo.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select placeholder="请选择" v-model="queryInfo.order_state_name">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="待指派" value="1"></el-option>
            <el-option label="待服务" value="2"></el-option>
            <el-option label="待确认" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="queryInfomation">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="订单ID">
        </el-table-column>
        <el-table-column align="center" prop="name" label="用户名">
        </el-table-column>
        <el-table-column align="center" prop="phone_number" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="demand_mu" label="需求亩数">
        </el-table-column>
        <el-table-column align="center" prop="service_time" label="预约时间">
        </el-table-column>
        <el-table-column align="center" prop="order_amount" label="订单金额">
        </el-table-column>
        <el-table-column align="center" prop="pay_time" label="付款时间">
        </el-table-column>
        <el-table-column align="center" prop="feishou_name" label="服务飞手">
        </el-table-column>
        <el-table-column align="center" prop="order_state_name" label="订单状态">
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="process_time" label="处理时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showAppoint(scope.row)">添加飞手</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog title="添加飞手" :visible.sync="dialogVisible" width="30%" @close="closeForm">
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
      queryInfo: {
        phone_number: '',
        order_state_name: ''
      },
      dialogVisible: false,
      appointForm: {
        feishou: ''
      },
      checked: false,
      addtable: [],
      currentPage: 1,
      tableData: [],
      total: 400,
      pageNum: 1,
      picked: ''
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async getInformationList () {
      const msg = await this.$http.get('dispatcher/getDispatcherList')
      console.log(msg.data.data)
      this.tableData = msg.data.data
    },
    async showAppoint (fly) {
      // if (!(fly.feishou_name === '未设置')) {
      //   return this.$message.error('飞手已设置！')
      // }
      this.dialogVisible = true
      const msg = await this.$http.get('dispatcher/getFeishou')
      console.log(msg.data.data)
      msg.data.data.checkid = fly.id
      // console.log(msg.data.data.checkid)
      this.addtable = msg.data.data
    },
    async queryInfomation () {
      const msg = await this.$http.get('dispatcher/getDispatcherList', this.$qs.stringify({ phone_number: this.queryInfo.phone_number }))
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data
    },
    closeForm () {
      this.$refs.addFormRef.resetFields()
    },
    async addfly () {
      const msg = await this.$http.post('dispatcher/dispatcher', { userId: this.picked, id: this.addtable.checkid })
      if (msg.status !== 200) {
        this.dialogVisible = false
        return this.$message.error('派单失败！')
      }
      this.$message.success('派单成功！')
      this.dialogVisible = false
      this.getInformationList()
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
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
.anniu {
  margin-left: 25px;
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

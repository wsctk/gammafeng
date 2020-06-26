<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>派单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">派单管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户手机号" class="firInput" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderState">
          <el-select placeholder="请选择" v-model="queryInfo.orderState">
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
        <el-table-column align="center" prop="service_time" label="预约时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.service_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order_amount" label="订单金额(元)">
        </el-table-column>
        <el-table-column align="center" prop="pay_time" label="付款时间" width="150px">
          <template v-slot="scope">
            <p v-if="scope.row.pay_time">{{ scope.row.pay_time | dateFormat}}</p>
            <p v-else></p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="feishou_name" label="服务飞手">
        </el-table-column>
        <el-table-column align="center" prop="order_state_name" label="订单状态">
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="创建时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="process_time" label="处理时间" width="150px" v-slot="scope">
          <template>
            <p v-if="scope.row.process_time">{{ scope.row.process_time | dateFormat}}</p>
            <p v-else></p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="120px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showAppoint(scope.row)">添加飞手</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      pageSize: 1,
      total: 400,
      pageNum: 1,
      maxPage: '',
      queryInfo: {
        phoneNumber: '',
        orderStateName: '',
        pageSize: '',
        pageNum: ''
      },
      dialogVisible: false,
      appointForm: {
        feishou: ''
      },
      addtable: [],
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
      if (msg.status !== 200) {
        return this.$message.error('获取派单列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].order_state_name) {
          case 0:
            msg.data.data[i].order_state_name = '待付款'
            break
          case 1:
            msg.data.data[i].order_state_name = '待指派'
            break
          case 2:
            msg.data.data[i].order_state_name = '待服务'
            break
          case 3:
            msg.data.data[i].order_state_name = '待确认'
            break
          case 4:
            msg.data.data[i].order_state_name = '已完成'
            break
        }
        msg.data.data[i].order_amount /= 100
        msg.data.data[i].order_amount = msg.data.data[i].order_amount.toFixed(2)
      }
      this.tableData = msg.data.data
    },
    async queryInfomation () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('dispatcher/getDispatcherList', { params: this.queryInfo })
      console.log(msg)
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].order_state_name) {
          case 0:
            msg.data.data[i].order_state_name = '待付款'
            break
          case 1:
            msg.data.data[i].order_state_name = '待指派'
            break
          case 2:
            msg.data.data[i].order_state_name = '待服务'
            break
          case 3:
            msg.data.data[i].order_state_name = '待确认'
            break
          case 4:
            msg.data.data[i].order_state_name = '已完成'
            break
        }
        msg.data.data[i].order_amount /= 100
        msg.data.data[i].order_amount = msg.data.data[i].order_amount.toFixed(2)
      }
      this.tableData = msg.data.data
      this.total = msg.data.data.total
      this.maxPage = msg.data.data.maxPage
    },
    async showAppoint (order) {
      console.log(order)
      if (!(order.feishou_name === '未指派')) {
        return this.$message.error('飞手已指派！')
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
      this.dialogVisible = false
      this.getInformationList()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.getCustomerList()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      this.getCustomerList()
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

<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">优惠券管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryinfoRef">
        <el-form-item label="优惠券使用方式：" prop="useCondition" class="firInput">
          <el-input v-model="queryInfo.useCondition" placeholder="请输入条件金额" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="优惠券状态：" prop="state">
          <el-select placeholder="请选择" v-model="queryInfo.state" @keydown.enter.native="queryinfo">
            <el-option label="未使用" value="0"></el-option>
            <el-option label="已使用" value="1"></el-option>
            <el-option label="已失效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetquery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="优惠券ID" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="被绑定用户(手机号码)" min-width="150px">
          </el-table-column>
          <el-table-column align="center" prop="value" label="优惠券面额(元)" min-width="90px">
          </el-table-column>
          <el-table-column align="center" prop="useCondition" label="使用门槛" min-width="110px">
          </el-table-column>
          <el-table-column align="center" prop="expirationDate" label="优惠券有效期" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.expirationDate | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="statename" label="优惠券状态" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="useTime" label="使用时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.useTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="180px" v-slot="scope" fixed="right">
            <template>
              <el-button size="small" type="danger" @click="removecoupon(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="600px" @close="closeaddform">
      <el-form label-width="120px" :model="addForm" ref="addFormRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="12" :offset="3">
            <el-form-item label="开始时间:" prop="acquireTime">
              <el-date-picker
                v-model="addForm.acquireTime"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="结束时间:" prop="expirationDate">
              <el-date-picker
                v-model="addForm.expirationDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="绑定用户:" prop="phoneNumber">
              <el-input v-model="addForm.phoneNumber" placeholder="请输入绑定用户手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="使用类型:" prop="useType">
              <el-radio v-model="addForm.useType" :label="1">派单优惠券</el-radio>
              <el-radio v-model="addForm.useType" :label="0">商品优惠券</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="优惠券类型:" prop="couponsType">
              <el-radio v-model="addForm.couponsType" :label="1">直减</el-radio>
              <el-radio v-model="addForm.couponsType" :label="0">满减</el-radio>
              <div v-if="addForm.couponsType===0">
                <span class="textspan">满</span>
                <input class="textinput" v-model="addForm.useCondition" placeholder="请输入条件金额" />
                <span class="textspan">元使用</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="优惠券面额(元):" prop="value">
              <el-input v-model="addForm.value" placeholder="请输入面额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addcoupon" :disabled="zhinenganyici">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      zhinenganyici: false,
      tableData: [],
      total: 400,
      pageNum: 1,
      pageSize: 10,
      maxPage: 1,
      queryInfo: {
        useCondition: '',
        state: '',
        pageNum: '',
        pageSize: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      addForm: {
        useType: '',
        couponsType: 0,
        value: '',
        acquireTime: '',
        expirationDate: '',
        phoneNumber: '',
        useCondition: 0
      },
      addFormRules: {
        value: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' }
        ],
        expirationDate: [
          { required: true, message: '请选择优惠券有效期', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getcouponlist()
  },
  methods: {
    async queryinfo () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('coupons/couponsList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetquery()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].state) {
          case '0':
            msg.data.rows[i].statename = '未使用'
            break
          case '1':
            msg.data.rows[i].statename = '已使用'
            break
          case '2':
            msg.data.rows[i].statename = '已失效'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    resetquery () {
      this.$refs.queryinfoRef.resetFields()
    },
    async getcouponlist () {
      const msg = await this.$http.get('coupons/couponsList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取优惠券列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].state) {
          case '0':
            msg.data.rows[i].statename = '未使用'
            break
          case '1':
            msg.data.rows[i].statename = '已使用'
            break
          case '2':
            msg.data.rows[i].statename = '已失效'
            break
        }
        msg.data.rows[i].value /= 100
        msg.data.rows[i].useCondition /= 100
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async addcoupon () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.zhinenganyici = true
        this.addForm.value *= 100
        this.addForm.useCondition *= 100
        const msg = await this.$http.post('coupons/addCoupons', this.$qs.stringify(this.addForm))
        if (msg.status !== 200) {
          this.dialogVisible = false
          this.$message.error('添加优惠券失败！')
        }
        this.getcouponlist()
        this.$message.success('添加优惠券成功！')
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addFormRef.resetFields()
    },
    async removecoupon (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('coupons/deleteCoupons', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除优惠券失败！')
      }
      this.$message.success('删除成功！')
      this.getcouponlist()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.useCondition && !this.queryInfo.state) {
        return this.getcouponlist()
      }
      this.queryinfo()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.useCondition && !this.queryInfo.state) {
        return this.getcouponlist()
      }
      this.queryinfo()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (max-width: 1120px) {
    height:361px;
  }
  @media only screen and (min-width: 1120px) {
    height:420px;
  }
}
.textspan {
  font-size:16px;
  color:#aaa;
  margin: 0 20px 0 20px
}
.textinput {
  border:1px solid #DCDFE6;
  border-radius:5px;
  width:80px;
  height:18px;
  font-size:16px;
  text-align: center;
}
.main {
  overflow:auto;
}
.addbtn {
    margin-left:27px;
    margin-bottom: 10px;
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
  margin-bottom: 45px;
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
</style>

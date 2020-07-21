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
      <el-button plain class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="value" label="优惠券面额(元)" min-width="90px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="useCondition" label="使用门槛" min-width="110px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="expirationDate" label="优惠券有效期(天)" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="useType" label="使用类型" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="100px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="danger" @click="removecoupon(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="600px" @close="closeaddform">
      <el-form label-width="150px" :model="addForm" ref="addFormRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="有效期:" prop="expirationDate">
              <el-input v-model="addForm.expirationDate" placeholder="请输入优惠券有效期">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :offset="3">
            <el-form-item label="使用类型:" prop="useType">
              <el-radio v-model="addForm.useType" :label="1">派单优惠券</el-radio>
              <el-radio v-model="addForm.useType" :label="0">商品优惠券</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="优惠券类型:" prop="couponsType">
              <el-radio v-model="addForm.couponsType" :label="1">直减</el-radio>
              <el-radio v-model="addForm.couponsType" :label="0">满减</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="addForm.couponsType===0">
          <el-col :span="16" :offset="3">
            <el-form-item label="满减:" prop="useCondition">
              <el-input v-model="addForm.useCondition">
                <template slot="prepend">满</template>
                <template slot="append">元可用</template>
              </el-input>
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
      dialogVisible: false,
      addForm: {
        useType: '',
        couponsType: 1,
        value: '',
        expirationDate: '',
        useCondition: 0
      },
      addFormRules: {
        value: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' }
        ],
        expirationDate: [
          { required: true, message: '请选择优惠券结束时间', trigger: 'blur' }
        ],
        couponsType: [
          { required: true, message: '请选择优惠券类型', trigger: 'blur' }
        ],
        useType: [
          { required: true, message: '请选择优惠券使用类型', trigger: 'blur' }
        ],
        useCondition: [
          { required: true, message: '请选择满减金额', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getcouponlist()
  },
  methods: {
    async getcouponlist () {
      const msg = await this.$http.get('coupons/getRegisterCouponsList')
      if (msg.status !== 200) {
        return this.$message.error('获取优惠券列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].useType) {
          case '0':
            msg.data.data[i].useType = '商城优惠券'
            break
          case '1':
            msg.data.data[i].useType = '派单优惠券'
            break
        }
        msg.data.data[i].value /= 100
        msg.data.data[i].useCondition /= 100
      }
      this.tableData = msg.data.data
    },
    async addcoupon () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.addForm.value *= 100
        this.addForm.useCondition *= 100
        this.zhinenganyici = true
        const msg = await this.$http.post('coupons/addRegisterCoupons', this.$qs.stringify(this.addForm))
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
      const msg = await this.$http.post('coupons/deleteRegisterCoupons', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除优惠券失败！')
      }
      this.$message.success('删除成功！')
      this.getcouponlist()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  height:555px;
}
.main {
  height:675px;
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
</style>

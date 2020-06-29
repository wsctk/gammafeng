<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">优惠券管理</p>
    </div>
    <el-card>
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
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="优惠券ID">
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="被绑定用户">
        </el-table-column>
        <el-table-column align="center" prop="value" label="优惠券面额">
        </el-table-column>
        <el-table-column align="center" prop="useCondition" label="优惠券使用条件">
        </el-table-column>
        <el-table-column align="center" prop="expirationDate" label="优惠券有效期" width="150px">
          <template v-slot="scope">
            {{ scope.row.expirationDate | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="statename" label="优惠券状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="useTime" label="使用时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.useTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showEditForm(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removecoupon(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
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
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
      <el-form label-width="120px" :model="addForm" ref="addFormRef" :rules="addFormRules" hide-required-asterisk>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券面额:" prop="value">
              <el-input v-model="addForm.value" placeholder="请输入面额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="优惠券有效期:" prop="expirationDate">
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
          <el-col :span="11" :offset="6">
            <el-form-item label="绑定用户:" prop="phoneNumber">
              <el-input v-model="addForm.phoneNumber" placeholder="请输入绑定用户手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券使用方式:" prop="useCondition">
              <el-input v-model="addForm.useCondition" placeholder="请输入条件金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="优惠券状态:" prop="state">
               <el-radio-group v-model="addForm.state">
                <el-radio :label="0">未使用</el-radio>
                <el-radio :label="1">已使用</el-radio>
                <el-radio :label="2">已失效</el-radio>
               </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addcoupon">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑优惠券" :visible.sync="dialogVisible1" width="40%" @close="closeeditform">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" :rules="editFormRules" hide-required-asterisk>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券面额:" prop="value">
              <el-input v-model="editForm.value" placeholder="请输入面额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="优惠券有效期:" prop="expirationDate">
              <el-date-picker
                v-model="editForm.expirationDate"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="绑定用户:" prop="phoneNumber">
              <el-input v-model="editForm.phoneNumber" placeholder="请输入绑定用户手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券类型:" prop="useCondition">
              <el-input v-model="editForm.useCondition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="优惠券状态:" prop="state">
               <el-radio-group v-model="editForm.state">
                <el-radio label="0">未使用</el-radio>
                <el-radio label="1">已使用</el-radio>
                <el-radio label="2">已失效</el-radio>
               </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取消</el-button>
        <el-button type="primary" @click="editcoupon">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
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
        value: '',
        expirationDate: '',
        phoneNumber: '',
        state: '',
        useCondition: ''
      },
      addFormRules: {
        value: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' }
        ],
        expirationDate: [
          { required: true, message: '请选择优惠券有效期', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
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
      console.log(msg)
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
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async addcoupon () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
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
      this.$refs.addFormRef.resetFields()
    },
    showEditForm (user) {
      this.dialogVisible1 = true
      this.editForm = user
    },
    async editcoupon () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('coupons/updateCoupons', this.$qs.stringify(this.editForm))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑失败！')
        }
        this.getcouponlist()
        this.$message.success('编辑成功！')
        this.dialogVisible1 = false
      })
    },
    closeeditform () {
      this.$refs.editFormRef.resetFields()
      this.getcouponlist()
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

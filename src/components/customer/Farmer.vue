<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>农资商</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">农资商</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户名：" class="firInput" prop="wechatName">
          <el-input placeholder="请输入" v-model="queryInfo.wechatName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNummber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNummber"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="用户ID">
        </el-table-column>
        <el-table-column align="center" prop="wechatName" label="用户名">
        </el-table-column>
        <el-table-column align="center" prop="wechatAvatar" label="微信头像">
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="手机号">
        </el-table-column>
        <el-table-column align="center" prop="statusState" label="身份状态">
        </el-table-column>
        <el-table-column align="center" prop="points" label="用户积分">
        </el-table-column>
        <el-table-column align="center" prop="commissionRate" label="佣金分成比例">
        </el-table-column>
        <el-table-column align="center" prop="balance" label="钱包余额">
        </el-table-column>
        <el-table-column align="center" prop="parentId" label="邀请人">
        </el-table-column>
        <el-table-column align="center" prop="registerTime" label="注册时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px">
          <template>
            <el-button size="small" type="primary" @click="showDialogForm">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[1, 5, 10, 20]" :page-size="10" :page-count="11" :current-page="currentPage" layout="total, slot, prev, pager, next, sizes, jumper" :total="total">
      <span class="slotText">第{{pageNum}}/{{total/5}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible1" width="50%">
      <el-form label-width="130px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right">
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户名：" prop="username">
              <el-input placeholder="请输入" v-model="editForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="手机号：" prop="phonenumber">
              <el-input placeholder="请输入" v-model="editForm.phonenumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="注册身份：">
              <el-radio-group v-model='radio1'>
                <el-radio label="1">普通用户</el-radio>
                <el-radio label="2">飞手</el-radio>
                <el-radio label="3">农资商</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="认证状态：">
              <el-radio v-model="radio2" label="1">已认证</el-radio>
              <el-radio v-model="radio2" label="2">未认证</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户积分：" prop="jifen">
              <el-input placeholder="请输入" v-model="editForm.jifen"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="佣金分成比例：" prop="fenchengbili">
              <el-input placeholder="请输入" v-model="editForm.fenchengbili"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="钱包余额：" prop="surplus">
              <el-input placeholder="请输入" v-model="editForm.surplus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="邀请人：" prop="inviter">
              <!-- <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="注册时间：" prop="registerTime">
              <el-input placeholder="请输入" v-model="editForm.registerTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="身份证号码：" prop="idcode">
              <el-input placeholder="请输入" v-model="editForm.idcode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="身份证正面：">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :file-list="fileList1"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible2">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="身份证背面：">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :file-list="fileList2"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible3">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: 2,
      dialogVisible1: false,
      currentPage: 1,
      radio1: '2',
      radio2: '2',
      queryInfo: {
        wechatName: '',
        phoneNumber: '',
        userStatus: 2
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      dialogVisible3: false,
      fileList1: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      fileList2: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      tableData: [],
      editForm: {
        username: '',
        phonenumber: '',
        identity: '',
        status: '',
        jifen: '',
        fenchengbili: '',
        surplus: '',
        inviter: '',
        registerTime: '',
        idcode: '',
        idimg1: '',
        idimg2: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        jifen: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        fenchengbili: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        surplus: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        inviter: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        registerTime: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ]
      },
      total: 400,
      pageNum: 1
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    showDialogForm () {
      this.dialogVisible1 = true
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async getCustomerList () {
      const msg = await this.$http.get('user/userList', { params: { userStatus: 2 } })
      this.tableData = msg.data
    },
    async queryinfo () {
      console.log(this.queryInfo.wechatName)
      const msg = await this.$http.get('user/userList', { params: this.queryInfo })
      console.log(msg)
      this.tableData = msg.data
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
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
/deep/.el-dialog__header {
  border:1px solid #eee;
}
/deep/.el-upload--picture-card {
  height: 120px;
  width: 120px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  height: 120px;
  width: 120px;
}
/deep/.el-dialog__header {
  border-radius: 7px;
}
/deep/.el-radio {
  margin-right:20px;
}
</style>

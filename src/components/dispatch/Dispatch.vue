<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>派单管理</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>认证记录</el-breadcrumb-item> -->
      </el-breadcrumb>
      <p class="indexText">派单管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户手机号" class="firInput" prop="userphonenumber">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
         <el-form-item label="飞手手机号" prop="flyerphonenumber">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item label="派单状态" prop="dispatchstatus">
          <el-select placeholder="请选择" v-model="queryInfo.publishtime">
            <el-option label="身份一" value="shanghai"></el-option>
            <el-option label="身份二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="showAddForm">+ 新建</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="orderid" label="订单ID">
        </el-table-column>
        <el-table-column align="center" prop="username" label="用户名">
        </el-table-column>
        <el-table-column align="center" prop="phonenumber" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="needednum" label="需求亩数">
        </el-table-column>
        <el-table-column align="center" prop="appointment" label="预约时间">
        </el-table-column>
        <el-table-column align="center" prop="ordermoney" label="订单金额">
        </el-table-column>
        <el-table-column align="center" prop="paytime" label="付款时间">
        </el-table-column>
        <el-table-column align="center" prop="serviceflyer" label="服务飞手">
        </el-table-column>
        <el-table-column align="center" prop="status" label="派单状态">
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="processtime" label="处理时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px">
          <template>
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="50%">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
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
        userphonenumber: '',
        flyerphonenumber: '',
        dispatchstatus: ''
      },
      radio: '2',
      dialogVisible: false,
      editForm: {
        title: '123',
        fengmian: '123',
        xiangqing: '123'
      },
      currentPage: 1,
      dialogVisible2: false,
      dialogImageUrl: '',
      textarea: '',
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      tableData: [
        {
          orderid: '0030121',
          username: '刘德华',
          phonenumber: '18020220001',
          needednum: '10',
          appointment: '05-20 13:00',
          ordermoney: '500.00',
          paytime: '05-20 13:14',
          serviceflyer: '梁朝伟',
          status: '待付款',
          createtime: '05-20 13:14',
          processtime: '05-20 13:14'
        },
        {},
        {},
        {},
        {},
        {}
      ],
      total: 400,
      pageNum: 1
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
      const msg = await this.$http.get('information/getInformationList')
      console.log(msg)
    },
    showAddForm () {
      this.dialogVisible = true
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

<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">分类管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="分类名称：" class="firInput" prop="userphonenumber">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="showAddForm">+ 新建</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="cateid" label="分类ID">
        </el-table-column>
        <el-table-column align="center" prop="catename" label="分类名称">
        </el-table-column>
        <el-table-column align="center" prop="status" label="分类状态">
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
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
    <el-dialog title="新增分类" :visible.sync="dialogVisible1" width="40%">
      <el-form :hide-required-asterisk="true" label-width="100px" :model="additionalInfo" ref="additionalInfoRef" rules="additionalInfoRules">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="分类名称:" prop="imgid">
              <el-select placeholder="请选择">
                <!-- <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="分类状态:" prop="goodname">
              <el-radio v-model="radio" label="1">正常</el-radio>
              <el-radio v-model="radio" label="2">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="dialogVisible2" width="40%">
      <el-form :hide-required-asterisk="true" label-width="100px" :model="editForm" ref="editFormRef" rules="editFormRules">
        <el-row>
          <el-col :span="11" :offset="4">
            <el-form-item label="分类ID:" prop="cateid">
              <el-input v-model="editForm.cateid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="分类名称:" prop="catename">
              <el-select placeholder="请选择">
                <!-- <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="分类状态:" prop="status">
              <el-radio v-model="radio" label="1">正常</el-radio>
              <el-radio v-model="radio" label="2">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
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
      additionalInfo: {
        catename: '',
        status: ''
      },
      additionalInfoRules: {
        catename: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editForm: {
        cateid: '',
        catename: '',
        status: ''
      },
      radio: '2',
      dialogVisible1: false,
      currentPage: 1,
      dialogVisible2: false,
      tableData: [
        {
          cateid: '0030121',
          catename: '',
          status: '正常',
          createtime: '05-20 13:00'
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
      const msg = await this.$http.get('/distribution/getDistribution')
      console.log(msg)
    },
    showAddForm () {
      this.dialogVisible1 = true
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

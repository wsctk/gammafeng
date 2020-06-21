<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">图片管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="userphonenumber">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="imgid" label="图片ID">
        </el-table-column>
        <el-table-column align="center" prop="goodname" label="商品名称">
        </el-table-column>
        <el-table-column align="center" prop="goodimg" label="商品图片">
          <template v-slot="scope">
            <img :src=scope.row style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
          <template>
            {{scope.row.registerTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" v-slot="scope">
          <template>
            <el-button size="small" type="danger" @click="removeimg(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增商品图片：" :visible.sync="dialogVisible" width="40%">
      <el-form label-width="100px" :model="addForm" ref="addFormRef">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="商品名称:" prop="goodname">
              <el-input v-model="addFrom.goodimg" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="商品图片:">
              <el-upload
                :auto-upload="false"
                :limit=1
                :http-request="uploadSectionFile"
                action="#"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sumitgoodimg">确定</el-button>
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
      currentPage: 1,
      queryInfo: {
        userphonenumber: '',
        flyerphonenumber: '',
        dispatchstatus: ''
      },
      addForm: {
        imgid: '',
        goodname: '',
        goodimg: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogImageUrl: ''
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      const msg = await this.$http.get('information/getInformationList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        this.$message.error('查询失败！')
      }
      this.tableData = msg.data.data
    },
    async getInformationList () {
      const msg = await this.$http.get('information/getInformationList')
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('获取商品图片失败！')
      }
      this.tableData = msg.data.data
    },
    uploadSectionFile (params) {
      this.addForm.goodimg = params.file
    },
    async sumitgoodimg () {
      const formdata = new FormData()
      formdata.append('goodimg', this.addForm.goodimg)
      formdata.append('goodname', this.addForm.goodname)
      const msg = await this.$http.post('', formdata)
      if (msg.status !== 200) {
        this.dialogVisible = false
        return this.$message.error('上传商品图片失败！')
      }
      this.getInformationList()
      this.$message.success('上传商品图片成功！')
      this.dialogVisible = false
    },
    async removeimg (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.tableData = msg.data.data
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

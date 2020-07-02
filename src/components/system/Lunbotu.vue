<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图片管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">轮播图片管理</p>
    </div>
    <el-card class="main">
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="图片ID" min-width="50px">
          </el-table-column>
          <el-table-column align="center" prop="goodsName" label="标题" min-width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="thumbnailPicture" label="轮播图片" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.thumbnailPicture"
                :preview-src-list="[scope.row.thumbnailPicture]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="排序" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" v-slot="scope" min-width="100px" fixed="right">
            <template>
              <el-button size="small" type="danger" @click="showeditform(scope.row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="removeimg(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="600px" @close="closeaddform">
      <el-form label-width="120px" :model="addForm" ref="addFormRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="标题:" prop="acquireTime">
              <el-input v-model="addForm" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="图片:" prop="expirationDate">
              <el-upload
                ref="addimgRef"
                :limit=1
                :http-request="uploadaddFormFile"
                action="#"
                list-type="picture-card"
                :on-preview="addimgPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <el-form-item label="显示:" prop="phoneNumber">
                <el-radio v-model="addForm" :label="0">禁用</el-radio>
                <el-radio v-model="addForm" :label="1">启用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <el-form-item label="排序:" prop="useType">
              <el-input v-model="addForm" placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button @click="addlunboimg">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      tableData: [],
      total: 1,
      pageNum: 1,
      pageSize: 10,
      maxPage: 1,
      addForm: {
      },
      addFormRules: {},
      eidtForm: {},
      editFormRules: {}
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
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('picture/pictureList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async getInformationList () {
      const msg = await this.$http.get('picture/pictureList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取商品图片失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async addlunboimg () {
      const msg = await this.$http.post('')
      console.log(msg)
    },
    async showeditform (id) {
      this.dialogVisible1 = true
      const msg = await this.$http.get('', { params: { id: id } })
      console.log(msg)
      this.editForm = msg.data.data
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
      const msg = await this.$http.post('picture/deletePicture', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getInformationList()
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    handleRemove (file, fileList) {
      // this.hideUpload = fileList.length >= this.limitcount
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName) {
        return this.getInformationList()
      }
      this.queryinfo()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.goodsName) {
        return this.getInformationList()
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
.tablediv {
  height:470px;
}
.main {
  height:630px;
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
.anniu {
  margin-left: 25px;
}
</style>

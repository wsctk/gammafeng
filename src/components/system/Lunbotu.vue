<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">轮播图管理</p>
    </div>
    <el-card class="main">
      <el-row>
        <el-col :span="3" v-for="img in imgslist" :key="img.id" >
            <el-card>
              <el-image
                style="width: 105px; height: 105px"
                :src="img.route"
                :preview-src-list="[img.route]">
              </el-image>
              <el-link class="lunbobtn" icon="el-icon-close" @click="deleteimg($event)" :data-id="img.id"></el-link>
            </el-card>
        </el-col>
      </el-row>
      <div v-if="morenimg">
        <img  style="width:200px;height:200px;" src="../../assets/nocan.jpg" />
      </div>
      <el-row>
        <el-col :span="2" class="addbtn">
          <el-button type="primary" @click="dialogVisible=true">新增轮播图片</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="新增轮播图片" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
        <el-row>
            <el-col :span="15" :offset="4">
                <el-upload
                ref="addimgRef"
                :http-request="uploadaddFormFile"
                action="#"
                list-type="picture-card"
                :on-preview="addimgPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible2" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-col>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addlunboimgs" :disabled="zhinenganyici">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      morenimg: false,
      zhinenganyici: false,
      total: 200,
      maxPage: '',
      pageNum: '',
      pageSize: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogImageUrl: '',
      imgslist: []
    }
  },
  created () {
    this.getlunboimgsList()
  },
  methods: {
    async getlunboimgsList () {
      const msg = await this.$http.get('rotation/rotationList')
      if (msg.status !== 200) {
        return this.$message.error('获取轮播图片失败！')
      }
      this.imgslist = msg.data.data
      if (this.imgslist.length === 0) {
        this.morenimg = true
        return
      }
      this.morenimg = false
    },
    uploadaddFormFile () {
    },
    async addlunboimgs () {
      const formData = new FormData()
      for (let i = 0; i < this.$refs.addimgRef.uploadFiles.length; i++) {
        formData.append('files', this.$refs.addimgRef.uploadFiles[i].raw)
      }
      if (!this.$refs.addimgRef.uploadFiles) {
        return this.$message.error('没有图片可以提交！')
      }
      this.zhinenganyici = true
      const msg = await this.$http.post('rotation/insertRotation', formData)
      if (msg.status !== 200) {
        this.dialogVisible = false
        return this.$message.error('新增轮播图片失败！')
      }
      this.$message.success('新增轮播图片成功！')
      this.dialogVisible = false
      this.getlunboimgsList()
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addimgRef.clearFiles()
    },
    async deleteimg (e) {
      const confirmResult = await this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('rotation/deleteRotation', this.$qs.stringify({ id: e.path[1].attributes[1].nodeValue }))
      if (msg.status !== 200) {
        return this.$message.error('删除图片失败')
      }
      this.$message.success('删除图片成功！')
      this.getlunboimgsList()
    },
    handleRemove (file, fileList) {
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
.main {
  height:630px;
  overflow: auto;
}
.addbtn {
  margin-left:24px;
}
/deep/.el-card__body {
  padding-left:20px;
  padding-right:20px;
  padding-top:20px;
  padding-bottom:0px;
}
.lunbobtn {
  position: relative;
  left:105px;
  top:-130px;
}
</style>

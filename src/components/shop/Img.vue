<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">图片管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="图片ID" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="goodsName" label="商品名称" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="thumbnailPicture" label="商品图片" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 34px; height: 34px"
                :src="scope.row.thumbnailPicture"
                :preview-src-list="[scope.row.thumbnailPicture]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="200px">
            <template v-slot="scope">
              {{scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" v-slot="scope" min-width="100px" fixed="right">
            <template>
              <el-button plain size="small" type="danger" @click="removeimg(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-pagination
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[5, 7, 10, 20]"
      :page-size="pageSize"
      :page-count="11"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      total: 100,
      pageNum: 1,
      pageSize: 7,
      maxPage: 14,
      queryInfo: {
        goodsName: '',
        pageNum: '',
        pageSize: ''
      },
      addForm: {
        imgid: '',
        goodname: '',
        goodsimg: ''
      }
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
      this.pageNum = 1
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
    async queryinfopage () {
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
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName) {
        return this.getInformationList()
      }
      this.queryinfopage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.goodsName) {
        return this.getInformationList()
      }
      this.queryinfopage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  height:515px;
}
.main {
  height:675px;
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

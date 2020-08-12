<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>认证记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">认证记录</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="手机号码：" prop="phoneNumber" class='firInput'>
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：" prop="status">
          <el-select placeholder="请选择" v-model="queryInfo.status" @keydown.enter.native="queryinfo">
            <el-option label="飞手" value="1"></el-option>
            <el-option label="农资商" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="认证ID" min-width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="status" label="认证身份" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="idNumber" label="身份证号码" min-width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="idCardFront" label="身份证正面" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 28px; height: 28px"
                :src="scope.row.idCardFront"
                :preview-src-list="[scope.row.idCardFront]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="idCardReverse" label="身份证背面" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 28px; height: 28px"
                :src="scope.row.idCardReverse"
                :preview-src-list="[scope.row.idCardReverse]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="authenticationState" label="认证状态" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="提交时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="300px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="showdetails(scope.row.id)">详情</el-button>
              <el-button plain size="small" type="primary" @click="authsuccess(scope.row.id)">通过</el-button>
              <el-button plain size="small" type="warning" @click="refuse(scope.row)">驳回</el-button>
              <el-button plain size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
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
    <el-dialog title="认证详情" :visible.sync="dialogVisible" width="700px" @close="closeform">
      <el-form label-width="170px" :model="details" ref="editFormRef" label-position="right">
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item label="真实(法人)姓名：">
              <el-input v-model="details.name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" :offset="1">
            <el-form-item label="所在地：">
              <el-input v-model="details.address" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="1">
            <el-form-item label="详细地址：">
              <el-input v-model="details.detaileAddress" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.qualifications">
          <el-col :span="10" :offset="1">
            <el-form-item label="飞手资质：">
              <el-input v-model="details.qualifications" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.machineModel">
          <el-col :span="10" :offset="1">
            <el-form-item label="机器型号：">
              <el-input v-model="details.machineModel" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.machineNumber">
          <el-col :span="10" :offset="1">
            <el-form-item label="机器数量：">
              <el-input v-model="details.machineNumber" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.experience">
          <el-col :span="17" :offset="1">
            <el-form-item label="作业经验：">
              <el-input v-model="details.experience" type="textarea" :rows="6" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.enterpriseName">
          <el-col :span="17" :offset="1">
            <el-form-item label="企业名称：">
              <el-input v-model="details.enterpriseName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="details.business">
          <el-col :span="17" :offset="1">
            <el-form-item label="营业执照副本/飞手资质">
              <el-image
              style="width: 100px; height: 100px"
              :src="details.business"
              :preview-src-list="[details.business]">
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      details: {},
      queryInfo: {
        wechatName: '',
        phoneNumber: '',
        status: '',
        pageSize: '',
        pageNum: ''
      },
      dialogVisible: false,
      pageSize: 7,
      tableData: [],
      total: 100,
      pageNum: 1,
      maxPage: 14
    }
  },
  created () {
    this.getAuthList()
  },
  methods: {
    // 重置搜索框
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 获取table数据
    async getAuthList () {
      const msg = await this.$http.get('auth/authList', { params: { pageSize: this.pageSize, pageNum: this.pageNum } })
      if (msg.status !== 200) {
        return this.$message.error('获取认证列表失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].status) {
          case '1':
            arr.data.rows[i].status = '飞手'
            break
          case '2':
            arr.data.rows[i].status = '农资商'
            break
        }
        switch (arr.data.rows[i].authenticationState) {
          case '2':
            arr.data.rows[i].authenticationState = '已驳回'
            break
          case '1':
            arr.data.rows[i].authenticationState = '已通过'
            break
          case '0':
            arr.data.rows[i].authenticationState = '未认证'
            break
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    // 搜索框搜索
    async queryinfo () {
      this.pageNum = 1
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('auth/authList', { params: this.queryInfo })
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].status) {
          case '1':
            arr.data.rows[i].status = '飞手'
            break
          case '2':
            arr.data.rows[i].status = '农资商'
            break
        }
        switch (arr.data.rows[i].authenticationState) {
          case '2':
            arr.data.rows[i].authenticationState = '已驳回'
            break
          case '1':
            arr.data.rows[i].authenticationState = '已通过'
            break
          case '0':
            arr.data.rows[i].authenticationState = '未认证'
            break
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    // 搜索之后所有结果分页
    async queryinfopage () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('auth/authList', { params: this.queryInfo })
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].status) {
          case '1':
            arr.data.rows[i].status = '飞手'
            break
          case '2':
            arr.data.rows[i].status = '农资商'
            break
        }
        switch (arr.data.rows[i].authenticationState) {
          case '2':
            arr.data.rows[i].authenticationState = '已驳回'
            break
          case '1':
            arr.data.rows[i].authenticationState = '已通过'
            break
          case '0':
            arr.data.rows[i].authenticationState = '未认证'
            break
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    // 显示详情dialog
    async showdetails (id) {
      const msg = await this.$http.get('auth/getUserAuthDetails', { params: { id: id } })
      if (msg.status !== 200) {
        return this.$message.error('获取详情失败！')
      }
      this.details = msg.data.data[0]
      this.dialogVisible = true
    },
    // 关闭详情dialog
    closeform () {
      this.details = {}
    },
    // 通过认证
    async authsuccess (id) {
      const confirmResult = await this.$confirm('确定要通过该认证？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const msg = await this.$http.post('auth/authPass', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('认证请求失败！')
      }
      this.$message.success('认证成功！')
      this.getAuthList()
    },
    // 驳回认证
    async refuse (user) {
      if (user.authenticationState !== '未认证') {
        return this.$message.error('认证已通过或已驳回！')
      }
      const msg = await this.$http.post('auth/authRefuse', this.$qs.stringify({ id: user.id }))
      if (msg.status !== 200) {
        return this.$message.error('驳回请求失败！')
      }
      this.$message.success('驳回成功！')
      this.getAuthList()
    },
    // 删除认证记录
    async remove (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('auth/deleteAuth', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getAuthList()
    },
    // 改变页面最大显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber && !this.queryInfo.status) {
        return this.getAuthList()
      }
      this.queryinfopage()
    },
    // 改变当前页面索引
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber && !this.queryInfo.status) {
        return this.getAuthList()
      }
      this.queryinfopage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1493px) {
    height:495px;
  }
  @media only screen and (max-width: 1493px) {
    height:410px;
  }
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
  margin-bottom: 45px;
}
.firInput {
  margin-left: 30px
}
.anniu {
  margin-left: 25px;
}
/deep/.el-pagination {
  text-align:center;
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

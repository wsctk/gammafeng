<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>认证记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">认证记录</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户名：" class="firInput" prop="wechatName">
          <el-input placeholder="请输入" v-model="queryInfo.wechatName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：" prop="status">
          <el-select placeholder="请选择" v-model="queryInfo.status">
            <el-option label="飞手" value="1"></el-option>
            <el-option label="农资商" value="2"></el-option>
          </el-select>
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
          <template v-slot="scope">
            <img :src=scope.row.wechatAvatar style="width:50px;height:50px;" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="手机号">
        </el-table-column>
        <el-table-column align="center" prop="status" label="认证身份">
        </el-table-column>
        <el-table-column align="center" prop="idNumber" label="身份证号码">
        </el-table-column>
        <el-table-column align="center" prop="idCardFront" label="身份证正面" v-slot="scope">
          <template>
            <img :src=scope.row.idCardFront style="width:50px; height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="idCardReverse" label="身份证背面" v-slot="scope">
          <template>
            <img :src=scope.row.idCardReverse style="width:50px; height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="authenticationState" label="认证状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="提交时间">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="280px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="authsuccess(scope.row.id)">认证通过</el-button>
            <el-button size="small" type="warning" @click="refuse(scope.row)">驳回</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        wechatName: '',
        phoneNumber: '',
        status: ''
      },
      currentPage: 1,
      tableData: [],
      total: 400,
      pageNum: 1
    }
  },
  created () {
    this.getAuthList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async getAuthList () {
      const msg = await this.$http.get('auth/authList')
      console.log(msg.data.data)
      if (msg.status !== 200) {
        return this.$message.error('获取认证列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].status) {
          case '1':
            msg.data.data[i].status = '飞手'
            break
          case '2':
            msg.data.data[i].status = '农资商'
            break
        }
        switch (msg.data.data[i].authenticationState) {
          case '2':
            msg.data.data[i].authenticationState = '已驳回'
            break
          case '1':
            msg.data.data[i].authenticationState = '已通过'
            break
          case '0':
            msg.data.data[i].authenticationState = '未认证'
            break
        }
      }
      this.tableData = msg.data.data
    },
    async queryinfo () {
      console.log(this.queryInfo.wechatName)
      const msg = await this.$http.get('auth/authList', { params: this.queryInfo })
      console.log(msg.data.data)
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data.data
    },
    async authsuccess (id) {
      const confirmResult = await this.$confirm('确定要通过该认证？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('auth/authPass', this.$qs.stringify({ id: id }))
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('认证请求失败！')
      }
      this.$message.success('认证成功！')
      this.getAuthList()
    },
    async refuse (user) {
      if (user.authenticationState !== 0) {
        return this.$message.error('认证已通过或已驳回！')
      }
      const msg = await this.$http.post('auth/authRefuse', this.$qs.stringify({ id: user.id }))
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('驳回请求失败！')
      }
      this.$message.success('驳回成功！')
      this.getAuthList()
    },
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
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getAuthList()
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
</style>

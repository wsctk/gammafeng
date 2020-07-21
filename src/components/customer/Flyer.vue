<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>飞手</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">飞手</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户名：" class="firInput" prop="wechatName">
          <el-input placeholder="请输入" v-model="queryInfo.wechatName" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
            <el-table-column align="center" prop="id" label="用户ID" min-width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="wechatName" label="用户名" min-width="80px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="wechatAvatar" label="微信头像" min-width="70px">
              <template v-slot="scope">
                <el-image
                  style="width: 40px; height: 40px"
                  :src="scope.row.wechatAvatar"
                  :preview-src-list="[scope.row.wechatAvatar]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
            </el-table-column>
            <el-table-column align="center" prop="points" label="用户积分" min-width="70px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="commissionRate" label="商品佣金比例(千分比)" min-width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="distributionRate" label="派单佣金比例(千分比)" min-width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="shareProp" label="派单分成比例(千分比)" min-width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="balance" label="钱包余额(元)" min-width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" prop="parentPhoneNumber" label="邀请人(手机号码)" min-width="120px">
            </el-table-column>
            <el-table-column align="center" prop="sonNumber" label="下级用户个数" min-width="120px">
            </el-table-column>
            <el-table-column align="center" prop="registerTime" label="注册时间" v-slot="scope" min-width="200px">
              {{scope.row.registerTime}}
            </el-table-column>
            <el-table-column align="center" prop="" label="操作" min-width="240px" v-slot="scope" fixed="right">
              <template>
                <el-button plain size="small" type="success" @click="showdetails(scope.row)">详情</el-button>
                <el-button plain size="small" type="primary" @click="showDialogForm(scope.row)">编辑</el-button>
                <el-button plain size="small" type="danger" @click="removeflyer(scope.row.id)">删除</el-button>
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
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible1" width="800px" @close="closeeditform">
      <el-form label-width="200px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="14" :offset="3">
            <el-form-item label="用户积分：" prop="points">
              <el-input v-model="editForm.points"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="3">
            <el-form-item label="商品佣金比例(千分比)：" prop="commissionRate">
              <el-input v-model="editForm.commissionRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="3">
            <el-form-item label="派单分销佣金比例(千分比)：" prop="distributionRate">
              <el-input v-model="editForm.distributionRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="3">
            <el-form-item label="派单分成比例(千分比)：" prop="shareProp">
              <el-input v-model="editForm.shareProp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="3">
            <el-form-item label="邀请人(手机号码)：" prop="parentPhoneNumber">
              <el-input v-model="editForm.parentPhoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="editdialog">确定</el-button>
      </div>
      <div class="textdiv">
        （上面三个比例都是千分比，输入数字后台会自动转成相应的千分比。
        商品佣金比例：根据二级用户在商城的消费按此比例给一级用户返利
        派单分销佣金比例：根据二级用户派单所付金额按此比例给一级用户返利
        派单分成比例：飞手完成任务后从派单金额获得佣金的比例）
      </div>
    </el-dialog>
    <el-dialog title="飞手详情" :visible.sync="dialogVisible" width="900px" @close="closeform">
      <el-form label-width="170px" :model="details" ref="editFormRef" label-position="right">
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户ID：">
              <el-input v-model="details.id" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户名：">
              <el-input v-model="details.wechatName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="微信头像：">
              <el-image
              style="width: 100px; height: 100px"
              :src="details.wechatAvatar"
              :preview-src-list="[details.wechatAvatar]">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号码：">
              <el-input v-model="details.phoneNumber" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="派单佣金比例(千分比)：">
              <el-input v-model="details.distributionRate" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商品佣金比例(千分比)：">
              <el-input v-model="details.commissionRate" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户积分：">
              <el-input v-model="details.points" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="钱包余额：">
              <el-input v-model="details.balance" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="邀请人(手机号码)：">
              <el-input v-model="details.parentPhoneNumber" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="注册时间：">
              <el-input v-model="details.registerTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="真实姓名：">
              <el-input v-model="secdetails.name" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="飞手手机号码：">
              <el-input v-model="secdetails.phoneNumber" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="机器型号：">
              <el-input v-model="secdetails.machineModel" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="机器数量：">
              <el-input v-model="secdetails.machineNumber" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="飞手资质：">
              <el-input v-model="secdetails.qualifications" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="作业经验：">
              <el-input type="textarea" rows="4" v-model="secdetails.experience" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="下级用户：">
              <el-table :data="sonlist" style="width: 100%" border height="100%">
                <el-table-column align="center" prop="id" label="用户ID" min-width="100px">
                </el-table-column>
                <el-table-column align="center" prop="wechatName" label="用户名" min-width="80px">
                </el-table-column>
                <el-table-column align="center" prop="wechatAvatar" label="微信头像" min-width="70px">
                  <template v-slot="scope">
                    <el-image
                      style="width: 26px; height: 26px"
                      :src="scope.row.wechatAvatar"
                      :preview-src-list="[scope.row.wechatAvatar]">
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在地：">
              <el-input v-model="secdetails.address" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="详细地址：">
              <el-input v-model="secdetails.detaileAddress" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="amap-page-container">
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
          <el-amap-marker vid="component-marker" :position="mapCenter"></el-amap-marker>
        </el-amap>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checkbili = (rule, value, cb) => {
      const regbili = /^[1-9]\d*$/
      if (regbili.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的数字！'))
    }
    return {
      address: '',
      mapCenter: [121.59996, 31.197646],
      details: {},
      secdetails: {},
      sonlist: [],
      tableData: [],
      total: 100,
      pageNum: 1,
      pageSize: 7,
      maxPage: 14,
      queryInfo: {
        wechatName: '',
        phoneNumber: '',
        userStatus: 1,
        pageNum: '',
        pageSize: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      editForm: {},
      editFormRules: {
        points: [
          { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ],
        commissionRate: [
          { required: true, message: '请输入商品佣金比例', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ],
        distributionRate: [
          { required: true, message: '请输入派单分销佣金比例：', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ],
        shareProp: [
          { required: true, message: '请输入派单分成比例：：', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    async geocode () {
      const msg = await this.$http.get('https://restapi.amap.com/v3/geocode/geo', {
        params: {
          key: '27fa650ff8a558de85b5a344c6a0e7fc',
          address: this.address
        },
        withCredentials: false
      })
      if (msg.data.count === '0') {
        return this.$message.error('获取地理位置有误！')
      }
      this.mapCenter = []
      const zuobiao = msg.data.geocodes[0].location
      const comma = zuobiao.indexOf(',')
      const log = zuobiao.slice(0, comma)
      const lat = zuobiao.slice((comma + 1))
      this.mapCenter.push(log)
      this.mapCenter.push(lat)
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      this.pageNum = 1
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('user/userList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.rows[i].statusState) {
          case '0':
            msg.data.rows[i].statusState = '未认证'
            break
          case '1':
            msg.data.rows[i].statusState = '已认证'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async queryinfopage () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('user/userList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.rows[i].statusState) {
          case '0':
            msg.data.rows[i].statusState = '未认证'
            break
          case '1':
            msg.data.rows[i].statusState = '已认证'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async getCustomerList () {
      const msg = await this.$http.get('user/userList', { params: { userStatus: '1', pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取飞手列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].statusState) {
          case '0':
            msg.data.rows[i].statusState = '未认证'
            break
          case '1':
            msg.data.rows[i].statusState = '已认证'
            break
        }
        msg.data.rows[i].registerTime = this.tranformtime(msg.data.rows[i].registerTime)
      }
      this.tableData = msg.data.rows
      this.maxPage = msg.data.maxPage
      this.total = msg.data.total
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    showDialogForm (user) {
      this.editForm = user
      this.dialogVisible1 = true
    },
    async editdialog () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('user/updateUser', this.$qs.stringify({ commissionRate: this.editForm.commissionRate, parentPhoneNumber: this.editForm.parentPhoneNumber, distributionRate: this.editForm.distributionRate, id: this.editForm.id, shareProp: this.editForm.shareProp, points: this.editForm.points }))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑飞手信息失败！')
        }
        if (msg.data.code === 9) {
          return this.$message.error('上级用户不存在！')
        }
        this.getCustomerList()
        this.$message.success('编辑飞手信息成功！')
        this.dialogVisible1 = false
      })
    },
    closeeditform () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
      this.getCustomerList()
    },
    tranformtime (originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const sec = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}年${m}月${d}日${hh}:${mm}:${sec}`
    },
    async showdetails (user) {
      this.details = user
      this.address = user.userAuth.address + user.userAuth.detaileAddress
      this.geocode()
      this.secdetails = user.userAuth
      this.dialogVisible = true
      const msg = await this.$http.get('user/getSonList', { params: { id: user.id } })
      if (msg.status !== 200) {
        return this.$message.error('获取下级用户列表失败！')
      }
      this.sonlist = msg.data.data
    },
    closeform () {
      this.details = {}
      this.sonlist = []
      this.mapCenter = [121.59996, 31.197646]
    },
    async removeflyer (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该飞手, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('user/deleteUser', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除飞手身份失败')
      }
      this.$message.success('飞手身份已删除')
      this.getCustomerList()
    }
  }
}
</script>
<style lang="less" scoped>
.amap-demo {
  height: 500px;
}

.search-box {
  position: absolute;
  top: 25px;
  left: 20px;
}

.amap-page-container {
  position: relative;
}
.textdiv {
  padding:50px;
}
.tablediv {
  @media only screen and (min-width: 1111px) {
    height:495px;
  }
  @media only screen and (max-width: 1111px) {
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
// /deep/.el-pagination.is-background .btn-prev {
//   margin-left:825px;
// }
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
/deep/.el-dialog__header {
  border:1px solid #eee;
  border-radius: 7px;
}
// /deep/.el-radio {
//   margin-right:20px;
// }
</style>

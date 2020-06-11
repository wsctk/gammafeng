<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">优惠券管理</p>
    </div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="优惠券类型：">
          <el-select placeholder="请选择">
            <el-option label="直减" value="shanghai"></el-option>
            <el-option label="满减" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券状态：">
          <el-select placeholder="请选择">
            <el-option label="未使用" value="shanghai"></el-option>
            <el-option label="已使用" value="beijing"></el-option>
            <el-option label="已失效" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain>重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="couponid" label="优惠券ID">
        </el-table-column>
        <el-table-column align="center" prop="bindeduser" label="被绑定用户">
        </el-table-column>
        <el-table-column align="center" prop="couponsize" label="优惠券面额">
        </el-table-column>
        <el-table-column align="center" prop="coupontype" label="优惠券类型">
        </el-table-column>
        <el-table-column align="center" prop="validcoupon" label="优惠券有效期">
        </el-table-column>
        <el-table-column align="center" prop="status" label="优惠券状态">
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="usetime" label="使用时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="280px">
          <template>
            <el-button size="small" type="primary" @click="showEditForm">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
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
    <el-dialog title="新增优惠券" :visible.sync="dialogVisible" width="40%">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" rules="editFormRules">
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券面额:" prop="couponsize">
              <el-input v-model="editForm.couponsize"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="有效期:" prop="validcoupon">
              <el-select v-model="editForm.validcoupon" placeholder="请选择">
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
          <el-col :span="11" :offset="6">
            <el-form-item label="绑定用户:" prop="bindeduser">
              <el-input v-model="editForm.bindeduser"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="6">
            <el-form-item label="优惠券状态:" prop="status">
              <el-radio v-model="editForm.status" label="未使用"></el-radio>
              <el-radio v-model="editForm.status" label="已使用"></el-radio>
              <el-radio v-model="editForm.status" label="已失效"></el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="6">
            <el-form-item label="优惠券类型:" prop="coupontype">
              <el-radio v-model="editForm.coupontype" label="直减"></el-radio>
              <el-radio v-model="editForm.coupontype" label="满减"></el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage: 1,
      dialogVisible: false,
      tableData: [
        {
          couponid: '0031121',
          bindeduser: '梁朝伟',
          couponsize: '50元',
          coupontype: '直减',
          validcoupon: '2020-05-30',
          status: '未使用',
          createtime: '2020-05-20 13:14',
          usetime: '2020-05-20 18:37'
        },
        {},
        {},
        {},
        {},
        {}
      ],
      editForm: {
        couponsize: '',
        validcoupon: '',
        bindeduser: '',
        coupontype: '',
        status: ''
      },
      total: 400,
      pageNum: 1
    }
  },
  methods: {
    showEditForm () {
      this.dialogVisible = true
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

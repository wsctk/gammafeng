<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>认证记录</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>用户管理</h1>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：">
          <el-select placeholder="请选择">
            <el-option label="身份一" value="shanghai"></el-option>
            <el-option label="身份二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
  <el-form-item class="anniu">
    <el-button type="primary">查询</el-button>
    <el-button plain>重置</el-button>
  </el-form-item>
</el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.el-form-item {
  margin-left:15px;
}
.anniu {
  margin-left: 25px;
}
</style>

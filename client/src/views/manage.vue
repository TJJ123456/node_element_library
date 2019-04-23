<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #515151;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
          <el-menu-item index="manager">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>书籍管理
            </template>
            <el-menu-item index="bookList">书籍列表</el-menu-item>
            <el-menu-item index="addbook">添加书本</el-menu-item>
            <el-menu-item index="borrowList">借阅列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>书架管理
            </template>
            <el-menu-item index="bookshelfList">书架列表</el-menu-item>
            <el-menu-item index="addBookshelf">添加书架</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-plus"></i>种类管理
            </template>
            <el-menu-item index="genreList">种类列表</el-menu-item>
            <el-menu-item index="addGenre">添加种类</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-plus"></i>用户管理
            </template>
            <el-menu-item index="userList">用户列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
},
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {},
  methods: {}
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
.el-submenu {
  // background-color: #ffa500;
}

.el-menu-item {
}
</style>

<template>
  <div class="comico-global-header02__wrapper _globalHeader">
    <nav class="comico-global-header02__sub">
      <div
        class="comico-global-header02__sub-category _globalHeaderSubCategory comico-global-header__sub-category--flex"
        style="opacity: 1;"
      >
        <div class="comico-global-header02__sub-category-inner">
          <ul class="comico-global-header02__sub-category-list">
            <li class="comico-global-header02__sub-category-item">
              <a class="comico-global-header02__sub-category-item-inner">排行</a>
            </li>
            <li class="comico-global-header02__sub-category-item">
              <a class="comico-global-header02__sub-category-item-inner">类型</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    async logout() {
      await this.$fetch("user/logout");
      this.$state.user = false;
      localStorage.removeItem("user");
      this.$router.replace("/");
      this.$message({
        showClose: true,
        message: "退出成功",
        type: "success"
      });
    }
  }
};
</script>
<style scoped>
</style>

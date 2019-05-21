<template>
  <div class="stage">
    <div class="stage__body stage__body--fixed-header2">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import userLogin from "./login";
import userhead from "./userhead";
import navMenu from "./navMenu";
export default {
  components: { userhead, navMenu }
};
</script>
<style lang="less">
.stage {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
}
</style>

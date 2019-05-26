<template>
  <header class="comico-global-header02 comico-global-header02--fixed _fixedHeader">
    <div class="add-homescreen02 _addHomescreenAndroid add-homescreen02--static o-hidden"></div>
    <div class="comico-global-header02__wrapper _globalHeader">
      <div class="comico-global-header02__main">
        <div class="comico-global-header02__main-action1">
          <div class="comico-global-header02__site-logo">
            <p>
              <a @click="toHome()" class="comico-global-header02__site-logo-inner">图书馆</a>
            </p>
          </div>
          <ul class="comico-global-header02__list-nav">
            <li
              class="comico-global-header02__list-nav-item comico-global-header02__list-nav-item--focus2"
            >
              <a @click="toEdit()" class="comico-global-header02__list-nav-item-inner">官方推荐</a>
            </li>
          </ul>
        </div>
        <div class="comico-global-header02__main-action2">
          <ul class="comico-global-header02__list-nav2">
            <li class="comico-global-header02__list-nav2-item o-large-screen-object">
              <form class="comico-global-header02__list-nav2-item-inner" onsubmit="false">
                <div class="comico-global-header02__search02">
                  <input
                    v-model="keyword"
                    type="text"
                    class="comico-global-header02__search02-input"
                    maxlength="50"
                  >
                  <button
                    @click="search()"
                    class="i-search04 comico-global-header02__search02-submit"
                  ></button>
                </div>
              </form>
            </li>
            <li
              class="comico-global-header02__list-nav2-item comico-global-header02__list-nav2-item--login o-large-screen-object"
            >
              <a
                v-if="!$state.user"
                @click="toSignup()"
                class="comico-global-header02__list-nav2-item-inner"
              >注册</a>
              <a
                v-if="$state.user"
                @click="toMyview()"
                class="comico-global-header02__list-nav2-item-inner"
              >{{$state.user.username}}</a>
            </li>
          </ul>
          <div class="comico-global-header02__switch-site o-large-screen-object">
            <div class="comico-global-header02__switch-site-inner">
              <a
                v-if="!$state.user"
                @click="toLogin()"
                class="comico-global-header02__switch-site-btn"
              >登录</a>
              <a
                v-if="$state.user"
                @click="logout()"
                class="comico-global-header02__switch-site-btn"
              >登出</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comico-global-header02__wrapper _globalHeader" v-if="!checkMyView">
      <nav class="comico-global-header02__sub">
        <div
          class="comico-global-header02__sub-category _globalHeaderSubCategory comico-global-header__sub-category--flex"
          style="opacity: 1;"
        >
          <div class="comico-global-header02__sub-category-inner">
            <ul class="comico-global-header02__sub-category-list">
              <li class="comico-global-header02__sub-category-item">
                <a
                  @click="toEdit()"
                  class="comico-global-header02__sub-category-item-inner"
                  :class="{'red':routeIsEdit}"
                >排行</a>
              </li>
              <li class="comico-global-header02__sub-category-item">
                <a
                  @click="toGenre()"
                  class="comico-global-header02__sub-category-item-inner"
                  :class="{'red':routeIsGenre}"
                >类型</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
export default {
  data() {
    return {
      keyword: ""
    };
  },
  computed: {
    checkMyView() {
      return (
        this.$route.name === "bookDetail" ||
        this.$route.name === "search" ||
        this.$route.name === "myview"
      );
    },
    routeIsGenre() {
      return this.$route.name === "userGenres";
    },
    routeIsEdit() {
      return this.$route.name === "userBookshelf";
    }
  },
  methods: {
    test() {
      // console.log("111");
      this.$router.push({ path: "/home/login" });
    },
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
    },
    toHome() {
      this.$router.push({ path: "/" });
    },
    toSignup() {
      this.$router.push({ path: "/home/signup" });
    },
    toLogin() {
      this.$router.push({
        name: "userLogin",
        params: { wantedRoute: this.$route.path }
      });
    },
    toMyview() {
      this.$router.push({ path: "/home/userview" });
    },
    toGenre() {
      this.$router.push({ path: "/home/userGenres" });
    },
    search() {
      if (this.keyword !== "")
        this.$router.push({
          name: "search",
          params: { keyword: this.keyword }
        });
    },
    toEdit() {
      this.$router.push({ path: "/home/userBookshelf" });
    }
  }
};
</script>
<style lang="less">
.stage .stage__body.stage__body--fixed-header2 {
  padding-top: 98px;
}
.stage .stage__body {
  position: relative;
  z-index: 3;
  padding: 0;
  min-height: 100vh;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #f8f9fa;
}
.comico-global-header02.comico-global-header02--fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.comico-global-header02 {
  font-size: 13px;
  position: relative;
  z-index: 1000;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -moz-user-select: -moz-none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.08);
  color: #212529;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
main {
  display: block;
}
.bnr-stage,
.add-homescreen02 {
  height: 70px;
  position: relative;
}
.o-hidden {
  display: none;
}
.comico-global-header02 .add-homescreen02 + .comico-global-header02__wrapper {
  border-top: none;
}
.comico-global-header02 .comico-global-header02__wrapper {
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.comico-global-header02 .comico-global-header02__local,
.comico-global-header02 .comico-global-header02__sub,
.comico-global-header02 .comico-global-header02__main {
  height: 48px;
  width: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  max-width: 1080px;
  margin: 0 auto;
}

.comico-global-header02 .comico-global-header02__main {
  position: relative;
}

.comico-global-header02 .comico-global-header02__main-action1 {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0;
}

.comico-global-header02
  .comico-global-header02__site-logo
  .comico-global-header02__site-logo-inner {
  display: block;
  line-height: 48px;
  width: 90px;
  text-align: center;
  font-size: 24px;
  color: #f11;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  overflow: hidden;
}

.comico-global-header02 .comico-global-header02__site-logo {
  display: inline-block;
  height: 48px;
  position: relative;
  vertical-align: top;
}

.comico-global-header02
  .comico-global-header02__site-logo
  + .comico-global-header02__list-nav {
  padding-left: 8px;
}
.comico-global-header02 .comico-global-header02__list-nav {
  display: inline-block;
  position: relative;
  vertical-align: top;
}

.comico-global-header02 .comico-global-header02__list-nav-item {
  display: inline-block;
  height: 48px;
  position: relative;
  vertical-align: top;
  white-space: nowrap;
}
.comico-global-header02
  .comico-global-header02__list-nav-item.comico-global-header02__list-nav-item--focus2
  .comico-global-header02__list-nav-item-inner {
  color: #212529;
  &:hover {
    color: #f11;
  }
}
.comico-global-header02 .comico-global-header02__main-action1 button,
.comico-global-header02 .comico-global-header02__main-action1 label,
.comico-global-header02 .comico-global-header02__main-action1 a {
  -webkit-tap-highlight-color: transparent;
}

.comico-global-header02 .comico-global-header02__list-nav-item-inner {
  display: inline-block;
  line-height: 48px;
  padding: 0 8px;
  text-align: center;
  height: 48px;
  font-size: 16px;
  color: #adb5bd;
}
.comico-global-header02 .comico-global-header02__main-action2 {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0;
}
.comico-global-header02 .comico-global-header02__list-nav2 {
  display: inline-block;
  position: relative;
  vertical-align: top;
  padding-right: 10px;
}

.comico-global-header02 .comico-global-header02__list-nav2-item-inner {
  display: inline-block;
  line-height: 48px;
  padding: 0 10px;
  text-align: center;
  height: 48px;
  font-size: 14px;
  color: inherit;
}
.comico-global-header02 .comico-global-header02__search02 {
  display: block;
  vertical-align: middle;
  position: relative;
  width: 240px;
  padding-top: 20px;
}
.comico-global-header02
  .comico-global-header02__search02
  .comico-global-header02__search02-input {
  background: transparent;
  border: 1px solid #ced4da;
  border-radius: 50px;
  color: #212529;
  font-size: 13px;
  padding: 7px 50px 8px 22px;
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  z-index: 3;
  width: 240px;
}
input[type="tel"],
input[type="password"],
input[type="text"],
input[type="email"],
input[type="number"],
input[type="url"] {
  font-size: 12px;
  display: block;
  width: 100%;
  color: #212529;
  -webkit-appearance: none;
  box-shadow: none;
  border-radius: 0;
  padding: 5px 10px;
  border: 1px solid #dee2e6;
  background: #fff;
}
input,
select {
  vertical-align: middle;
  margin: 0;
}
.comico-global-header02
  .comico-global-header02__search02
  .comico-global-header02__search02-submit {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  color: transparent;
  position: absolute;
  top: 24px;
  right: 14px;
  z-index: 4;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.comico-global-header02 .i-search04,
.comico-global-header02 .i-search03,
.comico-global-header02 .i-search02 {
  width: 24px;
  height: 24px;
}
.i-search04 {
  background-image: url(//images.comico.jp/spn/spicon/search_04.png?1522303311);
}
.i-search04,
.i-search03,
.i-search02 {
  background-image: url(//images.comico.jp/spn/spicon/search_02.png?1522303311);
  width: 19px;
  height: 19px;
}
.i-score,
.i-score02,
.i-score03,
.i-score04,
.i-score05,
.i-score06,
.i-alert,
.i-coin,
.i-alarm-on,
.i-alarm-off,
.i-comment02,
.i-lock,
.i-good,
.i-bookshelf,
.i-bookshelf03,
.i-bookshelf04,
.i-menu04,
.i-menu03,
.i-bookshelf02,
.i-present,
.i-present02,
.i-present03,
.i-tail,
.i-tail02,
.i-close,
.i-close02,
.i-close03,
.i-contrib,
.i-contrib02,
.i-contrib03,
.i-search,
.i-search04,
.i-search03,
.i-search02,
.i-family-app,
.i-favorite02,
.i-favorite02-white,
.i-favorite02-active,
.i-favorite02-active-white,
.i-share,
.i-share02,
.i-sort,
.i-home,
.i-home02,
.i-web,
.i-web02,
.i-web03,
.i-view-tile,
.i-view-card,
.i-calendar,
.i-arrow,
.i-edit,
.i-new,
.i-switch,
.i-coin02,
.i-point,
.i-info,
.i-comicoplus,
.i-novel,
.i-bestchallenge,
.i-medal {
  display: inline-block;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  vertical-align: middle;
}
input,
select {
  vertical-align: middle;
  margin: 0;
}
input,
select,
textarea {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 100%;
  font-family: inherit;
}

user agent stylesheet input {
  padding: 1px 0px;
}
user agent stylesheet input {
  -webkit-appearance: textfield;
  background-color: white;
  -webkit-rtl-ordering: logical;
  cursor: text;
  padding: 1px;
  border-width: 2px;
  border-style: inset;
  border-color: initial;
  border-image: initial;
}
user agent stylesheet input {
  text-rendering: auto;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  margin: 0em;
  font: 400 13.3333px Arial;
}
user agent stylesheet input {
  -webkit-writing-mode: horizontal-tb !important;
}

.comico-global-header02 .comico-global-header02__list-nav2-item {
  display: inline-block;
  height: 48px;
  position: relative;
  vertical-align: top;
  white-space: nowrap;
}

.comico-global-header02 .comico-global-header02__list-nav2-item-inner {
  display: inline-block;
  line-height: 48px;
  padding: 0 10px;
  text-align: center;
  height: 48px;
  font-size: 14px;
  color: inherit;
}

.comico-global-header02 .comico-global-header02__switch-site {
  display: inline-block;
  font-size: 14px;
  height: 48px;
  vertical-align: top;
  padding-left: 24px;
  position: relative;
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav-item {
    height: 72px;
    font-weight: 500;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav-item-inner {
    line-height: 72px;
    height: 72px;
    font-size: 16px;
    padding: 0 20px;
    color: #212529;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav2-item {
    height: 72px;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav2-item-inner {
    line-height: 72px;
    height: 72px;
    padding: 0 12px;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__main {
    height: 72px;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__local,
  .comico-global-header02 .comico-global-header02__sub,
  .comico-global-header02 .comico-global-header02__main {
    position: relative;
    height: 64px;
  }
}
@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__site-logo {
    height: 72px;
  }
}

@media screen and (min-width: 1080px) {
  .comico-global-header02
    .comico-global-header02__site-logo
    .comico-global-header02__site-logo-inner {
    width: auto;
    line-height: 72px;
    background: none;
  }
}

a:hover {
  cursor: pointer;
}
@media screen and (min-width: 1080px) {
  .comico-global-header02
    .comico-global-header02__site-logo
    + .comico-global-header02__list-nav {
    padding-left: 20px;
  }
}
@media screen and (min-width: 1080px) {
  .stage .stage__body.stage__body--fixed-header2 {
    padding-top: 138px;
  }
}
@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav2-item {
    height: 72px;
  }
}
@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__list-nav2-item-inner {
    line-height: 72px;
    height: 72px;
    padding: 0 12px;
  }
}
@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__switch-site {
    height: 72px;
  }
}
.comico-global-header02
  .comico-global-header02__switch-site
  .comico-global-header02__switch-site-inner {
  vertical-align: middle;
  display: block;
  height: 48px;
  line-height: 48px;
}
@media screen and (min-width: 1080px) {
  .comico-global-header02
    .comico-global-header02__switch-site
    .comico-global-header02__switch-site-inner {
    height: 72px;
    line-height: 72px;
  }
}
.comico-global-header02
  .comico-global-header02__switch-site
  .comico-global-header02__switch-site-btn {
  display: inline-block;
  font-size: 14px;
  border: 1px solid #dee2e6;
  border-radius: 40px;
  padding: 9px 16px;
  line-height: 1;
  color: #495057;
  &:hover {
    border: 1px solid #f11;
  }
}
.comico-global-header02 .comico-global-header02__sub-category-list {
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
  text-align: center;
  padding-bottom: 0;
  display: table;
  width: 100%;
  font-size: 14px;
}
@media screen and (min-width: 1080px) {
  .comico-global-header02 .comico-global-header02__sub-category-list {
    table-layout: fixed;
    line-height: 64px;
    height: 64px;
    font-size: 16px;
  }
}
.comico-global-header02 .comico-global-header02__sub-category-item {
  vertical-align: top;
  text-align: center;
  display: table-cell;
  width: auto;
}
.comico-global-header02 .comico-global-header02__sub-category-item-inner {
  display: block;
  padding: 0 8px;
  // color: inherit;
  font-weight: normal;
  &:hover {
    color: #f11;
  }
}
.red {
  color: #f11;
}
</style>

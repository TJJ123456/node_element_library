<template>
  <div class="stage__body stage__body--fixed-header1">
    <userhead/>
    <div
      class="comico-global-search comico-global-search--show comico-global-search--static comico-global-search--wide o-pb0 o-mt20ws"
      style="margin-top: -50px;"
    >
      <div class="comico-global-search__action o-mb5">
        <div class="comico-global-search__form">
          <div class="comico-global-search__form-inner">
            <div class="comico-global-search__input-outer">
              <input
                type="text"
                class="comico-global-search__input _searchInput"
                v-model="keyword2"
                placeholder="按标题/作者姓名搜索"
              >
            </div>
            <button @click="search()" class="el-icon-search comico-global-search__submit _searchSubmit"></button>
            <div class="comico-global-search__form-border"></div>
          </div>
        </div>
      </div>
    </div>
    <p class="o-maxw640 o-mt10 o-center">
      合计
      <span class="o-txt-bold">{{showList.length}}个</span>搜索结果
    </p>
    <div class="horizontal-nav02 o-mt30ws horizontal-nav02--flex"></div>
    <div class="list-search-result">
      <ul class="list-search-result__list _searchList">
        <li class="list-search-result__item" v-for="(item, index) in showList" :key="index">
          <a class="list-search-result__item-inner" @click="toDetail(item._id)">
            <div class="list-search-result__cover">
              <div class="list-search-result__cover-inner">
                <img :src="getImgPath(item.filepath)" alt width="100%" height="100%">
              </div>
            </div>
            <div class="list-search-result__body">
              <p class="list-search-result__label1">{{item.name}}</p>
              <p class="list-search-result__label2">{{item.author}}</p>
              <p class="list-search-result__label3">{{item.desc}}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
export default {
  props: {
    keyword: {
      require: true
    }
  },
  data() {
    return {
      showList: [],
      loading: false,
      showBook: true,
      keyword2: ""
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  watch: {
    keyword(val) {
      this.initData();
    }
  },
  methods: {
    async initData() {
      this.loading = true;
      this.keyword2 = this.keyword;
      let list = await this.$fetch("book/usersearch", {
        method: "POST",
        body: JSON.stringify({
          keyword: this.keyword
        })
      });
      this.showList = list.data;
      this.loading = false;
    },
    getImgPath(path) {
      if (path && path !== "") return "http://localhost:3000" + path;
      return "http://localhost:3000/public/img/default.jpg";
    },
    search() {
      if (this.keyword2 !== "")
        this.$router.push({
          name: "search",
          params: { keyword: this.keyword2 }
        });
    },
    toDetail(id) {
      this.$router.push({ name: "bookDetail", params: { bookId: id } });
    }
  }
};
</script>
<style lang="less">
.comico-global-search.comico-global-search--static {
  position: static;
  background: transparent;
}
.comico-global-search.comico-global-search--show {
  opacity: 1;
  pointer-events: auto;
  display: block;
  display: block\9;
}
.comico-global-search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 4000;
  padding: 15px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #222;
  font-family: sans-serif;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  opacity: 0;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
  display: none;
  display: none\9;
}
.o-pb0 {
  padding-bottom: 0px !important;
}
@media screen and (min-width: 1080px) {
  .o-mt20ws {
    margin-top: 20px;
  }
}
.comico-global-search .comico-global-search__action {
  *zoom: 1;
  max-width: 640px;
  margin: 0 auto 18px;
}
.o-mb5 {
  margin-bottom: 5px !important;
}
.comico-global-search .comico-global-search__action:after,
.comico-global-search .comico-global-search__action:before {
  content: "";
  display: table;
}
.comico-global-search .comico-global-search__form {
  display: block;
}
.comico-global-search.comico-global-search--wide
  .comico-global-search__form-inner {
  margin-right: 0;
}
.comico-global-search .comico-global-search__form-inner {
  border-bottom: 2px solid transparent;
  margin-right: 75px;
  position: relative;
}
.comico-global-search .comico-global-search__input-outer {
  margin-right: 25px;
}
.comico-global-search .comico-global-search__input {
  border: none;
  font-size: 16px;
  line-height: 27px;
  height: 27px;
  padding: 0 5px 0 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  width: 100%;
  -webkit-appearance: none;
  background: transparent;
}
.comico-global-search .comico-global-search__action:after {
  clear: both;
}
.comico-global-search .comico-global-search__action:after,
.comico-global-search .comico-global-search__action:before {
  content: "";
  display: table;
}
.comico-global-search .comico-global-search__submit {
  position: absolute;
  top: 3px;
  right: 1px;
  display: block;
  border: none;
  font-size: 20px;
  background-color: #fff;
  width: 19px;
  height: 19px;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  -webkit-appearance: none;
  border-radius: 0;
  // color: transparent;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.comico-global-search.comico-global-search--show
  .comico-global-search__form-border {
  -moz-transform: scaleX(1);
  -ms-transform: scaleX(1);
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}
.comico-global-search .comico-global-search__form-border {
  display: block;
  height: 2px;
  width: 100%;
  background: #222;
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  -moz-transform: scaleX(0);
  -ms-transform: scaleX(0);
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -moz-transform-origin: 0 50%;
  -ms-transform-origin: 0 50%;
  -webkit-transform-origin: 0 50%;
  transform-origin: 0 50%;
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -moz-transition-delay: 0.4s;
  -o-transition-delay: 0.4s;
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
.o-maxw640 {
  max-width: 640px;
  margin: 0 auto;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.o-center {
  text-align: center;
}
.o-mt10 {
  margin-top: 10px !important;
}
.o-txt-bold {
  font-weight: bold;
}
.horizontal-nav02 {
  height: 40px;
  width: 100%;
  line-height: 40px;
  overflow: hidden;
  color: #999;
  white-space: nowrap;
  position: relative;
  border-bottom: 1px solid #ced4da;
}
.list-search-result {
  font-size: 12px;
  color: #868e96;
}
.list-search-result .list-search-result__item {
  position: relative;
  z-index: 2;
  background: #fff;
}
.o-hidden {
  display: none;
}
@media screen and (min-width: 1080px) {
  .list-search-result .list-search-result__item {
    max-width: 1080px;
    margin: 15px auto;
  }
}
.list-search-result .list-search-result__item-inner {
  width: 100%;
  display: table;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  table-layout: fixed;
  position: relative;
  z-index: 1;
}
.list-search-result a {
  color: inherit;
}
.list-search-result .list-search-result__cover {
  display: table-cell;
  width: 100px;
  height: 100px;
  vertical-align: middle;
  position: relative;
}
@media screen and (min-width: 1080px) {
  .list-search-result .list-search-result__cover {
    width: 150px;
    height: 150px;
  }
}
.list-search-result .list-search-result__cover-inner {
  width: 100px;
  height: 100px;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: #fff;
}
@media screen and (min-width: 1080px) {
  .list-search-result .list-search-result__cover-inner {
    width: 150px;
    height: 150px;
  }
}
.list-search-result .list-search-result__body {
  display: table-cell;
  padding: 0 12px;
  vertical-align: middle;
}
@media screen and (min-width: 1080px) {
  .list-search-result .list-search-result__body {
    padding: 0 20px;
  }
}
.list-search-result .list-search-result__label1 {
  color: #222;
  font-size: 14px;
  margin-bottom: 1px;
}
.list-search-result .list-search-result__label1,
.list-search-result .list-search-result__label2,
.list-search-result .list-search-result__label3,
.list-search-result .list-search-result__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.list-search-result .list-search-result__label2 {
  margin-bottom: 7px;
  min-height: 1em;
}
.list-search-result .list-search-result__label3 {
  font-size: 11px;
  margin-bottom: 2px;
}
</style>

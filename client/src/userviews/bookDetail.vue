<template>
  <div>
    <userhead/>
    <div class="stage__body stage__body--fixed-header1">
      <div class="article-hero08">
        <div class="article-hero08__bg-image">
          <div class="article-hero08__inner">
            <div class="article-hero08__inner2 full-size-cnt">
              <div class="article-hero08__cover">
                <div class="article-hero08__cover-image">
                  <img :src="getImgPath(bookDetail.filepath)" alt>
                </div>
              </div>
              <div class="article-hero08__body">
                <h1
                  class="article-hero08__title"
                  style="opacity: 1; height: auto;"
                >{{bookDetail.name}}</h1>
                <ul class="article-hero08__list-meta">
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">{{bookDetail.author}}</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">|</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__publisher">{{bookDetail.publisher}}</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">|</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">点击次数：{{bookDetail.allClick}}</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">|</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">借阅次数：{{bookDetail.lendTimes}}</p>
                  </li>
                </ul>
                <ul class="article-hero08__list-genre">
                  <li
                    v-for="(item, index) in bookDetail.genreNamelist"
                    :key="index"
                    class="article-hero08__list-genre-item"
                  >
                    <p class="article-hero08__genre">{{item}}</p>
                  </li>
                </ul>
                <div class="article-hero08__description">
                  <div class="article-hero08__description-inner">
                    <p class="_description" style="opacity: 1;">{{bookDetail.desc}}</p>
                  </div>
                </div>
                <ul class="article-hero08__list-meta" style="margin-top:25px;">
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">未借阅数量：{{bookDetail.remaining}}</p>
                  </li>
                </ul>
                <ul class="article-hero08__action">
                  <li class="article-hero08__action-item o-large-screen-object">
                    <a
                      v-if="!borrowInfo"
                      @click="borrow()"
                      class="btn03 btn03--large btn03--special"
                      :class="{'btn03--noremain':bookDetail.remaining <= 0}"
                    >借阅</a>
                    <a @click="backBook()" v-else class="btn03 btn03--large btn03--special">还书</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="sort-bar05 sort-bar05--t01">
          <div class="sort-bar05__inner">
            <p class="sort-bar05__heading sort-bar05__heading--t01">相关图书</p>
          </div>
        </div>
        <div class="list-article04">
          <div class="list-article04__inner">
            <ul class="list-article04__list _articleList full-size-list">
              <li
                v-for="(item, index) in relateList"
                :key="index"
                class="list-article04__item full-size-item"
              >
                <a @click="toDetail(item._id)">
                  <div class="list-article04__cover">
                    <div class="list-article04__cover-inner-full">
                      <span class="auto-size-cnt">
                        <img
                          :src="getImgPath(item.filepath)"
                          alt
                          class="list-article04__cover-full"
                        >
                        <p class="list-article04__work-title _listTitle">{{item.name}}</p>
                        <p
                          class="list-article04__label2"
                        >{{item.author}}·{{getGenre(item.genreNamelist)}}</p>
                      </span>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      loading: false,
      bookDetail: {},
      borrowInfo: {},
      relateList: []
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  watch: {
    bookId(val, oldval) {
      if (val !== oldval) {
        this.initData();
      }
    }
  },
  computed: {
    checkBorrowIsMe() {
      // console.log(this.bookDetail.state, this.borrowInfo);
      // if (
      //   this.bookDetail.state !== "可借阅" &&
      //   this.borrowInfo &&
      //   this.$state.user &&
      //   this.borrowInfo.reader === this.$state.user._id
      // ) {
      //   return true;
      // }
      return false;
    }
  },
  methods: {
    getNameAndGenres() {},
    async initData() {
      this.loading = true;
      let book = await this.$fetch("book/detail", {
        method: "POST",
        body: JSON.stringify({
          id: this.bookId
        })
      });
      this.bookDetail = book.book;
      this.relateList = book.relateList;
      this.borrowInfo = book.borrowInfo;
      this.loading = false;
    },
    getImgPath(path) {
      if (path && path !== "") return "http://localhost:3000" + path;
      return "http://localhost:3000/public/img/default.jpg";
    },
    getGenre(arr) {
      let str = "";
      for (let i = 0; i < arr.length; ++i) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ",";
        }
      }
      return str;
    },
    async borrow() {
      if (this.bookDetail.remaining <= 0) {
        return;
      }
      let data = await this.$fetch("bookinstance/borrow", {
        method: "POST",
        body: JSON.stringify({
          id: this.bookId
        })
      });
      if (data.err) {
        if (data.msg === "请登录") {
          console.log("path", this.$route.path);
          this.$router.replace({
            name: "userLogin",
            params: { wantedRoute: this.$route.path }
          });
        } else if (data.msg === "您现在不能借书") {
          this.$alert(data.msg, "", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          showClose: true,
          message: "借书成功",
          type: "success"
        });
        // this.initData();
        this.bookDetail = data.book;
        this.borrowInfo = data.borrowInfo;
      }
    },
    async backBook() {

      let data = await this.$fetch("bookinstance/backBook", {
        method: "POST",
        body: JSON.stringify({
          id: this.borrowInfo.bookinstanceid
        })
      });
      if (data.err) {
        if (data.msg === "请登录") {
          this.$router.replace({
            name: "userLogin",
            params: { wantedRoute: this.$route.path }
          });
        }
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          showClose: true,
          message: "还书成功",
          type: "success"
        });
        this.bookDetail = data.book;
        this.borrowInfo = data.borrowInfo;
      }
    },
    toDetail(id) {
      this.$router.push({ name: "bookDetail", params: { bookId: id } });
    }
  },
  props: {
    bookId: {
      required: true
    }
  }
};
</script>
<style scoped>
ul {
  padding-inline-start: 0;
}
</style>

<style lang="less">
.stage .stage__body.stage__body--fixed-header1 {
  margin-top: -48px;
}
@media screen and (min-width: 1080px) {
  .stage .stage__body.stage__body--fixed-header1 {
    margin-top: -56px;
  }
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

.article-hero08 {
  padding-bottom: 32px;
  background: #fff;
  position: relative;
  z-index: 3;
}
@media screen and (min-width: 1080px) {
  .article-hero08 {
    background: none;
  }
}
@media screen and (min-width: 1080px) {
  .article-hero08 {
    padding-bottom: 0;
    margin-bottom: -4px;
    position: static;
  }
}
.article-hero08 .article-hero08__bg-image {
  background: 50% 50% no-repeat;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__bg-image {
    background: none !important;
  }
}
.article-hero08 .article-hero08__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 16px 0;
  color: #fff;
  position: relative;
  bottom: -24px;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__inner {
    bottom: 0;
    padding: 40px 0;
    color: #495057;
    border-bottom: 1px solid #e9ecef;
  }
}
.article-hero08 .article-hero08__inner2.full-size-cnt {
  display: block;
}
.article-hero08 .article-hero08__inner2 {
  width: 100%;
  display: table;
  table-layout: fixed;
}
.article-hero08 .article-hero08__inner2.full-size-cnt .article-hero08__cover {
  height: auto;
  width: auto;
  height: unset;
  width: unset;
}
.article-hero08 .article-hero08__cover {
  display: table-cell;
  width: 112px;
  height: 160px;
  vertical-align: top;
  position: relative;
  z-index: 1;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__cover {
    width: 240px;
    height: 340px;
  }
}
.article-hero08
  .article-hero08__inner2.full-size-cnt
  .article-hero08__cover
  .article-hero08__cover-image {
  height: auto;
  width: auto;
  height: unset;
  width: unset;
}
.article-hero08 .article-hero08__cover-image {
  background: 50% 50% no-repeat;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
  width: 112px;
  height: 160px;
  position: relative;
}
.article-hero08
  .article-hero08__inner2.full-size-cnt
  .article-hero08__cover
  .article-hero08__cover-image
  img {
  height: 160px;
  width: auto;
  opacity: 1;
}
.article-hero08 .article-hero08__cover-image .article-hero08__cover-image-img {
  pointer-events: none;
  width: 100%;
  height: 100%;
  opacity: 0;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__cover-image {
    width: 240px;
    height: 340px;
  }
}
@media screen and (min-width: 860px) {
  .article-hero08
    .article-hero08__inner2.full-size-cnt
    .article-hero08__cover
    .article-hero08__cover-image
    img {
    height: 340px;
  }
}
.article-hero08 .article-hero08__body {
  display: table-cell;
  vertical-align: top;
  padding-left: 16px;
  font-size: 13px;
  position: relative;
  padding-bottom: 35px;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__body {
    padding-left: 40px;
    font-size: 16px;
    padding-bottom: 72px;
  }
}
.article-hero08 .article-hero08__title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  opacity: 0;
  height: 2em;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__title {
    font-size: 40px;
    line-height: 1.3;
    margin-bottom: 14px;
  }
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__list-meta {
    margin-bottom: 16px;
    font-size: 0;
  }
}
.article-hero08 .article-hero08__list-meta-item {
  margin-bottom: 4px;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__list-meta-item:first-child {
    margin-left: 0;
    padding-left: 0;
  }
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__list-meta-item {
    display: inline-block;
    margin-bottom: 0;
    position: relative;
    padding-left: 9px;
    margin-left: 8px;
    font-size: 14px;
  }
}
.article-hero08 .article-hero08__publisher,
.article-hero08 .article-hero08__author {
  color: rgba(255, 255, 255, 0.6);
}
.article-hero08 .article-hero08__author {
  font-feature-settings: normal;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__publisher,
  .article-hero08 .article-hero08__author {
    color: #868e96;
  }
}
.article-hero08 .article-hero08__publisher,
.article-hero08 .article-hero08__author {
  color: rgba(255, 255, 255, 0.6);
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__publisher,
  .article-hero08 .article-hero08__author {
    color: #868e96;
  }
}

// p {
//   display: block;
//   margin-block-start: 1em;
//   margin-block-end: 1em;
//   margin-inline-start: 0px;
//   margin-inline-end: 0px;
// }
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__list-genre {
    margin-bottom: 16px;
    font-size: 0;
  }
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__list-genre-item {
    font-size: 16px;
    margin-right: 12px;
  }
  .article-hero08 .article-hero08__list-genre-item {
    font-size: 13px;
    display: inline-block;
  }
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__genre {
    text-decoration: underline;
  }
}
.article-hero08 .article-hero08__description {
  display: none;
  margin-top: 24px;
  position: relative;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__description {
    display: block;
  }
}
.article-hero08
  .article-hero08__description
  .article-hero08__description-inner {
  font-size: 14px;
  line-height: 1.6;
  max-height: 70px;
  overflow: hidden;
  position: relative;
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
.article-hero08 .article-hero08__action {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 0;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__action {
    right: auto;
    left: 40px;
    width: 100%;
  }
}
.article-hero08
  .article-hero08__action
  .article-hero08__action-item:first-child {
  margin-left: 0;
}

.article-hero08 .article-hero08__action .article-hero08__action-item {
  display: inline-block;
  margin-left: 16px;
  vertical-align: middle;
  position: relative;
}
@media screen and (min-width: 1080px) {
  .article-hero08 .article-hero08__action .article-hero08__action-item {
    margin-left: 24px;
  }
}

.article-hero08
  .article-hero08__action
  .article-hero08__action-item
  .btn03.btn03--large {
  background: none;
}
.btn03.btn03--special {
  border-color: #f40009;
  color: #f40009;
  font-weight: 500;
}

.btn03.btn03--noremain {
  border-color: gray;
  color: gray;
  font-weight: 500;
}

.btn03.btn03--large {
  padding: 9px 20px;
  font-size: 14px;
}
.article-hero08 a {
  color: inherit;
}
.btn03 {
  display: inline-block;
  font-size: 13px;
  padding: 6px 23px;
  border: 1px solid #ced4da;
  color: #495057;
  border-radius: 40px;
  background: #fff;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  text-align: center;
  min-width: 33px;
  position: relative;
  line-height: 1.67;
  -moz-user-select: -moz-none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
@media screen and (min-width: 1080px) {
  .article-hero08
    .article-hero08__action
    .article-hero08__action-item
    .btn03.btn03--large {
    border-width: 2px;
    min-width: 200px;
    padding: 10px 20px;
    font-size: 16px;
  }
}
.article-hero08
  .article-hero08__action
  .article-hero08__action-item
  .btn03.btn03--large:hover {
  opacity: 0.6;
}
.sort-bar05 {
  text-align: right;
  margin: 20px 0 0;
  position: relative;
  z-index: 2;
}
@media screen and (min-width: 1080px) {
  .sort-bar05.sort-bar05--t01 {
    padding: 0;
    margin: 36px 0 32px;
  }
}

@media screen and (min-width: 1080px) {
  .sort-bar05 {
    padding: 0;
    margin: 28px 0 24px;
  }
}
.sort-bar05 .sort-bar05__inner {
  *zoom: 1;
  max-width: 1080px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 16px 16px;
  border-bottom: 1px solid rgba(222, 226, 230, 0.6);
}
@media screen and (min-width: 1080px) {
  .sort-bar05.sort-bar05--t01 .sort-bar05__inner {
    border-bottom: none;
    padding-bottom: 0;
  }
}

@media screen and (min-width: 1080px) {
  .sort-bar05 .sort-bar05__inner {
    padding: 0 0 16px;
  }
}
.sort-bar05 .sort-bar05__heading {
  float: left;
  line-height: 1;
  font-size: 13px;
  color: #212529;
  font-weight: normal;
  position: relative;
  height: 13px;
}
@media screen and (min-width: 1080px) {
  .sort-bar05 .sort-bar05__heading.sort-bar05__heading--t01 {
    font-size: 14px;
  }
}

@media screen and (min-width: 1080px) {
  .sort-bar05 .sort-bar05__heading {
    font-size: 16px;
    height: 16px;
  }
}
.list-article04 {
  font-size: 12px;
  color: #222;
  max-width: 1096px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto 0;
  background: #fff;
  padding-top: 20px;
}
@media screen and (min-width: 1080px) {
  .list-article04 {
    margin: 24px auto 0;
    padding-top: 0;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 {
    background: transparent;
  }
}
.list-article04 .list-article04__list.full-size-list {
  clear: both;
  overflow: hidden;
  padding: 0 8px;
}
.list-article04 .list-article04__list {
  *zoom: 1;
  padding: 0 8px;
}

.list-article04 .list-article04__item:nth-child(3n + 1) {
  clear: both;
}
.list-article04 .list-article04__item.full-size-item {
  display: inline-block;
  text-align: left;
  padding: 0 10px;
}
.list-article04 .list-article04__item {
  position: relative;
  z-index: 2;
  margin-bottom: 6px;
  padding: 0 8px;
  float: left;
  width: 33%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item.full-size-item:nth-child(4n + 1) {
    clear: none;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__list.full-size-list .full-size-item {
    width: 202px;
    margin: 0 17.5px 20px 0;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__item:nth-child(4n + 1),
  .list-article04 .list-article04__item:nth-child(3n + 1),
  .list-article04 .list-article04__item:nth-child(2n + 1) {
    clear: none;
  }
}
@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__list.full-size-list {
    padding: 0;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__list {
    padding: 0;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item.full-size-item:nth-child(4n + 1) {
    clear: none;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__list.full-size-list .full-size-item {
    width: 202px;
    margin: 0 17.5px 20px 0;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__item:nth-child(4n + 1),
  .list-article04 .list-article04__item:nth-child(3n + 1),
  .list-article04 .list-article04__item:nth-child(2n + 1) {
    clear: none;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item.full-size-item {
    width: 202px;
    margin: 0 17.5px 20px 0;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item:nth-child(4n + 1) {
    clear: both;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item:nth-child(5n + 1),
  .list-article04 .list-article04__item:nth-child(3n + 1),
  .list-article04 .list-article04__item:nth-child(2n + 1) {
    clear: none;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__item {
    width: 20%;
    clear: none;
  }
}

@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item {
    width: 25%;
    clear: none;
  }
}

@media screen and (min-width: 1080px) {
  .list-article04 .list-article04__item {
    margin-bottom: 20px;
    padding: 0 10px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -webkit-transform: translateY(0);
    transform: translateY(0);
    -moz-transition-property: -moz-transform, -webkit-transform, box-shadow;
    -o-transition-property: -o-transform, -webkit-transform, box-shadow;
    -webkit-transition-property: -webkit-transform, -webkit-transform,
      box-shadow;
    transition-property: transform, -webkit-transform, box-shadow;
    -moz-transition-duration: 0.2s;
    -o-transition-duration: 0.2s;
    -webkit-transition-duration: 0.2s;
    transition-duration: 0.2s;
    -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
}
.list-article04 .list-article04__item-inner {
  width: 100%;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  table-layout: fixed;
  max-width: 1080px;
  margin: 0 auto;
  display: block;
  top: 0;
}
.list-article04 a {
  color: inherit;
}
.list-article04 .list-article04__list.full-size-list .list-article04__cover {
  margin-bottom: 53px;
}
.list-article04 .list-article04__cover {
  vertical-align: middle;
  position: relative;
  display: block;
  width: auto;
  height: auto;
}
.list-article04 .list-article04__cover-inner-full {
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background: none;
  width: 100%;
}
@media screen and (min-width: 1080px) {
  .list-article04
    .list-article04__list.full-size-list
    .full-size-item
    .list-article04__cover-inner-full {
    background: none;
  }
}
.list-article04 .list-article04__cover-inner-full span.auto-size-cnt {
  position: relative;
  display: table-cell;
}
.list-article04 .list-article04__cover-full {
  width: auto;
  height: 124px;
  max-width: 100%;
}
@media screen and (min-width: 1080px) {
  .list-article04
    .list-article04__list.full-size-list
    .full-size-item
    .list-article04__cover-inner-full
    img {
    max-width: 202px;
    position: relative;
    display: block;
  }
}
@media screen and (min-width: 860px) {
  .list-article04 .list-article04__item .list-article04__cover-full {
    width: auto;
    height: 250px;
  }
}
.sort-bar05 .sort-bar05__inner:after,
.sort-bar05 .sort-bar05__inner:before {
  content: "";
  display: table;
}
.sort-bar05 .sort-bar05__inner:after {
  clear: both;
}
.sort-bar05 .sort-bar05__inner:after,
.sort-bar05 .sort-bar05__inner:before {
  content: "";
  display: table;
}
.list-article04 .list-article04__work-title {
  position: absolute;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  bottom: -31px;
}
@media screen and (min-width: 1080px) {
  .list-article04
    .list-article04__list.full-size-list
    .list-article04__work-title {
    font-weight: bold;
  }
}
.list-article04
  .list-article04__list.full-size-list
  .list-article04__cover
  .list-article04__label2 {
  position: absolute;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  bottom: -58px;
}
.list-article04 .list-article04__label2 {
  margin-bottom: 7px;
  min-height: 1em;
  color: #868e96;
}
.list-article04 .list-article04__label1,
.list-article04 .list-article04__label2,
.list-article04 .list-article04__label3,
.list-article04 .list-article04__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.list-article04 .list-article04__cover-inner-full span.auto-size-cnt:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid rgba(33, 37, 41, 0.1);
}
@media screen and (min-width: 1080px) {
  .list-article04
    .list-article04__list.full-size-list
    .full-size-item
    .list-article04__cover-inner-full
    span.auto-size-cnt:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(33, 37, 41, 0.1);
  }
}

@media screen and (min-width: 1080px) {
  .list-article04
    .list-article04__list.full-size-list
    .full-size-item
    .list-article04__cover-inner-full
    span:after {
    display: none;
  }
}
@media screen and (min-width: 1097px) {
  .list-article04
    .list-article04__list.full-size-list
    .full-size-item:nth-child(5n) {
    margin-right: 0;
  }
}
</style>

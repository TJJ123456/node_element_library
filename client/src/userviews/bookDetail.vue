<template>
  <div>
    <userhead/>
    <div class="stage__body stage__body--fixed-header1">
      <div class="article-hero08">
        <div class="article-hero08__bg-image">
          <div class="article-hero08__inner">
            <div class="article-hero08__inner2 full-size-cnt">
              <div class="article-hero08__cover">
                <div
                  class="article-hero08__cover-image"
                  style="background-image:url(http://comicimg.comico.jp/store/2/title/38692/th_de12e2cc.png);"
                >
                  <img src="http://comicimg.comico.jp/store/2/title/38692/th_de12e2cc.png" alt>
                </div>
              </div>
              <div class="article-hero08__body">
                <h1 class="article-hero08__title" style="opacity: 1; height: auto;">书名</h1>
                <ul class="article-hero08__list-meta">
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">作者</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__author">|</p>
                  </li>
                  <li class="article-hero08__list-meta-item">
                    <p class="article-hero08__publisher">出版社</p>
                  </li>
                </ul>
              </div>
            </div>
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
      borrowInfo: {}
    };
  },
  activated() {
    // this.initData();
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
    async initData() {
      this.loading = true;
      let book = await this.$fetch("book/detail", {
        method: "POST",
        body: JSON.stringify({
          id: this.bookId
        })
      });
      this.bookDetail = book.book;
      // this.borrowInfo = book.borrowInfo;
      this.loading = false;
    },
    getImgPath(path) {
      if (path && path !== "") return "http://localhost:3000" + path;
      return "http://localhost:3000/public/img/default.jpg";
    },
    async borrow() {
      let data = await this.$fetch("book/borrow", {
        method: "POST",
        body: JSON.stringify({
          id: this.bookId
        })
      });
      if (data.err) {
        if (data.msg === "请登录") {
          this.$router.replace("/home/login", "");
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
        this.bookDetail = data.book;
        this.borrowInfo = data.borrowInfo;
      }
    },
    async backBook() {
      let data = await this.$fetch("book/backBook", {
        method: "POST",
        body: JSON.stringify({
          id: this.bookId
        })
      });
      if (data.err) {
        if (data.msg === "请登录") {
          this.$router.replace("/home/login", "");
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
        this.borrowInfo = null;
      }
    }
  },
  props: {
    bookId: {
      required: true
    }
  }
};
</script>
<style lang="less" scoped>
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

p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>

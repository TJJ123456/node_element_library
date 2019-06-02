<template>
  <div>
    <userhead/>
    <div class="grid-nav02 o-large-screen-object">
      <div class="grid-nav02__inner">
        <table class="grid-nav02__table _largeScreenNavItems">
          <tbody>
            <tr v-for="(item, index) in showGenreList" :key="index">
              <td
                class="grid-nav02__item"
                :class="index * 6 + j === genreIndex? 'grid-nav02__item--focus': ''"
                v-for="(genre, j) in item"
                :key="j"
              >
                <a @click="choiceGenre(index, j)" class="grid-nav02__item-inner">{{genre.name}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="sort-bar05 _orderTypeContainer">
      <div class="sort-bar05__inner">
        <h1 class="sort-bar05__heading o-large-screen-object _genreName">{{getGenreName}}</h1>
        <ul class="sort-bar05__list">
          <li class="sort-bar05__item" :class="{'sort-bar05__item--focus':sortType === 0}">
            <a @click="sortType = 0">时间排序</a>
          </li>
          <li class="sort-bar05__item" :class="{'sort-bar05__item--focus':sortType === 1}">
            <a @click="sortType = 1">人气排序</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="list-article02 list-article02--type-tile">
      <ul class="list-article02__list _resizeTitleList _titleList" style="opacity: 1;">
        <li class="list-article02__item _titleItem" v-for="(item, index) in showList" :key="index">
          <a @click="toDetail(item._id)" class="list-article02__item-inner">
            <div class="list-article02__cover">
              <div class="list-article02__cover-inner">
                <img :src="getImgPath(item.filepath)" alt class="list-article02__cover-img">
                <div class="list-article02__cover-layer">
                  <p>{{item.desc}}</p>
                </div>
              </div>
            </div>
            <div class="list-article02__body">
              <p class="list-article02__label1">{{item.name}}</p>
              <p class="list-article02__label3">{{item.author}}</p>
              <div class="list-article02__body-footer">
                <div class="list-article02__label4">
                  <p class="list-article02__score">
                    <i class="el-icon-view"></i>
                    {{item.allClick}}人
                  </p>
                  <!-- <p class="list-article02__genre">{{getGenre(item.genreNames)}}</p> -->
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      bookList: [],
      genres: [],
      bookShelflist: [],
      showGenreList: [],

      shelfIndex: -1,
      sortType: 0,
      genreIndex: 0,
      showBook: true
    };
  },
  computed: {
    showList() {
      if (this.bookShelflist.length === 0) {
        return [];
      }
      let list = this.bookShelflist[this.genreIndex].bookInfoList;
      switch (this.sortType) {
        case 0:
          list.sort((a, b) => {
            return b.time - a.time;
          });
          break;
        case 1:
          list.sort((a, b) => {
            return b.allClick - a.allClick;
          });
          break;
      }
      return list;
    },
    getGenreName() {
      if (this.bookShelflist.length > 0) {
        return this.bookShelflist[this.genreIndex].name;
      }
      return "";
    }
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  methods: {
    async initData() {
      this.loading = true;
      let genreList = await this.$fetch("genre/list");
      let bookShelflist = await this.$fetch("bookshelf/list");
      let booklist = await this.$fetch("book/list");
      this.genres = genreList.data;

      this.bookShelflist = bookShelflist.data;
      let showLength = Math.ceil(this.bookShelflist.length / 6);
      for (let i = 0; i < showLength; ++i) {
        let arr = [];
        for (let j = 0; j < 6; ++j) {
          let pos = i * 6 + j;
          if (pos >= this.bookShelflist.length) {
            break;
          }
          arr.push(this.bookShelflist[pos]);
        }
        this.showGenreList.push(arr);
      }
      this.bookList = booklist.data;
      this.loading = false;
    },
    getImgPath(path) {
      if (path && path !== "") return "http://localhost:3000" + path;
      return "http://localhost:3000/public/img/default.jpg";
    },
    clickShelf(index) {
      this.shelfIndex = index;
      this.delayshow();
    },
    clickgenre(index) {
      this.genreIndex = index;
      this.delayshow();
    },
    delayshow() {
      this.showBook = false;
      setTimeout(() => {
        this.showBook = true;
      }, 200);
    },
    toDetail(id) {
      this.$router.push({ name: "bookDetail", params: { bookId: id } });
    },
    choiceGenre(i, j) {
      this.genreIndex = i * 6 + j;
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
    toDetail(id) {
      this.$router.push({ name: "bookDetail", params: { bookId: id } });
    }
  }
};
</script>
<style lang="less" scoped>
.grid-nav02 {
  max-width: 1080px;
  margin: 40px auto 32px;
  color: #212529;
}
.grid-nav02 .grid-nav02__table {
  width: 100%;
  table-layout: fixed;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.grid-nav02 .grid-nav02__item.grid-nav02__item--focus {
  color: #f40009;
  border-color: #f40009;
  position: relative;
}
.grid-nav02 .grid-nav02__item {
  border: 1px solid #dee2e6;
  vertical-align: middle;
  text-align: center;
  font-size: 14px;
  width: 1%;
}
.grid-nav02 .grid-nav02__item.grid-nav02__item--focus:before {
  content: "";
  display: block;
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  margin: auto;
  border: 2px solid #f40009;
  pointer-events: none;
}
.grid-nav02 .grid-nav02__item-inner {
  display: block;
  line-height: 47px;
}
.grid-nav02 a {
  color: inherit;
}
a {
  margin: 0;
  padding: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
  color: #2569ce;
  text-decoration: none;
}
.sort-bar05 {
  text-align: right;
  margin: 20px 0 0;
  position: relative;
  z-index: 2;
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
.sort-bar05 .sort-bar05__inner:after,
.sort-bar05 .sort-bar05__inner:before {
  content: "";
  display: table;
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
.sort-bar05 .sort-bar05__inner:after {
  clear: both;
}
.sort-bar05 .sort-bar05__inner:after,
.sort-bar05 .sort-bar05__inner:before {
  content: "";
  display: table;
}
@media screen and (min-width: 1080px) {
  .sort-bar05 .sort-bar05__heading {
    font-size: 16px;
    height: 16px;
  }
}
.sort-bar05 .sort-bar05__list {
  float: right;
  font-size: 0;
  line-height: 1;
}
.sort-bar05 .sort-bar05__item.sort-bar05__item--focus {
  color: #f11;
}
.sort-bar05 .sort-bar05__item {
  font-size: 13px;
  display: inline-block;
  position: relative;
  color: #868e96;
  padding-left: 12px;
}
.sort-bar05 .sort-bar05__item.sort-bar05__item--focus a {
  color: #f11;
}
.sort-bar05 .sort-bar05__item a {
  font-size: 13px;
  color: #868e96;
}
@media screen and (min-width: 1080px) {
  .sort-bar05 .sort-bar05__item {
    padding-left: 17px;
  }
}
.list-article02.list-article02--type-tile {
  padding: 15px 15px 5px;
  max-width: 1096px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  border-top: none;
}
.list-article02 {
  font-size: 13px;
  color: #212529;
  margin-top: -1px;
  position: relative;
  z-index: 1;
}
@media screen and (min-width: 1080px) {
  .list-article02.list-article02--type-tile {
    padding: 0 0 5px 0;
    margin: 15px auto 0;
  }
}
.list-article02.list-article02--type-tile .list-article02__item {
  float: left;
  margin: 0 1% 16px;
  padding: 16px;
  border: 1px solid #dee2e6;
  box-sizing: border-box;
  margin: 0 0 16px;
  width: 100%;
}
.list-article02 .list-article02__item:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.list-article02 .list-article02__item {
  position: relative;
  z-index: 2;
  background: #fff;
}

@media screen and (min-width: 520px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(3n + 1) {
    clear: both;
  }
}

@media screen and (min-width: 520px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(5n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(4n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(2n + 1) {
    clear: none;
  }
}

@media screen and (min-width: 520px) {
  .list-article02.list-article02--type-tile .list-article02__item {
    width: 31.3%;
    clear: none;
    margin: 0 1% 16px;
  }
}

@media screen and (min-width: 860px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(4n + 1) {
    clear: both;
  }
}

@media screen and (min-width: 860px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(5n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(3n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(2n + 1) {
    clear: none;
  }
}
@media screen and (min-width: 860px) {
  .list-article02.list-article02--type-tile .list-article02__item {
    width: 23%;
    clear: none;
  }
}

@media screen and (min-width: 1080px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(5n + 1) {
    clear: both;
  }
}

@media screen and (min-width: 1080px) {
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(4n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(3n + 1),
  .list-article02.list-article02--type-tile
    .list-article02__item:nth-child(2n + 1) {
    clear: none;
  }
}
@media screen and (min-width: 1080px) {
  .list-article02.list-article02--type-tile .list-article02__item {
    width: 18%;
    clear: none;
    margin-bottom: 40px;
  }
}
@media screen and (min-width: 1080px) {
  .list-article02.list-article02--type-tile .list-article02__item {
    background: transparent;
    padding: 0;
    border: none;
    margin-bottom: 40px;
  }
}

.list-article02.list-article02--type-tile .list-article02__item-inner {
  display: block;
  top: 0;
}
.list-article02 .list-article02__item-inner {
  width: 100%;
  display: table;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  table-layout: fixed;
  max-width: 1080px;
  margin: 0 auto;
}
.list-article02 a {
  color: inherit;
}
.list-article02.list-article02--type-tile .list-article02__cover {
  display: block;
  width: auto;
  height: auto;
}
.list-article02 .list-article02__cover {
  display: table-cell;
  width: 112px;
  height: 112px;
  vertical-align: middle;
  position: relative;
}
.list-article02.list-article02--type-tile .list-article02__cover-inner {
  width: 100%;
  height: auto;
  position: relative;
}
.list-article02 .list-article02__cover-inner {
  width: 100%;
  height: 100%;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: #fff;
  position: relative;
}
.list-article02.list-article02--type-tile .list-article02__cover-img {
  width: 100%;
  max-height: 260px;
  height: auto;
  opacity: 1;
  display: block;
}
.list-article02.list-article02--type-tile .list-article02__cover-layer {
  display: block;
}

.list-article02.list-article02--type-tile .list-article02__cover-inner:after {
  content: "";
  position: absolute;
  width: auto;
  height: auto;
  background: transparent;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: block;
}

.list-article02__cover-inner:hover .list-article02__cover-layer {
  opacity: 1;
}

.list-article02 .list-article02__cover-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 20px;
  font-size: 14px;
  overflow: hidden;
  line-height: 1.5;
  opacity: 0;
  -webkit-backdrop-filter: blur(5px);
  -moz-transition-property: all;
  -o-transition-property: all;
  -webkit-transition-property: all;
  transition-property: all;
  -moz-transition-duration: 0.25s;
  -o-transition-duration: 0.25s;
  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;
  -moz-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -o-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  display: none;
  &:hover {
    opacity: 1;
  }
}

.list-article02.list-article02--type-tile .list-article02__list:after,
.list-article02.list-article02--type-tile .list-article02__list:before {
  content: "";
  display: table;
}
.list-article02.list-article02--type-tile .list-article02__list:after {
  clear: both;
}
.list-article02.list-article02--type-tile .list-article02__list:after,
.list-article02.list-article02--type-tile .list-article02__list:before {
  content: "";
  display: table;
}
.list-article02.list-article02--type-tile .list-article02__body {
  display: block;
  padding: 8px 0 0;
}
.list-article02 .list-article02__body02,
.list-article02 .list-article02__body {
  display: table-cell;
  padding: 12px;
  vertical-align: top;
  position: relative;
}

.list-article02.list-article02--type-tile .list-article02__label1 {
  margin-bottom: 4px;
}

.list-article02 .list-article02__label1 {
  font-size: 13px;
  margin-bottom: 2px;
  font-weight: 500;
  line-height: 1.57;
}
.list-article02 .list-article02__label1,
.list-article02 .list-article02__label2,
.list-article02 .list-article02__label3,
.list-article02 .list-article02__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
@media screen and (min-width: 1080px) {
  .list-article02 .list-article02__label1 {
    font-size: 14px;
  }
}
.list-article02.list-article02--type-tile .list-article02__label1 {
  margin-bottom: 4px;
}
.list-article02 .list-article02__label1 {
  font-size: 13px;
  margin-bottom: 2px;
  font-weight: 500;
  line-height: 1.57;
}
.list-article02 .list-article02__label1,
.list-article02 .list-article02__label2,
.list-article02 .list-article02__label3,
.list-article02 .list-article02__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.list-article02 .list-article02__label2 {
  color: rgba(73, 80, 87, 0.9);
}
.list-article02 .list-article02__label1,
.list-article02 .list-article02__label2,
.list-article02 .list-article02__label3,
.list-article02 .list-article02__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
@media screen and (min-width: 1080px) {
  .list-article02 .list-article02__label1 {
    font-size: 14px;
  }
}

.list-article02.list-article02--type-tile .list-article02__label3 {
  margin-bottom: 4px;
  font-size: 12px;
  color: #868e96;
}
.list-article02 .list-article02__label3 {
  font-size: 11px;
  color: #adb5bd;
}
.list-article02 .list-article02__label1,
.list-article02 .list-article02__label2,
.list-article02 .list-article02__label3,
.list-article02 .list-article02__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.list-article02.list-article02--type-tile .list-article02__body-footer {
  position: static;
  padding: 0;
}
.list-article02 .list-article02__body-footer {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
  padding: 0 12px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.list-article02 .list-article02__label4 {
  font-size: 12px;
}
.list-article02 .list-article02__label1,
.list-article02 .list-article02__label2,
.list-article02 .list-article02__label3,
.list-article02 .list-article02__label4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.list-article02 .list-article02__score {
  color: #f40009;
  display: inline-block;
}
.list-article02 .list-article02__score + .list-article02__genre {
  margin-left: 4px;
}

.list-article02 .list-article02__genre {
  color: #868e96;
  display: inline-block;
}
</style>

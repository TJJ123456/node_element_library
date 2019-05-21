<template>
  <div>
    <userhead/>
    <div
      class="carousel _slick carousel--w1080 carousel--t02 slick-initialized slick-slider slick-dotted"
      role="toolbar"
    >
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="ui-card-stream">
      <section class="ui-card">
        <header class="ui-card__header">
          <h1>搜索趋势排名</h1>
        </header>
        <div class="ui-card__body">
          <div class="ui-card__search">
            <ol class="ui-card__search-trend-list">
              <li class="ui-card__search-trend-item">
                <a class="ui-card__search-trend-item-inner">
                  <p class="ui-card__search-trend-rank">1.</p>
                  <p class="ui-card__search-trend-word">网络</p>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
    <section class="ui-card _card">
      <header class="ui-card__header">
        <h1>本周最热图书</h1>
      </header>
      <div class="ui-card__body">
        <div class="ui-card__body-hscroll">
          <div class="ui-card__body-hscroll-inner2">
            <div class="ui-card__horizontal">
              <ul class="ui-card__horizontal-list">
                <li class="ui-card__horizontal-item ui-card__horizontal-item--bg-transparent">
                  <div class="ui-card__figure">
                    <a>
                      <figure>
                        <div class="ui-card__figure-media">
                          <div class="cover-thumb03 cover-thumb03--flex">
                            <div class="cover-thumb03__inner">
                              <p class="cover-thumb03__image">
                                <img
                                  src="//comicimg.comico.jp/tmb/23844/8cb85aae_1553582280767.jpg"
                                  alt
                                  width="100%"
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                        <figcaption class="ui-card__figure-caption">
                          <p class="ui-card__figure-heading">书名</p>
                          <p class="ui-card__figure-sub-copy">简介</p>
                        </figcaption>
                      </figure>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="ui-card-wrapper ui-card-wrapper--bg-lightblue">
      <section class="ui-card">
        <header class="ui-card__header">
          <a class="ui-card__header-inner">
            <h1>
              <span class="ui-card__heading-label">编辑推荐</span>
            </h1>
            <div class="ui-card__header-icon">
              <span class="ui-card__header-icon-label">更多 ></span>
            </div>
          </a>
        </header>
        <div class="ui-card__body _cardBody">
          <div class="ul-card__ranking">
            <ul class="ul-card__ranking-list1">
              <li class="ul-card__ranking-list1-item">
                <div class="ui-card__figure2 ui-card__figure2--type2">
                  <a class="ui-card__figure2-inner">
                    <img src="//images.comico.jp/spn/blank/img_1x1.png" alt>
                    <figure class="ui-card__figure2-inner">
                      <div class="ui-card__figure2-media">
                        <div class="cover-thumb03 cover-thumb03--flex">
                          <div class="cover-thumb03__inner">
                            <p class="cover-thumb03__image">
                              <img
                                src="//comicimg.comico.jp/tmb/21267/a8d49a81_1518749361997.jpg"
                                alt
                              >
                            </p>
                          </div>
                        </div>
                      </div>
                      <figcaption class="ui-card__figure2-caption">
                        <div class="ui-card__figure2-caption-inner">
                          <div class="ui-card__figure2-caption-group1">
                            <p class="ui-card__figure2-rank">1</p>
                          </div>
                          <div class="ui-card__figure2-caption-group2">
                            <p class="ui-card__figure2-heading">书名</p>
                            <p class="ui-card__figure2-sub-copy">作者</p>
                          </div>
                        </div>
                      </figcaption>
                    </figure>
                  </a>
                </div>
              </li>
              <li class="ul-card__ranking-list1-item"></li>
              <li class="ul-card__ranking-list1-item"></li>
              <li class="ul-card__ranking-list1-item"></li>
              <li class="ul-card__ranking-list1-item"></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    <userfoot/>
  </div>
</template>
  
<script>
import userhead from "./userhead";
export default {
  components: { userhead },
  data() {
    return {
      bookList: [],
      count: 0,
      showIndex: 0,
      showBook: true
    };
  },
  // created() {
  //   this.initData();
  // },
  activated() {
    this.GetListCount();
  },
  computed: {
    showList() {
      let begin = this.showIndex * 10;
      let end =
        begin + 10 > this.bookList.length ? this.bookList.length : begin + 10;
      return this.bookList.slice(begin, end);
    }
  },
  methods: {
    async initData() {
      this.loading = true;
      this.GetListCount();
      this.loading = false;
    },
    async GetListCount() {
      let data = await this.$fetch("book/count");
      if (data.data !== this.count) {
        this.getList();
        this.count = data.data;
      }
    },
    getImgPath(path) {
      if (path && path !== "") return "http://localhost:3000" + path;
      return "http://localhost:3000/public/img/default.jpg";
    },
    async getList() {
      let data = await this.$fetch("book/list", {
        method: "POST",
        body: JSON.stringify({
          limit: this.limit,
          offset: this.offset
        })
      });
      this.bookList = data.data;
    },
    addshowIndex() {
      if (this.showIndex >= Math.ceil(this.bookList / 10)) {
        return;
      }
      ++this.showIndex;
      this.delayshow();
    },
    delshowIndex() {
      if (this.showIndex > 0) {
        --this.showIndex;
      }
      this.delayshow();
    },
    delayshow() {
      this.showBook = false;
      setTimeout(() => {
        this.showBook = true;
      }, 200);
    }
  }
};
</script>
<style lang="less">
.carousel.carousel--t02 {
  padding-top: 0;
}
.slick-slider {
  position: relative;
  display: block;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -ms-touch-action: pan-y;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}
.carousel {
  overflow: hidden;
  margin-bottom: 0;
  position: relative;
  // margin-top: 96px;
}
@media screen and (min-width: 1080px) {
  .carousel {
    overflow: hidden;
    margin-bottom: 0;
    position: relative;
    // margin-top: 130px;
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.ui-card-stream {
  color: #212529;
  position: relative;
}

.ui-card {
  background: #fff;
  font-family: "HelveticaNeue", "Noto Sans Japanese",
    "Hiragino Kaku Gothic ProN", "Meiryo UI", "メイリオ", Meiryo, sans-serif;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 640px;
  color: #212529;
  font-size: 12px;
}

@media screen and (min-width: 1080px) {
  .ui-card {
    max-width: 1080px;
    background: none;
    border: none;
    margin: 44px auto;
  }
}

.ui-card .ui-card__header {
  padding: 16px 15px 0;
  margin-bottom: 12px;
  position: relative;
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

@media screen and (min-width: 1080px) {
  .ui-card .ui-card__header {
    margin-bottom: 20px;
    padding: 0;
  }
}
.ui-card .ui-card__body {
  margin-top: 9px;
}
.ui-card__search {
  padding-bottom: 16px;
}

.ui-card__search .ui-card__search-trend-list {
  overflow: auto;
  white-space: nowrap;
  padding: 0 15px;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  font-size: 0;
  margin: -3px 0;
}

@media screen and (min-width: 1080px) {
  .ui-card__search .ui-card__search-trend-list {
    text-align: center;
    overflow: visible;
    white-space: normal;
    padding: 0;
  }
}
.ui-card__search .ui-card__search-trend-item {
  display: inline-block;
  margin: 3px;
}

.ui-card__search .ui-card__search-trend-item-inner {
  text-align: center;
  font-size: 13px;
  border: 1px solid #b8b8b8;
  padding: 5px 14px;
  border-radius: 40px;
  vertical-align: middle;
  position: relative;
  background: #fff;
  display: block;
}
.ui-card a {
  color: inherit;
}
@media screen and (min-width: 1080px) {
  .ui-card__search .ui-card__search-trend-item-inner {
    font-size: 16px;
    padding: 6px 21px;
  }
}
.ui-card__search .ui-card__search-trend-rank {
  text-align: center;
  color: #868e96;
  display: inline-block;
}
.ui-card__search .ui-card__search-trend-word {
  display: inline-block;
}
.ui-card .ui-card__body-hscroll {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
@media screen and (min-width: 1080px) {
  .ui-card .ui-card__body-hscroll {
    overflow: visible;
    white-space: normal;
  }
}
.ui-card__horizontal .ui-card__horizontal-list {
  white-space: nowrap;
  padding: 0 12px;
  font-size: 0;
}
@media screen and (min-width: 1080px) {
  .ui-card__horizontal .ui-card__horizontal-list {
    white-space: normal;
    padding: 0;
    margin: 0 -8px -16px;
  }
}

.ui-card__horizontal .ui-card__horizontal-item {
  display: inline-block;
  width: 124px;
  margin: 0 3px;
  font-size: 12px;
  vertical-align: top;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

@media screen and (min-width: 1080px) {
  .ui-card__horizontal
    .ui-card__horizontal-item.ui-card__horizontal-item--bg-transparent {
    background: transparent;
  }
}

@media screen and (min-width: 1080px) {
  .ui-card__horizontal .ui-card__horizontal-item {
    width: 203px;
    margin: 0 8px 16px;
    background: #fff;
  }
}
.cover-thumb03.cover-thumb03--flex .cover-thumb03__inner {
  display: block;
}
.cover-thumb03 .cover-thumb03__inner {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 100%;
}
.cover-thumb03 .cover-thumb03__image {
  height: 100%;
  width: 100%;
  background: 50% 50% no-repeat #fff;
  -moz-background-size: contain;
  -o-background-size: contain;
  -webkit-background-size: contain;
  background-size: contain;
  position: relative;
}

.ui-card__horizontal
  .ui-card__horizontal-item.ui-card__horizontal-item--bg-transparent
  .ui-card__figure-caption {
  background: transparent;
  padding: 0;
  margin: 8px 0 0;
}
.ui-card__figure .ui-card__figure-caption {
  display: block;
  margin-top: 5px;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure .ui-card__figure-caption {
    margin-top: 0;
    padding: 18px 20px;
  }
}
.ui-card__figure .ui-card__figure-heading {
  font-size: 14px;
}

.ui-card__figure .ui-card__figure-heading {
  color: #222;
  font-weight: normal;
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  text-rendering: auto;
}
.ui-card__figure .ui-card__figure-sub-copy {
  font-size: 14px;
}
.ui-card__figure .ui-card__figure-sub-copy {
  color: #868e96;
  font-size: 11px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-card-wrapper.ui-card-wrapper--bg-lightblue {
  background: #48d3c2;
}
@media screen and (min-width: 1080px) {
  .ui-card-wrapper.ui-card-wrapper--bg-lightblue {
    padding: 1px 0;
  }
}

.ui-card {
  background: #fff;
  font-family: "HelveticaNeue", "Noto Sans Japanese",
    "Hiragino Kaku Gothic ProN", "Meiryo UI", "メイリオ", Meiryo, sans-serif;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 640px;
  color: #212529;
  font-size: 12px;
}
@media screen and (min-width: 1080px) {
  .ui-card {
    max-width: 1080px;
    background: none;
    border: none;
    margin: 44px auto;
  }
}
@media screen and (min-width: 1080px) {
  .ui-card-wrapper > .ui-card {
    margin: 33px auto;
  }
}

.ui-card .ui-card__header .ui-card__header-inner {
  display: block;
}
.ui-card a {
  color: inherit;
}

.ui-card .ui-card__heading .ui-card__heading-label {
  font-weight: bold;
  font-size: 14px;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  display: block;
}
@media screen and (min-width: 1080px) {
  .ui-card .ui-card__heading .ui-card__heading-label {
    font-size: 20px;
  }
}

.ui-card .ui-card__header .ui-card__header-icon {
  display: block;
  position: absolute;
  top: 50%;
  right: 15px;
  color: #495057;
  -moz-transform: translateY(-1px);
  -ms-transform: translateY(-1px);
  -webkit-transform: translateY(-1px);
  transform: translateY(-1px);
}
@media screen and (min-width: 1080px) {
  .ui-card .ui-card__header .ui-card__header-icon {
    -moz-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
    transform: translateY(-10px);
    right: 1px;
  }
}

.ui-card .ui-card__header .ui-card__header-icon .ui-card__header-icon-label {
  margin-right: 2px;
  -moz-transform: translateY(1px);
  -ms-transform: translateY(1px);
  -webkit-transform: translateY(1px);
  transform: translateY(1px);
  display: none;
}

.ui-card .ui-card__body {
  margin-top: 9px;
}

.ul-card__ranking {
  padding: 0 15px;
}
@media screen and (min-width: 1080px) {
  .ul-card__ranking {
    padding: 0;
  }
}

.ul-card__ranking .ul-card__ranking-list1 {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.ul-card__ranking .ul-card__ranking-list1-item {
  display: table-cell;
  width: 50%;
  -moz-background-size: cover;
  -o-background-size: cover;
  -webkit-background-size: cover;
  background-size: cover;
  display: table-cell\9;
  display: table-cell\9 !important;
  width: 215px\9;
  height: 215px;
}

ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}

@media screen and (min-width: 1080px) {
  .ul-card__ranking .ul-card__ranking-list1-item {
    padding-right: 1px;
  }
}

li {
  display: list-item;
  text-align: -webkit-match-parent;
}
.ui-card__figure2 {
  position: relative;
}
.ul-card__ranking .ul-card__ranking-list1-item .ui-card__figure2-inner {
  padding-bottom: 0;
}
.ui-card__figure2 .ui-card__figure2-inner {
  display: block;
  position: relative;
  min-height: 142px;
}

.ui-card a {
  color: inherit;
}
.ui-card__figure2 .ui-card__figure2-layout {
  width: 100%;
}
.ui-card__figure2 .ui-card__figure2-figure {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.cover-thumb03.cover-thumb03--flex .cover-thumb03__inner {
  display: block;
}
.cover-thumb03 .cover-thumb03__inner {
  position: relative;
  display: inline-block;
  height: 100%;
  width: 100%;
}
.cover-thumb03 .cover-thumb03__image {
  height: 100%;
  width: 100%;
  background: 50% 50% no-repeat #fff;
  -moz-background-size: contain;
  -o-background-size: contain;
  -webkit-background-size: contain;
  background-size: contain;
  position: relative;
}
.cover-thumb03.cover-thumb03--flex .cover-thumb03__image > img {
  width: 100%;
}

.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-caption {
  background: transparent;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiP…Igd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4g);
  background-size: 100%;
  background-image: -webkit-gradient(
    linear,
    50% 0%,
    50% 100%,
    color-stop(0%, rgba(0, 0, 0, 0)),
    color-stop(100%, rgba(0, 0, 0, 0.6))
  );
  background-image: -moz-linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  background-image: -webkit-linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.6)
  );
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  color: #fff;
  padding: 9px 7px 5px;
}

.ui-card__figure2 .ui-card__figure2-caption {
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiP…Igd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4g);
  background-size: 100%;
  background-image: -webkit-gradient(
    linear,
    50% 0%,
    50% 100%,
    color-stop(0%, rgba(0, 0, 0, 0)),
    color-stop(100%, rgba(0, 0, 0, 0.6))
  );
  background-image: -moz-linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  background-image: -webkit-linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.6)
  );
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 7px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2 .ui-card__figure2-caption {
    padding: 7px 10px;
  }
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-caption {
    padding: 9px 10px 5px;
  }
}
.ui-card__figure2 .ui-card__figure2-caption-inner {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.ui-card__figure2 .ui-card__figure2-caption-group1 {
  display: table-cell;
  vertical-align: middle;
  width: 20px;
  padding-right: 5px;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2 .ui-card__figure2-caption-group1 {
    width: 26px;
    padding-right: 10px;
  }
}
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-rank,
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-heading,
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-sub-copy {
  color: inherit;
}
.ui-card__figure2 .ui-card__figure2-rank {
  color: #222;
  font-size: 30px;
  float: left;
  line-height: 1;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2 .ui-card__figure2-rank {
    font-size: 50px;
  }
}
.ui-card__figure2 .ui-card__figure2-caption-group2 {
  display: table-cell;
  vertical-align: middle;
}
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-rank,
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-heading,
.ui-card__figure2.ui-card__figure2--type2 .ui-card__figure2-sub-copy {
  color: inherit;
}
.ui-card__figure2 .ui-card__figure2-heading {
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  text-rendering: auto;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2 .ui-card__figure2-heading {
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
  }
}
.ui-card__figure2 .ui-card__figure2-sub-copy {
  color: #fff;
  font-size: 11px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media screen and (min-width: 1080px) {
  .ui-card__figure2 .ui-card__figure2-sub-copy {
    font-size: 12px;
    margin-top: -2px;
  }
}
</style>

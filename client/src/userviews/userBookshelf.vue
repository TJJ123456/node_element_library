<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-row>
        <el-col :span="6" style="padding-left: 25px;padding-right: 25px;">
          <ul class="sidenav-list">
            <li class="sidenav-major" :class="{active: shelfIndex === -1}">
              <a @click="clickShelf(-1)">所有书架</a>
            </li>
            <li
              class="sidenav-major"
              :class="{active: shelfIndex === index}"
              v-for="(item, index) in bookShelflist"
              :key="index"
            >
              <a @click="clickShelf(index)">{{item.name}}</a>
            </li>
          </ul>
          <ul class="sidenav-list">
            <li class="sidenav-major" :class="{active: genreIndex === -1}">
              <a @click="clickgenre(-1)">所有分类</a>
            </li>
            <li
              class="sidenav-major"
              :class="{active: genreIndex === index}"
              v-for="(item, index) in genres"
              :key="index"
            >
              <a @click="clickgenre(index)">{{item.name}}</a>
            </li>
          </ul>
        </el-col>
        <el-col :span="15" :offset="1">
          <template v-if="shelfIndex !== -1">
            <h2>书架名字: {{bookShelflist[shelfIndex].name}}</h2>
            <br>
            <span>书架介绍：{{bookShelflist[shelfIndex].desc}}</span>
            <br>
            <br>
            <hr>
          </template>
          <template v-else>
            <h3>图书列表</h3>
            <hr>
          </template>
          <transition name="el-fade-in-linear">
            <div style="width:842.5px">
              <ul class="booklist" v-if="showBook">
                <li v-for="(item, index) in showList" :key="index">
                  <div class="book-img">
                    <router-link :to="{name: 'bookDetail', params: { bookId: item._id }}">
                      <img src alt>
                    </router-link>
                  </div>
                  <div class="book-info">
                    <h3 class="name">{{item.name}}</h3>
                    <span style="color: #767676">{{item.author}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </transition>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
  
<script>
export default {
  data() {
    return {
      bookList: [],
      genres: [],
      bookShelflist: [],
      shelfIndex: -1,
      genreIndex: -1,
      showBook: true
    };
  },
  computed: {
    showList() {
      let showlist = [];
      showlist = this.bookList.filter(item => {
        let isShelf = true;
        let isGenre = true;
        if (this.shelfIndex !== -1) {
          isShelf = item.bookshelf === this.bookShelflist[this.shelfIndex]._id;
        }
        if (this.genreIndex !== -1) {
          isGenre = false;
          for (let i in item.genre) {
            if (item.genre[i] === this.genres[this.genreIndex]._id)
              isGenre = true;
            break;
          }
        }
        return isShelf && isGenre;
      });
      return showlist;
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
      let bookshelfList = await this.$fetch("bookshelf/list");
      let booklist = await this.$fetch("book/list");
      this.genres = genreList.data;
      this.bookShelflist = bookshelfList.data;
      this.bookList = booklist.data;
      this.loading = false;
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
    }
  }
};
</script>
<style lang="less" scoped>
.sidenav-list {
  margin-top: 26px;
  border: 1px solid #a5a5a5;
}
ul,
ol {
  list-style: none;
}
.sidenav-list li.sidenav-major:first-child {
  margin-top: -1px;
}
.sidenav-list li.sidenav-major {
  border-top: 1px solid #a5a5a5;
}
.sidenav-list li {
  padding: 0;
}
.sidenav-list li.sidenav-major > a {
  font-size: 16px;
  padding-bottom: 7px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
}
.sidenav-list li > a,
.sidenav-list li > h4 {
  display: block;
  padding: 8px 20px;
  color: inherit;
}

.sidenav-list li.active > a {
  background: #4f6aa2;
  color: #fff;
  position: relative;
}

.book-img {
  padding: 0 0 2px 1px;
  margin-bottom: 10px;
  position: relative;
  text-align: left;
}
.book-img > a {
  position: relative;
  display: inline-block;
  margin-left: 20px;
  width: 116px;
  height: 170px;
  &:hover {
    cursor: pointer;
  }
}

img {
  position: absolute;
  left: 0;
  bottom: 0;
  display: block;
  width: 100%;
  height: 160px;

  vertical-align: bottom;
  background-color: red;
  -webkit-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  -khtml-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  -ms-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  -o-box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  -webkit-transition: all, 0.25s, ease;
  -khtml-transition: all, 0.25s, ease;
  -moz-transition: all, 0.25s, ease;
  -ms-transition: all, 0.25s, ease;
  -o-transition: all, 0.25s, ease;
  transition: all, 0.25s, ease;
}
.book-info {
  padding: 0;
  text-align: center;
}

.name {
  max-height: 44px;
  overflow: hidden;
  display: block;
  margin-bottom: 1px;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
}

.booklist {
  margin: 12px -15px 10px -15px;
}

.booklist {
  margin-left: 0;
  margin-right: 0;
  -ms-overflow-style: none;
}

.booklist > li {
  margin-top: 6px;
  display: inline-block;
  // padding: 0 15px;
  text-align: center;
  vertical-align: top;
  width: 19%;
  margin-bottom: 20px;
}

.booklist > li {
  font-size: 14px;
}
</style>

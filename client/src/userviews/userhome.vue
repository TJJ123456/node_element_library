<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <h2>热门图书</h2>
      <div style="width:842.5px">
        <div class="block-header">
          <div class="header-more">
            <el-button
              v-if="showIndex===0"
              @click="delshowIndex()"
              icon="el-icon-arrow-left"
              round
              disabled
            ></el-button>
            <el-button v-else @click="delshowIndex()" icon="el-icon-arrow-left" round></el-button>
            <el-button @click="addshowIndex()" icon="el-icon-arrow-right" round></el-button>
          </div>
        </div>
        <transition name="el-fade-in-linear">
          <ul v-if="showBook">
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
        </transition>
      </div>
    </el-col>
  </el-row>
</template>
  
<script>
export default {
  data() {
    return {
      bookList: [],
      count: 0,
      showIndex: 0,
      showBook: true
    };
  },
  created() {
    this.initData();
  },
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
<style lang="less" scoped>
.block-header {
  background: none;
  border: none;
  padding: 0;
  height: auto;
  margin: 30px 0 6px 0;
  border-bottom: 1px solid #a5a5a5;
  position: relative;
}
.header-more {
  position: absolute;
  right: 0;
  bottom: 8px;
}
.marquee-btns {
  margin-bottom: 4px;
}

ul {
  margin: 12px -15px 10px -15px;
}

ul {
  margin-left: 0;
  margin-right: 0;
  -ms-overflow-style: none;
}

ul > li {
  margin-top: 6px;
  display: inline-block;
  // padding: 0 15px;
  text-align: center;
  vertical-align: top;
  width: 19%;
  margin-bottom: 20px;
}

ul > li {
  font-size: 14px;
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
</style>

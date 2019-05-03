<template>
  <el-row v-loading="loading">
    <el-col :span="16" :offset="4">
      <div style="width:842.5px">
        <h2>搜索结果</h2>
        <br>
        <hr>

        <transition name="el-fade-in-linear">
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
        </transition>
      </div>
    </el-col>
  </el-row>
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
      showBook: true
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
      let list = await this.$fetch("book/usersearch", {
        method: "POST",
        body: JSON.stringify({
          keyword: this.keyword
        })
      });
      this.showList = list.data;
      this.loading = false;
    }
  }
};
</script>
<style lang="less" scoped>
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

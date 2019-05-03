<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-row>
        <el-col :span="7">
          <div class="book-img">
            <img src alt>
            <div style="margin-top:10px">
              <button v-if="checkBorrowIsMe" @click="backBook()" class="back">我要还书</button>
              <button v-else-if="bookDetail.state==='可借阅'" @click="borrow()" class="borrow">我要借阅</button>
              <button v-else class="preventborrow">已借出</button>
            </div>
          </div>
        </el-col>
        <el-col :span="17">
          <div>
            <h2>书名：{{bookDetail.name}}</h2>
          </div>
          <div style="margin-top:10px;">
            <span style="color: #767676">作者：{{bookDetail.author}}</span>
          </div>
          <div style="margin-top:10px;">
            <span>分类：</span>
            <span v-for="(item, index) in bookDetail.genreNamelist" :key="index">{{item}}</span>
          </div>
          <div style="margin-top:10px;">
            <span>摘要：{{bookDetail.desc}}</span>
          </div>
          <div style="margin-top:10px;">
            <span>所属书架：{{bookDetail.shelfname}}</span>
          </div>
          <div style="margin-top:10px;">
            <span>借阅次数：{{bookDetail.borrowTime || 0}}</span>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
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
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  computed: {
    checkBorrowIsMe() {
      console.log(this.bookDetail.state, this.borrowInfo);
      if (
        this.bookDetail.state !== "可借阅" &&
        this.borrowInfo &&
        this.$state.user &&
        this.borrowInfo.reader === this.$state.user._id
      ) {
        return true;
      }
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
      this.borrowInfo = book.borrowInfo;
      this.loading = false;
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
.book-img {
  padding: 0;
  margin-bottom: 0;
  text-align: left;
}
.book-img img {
  position: static;
  border-radius: 2px;
  display: inline-block;
  background-color: red;
  width: 240px;
  height: 304px;
}
.borrow {
  width: 240px;
  height: 40px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
  }
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.back {
  width: 240px;
  height: 40px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
  }
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.preventborrow {
  width: 240px;
  height: 40px;
  border-radius: 4px;
}
</style>

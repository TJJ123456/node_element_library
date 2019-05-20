<template>
  <div>
    
  </div>
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
<style lang="less" scoped>

</style>

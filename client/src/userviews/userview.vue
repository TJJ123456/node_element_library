<template>
  <div>
    <userhead/>
    <div class="list-inbox _listInboxContainer">
      <div class="list-inbox__header">
        <div class="list-inbox__header-inner">
          <div class="list-inbox__header-title">
            <font style="vertical-align: inherit;">
              <h1>借阅列表</h1>
            </font>
          </div>
        </div>
      </div>
      <div class="list-inbox__msg">
        <p>过期的图书会自动归还</p>
      </div>
      <ul class="list-inbox__list">
        <li class="list-inbox__item">
          <div class="list-inbox__item-inner">
            
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
import moment from "moment";
moment.locale("zh-cn");
export default {
  props: {},
  data() {
    return {
      borrowList: [],
      loading: false
    };
  },
  activated() {
    // this.initData();
  },
  watch: {
    keyword(val) {
      this.initData();
    }
  },
  computed: {},
  methods: {
    async initData() {
      this.loading = true;
      let data = await this.$fetch("book/borrowlist");
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
        this.borrowList = data.data;
        this.borrowList.forEach(item => {
          item.borrow = this.formatTime(item.borrowTime);
          item.back =
            item.backTime === 0 ? "未归还" : this.formatTime(item.backTime);
        });
      }
      this.loading = false;
    },
    formatTime(time) {
      return moment(time).format("LL");
    },
    checkBack(index) {
      if (this.borrowList[index].backTime === 0) return true;
      return false;
    },
    async backBook(index) {
      try {
        await this.$confirm(
          `确定归还《${this.borrowList[index].bookdetail.name}》吗?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        let data = await this.$fetch("book/backBook", {
          method: "POST",
          body: JSON.stringify({
            id: this.borrowList[index].book
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
          this.initData();
        }
      } catch (e) {}
    }
  }
};
</script>
<style lang="less">
.list-inbox {
  font-size: 12px;
  color: #212529;
}
@media screen and (min-width: 1080px) {
  .list-inbox {
    font-size: 14px;
  }
}

.list-inbox .list-inbox__header {
  max-width: 1080px;
  margin: 0 auto;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__header {
    padding: 0 0 5px 0;
    border-bottom: 1px solid #dee2e6;
    margin: 40px auto 16px;
  }
}

.list-inbox .list-inbox__header-title {
  display: table;
  width: 100%;
  margin: 0 auto;
}
.list-inbox .list-inbox__header-title h1 {
  font-size: 16px;
  font-weight: normal;
  color: #212529;
  display: none;
  vertical-align: middle;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__header-title h1 {
    display: table-cell;
  }
}
.list-inbox .list-inbox__msg {
  font-size: 13px;
  padding: 0 16px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  max-width: 1080px;
  margin: 16px auto;
  color: #495057;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__msg {
    font-size: 14px;
    padding: 0;
    margin: 24px auto;
  }
}
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.list-inbox .list-inbox__list {
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 56px;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__list {
    border: none;
    margin-bottom: 0;
  }
}
.list-inbox .list-inbox__item {
  border-top: 1px solid #dee2e6;
  background: #fff;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__item {
    max-width: 1080px;
    margin: 0 auto 8px;
    border: 1px solid #e9ecef;
  }
}
.list-inbox .list-inbox__item-inner {
  margin: 0 auto;
  display: table;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
@media screen and (min-width: 1080px) {
  .list-inbox .list-inbox__item-inner {
    max-width: 1080px;
    margin: 0 auto;
  }
}
</style>

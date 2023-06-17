// pages/collect/collect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_collection: '', //收藏字段内容
    collect_bookAs: [], //收藏的书们
    baseUrl: ''
  },
  showCollects: function (collect) {
    let that = this;
    // 收到用户收藏字段
    let dataList = this.data.user_collection;
    if (dataList != 'null' && dataList != '') {
      let res = dataList.split(',');
      res.forEach((item) => {
        console.log(item);
        wx.request({
          url: app.globalData.baseUrl + '/bookabout/id/' + item,
          success: function (res) {
            console.log('查询成功');
            that.data.collect_bookAs.push(res.data.results[0]);
            that.setData({
              collect_bookAs: that.data.collect_bookAs
            })
          }, fail: function () {
            console.log("获取失败");
          },
        })
      })
    }
  },

  // 跳转到图书详情页
  toBook: function (e) {
    // console.log(e.currentTarget.id);
    // 获取当前点击项的id
    // 截取点击项id字符串的末尾，得其在当前页面的booksArray数组的下标
    var id = e.currentTarget.id.slice(6, 7);
    console.log(id);
    // 得到该书的isbn号
    var id = this.data.collect_bookAs[id].bookA_id;
    console.log("要传递的tu：" + id);
    // 传参数isbn跳转到书详情页
    wx.navigateTo({
      url: '../detail/detail?bookA_id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ user_collection: options.user_collection });
    this.showCollects(this.data.user_collection);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      baseUrl: app.globalData.baseUrl
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
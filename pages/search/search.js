// pages/search/search.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    booknametosearch:'',
    booksArray:[],
    baseUrl:''
  },

  // 输入框输入事件
  serachbook_name:function(e){
    let bookname=e.detail.value;
    // console.log(bookname);
    this.setData({
      // 把用户输入值放入data里的booknametosearch
      booknametosearch: e.detail.value
    })
  },

  search:function(){
    // 到data里的booknametosearch获取用户输入
    var searchname=this.data.booknametosearch;
    let that=this;
    // console.log(searchname);
    wx.request({

      method: 'GET',
      url: app.globalData.baseUrl+'/bookabout/name/'+searchname,

      success: function (res) {
        console.log('查询结果');
        console.log(res.data);
        console.log(res.data.results);
        let resultArray=res.data.results;
        that.setData({
          // 查询结果赋给当前页面的data
          booksArray:resultArray,
        })
      },
      fail: function () {
        console.log("获取失败");
      },
    })
  },

  // 跳转到图书详情页
  toBook:function(e){
    // console.log(e.currentTarget.id);
    // 获取当前点击项的id
    // 截取点击项id字符串的末尾，得其在当前页面的booksArray数组的下标
    var id=e.currentTarget.id.slice(6,7);
    console.log(id);
    // 得到该书的isbn号
    var id=this.data.booksArray[id].bookA_id;
    console.log("要传递的tu："+id);
    // 传参数isbn跳转到书详情页
    wx.navigateTo({
      url: '../detail/detail?bookA_id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
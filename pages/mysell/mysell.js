// pages/mysell/mysell.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:'',
    // 接收从sellerorder表查到的记录
    sellerOrderArray:[],

  },


  // 根据用户code查其卖的书
  getBookFromSellerOrderBySellerId:function(){
    console.log("尝试根据用户code查其卖的书");
    let that = this;
    wx.request({
      method: 'GET',
      url: 'https://serve.sirbook.top/sellerorder/sellerid/'+this.data.user_id,
      success: function (res) {
        console.log("根据用户code查其卖的书成功");
        console.log(res.data);
        let resultArray=res.data.results;
        that.setData({
          // 查询结果赋给当前页面的data
          sellerOrderArray:resultArray,
        })
      },
      fail: function () {
        console.log("根据用户code查其卖的书失败");
      },
    })
    console.log("尝试向后端发送根据用户code查其卖的书请求失败");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.user_id=app.globalData.user_id
    console.log('mysell页收到user_id:'+this.data.user_id);
    this.getBookFromSellerOrderBySellerId();
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
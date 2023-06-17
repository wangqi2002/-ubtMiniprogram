// pages/mybuy/mybuy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接收从my页面传来的用户code
    user_id:'',
    buyerOrderArray:[],
    baseUrl:''
  },

  // 根据用户code查其买的书
  getBookFromBuyerOrderByBuyerId:function(){
    console.log("尝试根据用户code查其买的书");
    let that = this;
    wx.request({
      method: 'GET',
      url: app.globalData.baseUrl+'/buyerorder/buyer_id/'+this.data.user_id,
      success: function (res) {
        console.log("根据用户code查其买的书成功");
        res.data.results.forEach((item) => {
          wx.request({
            method: 'GET',
            url: app.globalData.baseUrl + '/book/getbook/' + item.buyerorder_bookid,
            data: {},
            success: function (res) {
              let orderItem = { ...item, ...res.data.book }
              console.log(orderItem);
              that.data.buyerOrderArray.push(orderItem)
              let orderList = that.data.buyerOrderArray
              that.setData({
                buyerOrderArray: orderList,
              })
            },
            fail: function (err) {
              console.log(err);
            },
          })
        })
      },
      fail: function () {
        console.log("根据用户code查其卖的书失败");
      },
    })
    console.log("尝试向后端发送根据用户code查其卖的书请求失败");
  },

  

  //根据书isbn号改其状态
  updateOrder:function(status,id){
    console.log("尝试根据书isbn号改其状态");
    // 改buyerorder表
    wx.request({
      method: 'PUT',
      url: app.globalData.baseUrl+'/buyerorder/'+id,
      data: {
        buyerorder_trading_status:status,
        buyerorder_id:id
      },
      success: function (res) {
        console.log("根据书isbn号改其状态成功");
        console.log(res.data);
      },
      fail: function () {
        console.log("根据书isbn号改其状态失败");
      },
    })
    console.log("尝试向后端发送根据书isbn号改其状态请求失败");
  },

  //确认收货
  checked:function(e){
    wx.showModal({
      title: '已收货',
      showCancel: false,
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          console.log('确定');
              wx.switchTab({
                    url: '../my/my',
              })
        }
      }
    })
    // console.log(e.target);
    var id=e.target.id.slice(6,7);
    // console.log(id);
    // 得到该书的isbn号
    var buyerorder_id=this.data.buyerOrderArray[id].buyerorder_id;
    console.log("要传递的buyerorder_id："+buyerorder_id);
    //在buyerorder表里把该书状态改成已收货
    this.updateOrder(2,buyerorder_id);
  },
  //拒收
  refuse:function(e){
    wx.showModal({
      title: '已拒收',
      showCancel: false,
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          console.log('确定');
              wx.switchTab({
                    url: '../my/my',
              })
        }
      }
    })
    // console.log(e.target);
    var id=e.target.id.slice(6,7);
    // console.log(id);
    // 得到该书的isbn号
    var buyerorder_id=this.data.buyerOrderArray[id].buyerorder_id;
    console.log("要传递的buyerorder_id："+buyerorder_id);
    //在buyerorder表里把该书状态改成已收货
    this.updateOrder(3,buyerorder_id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.user_id=app.globalData.user_id
    console.log('buyerorder页获取user_id：'+this.data.user_id);
    // 获取所有当前用户买的书
    this.getBookFromBuyerOrderByBuyerId();
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
const app = getApp();
Page({
  data: {
    id: '',
    buyerid: '',
    orderid: '',
    bookA_id: '',
    sellerid: '',
    address: '',
    date: '',
    price: '',
    state: '',
    bookname: '',
    author: '',
    publisher: '',
    publishTime: '',
    frame: '',
    cover: '',
    phone: '',
    realname: '',
    baseUrl: ''
  },

  search: function (book_id) {
    var bookA_id = book_id;
    console.log("当前书的id：" + bookA_id);
    let that = this;
    wx.request({
      method: 'GET',
      url: app.globalData.baseUrl + '/bookabout/id/' + bookA_id,
      success: function (res) {
        console.log("查询成功");
        console.log(res.data);
        let resultArray = res.data.results;
        that.setData({
          bookname: resultArray[0].book_name,
          author: resultArray[0].book_author,
          price: resultArray[0].bookA_price,
          publisher: resultArray[0].book_press,
          publishTime: resultArray[0].book_publication_time,
          frame: resultArray[0].book_framing,
          summary: resultArray[0].book_abstract,
          // 卖家id
          seller: resultArray[0].bookA_stand,
          book_kind: resultArray[0].bookA_kind,
          cover: resultArray[0].book_cover,
          isbn: resultArray[0].cover,
        })
      },
      fail: function (err) {
        console.log(err);
      },
    })
  },
  buy: function () {
    let that = this;
    let openid = app.globalData.open_id;
    var buyerid = app.globalData.user_id;
    var bookid = that.data.bookA_id;
    var sellerid = that.data.seller;
    var address = app.globalData.address;
    var price = this.data.price;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/payWechat',
      data: {
        description: that.data.bookname,
        total: price,
        openid: openid
      },
      success: function (res) {
        console.log("支付调出");
        console.log(res.data);
        that.setData({
          orderid: res.data.orderId
        });
        wx.requestPayment({
          nonceStr: res.data.value.nonceStr,
          package: res.data.value.package,
          signType: res.data.value.signType,
          timeStamp: res.data.value.timeStamp,
          paySign: res.data.value.paySign,
          "success": function (res) {
            console.log("调用支付成功")
          },
          "fail": function (res) {
            console.log("用户取消支付")
          },
          "complete": function (res) {
            console.log(res)
          }
        })
        that.payback((result) => {
          console.log("order", result)
          if (result.trade_state == "SUCCESS") {
            wx.request({
              method: 'POST',
              url: app.globalData.baseUrl + '/buyerorder',
              data: {
                buyerorder_id: that.data.orderid,
                buyerorder_buyerid: buyerid,
                buyerorder_bookid: bookid,
                buyerorder_sellerid: sellerid,
                buyerorder_address: address,
                buyerorder_price: price,
              },
              success: function (res) {
                console.log("插入buyerorder表成功");
                console.log(res.data);
              },
              fail: function (err) {
                console.log(err);
              },
            })
            wx.request({
              method: 'PUT',
              url: app.globalData.baseUrl + '/bookabout/state/' + bookid,
              data: {
                bookA_state: 3,
              },
              success: function (res) {
                console.log("修改bookabout表成功");
                console.log(res.data);
              },
              fail: function (err) {
                console.log(err);
              },
            })
            wx.request({
              method: 'POST',
              url: app.globalData.baseUrl + '/record',
              data: {
                r_userId: buyerid,
                r_url: 4,
                r_result: 1,
              },
              success: function (res) {
                console.log("插入record表成功");
                console.log(res.data);
              },
              fail: function (err) {
                console.log(err);
              },
            })
            wx.showToast({
              title: '购买成功',
              icon: 'success',
              duration: 2000,
              mask: true,
            })
            // this.$router.push({ path: "/" });
          } else if (result.trade_state == "NOTPAY") {
            console.log("订单取消");
            wx.showToast({
              title: '订单取消',
              icon: 'error',
              duration: 2000,
              mask: true,
            })
          }
        })
      },
      fail: function (err) {
        console.log(err);
      },
    })
  },
  payback: function (callback) {
    const _this = this
    const nowTime = new Date()
    let trade_state = null
    let flag = true
    const intervalId = setInterval(async function () {
      let newTime = new Date()
      if (newTime - nowTime > 60000) {
        flag = false
        trade_state = 'NOTPAY'
      }
      if (!flag) {
        clearInterval(intervalId);
        callback({ trade_state: trade_state })
      }
      wx.request({
        method: 'POST',
        url: app.globalData.baseUrl + '/payBack',
        data: {
          orderId: _this.data.orderid
          // orderId: "1686815742535aspxm"
        },
        success: function (res) {
          console.log("正在支付");
          console.log(res.data);
          if (res.data.value.trade_state === 'SUCCESS') {
            console.log("支付成功");
            trade_state = 'SUCCESS'
            flag = false
          }
        },
        fail: function (err) {
          console.log(err);
        },
      })
    }, 3000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      bookA_id: options.bookid,
      sellerid: options.sellerid,
      price: options.price,
      address: app.globalData.address,
      phone: app.globalData.user_telphone,
      realname: app.globalData.user_name
    })
    this.search(this.data.bookA_id);
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
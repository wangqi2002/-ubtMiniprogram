const app = getApp();
Page({
  data: {
    id:'',
    buyerid:'',
    bookA_id:'',
    sellerid:'',
    address:'',
    date:'',
    price:'',
    state:'',
    bookname:'',
    author:'',
    publisher:'',
    publishTime:'',
    frame:'',
    cover:'',
    phone:'',
    realname:'',
  },

  search:function(book_id){
    var bookA_id=book_id;
    console.log("当前书的id："+bookA_id);
    let that=this;
    wx.request({
      method: 'GET',
      url: 'https://serve.sirbook.top/bookabout/id/'+bookA_id,
      success: function (res) {
        console.log("查询成功");
        console.log(res.data);
        let resultArray=res.data.results;
        that.setData({
          bookname:resultArray[0].book_name,
          author:resultArray[0].book_author,
          price:resultArray[0].bookA_price,
          publisher:resultArray[0].book_press,
          publishTime:resultArray[0].book_publication_time,
          frame:resultArray[0].book_framing,
          summary:resultArray[0].book_abstract,
          // 卖家id
          seller:resultArray[0].bookA_stand,
          book_kind:resultArray[0].bookA_kind,
          cover:resultArray[0].book_cover,
          isbn:resultArray[0].cover,
        })
      },
      fail: function () {
        console.log("获取失败");
      },
    })
  },


  buy:function(){
    let that=this;
    // 订单号
    let id = new Date().getTime() + Math.random().toString(36).substring(4, 9);
    console.log('订单号id:'+id);
    // 买家（当前登录用户Id）
    var buyerid=app.globalData.user_id;
    console.log('买家（当前登录用户Id）:'+buyerid);
    // 书籍id
    var bookid=that.data.bookA_id;
    console.log('书籍id:'+bookid);
    // 卖家id
    var sellerid=that.data.seller;
    console.log('卖家id:'+sellerid);
    // 收货地址
    var address=app.globalData.address;
    console.log('收货地址:'+address);
    //日期
    var date=new Date();
    console.log('日期:'+date);
    //购买价格
    var price=this.data.price; //变成两位小数
    console.log('购买价格:'+price);
    // 交易状态
    var state=0;
    console.log('交易状态:'+state);
    wx.request({
      method: 'POST',
      url: 'https://serve.sirbook.top/buyerorder',
      data: {
        buyerorder_id:id,
        buyerorder_buyerid:buyerid,
        buyerorder_bookid:bookid,
        buyerorder_sellerid:sellerid,
        buyerorder_address:address,
        buyerorder_time:date,
        buyerorder_price:price,
      },
      success: function (res) {
        console.log("插入buyerorder表成功");
        console.log(res.data);
        wx.showToast({
          title: '购买成功',
          icon:'success',
          duration:2000,
          mask:true,
        })
      },
      fail: function () {
        console.log("插入buyerorder表失败");
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      bookA_id:options.bookid,
      sellerid:options.sellerid,
      price:options.price,
      address:app.globalData.address,
      phone:app.globalData.user_telphone,
      realname:app.globalData.user_name
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
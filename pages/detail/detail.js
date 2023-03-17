// pages/detail/detail.js
var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    bookA_id: '',
    isbn: '',
    bookname: '',
    author: '',
    price: '',
    seller: '',
    book_kind: '',
    publisher: '',
    publishTime: '',
    frame: '',
    summary: '',
    seller: '',
    book_kind: '',
    cover: '',
    bookA_image:'',
    weichat: '',
    user_id:'',
    collect: '/images/collect.png',
  },

  // 从books表获取书的信息
  search: function () {
    // 到data里获取当前页书的isbn
    var bookA_id = this.data.bookA_id;
    console.log("当前书的id：" + bookA_id);
    let that = this;
    wx.request({
      url: 'https://serve.sirbook.top/bookabout/id/' + bookA_id,
      success: function (res) {
        console.log("查询成功");
        // 查询记录条数
        console.log(res.results);
        // 查询结果
        console.log(res.data);
        let resultArray = res.data.results;
        console.log(res.data.results);
        that.setData({
          // 查询结果赋给当前页面的data
          // booksArray:resultArray,
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
          isbn: resultArray[0].book_isbn,
          bookA_image:resultArray[0].bookA_image,
        })
      },
      fail: function () {
        console.log("获取失败");
      },
    })
  },

  searchUserCollect: function () {
    var that = this;
    var user = app.globalData.user_id;
    var haveCollected = '';
    var bookA_id = this.data.bookA_id;
    wx.request({
      method: 'POST',
      url: 'https://serve.sirbook.top/user/getUserInfo',
      data: {
        user_id: user
      },
      success: function (res) {
        haveCollected = res.data[0].user_collection;
        console.log('已收藏：', haveCollected);
        if (haveCollected.indexOf(bookA_id) != -1) {
          that.setData({
            collect: '/images/havecollected.png'
          })
        } else {
          that.setData({
            collect: '/images/collect.png'
          })
        }
      },
      fail: function () {
        console.log("按用户微信号从user表查该用户信息失败");
      },
    })
  },

  remindLogin:function(){
    if(!this.data.weichat){
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要登录方可使用，是否马上去登录',
        showCancel: false,
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            console.log('确定');
                wx.switchTab({
                      url: '../my/my',
                })
          }
          else{
            console.log('取消');
          }
        }
      })
      return false;
    }
  },

  collect: function () {
    this.remindLogin();
    var that = this;
    console.log('点击了收藏按钮');
    var user = app.globalData.user_id;
    var haveCollected = '';
    var bookA_id = this.data.bookA_id;
    var tmpArray = [];
    // console.log('当前用户id：'+user);
    wx.request({
      method: 'POST',
      url: 'https://serve.sirbook.top/user/getUserInfo',
      data: {
        user_id: user
      },
      success: function (res) {
        // console.log("按用户微信号从user表查该用户信息成功");
        // console.log(res.data[0]);
        haveCollected = res.data[0].user_collection;
        console.log('已收藏：', haveCollected);
        if (haveCollected.indexOf(bookA_id) != -1) {
          tmpArray = haveCollected.split(bookA_id);
          haveCollected = tmpArray.join();
          console.log('取消收藏后，新haveCollected', haveCollected);
          console.log('当前用户id：', user);
          console.log('最新收藏字段：', haveCollected);
          wx.request({
            method: 'POST',
            url: 'https://serve.sirbook.top/user/collect',
            data: {
              user_collection: haveCollected,
              user_id: user,
            },
            success: function (res) {
              console.log('向后端删除收藏成功', res);
            }
          })
          that.setData({
            collect: '/images/collect.png'
          })
        } else {
          that.setData({
            collect: '/images/havecollected.png'
          })
          haveCollected = haveCollected + bookA_id + ',';
          // console.log('收藏已添加：',haveCollected);
          console.log('当前用户id：', user);
          console.log('最新收藏字段：', haveCollected);
          wx.request({
            method: 'POST',
            url: 'https://serve.sirbook.top/user/collect',
            data: {
              user_collection: haveCollected,
              user_id: user,
            },
            success: function (res) {
              console.log('向后端新增收藏成功', res);
            }
          })
        }
      },
      fail: function () {
        console.log("按用户微信号从user表查该用户信息失败");
      },
    })
  },

  buy: function () {
    // this.remindLogin();
    if(!this.data.weichat){
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要登录方可使用，是否马上去登录',
        showCancel: false,
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            console.log('确定');
                wx.switchTab({
                      url: '../my/my',
                })
          }
          else{
            console.log('取消');
          }
        }
      })
      return false;
    }
    else {
      let that = this;
      // 书籍id
      var bookid = that.data.bookA_id;
      console.log('书籍id:' + bookid);
      // 卖家id
      var sellerid = that.data.seller;
      console.log('卖家id:' + sellerid);
      //购买价格
      var price = this.data.price; //变成两位小数
      console.log('购买价格:' + price);
      wx.navigateTo({
        url: '/pages/buy/buy?bookid=' + bookid +
          '&sellerid=' + sellerid +
          '&price=' + price
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.weichat=app.globalData.weichat;
    // 从跳转源接收isbn号
    this.setData({
      bookA_id: options.bookA_id
    });
    this.search();
    this.searchUserCollect();
    // this.searchFromBookAbout();
    console.log(this.data.bookname);
  },
  changeTitle(e) {
    let that = this;
    that.setData({
      first_title: e.currentTarget.dataset.id
    })
  },
  //回到首页
  home() {
    wx.redirectTo({
      url: '/pages/homepage/homepage',
    })
  },
  //路由
  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.go,
    })
  },
  //客服跳动动画
  kefuani: function () {
    let that = this;
    let i = 0
    let ii = 0
    let animationKefuData = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    });
    animationKefuData.translateY(10).step({
      duration: 800
    }).translateY(0).step({
      duration: 800
    });
    that.setData({
      animationKefuData: animationKefuData.export(),
    })
    setInterval(function () {
      animationKefuData.translateY(20).step({
        duration: 800
      }).translateY(0).step({
        duration: 800
      });
      that.setData({
          animationKefuData: animationKefuData.export(),
        })
        ++ii;
      // console.log(ii);
    }.bind(that), 1800);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.kefuani();
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
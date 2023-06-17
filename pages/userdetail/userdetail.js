const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headImage: '',
    user_nickname: '',
    user_name: '',
    phone: '',
    address: '',
    baseUrl: ''
  },

  // 输入框输入事件
  newNickName: function (e) {
    this.setData({
      user_nickname: e.detail.value
    })
  },
  newUserName: function (e) {
    this.setData({
      user_name: e.detail.value
    })
  },
  newPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  newAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  // 从数据库获取用户信息
  getUser: function () {
    var user = app.globalData.weichat;
    let that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/user/getUserInfoW',
      data: {
        user_weichat: user
      },
      success: function (res) {
        console.log(res.data);
        let resultArray = res.data;
        that.setData({
          // 查询结果赋给当前页面的data
          headImage: resultArray[0].user_image,
          user_nickname: resultArray[0].user_nickname,
          user_name: resultArray[0].user_name,
          phone: resultArray[0].user_telphone,
          address: resultArray[0].user_loacation,
        })
      },
      fail: function () {
        console.log("根据微信号获取用户信息失败");
      },
    })
  },

  changeAvator: function () {
    var weichat = app.globalData.open_id;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log
        const tempFilePaths = res.tempFilePaths[0]
        // this.setData({
        //     coverImg: tempFilePaths
        // });
        // this.coverImg = tempFilePaths;
        wx.uploadFile({
          url: app.globalData.baseUrl + '/user/avaterw/' + weichat,
          filePath: tempFilePaths,
          name: 'user_image',
          success: function (res) {
            console.log(res);
          },
          fail: function (e) {
            console.log(e.stack);
          }
        })
        // wx.showModal({
        //   title: '修改成功',
        //   // content: '该功能需要登录方可使用，是否马上去登录',
        //   showCancel: false,
        //   confirmText: "确定",
        //   success(res) {
        //     if (res.confirm) {
        //       console.log('确定');
        //           wx.switchTab({
        //                 url: '../my/my',
        //           })
        //     }
        //     else{
        //       console.log('取消');
        //     }
        //   }
        // })
      }
    })
  },

  // 修改用户信息
  alterUser: function () {
    var that = this
    var user = app.globalData.weichat;
    var newNickName = this.data.user_nickname;
    var newUserName = this.data.user_name;
    var newPhone = this.data.phone;
    var newAddress = this.data.address;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/user/updateNoHeadInfo',
      data: {
        nickname: newNickName,
        name: newUserName,
        telphone: newPhone,
        loacation: newAddress,
        weichat: user,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          user_nickname: newNickName,
          user_name: newUserName,
          phone: newPhone,
          address: newAddress,
        })
        app.globalData.address = that.data.address;
        app.globalData.user_telphone = that.data.phone;
        app.globalData.user_name = that.data.user_name;
        app.globalData.user_nickname = that.data.user_nickname;
        wx.showModal({
          title: '修改成功',
          content: '请右上角重新进入小程序以刷新',
          confirmText: '是',
          showCancel: false,
        })

      },
      fail: function () {
        console.log("修改失败");
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUser();
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
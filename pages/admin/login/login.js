// pages/admin/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_disabled: false,
    password: "",
    loginname: "",
  },
  async login() {
    var that = this
    if (that.data.loginname == '') {
      wx.showModal({
        title: '提示！',
        showCancel: false,
        content: '请输入登录账号！',
        success: function (res) {}
      })
    } else if (that.data.password == '') {
      wx.showModal({
        title: '提示！',
        showCancel: false,
        content: '请输入密码！',
        success: function (res) {}
      })
    } else {
      await wx.p.request({
        url: app.globalData.baseUrl + '/login/adminLogin',
        data: {
          admin_account: that.data.loginname,
          admin_password: that.data.password,
        },
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          const {
            admin_account,
            admin_name,
            admin_permission
          } = res.data.data
          app.globalData.adminInfo = {
            admin_account: admin_account,
            admin_name: admin_name,
            admin_permission: admin_permission
          };
          switch (res.data.data.admin_permission) {
            case 2:
              wx.redirectTo({
                url: '/pages/admin/transport/list1/list1',
              });
              break;
            case 3:
              wx.redirectTo({
                url: "/pages/admin/warehouse/list1/list1",
              });
              break;
            default:
              that.setData({
                loginname: "",
                password: ""
              })
              wx.showToast({
                title: '身份不符合',
                icon: 'none',
                duration: 2000 //持续的时间
              })
              break;
          }
        },
        fail: function (res) {
          console.log(res);
          wx.showModal({
            title: '哎呀～',
            content: '账号或密码错误！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
  },
  loginnameInput: function (e) {
    this.data.loginname = e.detail.value
  },

  passwordInput: function (e) {
    this.data.password = e.detail.value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

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
  onUnload() {},

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
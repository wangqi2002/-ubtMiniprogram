const app = getApp();
// const config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用于存放获取的用户信息
    user_id: '',
    weichat: '', //存放用户openid
    openid: '',
    nickName: '', //昵称
    headImage: '', //头像
    user_collection: '', //收藏
    baseUrl: ''
  },

  tomycollect: function (e) {
    wx.navigateTo({
      url: '../collect/collect?user_collection=' + this.data.user_collection
    })
  },
  tomysell: function (e) {
    wx.navigateTo({
      url: '../mysell/mysell'
    })
  },
  tomybuy: function (e) {
    wx.navigateTo({
      url: '../mybuy/mybuy'
    })
  },
  toUserDetail: function (e) {
    // console.log('点击了用户头像');
    wx.navigateTo({
      url: '../userdetail/userdetail',
    })
  },

  onLoad() {
    let user = wx.getStorageSync('user')
    this.setData({
      userInfo: user
    })
  },
  //新增用户
  insertUserWeChat: function (openid) {
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/user/addUserWeChat',
      data: {
        user_weichat: openid
      },
      success: function (res) {
        console.log(res);
        if (res.data.code) {
          wx.showModal({
            title: '新用户注册成功',
            content: '请先点击头像去完善个人信息',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '新用户注册失败',
            content: '该用户已注册',
            showCancel: false,
          })
        }
      },
      fail: function () {
        console.log("新增用户失败");
      },
    })
  },
  // 按用户微信号从user表查该用户信息
  selectUserByWeChat: function (openid) {
    let that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/user/getUserInfoW',
      data: {
        user_weichat: openid
      },
      success: function (res) {
        console.log(res.data);
        if (!res.data.length) {
          that.insertUserWeChat(openid)
        } else {
          let resultArray = res.data;
          that.setData({
            // 查询结果赋给当前页面的data
            weichat: resultArray[0].user_weichat,
            nickName: resultArray[0].user_nickname,
            headImage: resultArray[0].user_image,
            user_collection: resultArray[0].user_collection,
            userInfo: resultArray[0]
          })
          app.globalData.address = resultArray[0].user_loacation;
          app.globalData.user_telphone = resultArray[0].user_telphone;
          app.globalData.user_name = resultArray[0].user_name;
          app.globalData.user_nickname = resultArray[0].user_nickname;
          app.globalData.weichat = resultArray[0].user_weichat;
          app.globalData.user_id = resultArray[0].user_id;
          app.globalData.open_id = resultArray[0].user_weichat;
        }
        // console.log(that.data.userInfo, app.globalData)
      },
      fail: function () {
        console.log("按用户微信号从user表查该用户信息失败");
      },
    })
  },
  login: function () {
    var that = this
    wx.login({
      success: (res) => {
        wx.request({
          url: app.globalData.baseUrl + '/login/userLoginW',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            that.selectUserByWeChat(res.data.data.openid)
            app.globalData.token = res.data.token
          },
          fail: function (err) {
            console.log(err);
          },
        })
      }
    })
  },

  // 退出登录
  loginOut() {
    this.setData({
      user_id: '',
      weichat: '', //存放用户code
      userInfo: '', //用于存放获取的用户信息
      openid: '',
      nickName: '', //昵称
      headImage: '', //头像
      userInfo: ''
    })
    app.globalData.weichat = '';
    app.globalData.user_id = '';
    // 清空缓存
    wx.setStorageSync('user', null)
  },
  onShow() {
    this.setData({
      userinfo: app.userinfo,
      baseUrl: app.globalData.baseUrl
    })
  },
  // 联系客服
  go(e) {
    if (e.currentTarget.dataset.status == '1') {
      // if (!app.openid) 
      if (!this.data.weichat) {
        wx.showModal({
          title: '温馨提示',
          content: '该功能需要注册方可使用，是否马上去注册',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return false
      }
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.go
    })
  },
  //预览图片
  preview(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.link.split(",")
    });
  },
  onShareAppMessage() {
    return {
      //   title: JSON.parse(config.data).share_title,
      //   imageUrl: JSON.parse(config.data).share_img,
      path: '/pages/start/start'
    }

  },
})
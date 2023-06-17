// pages/enroll/enroll.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      nickname: "",//昵称
      loginname: "",//账号
      phonenumber: "",
      password: "",
      passwordack: "",
      hidden: true,
      btnValue:'',
      btnDisabled:false,
      code: '',
      second: 60
    },
  
    signin: function(e) {
        wx.navigateTo({
            url: '/pages/login/login'
          })
    },
  
    regist: function(e) {
      var that = this
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (that.data.nickname == '') {
        wx.showModal({
          title: '提示！',
          content: '请输入昵称！',
          showCancel: false,
          success(res) {}
        })
      }else if (that.data.loginname == '') {
        wx.showModal({
          title: '提示！',
          content: '请输入登录账号！',
          showCancel: false,
          success(res) {}
        })
      }else if (that.data.phonenumber == '') {
        wx.showModal({
          title: '提示！',
          content: '请输入手机号！',
          showCancel: false,
          success(res) {}
        })
      } else if (that.data.phonenumber.length != 11) {
        wx.showModal({
          title: '提示！',
          content: '手机号长度有误，请重新输入！',
          showCancel: false,
          success(res) {}
        })
      } else if (!myreg.test(that.data.phonenumber)) {
        wx.showModal({
          title: '提示！',
          content: '请输入正确的手机号码！',
          showCancel: false,
          success(res) {}
        })
      } else if (that.data.password == '') {
        wx.showModal({
          title: '提示！',
          content: '请输入密码！',
          showCancel: false,
          success(res) {}
        })
      } else if (that.data.passwordack == '') {
        wx.showModal({
          title: '提示！',
          content: '请输入确认密码！',
          showCancel: false,
          success(res) {}
        })
      } else if (that.data.password!=that.data.passwordack ) {
        wx.showModal({
          title: '提示！',
          content: '两次输入密码不一致！',
          showCancel: false,
          success(res) {}
        })
      } else {
        console.log("success"),
        getApp().globalData.userInfo.nickname = that.data.nickname;
        wx.showModal({
            title: '提示！',
            content: '注册成功！',
            showCancel: false,
            success(res) {}
          }),
          wx.navigateTo({
            url: '/pages/login/login'
          })
      }
    },
  
    nicknameInput: function(e) {
        //console.log(e);
        var val = e.detail.value;
        this.data.nickname = e.detail.value;
        

    },
  
    loginnameInput: function(e){
        this.data.loginname = e.detail.value
    },

    phonenumberInput: function(e) {
      console.log(e.detail.value);
      var val = e.detail.value;
      this.data.phonenumber = val;
      if(val != ''){
        this.setData({
          hidden: false,
          btnValue: '获取验证码'
        })
      }else{
        this.setData({
          hidden: true
        })
      }
    },
    //验证码输入
    bindCodeInput(e) {
      this.setData({
      code: e.detail.value
    })
    },
    //获取短信验证码
  getCode(e) {
    // console.log('获取验证码');
    // var that = this;
    // zhenzisms.client.init('https://sms_developer.zhenzikj.com', 'appId', 'appSecret');
    // zhenzisms.client.send(function (res) {
    //   if(res.data.code == 0){
    //     that.timer();
    //     return ;
    //   }
    //   wx.showToast({
    //     title: res.data.data,
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }, '15811111111', '验证码为:3322');
    
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second+'秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
    passwordInput: function(e) {
      this.data.password = e.detail.value
    },
  
    passwordInputAck: function(e) {
      this.data.passwordack = e.detail.value
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
  
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
  
    }
  })
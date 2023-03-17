// app.js
App({
  onLaunch() {
    
    // wx.cloud.init({
    //   // 云开发-环境id
    //   env:"cloud1-6gi9sr1i9004b2c4",
    //   traceUser:true
    // })
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success (res) {
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://example.com/onLogin',
    //         data: {
    //           code: res.code
    //         }
    //       })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
  },
  globalData: {
    user_id:'',
    weichat:'',
    user_nickname:'',
    user_telphone:'',
    address:'',
    user_name:''
  }
})
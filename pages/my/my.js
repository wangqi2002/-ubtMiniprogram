const app = getApp();
// const config = require("../../config.js");
Page({

      /**
       * 页面的初始数据
       */
      data: {
        user_id:'',
        weichat:'', //存放用户code
        userInfo: '', //用于存放获取的用户信息
        openid:'',
        nickName:'', //昵称
        headImage:'', //头像
        user_collection:'', //收藏

        showShare: false,
        // poster: JSON.parse(config.data).share_poster,
      },

      tomycollect:function(e){
        wx.navigateTo({
          url: '../collect/collect?user_collection='+this.data.user_collection
        })
      },
      tomysell:function(e){
        wx.navigateTo({
          url: '../mysell/mysell'
        })
      },
      tomybuy:function(e){
        wx.navigateTo({
          url: '../mybuy/mybuy'
        })
      },
      toUserDetail:function(e){
        console.log('点击了用户头像');
        wx.navigateTo({
          url: '../userdetail/userdetail',
        })
        console.log('my页面发出向userdetail页面跳转请求');
      },

      onLoad(){

        let user = wx.getStorageSync('user')
        this.setData({
          userInfo: user
        })
    },
    //新增用户
    insertUserWeChat:function(wechat){
      wx.request({
        method: 'POST',
        url: 'https://serve.sirbook.top/user/addUserWeChat',
        data: {
          user_id:wechat
        },
        success: function (res) {
          console.log("新增用户成功");
          wx.showModal({
            title:'新用户注册成功',
            content:'请先点击头像去完善个人信息',
            showCancel:false,
          })
        },
        fail: function () {
          console.log("新增用户失败");
        },
      })
    },
    // 按用户微信号从user表查该用户信息
    selectUserByWeChat:function(wechat){
      console.log("尝试按用户微信号从user表查该用户信息");
      let that = this;
      wx.request({
        method: 'POST',
        url: 'https://serve.sirbook.top/user/getUserInfo',
        data: {
          user_id:wechat
        },
        success: function (res) {
          console.log("按用户微信号从user表查该用户信息成功");

          console.log('res.data.length:'+res.data.length);
          // if(res.data.length==0){
          //   console.log('无此用户:'+wechat);
          //   that.insertUserWeChat(wechat);
          // }else{
            console.log(res.data);
          let resultArray=res.data;
          that.setData({
            // 查询结果赋给当前页面的data
            nickName:resultArray[0].user_nickname,
            headImage:resultArray[0].user_image,
            user_collection:resultArray[0].user_collection,
          })
          app.globalData.address=resultArray[0].user_loacation;
          app.globalData.user_telphone=resultArray[0].user_telphone;
          app.globalData.user_name=resultArray[0].user_name;
          app.globalData.user_nickname=resultArray[0].user_nickname;
          
        },
        fail: function () {
          console.log("按用户微信号从user表查该用户信息失败");
        },
      })
      console.log("尝试向后端发送按用户微信号从user表查该用户信息请求失败");
    },
    login(){
      var that=this;
      console.log('调用云函数获取openid');
      // 调用云函数获取openid
      // 得到 res.result.openid
      // wx.cloud.callFunction({
      //   name:"getOpenid",
      //   success:function(res){
      //     console.log('登录获取用户唯一标识openid：',res.result.openid);
      //     that.setData({
      //       weichat:res.result.openid
      //     });
      //     app.globalData.weichat=res.result.openid;
      //     app.globalData.user_id=res.result.openid;
      //     //that.insertUserWeChat(res.result.openid);
      //     //查询用户信息
      //     that.selectUserByWeChat(res.result.openid);
      //   }
      // })
      //this.selectUserByWeChat('oflQo5aAm5uYR_gFb-RbYtTcrPv4');

      this.setData({
        weichat:'oflQo5aAm5uYR_gFb-RbYtTcrPv4'
      })
      
      // this.insertUserWeChat('oflQo5aAm5uYR_gFb-RbYtTcrPv3');
      // this.selectUserByWeChat('oflQo5aAm5uYR_gFb-RbYtTcrPv4');
      // this.selectUserByWeChat(this.data.weichat);

      //已获取到当前页最新的weichat
      console.log('this.data.weichat:'+this.data.weichat);
      app.globalData.weichat=this.data.weichat;
      app.globalData.user_id=this.data.weichat;
      that.selectUserByWeChat(this.data.weichat);
    },
  
    // 退出登录
    loginOut(){
        this.setData({ 
          user_id:'',
        weichat:'', //存放用户code
        userInfo: '', //用于存放获取的用户信息
        openid:'',
        nickName:'', //昵称
        headImage:'', //头像
            // userInfo:''
        })
        app.globalData.weichat='';
          app.globalData.user_id='';
        // 清空缓存
        wx.setStorageSync('user',null)
    },
      onShow() {
            this.setData({
                  userinfo: app.userinfo
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
      //展示分享弹窗
      showShare() {
            this.setData({
                  showShare: true
            });
      },
      //关闭弹窗
      closePop() {
            this.setData({
                  showShare: false,
            });
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
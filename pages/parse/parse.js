// pages/parse/parse.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        num: 0,
    },
    //生成32位随机字符串
    a(a) {
      var d,
          e,
          b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          c = "";
      for (d = 0; a > d; d += 1)
          e = Math.random() * b.length, e = Math.floor(e), c += b.charAt(e);
      return c
    },
    testpay(e){
      //var wxPay = wx.require('wxPay');
        wxPay.config({
            apiKey: 'wx********',//<!--微信开放平台获取的 appid-->
            mchId: '*********',//<!--商户号（具体在微信给商家发的邮件里）-->
            partnerKey: '******',//<!--秘钥-->
            notifyUrl: 'http://www.*******.xin'//<!--回调地址 写应用网址即可（不清楚有什么用）-->
        }, function(ret, err) {
            if (ret.status) {
                // alert('配置商户支付参数成功');
                wxPay.pay({
                    description:mc,//<!--传给微信的订单名称-->
                    totalFee:wxjg,//<!--给微信传的价格，这里只能是分，然后是整数-->
                    tradeNo:a(32)//<!--生成随机的32位随机码~这个地方很重要-->
                }, function(ret, err) {
                  // alert( JSON.stringify( ret ) );
                    if (ret.status){
                         alert(ret.code);
                    } else {
                        alert(err.code);
                        // alert(err.return_msg);
                    }
                });
            } else {
                alert(err.code);
            }
        });
    },
    go(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.go
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        this.getnum();
    },
    /**
     * 查询用户钱包余额
     */
    getnum() {

    },
    //至顶
    gotop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    //监测屏幕滚动
    onPageScroll: function (e) {
        this.setData({
            scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
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
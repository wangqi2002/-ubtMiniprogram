// pages/sell/list/list.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        _id: 1,
        status:1,
        bookinfo: {
          pic: '/images/book.jpg',
          title: 'C语言入门经典',
          author: 'Ivor Horton'
        },
        price: 18
      },
      {
        _id: 2,
        status:0,
        bookinfo: {
          pic: '/images/book2.jpg',
          title: 'Java入门经典',
          author: 'Wang Lei'
        },
        price: 20
      }],
        
          page: 1,
          scrollTop: 0,
          nomore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.getList();
  },
  // 获取用户发布的图书信息
  getList() {

  },
  //删除
  del(e) {
    let that = this;
    let del = e.currentTarget.dataset.del;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除此条订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除'
          })
          //删除一条记录
          // db.collection('publish').doc(del._id).remove({
          //   success() {
          //     wx.hideLoading();
          //     wx.showToast({
          //       title: '成功删除',
          //     })
          //     that.getList();
          //   },
          //   fail() {
          //     wx.hideLoading();
          //     wx.showToast({
          //       title: '删除失败',
          //       icon: 'none'
          //     })
          //   }
          // })
        }
      }
    })
  },
      //查看详情
      detail(e) {
        let that = this;
        let detail = e.currentTarget.dataset.detail;
        if (detail.status == 0) {
              wx.navigateTo({
                    url: '/pages/detail/detail?scene=' + detail._id,
              })
        }
        if (detail.status == 1) {
              wx.navigateTo({
                    url: '/pages/sell/detail/detail?id=' + detail._id,
              })
        }
  },
      //至顶
      gotop() {
        wx.pageScrollTo({
              scrollTop: 0
        })
  },
      //监测屏幕滚动
      onPageScroll: function(e) {
        this.setData({
              scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
        })
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
    this.getList();
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
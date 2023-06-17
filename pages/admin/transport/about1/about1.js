// pages/transport/about1/about1.js
const app = getApp()
const util = require('../../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    detaillist: [],
    tabid: 0,
  },

  handConfirm(e) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    let orderId = "";
    let bookId = "";
    let bookIsbn = "";
    let tag = 0;
    for (let i = 0; i < that.data.detaillist.length; i++) {
      if (that.data.detaillist[i]._id == e.currentTarget.dataset.id) {
        // console.log(that.data.detaillist[i].orderDetail.sellerorder_id);
        tag = i;
        orderId = that.data.detaillist[i].orderDetail.sellerorder_id;
        bookId = that.data.detaillist[i].orderDetail.sellerorder_bookid;
        bookIsbn = that.data.detaillist[i].orderDetail.sellerorder_book_isbn;
      }
    }
    /* wx.scanCode({
      success(res) {
        // console.log(res.result);
        // console.log(that.data)
        if (res.result === bookIsbn) {
          wx.showModal({
            title: '取书',
            content: '您确认要将此书收入？',
            async success(res) {
              if (res.confirm) {
                // console.log(e.currentTarget.dataset.id);
                that.data.list.orderinfo.number--;
                that.data.detaillist.splice(tag, 1);
                const {
                  data: res1
                } = await wx.p.request({
                  url: app.globalData.baseUrl + '/sellerorder/' + orderId,
                  data: {
                    sellerorder_status: 1
                  },
                  method: "PUT",
                  header: {
                    "Content-Type": "application/json"
                  }
                });
                const {
                  data: res2
                } = await wx.p.request({
                  url: app.globalData.baseUrl + '/bookabout/state/' + bookId,
                  data: {
                    bookA_state: 1
                  },
                  method: "PUT",
                  header: {
                    "Content-Type": "application/json"
                  }
                });
                that.onShow();
                eventChannel.emit('acceptDataFromOpenedPage', that.data);
              }
            }
          })
        } else {
          wx.showToast({
            title: '书籍不匹配',
            icon: 'none',
            duration: 1500 //持续的时间
          })
        }
      }
    }) */

    wx.showModal({
      title: '取书',
      content: '您确认要将此书收入？',
      async success(res) {
        if (res.confirm) {
          // console.log(e.currentTarget.dataset.id);
          that.data.list.orderinfo.number--;
          that.data.detaillist.splice(tag, 1);
          const {
            data: res1
          } = await wx.p.request({
            url: app.globalData.baseUrl + '/sellerorder/' + orderId,
            data: {
              sellerorder_status: 1
            },
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            }
          });
          const {
            data: res2
          } = await wx.p.request({
            url: app.globalData.baseUrl + '/bookabout/state/' + bookId,
            data: {
              bookA_state: 1
            },
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            }
          });
          that.onShow();
          eventChannel.emit('acceptDataFromOpenedPage', that.data);
        }
      }
    })
  },

  handMiss(e) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    // console.log(that.data)
    wx.showModal({
      title: '取书',
      content: '您确认用户处无此书？',
      async success(res) {
        if (res.confirm) {
          // console.log(that.data.detaillist[e.currentTarget.dataset.id].orderDetail.sellerorder_id);
          let orderId = that.data.detaillist[e.currentTarget.dataset.id].orderDetail.sellerorder_id;
          const {
            data: res
          } = await wx.p.request({
            url: app.globalData.baseUrl + '/sellerorder/' + orderId,
            data: {
              sellerorder_status: 3
            },
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            }
          })
          that.data.list.orderinfo.number--;
          that.data.detaillist.splice(e.currentTarget.dataset.id, 1);
          that.onShow();
          eventChannel.emit('acceptDataFromOpenedPage', that.data);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', async function (data) {
      console.log("+++++", data)
      let detaillist = [];
      for (let i = 0; i < data.orderList.orderList.length; i++) {
        // console.log(data.orderList.orderList[i].sellerorder_book_isbn);
        const {
          data: res
        } = await wx.p.request({
          url: app.globalData.baseUrl + '/book/getIsbn/' + data.orderList.orderList[i].sellerorder_book_isbn,
          data: {},
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        })
        console.log(res)
        detaillist.push({
          _id: i,
          orderinfo: {
            ordernumber: data.orderList.orderList[i].sellerorder_id,
            bookname: res.book.book_name,
            date: util.formatTime(data.orderList.orderList[i].sellerorder_date, 'yyyy-mm-dd hh:mi:ss')
          },
          orderDetail: data.orderList.orderList[i]
        })
      }
      // console.log(detaillist);
      that.setData({
        list: data.userDetail,
        detaillist: detaillist
      })
    });
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
    let that = this;
    this.setData({
      list: that.data.list,
      detaillist: that.data.detaillist
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    let that = this;
    this.setData({
      list: that.data.list,
      detaillist: that.data.detaillist
    });
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
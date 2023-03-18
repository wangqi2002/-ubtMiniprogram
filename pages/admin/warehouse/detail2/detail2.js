// pages/admin/warehouse/detail2/detail2.js

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
    const eventChannel = this.getOpenerEventChannel()
    // console.log(that.data)
    wx.showModal({
      title: '出库',
      content: '您确认要将此书出库？',
      async success(res) {
        if (res.confirm) {
          let orderId = "";
          let bookId = "";
          let userId = "";
          for (let i = 0; i < that.data.detaillist.length; i++) {
            if (that.data.detaillist[i]._id == e.currentTarget.dataset.id) {
              // console.log(that.data.detaillist[i].orderDetail.buyerorder_id);
              orderId = that.data.detaillist[i].orderDetail.buyerorder_id;
              bookId = that.data.detaillist[i].orderDetail.buyerorder_bookid;
              userId = that.data.detaillist[i].orderDetail.buyerorder_sellerid;
              that.data.list.orderinfo.number--;
              that.data.detaillist.splice(i, 1);
            }
          }
          const {
            data: res1
          } = await wx.p.request({
            url: 'https://serve.sirbook.top/buyerorder/' + orderId,
            data: {
              buyerorder_status: 1
            },
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            }
          });
          const {
            data: res2
          } = await wx.p.request({
            url: 'https://serve.sirbook.top/bookabout/state/' + bookId,
            data: {
              bookA_state: 4
            },
            method: "PUT",
            header: {
              "Content-Type": "application/json"
            }
          });
          const {
            data: res3
          } = await wx.p.request({
            url: 'https://serve.sirbook.top/bookstand/reduce/' + userId,
            data: {},
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', async function (data) {
      console.log("+++++", data)
      let detaillist = [];
      for (let i = 0; i < data.orderList.orderList.length; i++) {
        // console.log(data.orderList.orderList[i].buyerorder_bookid);
        const {
          data: res
        } = await wx.p.request({
          url: 'https://serve.sirbook.top/book/getbook/' + data.orderList.orderList[i].buyerorder_bookid,
          data: {},
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        })
        const {
          data: res2
        } = await wx.p.request({
          url: 'https://serve.sirbook.top/bookstand/' + data.orderList.orderList[i].buyerorder_sellerid,
          data: {},
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        })
        detaillist.push({
          _id: i,
          orderinfo: {
            ordernumber: data.orderList.orderList[i].buyerorder_id,
            bookname: res.book.book_name,
            date: util.formatTime(data.orderList.orderList[i].buyerorder_time, 'yyyy-mm-dd hh:mi:ss'),
            address: res2.results[0].book_stand_location
          },
          orderDetail: data.orderList.orderList[i]
        })
      }
      // console.log(detaillist);
      that.setData({
        list: data.userDetail,
        detaillist: detaillist
      })
      console.log(that.data);
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
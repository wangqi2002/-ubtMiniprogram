// pages/admin/warehouse/detail1/detail1.js// pages/warehouse/detail1/detail1.js
const util = require('../../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    detaillist: [],
    LocationOfstorage: '', //书立存放位置
    isInput: false,
    isShow: true,
    tabid: 0,
  },

  locationValue(e) {
    this.setData({
      LocationOfstorage: e.detail.value
    })
  },

  handLocation(e) {
    this.setData({
      isInput: !this.data.isInput,
      isShow: !this.data.isShow,
    })
  },

  handConfirm(e) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel()
    // console.log(that.data)
    if (that.data.LocationOfstorage != '') {
      wx.showModal({
        title: '入库',
        content: '您确认要将此书入库？',
        async success(res) {
          if (res.confirm) {
            let orderId = "";
            let bookId = "";
            let userId = "";
            for (let i = 0; i < that.data.detaillist.length; i++) {
              if (that.data.detaillist[i]._id == e.currentTarget.dataset.id) {
                // console.log(that.data.detaillist[i].orderDetail.sellerorder_id);
                orderId = that.data.detaillist[i].orderDetail.sellerorder_id;
                bookId = that.data.detaillist[i].orderDetail.sellerorder_bookid;
                userId = that.data.detaillist[i].orderDetail.sellerorder_sellerid;
                that.data.list.orderinfo.number--;
                that.data.detaillist.splice(i, 1);
              }
            }
            const {
              data: res1
            } = await wx.p.request({
              url: 'https://serve.sirbook.top/sellerorder/' + orderId,
              data: {
                sellerorder_status: 2
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
                bookA_state: 2
              },
              method: "PUT",
              header: {
                "Content-Type": "application/json"
              }
            });
            const {
              data: res3
            } = await wx.p.request({
              url: 'https://serve.sirbook.top/bookstand',
              data: {
                book_stand_id: userId,
                book_stand_location: that.data.LocationOfstorage
              },
              method: "POST",
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
        title: '存放位置未填写',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', async function (data) {
      console.log("+++++", data)
      let detaillist = [];
      const {
        data: valueL
      } = await wx.p.request({
        url: 'https://serve.sirbook.top/bookstand/' + data.orderList.orderList[0].sellerorder_sellerid,
        // url: 'https://serve.sirbook.top/bookstand/16656593520174wx1inztq2b',
        data: {},
        method: "GET",
        header: {
          "Content-Type": "application/json"
        }
      })
      if (valueL.results.length > 0) {
        console.log(valueL.results[0].book_stand_location)
        that.setData({
          LocationOfstorage: valueL.results[0].book_stand_location,
          isInput: true,
          isShow: false,
        })
      }
      for (let i = 0; i < data.orderList.orderList.length; i++) {
        // console.log(data.orderList.orderList[i].sellerorder_book_isbn);
        const {
          data: res
        } = await wx.p.request({
          url: 'https://serve.sirbook.top/book/getIsbn/' + data.orderList.orderList[i].sellerorder_book_isbn,
          data: {},
          method: "GET",
          header: {
            "Content-Type": "application/json"
          }
        })
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
      console.log(detaillist);
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
    console.log(this.data)
    this.setData({
      list: that.data.list,
      detaillist: that.data.detaillist,
      LocationOfstorage: that.data.LocationOfstorage,
      isInput: that.data.isInput,
      isShow: that.data.isShow,
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
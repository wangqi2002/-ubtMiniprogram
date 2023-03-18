// pages/admin/warehouse/list1/list1.js
// pages/warehouse/list1/list1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_in: [], //入库页面展示
    list_out: [], //出库页面展示
    list_in_copy: [], //入库页面展示
    list_out_copy: [], //出库页面展示
    data_in: [], //待入库信息
    data_out: [], //待出库信息
    dataDetail_in: [], //待入库信息 传入详情页
    dataDetail_out: [], //待出库信息 传入详情页
    searchv: '',
    tab: [{
        name: '待入库订单',
        id: 0,
      },
      {
        name: '待出库订单',
        id: 1,
      }
    ],
    tabid: 0,
  },

  searchValue(e) {
    this.data.searchv = e.detail.value
  },

  search(e) {
    // console.log(this.data.list_in_copy, "--打印字段--");
    let keyWord = this.data.searchv;
    // console.log(keyWord, '关键字')
    this.data.list_in_copy = [];
    this.data.list_out_copy = [];
    if (keyWord != '') {
      for (let i = 0; i < this.data.list_in.length; i++) {
        if (this.data.list_in[i].orderinfo.username.indexOf(keyWord) >= 0) {
          this.data.list_in_copy.push(this.data.list_in[i]);
        }
      }
      for (let i = 0; i < this.data.list_out.length; i++) {
        if (this.data.list_out[i].orderinfo.username.indexOf(keyWord) >= 0) {
          this.data.list_out_copy.push(this.data.list_out[i]);
        }
      }
    } else {
      this.data.list_in_copy = this.data.list_in;
      this.data.list_out_copy = this.data.list_out;
    }
    // console.log(this.data.list_in_copy, "数据111");
    this.setData({
      list_in_copy: this.data.list_in_copy,
      list_out_copy: this.data.list_out_copy
    })
  },

  //导航栏切换
  changeTab(e) {
    let that = this;
    that.setData({
      tabid: e.currentTarget.dataset.id
    })
    //that.getlist(); //查询出待收订单
  },
  //跳转详情
  detail_1(e) {
    let that = this;
    // console.log(e.currentTarget.dataset);
    let data = {
      userDetail: that.data.list_in[e.currentTarget.dataset.id],
      orderList: that.data.dataDetail_in[e.currentTarget.dataset.id]
    };
    wx.navigateTo({
      url: '/pages/warehouse/detail1/detail1',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          let orderList = [];
          // console.log(that.data);
          // console.log("-----", data);
          for (let i = 0; i < data.detaillist.length; i++) {
            orderList.push(data.detaillist[i].orderDetail);
          }
          that.setData({
            ['list_in[' + data.list._id + '].orderinfo']: data.list.orderinfo,
            ['dataDetail_in[' + data.list._id + '].orderList']: orderList
          });
          orderList = [];
          // console.log(that.data.list_in);
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },
  detail_2(e) {
    let that = this;
    // console.log(e.currentTarget.dataset);
    // let data = that.data.dataDetail_out[e.currentTarget.dataset.id];
    let data = {
      userDetail: that.data.list_out[e.currentTarget.dataset.id],
      orderList: that.data.dataDetail_out[e.currentTarget.dataset.id]
    };
    wx.navigateTo({
      url: '/pages/warehouse/detail2/detail2',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          let orderList = [];
          // console.log(that.data);
          // console.log("-----", data);
          for (let i = 0; i < data.detaillist.length; i++) {
            orderList.push(data.detaillist[i].orderDetail);
          }
          that.setData({
            ['list_out[' + data.list._id + '].orderinfo']: data.list.orderinfo,
            ['dataDetail_out[' + data.list._id + '].orderList']: orderList
          });
          orderList = [];
          // console.log(that.data.list_out);
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let that = this;
    await wx.p.request({
      url: 'https://serve.sirbook.top/sellerorder/link_sAn/1',
      data: {},
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        let list_in = [];
        let data_in = [];
        let dataDetail = [];
        let dataDetaillist = [];
        data_in = res.data.results;
        data_in.forEach(function (value) {
          let result = dataDetail.filter(function (item) {
            return item.username == value.user_nickname
          })[0]
          if (result) {
            result.number += 1
          } else {
            dataDetail.push({
              username: value.user_nickname,
              number: 1
            })
          }
        })
        for (let i = 0; i < dataDetail.length; i++) {
          list_in.push({
            _id: i,
            orderinfo: dataDetail[i]
          });
          let obj = data_in.filter(function (item) {
            return dataDetail[i].username == item.user_nickname
          })
          dataDetaillist.push({
            username: dataDetail[i].username,
            orderList: obj
          })
        }
        // console.log(dataDetaillist)
        that.setData({
          list_in: list_in,
          list_in_copy: list_in,
          data_in: data_in,
          dataDetail_in: dataDetaillist
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    await wx.p.request({
      url: 'https://serve.sirbook.top/buyerorder/link_sAn/0',
      data: {},
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        let list_out = [];
        let data_out = [];
        let dataDetail = [];
        let dataDetaillist = [];
        data_out = res.data.results;
        data_out.forEach(function (value) {
          let result = dataDetail.filter(function (item) {
            return item.username == value.user_nickname
          })[0]
          if (result) {
            result.number += 1
          } else {
            dataDetail.push({
              username: value.user_nickname,
              number: 1
            })
          }
        })
        for (let i = 0; i < dataDetail.length; i++) {
          list_out.push({
            _id: i,
            orderinfo: dataDetail[i]
          });
          let obj = data_out.filter(function (item) {
            return dataDetail[i].username == item.user_nickname
          })
          dataDetaillist.push({
            username: dataDetail[i].username,
            orderList: obj
          })
        }
        // console.log(dataDetail)
        that.setData({
          list_out: list_out,
          list_out_copy: list_out,
          data_out: data_out,
          dataDetail_out: dataDetaillist
        })
      },
      fail: function (res) {
        console.log(res);
      }
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
      list_out_copy: that.data.list_out,
      list_in_copy: that.data.list_in
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
// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_collection:'', //收藏字段内容
    collect_bookAs:[], //收藏的书们
  },
  showCollects:function(collect){
    let that=this;
    // 收到用户收藏字段
    console.log('collect页收到',this.data.user_collection);
    let dataList = this.data.user_collection;
    // console.log(dataList);
    // 切割字符串
    let res = dataList.split(',');
    // 得到收藏的书们的bookid
    // this.setData({collect_bookAs:res});
    console.log('this.data.collect_bookAs',res);
    // 用每个收藏书的id，获取bookA信息
    res.forEach((item)=>{
      console.log(item);
        wx.request({
          url: 'https://serve.sirbook.top/bookabout/id/'+item,
          success: function (res){
            console.log('查询成功');
            that.data.collect_bookAs.push(res.data.results[0]);
            that.setData({
              collect_bookAs:that.data.collect_bookAs
            })

            // console.log('that.data.collect_bookAs',that.data.collect_bookAs);
          },fail: function () {
            console.log("获取失败");
          },
        })
    })
    // this.setData({collect_bookAs:tmpbookAs});
    // console.log('数组追加完成',this.data.collect_bookAs);
    // console.log('尝试调用newcollect');
    // this.newCollect(tmpbookAs);
  },

  // 跳转到图书详情页
  toBook:function(e){
    // console.log(e.currentTarget.id);
    // 获取当前点击项的id
    // 截取点击项id字符串的末尾，得其在当前页面的booksArray数组的下标
    var id=e.currentTarget.id.slice(6,7);
    console.log(id);
    // 得到该书的isbn号
    var id=this.data.collect_bookAs[id].bookA_id;
    console.log("要传递的tu："+id);
    // 传参数isbn跳转到书详情页
    wx.navigateTo({
      url: '../detail/detail?bookA_id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({user_collection:options.user_collection});
    
    this.showCollects(this.data.user_collection);
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
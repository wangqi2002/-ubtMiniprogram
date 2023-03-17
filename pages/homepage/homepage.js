// pages/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // booksAboutArray:[], //所有图书实体
    booksArray:[], //书信息实体

    // 图书分类数组
    college: [
      {
        name: '通用',
        id: -1
  },
  {
        name: '计算机',
        id: 0
  },
  {
        name: '经管',
        id: 1
  },
  {
        name: '土木',
        id: 2
  },
  {
        name: '新闻',
        id: 3
  },
  {
        name: '数统',
        id: 4
  },
  {
        name: '物理',
        id: 5
  },
  {
        name: '化工',
        id: 6
  },
  {
        name: '生物',
        id: 7
  },
  {
        name: '电气',
        id: 8
  },
  {
        name: '机械',
        id: 9
  },
  {
        name: '动力',
        id: 10
  },
  {
        name: '材料',
        id: 11
  },
  {
        name: '建筑',
        id: 12
  },
  {
        name: '其它',
        id: 13
  },
    ],
    collegeCur: -2,
    scrollTop: 0,
    nomore: false,


    // 轮播图
    background: ['1.jpg', '2.jpg', '3.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  // 跳转到图书详情页
  toBook:function(e){
    // console.log(e.currentTarget.id);
    // 获取当前点击项的id
    // 截取点击项id字符串的末尾，得其在当前页面的booksArray数组的下标
    var id=e.currentTarget.id.slice(6,7);
    console.log(id);
    // 得到该书的isbn号
    var id=this.data.booksArray[id].bookA_id;
    console.log("要传递的tu："+id);
    // 传参数isbn跳转到书详情页
    wx.navigateTo({
      url: '../detail/detail?bookA_id=' + id
    })
  },

  // 根据分类查图书
  selectBookByKind:function(kind){
    console.log("尝试根据分类查图书");
    let that = this;
    wx.request({
      method: 'GET',
      url: 'https://serve.sirbook.top/bookabout/kind/'+kind,
      // data: {
      //   book_kind:kind
      // },
      success: function (res) {
        console.log("根据分类查图书成功");
        console.log(res.data);
        let resultArray=res.data.results;
        that.setData({
          // 查询结果赋给当前页面的data
          booksArray:resultArray,
        })
      },
      fail: function () {
        console.log("按分类获取图书失败");
      },
    })
    console.log("尝试向后端发送按分类查图书请求失败");
  },

  // 显示所有书籍  查所有
  showAll:function(){
    console.log("尝试从bookabout获取所有图书实体");
    let that = this;
    wx.request({
       method: 'GET',
      // url: 'http://127.0.0.1:3000/getAllBooks',
      url: 'https://serve.sirbook.top/bookabout/all',
      // data: {
      //   // 
      // },
      success: function (res) {
        console.log("从bookabout获取所有图书实体成功");
        console.log(res.data);
        let resultArray=res.data.results;
        that.setData({
          // 查询结果赋给当前页面的data
          booksArray:resultArray,
        })
      },
      fail: function () {
        console.log("获取所有图书失败");
      },
    })
    console.log("3333"+this.data.userArray)
  },

  // 搜索，跳转到搜索页
  search() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.showAll()
  },
  //跳转详情
  detail(e) {
    let that = this;
    wx.navigateTo({
      url: '/pages/detail/detail',
      //url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    this.setData({
      scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
    })
    //console.log(e)
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //选择全部
  selectAll() {
    this.showAll()
    this.setData({
      collegeCur: -2,
      scrollLeft: -200,
    })
    //this.getList();
  },
  //学院选择
  collegeSelect(e) {
    console.log('学院选择',e);
    // 获取点击项的id
    var id=e.currentTarget.id.slice(6,7);
    // console.log(id);

    // 根据id获取要查询图书的种类
    var searchkind;
    if(id==0){
      searchkind='通用';
    }else if(id==1){
      searchkind='计算机';
    }else if(id==2){
      searchkind='经管';
    }else if(id==3){
      searchkind='土木';
    }
    else if(id==4){
      searchkind='新闻';
    }
    else if(id==5){
      searchkind='数统';
    }
    else if(id==6){
      searchkind='物理';
    }
    else if(id==7){
      searchkind='化工';
    }
    else if(id==8){
      searchkind='生物';
    }
    else if(id==9){
      searchkind='电气';
    }
    else if(id==10){
      searchkind='机械';
    }
    else if(id==11){
      searchkind='动力';
    }
    else if(id==12){
      searchkind='材料';
    }
    else if(id==13){
      searchkind='建筑';
    }
    else if(id==14){
      searchkind='其它';
    }
    console.log(searchkind);
    this.selectBookByKind(searchkind);
    this.setData({
      // 修改当前选择分类
      collegeCur: id,
      // collegeCur: e.currentTarget.dataset.id - 1,
      scrollLeft: (e.currentTarget.dataset.id - 3) * 100,
    })

    // console.log(this.data.collegeCur);
    //this.getList();
  },
  // 获取滚动条当前位置

  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
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
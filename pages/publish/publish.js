// const db = wx.cloud.database();
const app = getApp();
 const config = require("../../config.js");
Page({
  data: {
    bookinfo:{

    },
    // bookA_image:[],
    bookA_id:'',
    imgs: [],
    //book_cover: '',
    //systeminfo: app.systeminfo,
    entime: {
      enter: 600,
      leave: 300
    }, //进入褪出动画时长
    college: JSON.parse(config.data).college.splice(1),
    steps: [{
        text: '步骤一',
        desc: '扫描isbn码'
      },
      {
        text: '步骤二',
        desc: '补充图书信息'
      },
      {
        text: '步骤三',
        desc: '上传商品图片'
      },
      {
        text: '步骤四',
        desc: '发布成功'
      },
    ],
  },

  // 复制自testimage
  // 上传图片
  chooseImg: function (e) {
    var bookA_id=this.data.bookA_id;
   var that = this;
   var imgs = this.data.imgs;
   if (imgs.length >= 9) {
    this.setData({
     lenMore: 1
    });
    setTimeout(function () {
     that.setData({
      lenMore: 0
     });
    }, 2500);
    return false;
   }
   console.log('向该本书插入图片:'+bookA_id);
   wx.chooseImage({
    // count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
     var tempFilePaths = res.tempFilePaths;
     var imgs = that.data.imgs;
     // console.log(tempFilePaths + '----');
     for (var i = 0; i < tempFilePaths.length; i++) {
      if (imgs.length >= 9) {
       that.setData({
        imgs: imgs
       });
       return false;
      } else {
       imgs.push(tempFilePaths[i]);
      }
      console.log('要插入的图片为：'+tempFilePaths[i]);
      wx.uploadFile({
       url: 'https://serve.sirbook.top/bookabout/avator/' + bookA_id, //服务器接口地址
       filePath: tempFilePaths[i],
       name: 'bookA_image',
       formData: {
           'user': 'test'
       },
       success (res){
           console.log(res);
           const data = res.data
           //do something
           console.log('uploadfile成功');
       }
   })
     }
     console.log(tempFilePaths);
     that.setData({
      imgs: imgs
     });
    }
   });
  },
  // 删除图片
  deleteImg: function (e) {
   var imgs = this.data.imgs;
   var index = e.currentTarget.dataset.index;
   imgs.splice(index, 1);
   this.setData({
    imgs: imgs
   });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
   var index = e.currentTarget.dataset.index;
    //所有图片
   var imgs = this.data.imgs;
   wx.previewImage({
    //当前显示图片
    current: imgs[index],
    //所有图片
    urls: imgs
   })
  },

  btn:function(){
    console.log(this.data.imgs)
  },

  login:function(){
    wx.cloud.callFunction({
      name:"getOpenid",
      success:function(res){
        console.log(res.result.openid)
      }
    })
  },

  //恢复初始态
  initial() {
    let that = this;
    that.setData({
      dura: 30,
      price: 30,
      place: '',
      chooseDelivery: 0,
      cids: '-1', //学院选择的默认值
      isbn: '',
      show_a: true,
      show_b: false,
      show_c: false,
      active: 0,
      chooseCollege: false,
      note_counts: 0,
      notes: '',
      kindid: 0,
      kind: [{
        name: '通用',
        id: 0,
        check: true,
      }, {
        name: '专业',
        id: 1,
        check: false
      }],
    })
  },
  checkLogin:function(){
    if(!this.data.weichat){
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要登录方可使用，是否马上去登录',
        showCancel: false,
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            console.log('确定');
                wx.switchTab({
                      url: '../my/my',
                })
          }
          else{
            console.log('取消');
          }
        }
      })
      return false;
    }
  },
  onLoad() {
    this.initial();
    this.data.weichat=app.globalData.weichat;
    this.checkLogin();
  },
  //手动输入isbn
  isbnInput(e) {
    this.data.isbn = e.detail.value;
  },
  //打开摄像头扫码isbn
  scan() {
    let that = this;
    wx.scanCode({
      // onlyFromCamera: false,
      scanType: ['barCode'],
      success: res => {
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        })
        that.setData({
          isbn: res.result
        })
      },
      fail() {
        wx.showToast({
          title: '扫码失败，请重新扫码或者手动输入',
          icon: 'none'
        })
      }
    })
  },
  confirm() {
    let id = new Date().getTime() + Math.random().toString(36).substring(4, 9);
    this.setData({
      bookA_id:id
    })
    let that = this;
    let isbn = that.data.isbn;
    if (!(/978[0-9]{10}/.test(isbn))) {
      wx.showToast({
        title: '请检查您的isbn号',
        icon: 'none'
      });
      return false;
    }
    that.addbooks(isbn);
  // }
  },
  //添加书籍信息到数据库
  addbooks(bn) {
    let that = this;
    
    wx.request({
      url: 'https://serve.sirbook.top/book/getIsbn/'+bn, 
      data: {
        // isbn: 'bn',
      },
      header: {
        'content-type': 'application/json' // 默认值9787121302954
      },
      success(res) {
        console.log(res.data.book)
       // photoUrl(res.data.book.book_cover)
        wx.request({
          url: 'https://serve.sirbook.top/book/',
          method:'POST',
          data:{
            book_isbn:res.data.book.book_isbn,
            book_name:res.data.book.book_name,
            book_author:res.data.book.book_author,
            book_press:res.data.book.book_press,
            book_publication_time:res.data.book.book_publication_time,
            book_framing:res.data.book.book_framing,
            book_publication_price:res.data.book.book_publication_price,
            book_cover:res.data.book.book_cover,
            book_abstract:res.data.book.book_abstract,
          },
          header: {
           "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"     /*更改头部*/
          },
          success(res){
            console.log(res)
          }
        })
        wx.hideLoading();
        that.setData({
          bookinfo: res.data.book,
         // book_cover: photoUrl(res.data.book.book_cover),
          show_a: false,
          show_b: true,
          show_c: false,
          show_d: false,
          active: 1,
        })
      }
      // fail: err => {
      //               console.error(err)
      //         }
    })
    
    //       
    // })
  },

  //价格输入改变
  priceChange(e) {
    this.data.price = e.detail;
  },
  //时才输入改变
  duraChange(e) {
    this.data.dura = e.detail;
  },
  //地址输入
  placeInput(e) {
    console.log(e)
    this.data.place = e.detail.value
  },
  //书籍类别选择
  kindChange(e) {
    let that = this;
    let kind = that.data.kind;
    let id = e.detail.value;
    for (let i = 0; i < kind.length; i++) {
      kind[i].check = false
    }
    kind[id].check = true;                                                                                                                                                  
    if (id == 1) {
      that.setData({
        kind: kind,
        chooseCollege: true,
        kindid: id
      })
    } else {
      that.setData({
        kind: kind,
        cids: '-1',
        chooseCollege: false,
        kindid: id
      })
    }
  },
  //选择专业
  choCollege(e) {
    let that = this;
    that.setData({
      cids: e.detail.value
    })
  },
  //取货方式改变
  delChange(e) {
    let that = this;
    let delivery = that.data.delivery;
    let id = e.detail.value;
    for (let i = 0; i < delivery.length; i++) {
      delivery[i].check = false
    }
    delivery[id].check = true;
    if (id == 1) {
      that.setData({
        delivery: delivery,
        chooseDelivery: 1
      })
    } else {
      that.setData({
        delivery: delivery,
        chooseDelivery: 0
      })
    }
  },
  //输入备注
  noteInput(e) {
    let that = this;
    that.setData({
      note_counts: e.detail.cursor,
      notes: e.detail.value,
    })
  },
  //发布校检
  check_pub() {
    let that = this;
    //如果用户选择了专业类书籍，需要选择学院
    if (that.data.kind[1].check) {
      if (that.data.cids == -1) {
        wx.showToast({
          title: '请选择学院',
          icon: 'none',
        });
        return false;
      }
    }
    that.publish();
  },
  //正式发布
  publish() {
    
    let that = this;
    // 订单号
    // let id = new Date().getTime() + Math.random().toString(36).substring(4, 9);
    var id = this.data.bookA_id;
    var sellerid=app.globalData.user_id;
    var seller_nickname=app.globalData.user_nickname;
    var address=app.globalData.address;
    console.log('向bookabout表插入新书的id：'+id);
    console.log(that.data.college);
    console.log(that.data.cids);
    wx.showModal({
      title: '温馨提示',
      content: '经检测您填写的信息无误，是否马上发布？',
      success(res) {
        if (res.confirm) {
          //向bookabout表插入
          wx.request({
            url: 'https://serve.sirbook.top/bookabout',
            method:'POST',
            data: {
              bookA_id:id,
              bookA_isbn:that.data.isbn,
              bookA_old_degree:that.data.notes,
              bookA_price:that.data.price,
              bookA_stand:seller_nickname,
              bookA_kind:that.data.college[that.data.cids].name
            },
            success(e) {
              console.log('向bookabout表插入成功')
              that.setData({
                show_a: false,
                show_b: false,
                show_c: true,
                active: 2,
                detail_id: e._id
              });
              //滚动到顶部
              wx.pageScrollTo({
                scrollTop: 0,
              })
            }
          })
          //向sellerorder表插入
          wx.request({
            url: 'https://serve.sirbook.top/sellerorder',
            method:'POST',
            data: {
              sellerorder_id:id,
              sellerorder_sellerid:sellerid,
              sellerorder_book_isbn:that.data.isbn,
              // sellerorder_date
              sellerorder_address:address,
            },
            success(e) {
              console.log('向sellerorder表插入成功')
              that.setData({
                show_a: false,
                show_b: false,
                show_c: true,
                show_d:false,
                active: 2,
                detail_id: e._id
              });
              //滚动到顶部
              wx.pageScrollTo({
                scrollTop: 0,
              })
            }
          })
        }
      }
    })
  },
  detail() {
    let that = this;
    wx.navigateTo({
      url: '/pages/detail/detail?scene=' + that.data.detail_id,
    })
  },
  next(){
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认上传这些图片',
      success(res) {
        that.setData({
          show_a: false,
          show_b: false,
          show_c: false,
          show_d: true,
          active: 3,
        })
        // //滚动到顶部
        wx.pageScrollTo({
          scrollTop: 0,
        })
            }
    })
    
  }
})
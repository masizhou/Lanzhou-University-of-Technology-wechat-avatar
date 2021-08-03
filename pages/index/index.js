//index.js

// 生成头像的宽度，请与 index.wxml 保持一致
const avatarWidth = 640.0;
//生成头像的高度
const avatarHeight = 640.0

// 页边距百分比，左右总和，请与 index.wxss 保持一致
const reservedPaddingProportion = 0.1;
// 除去保留的页边距外剩余可用空间，单位为rpx
const availableSpace = 750.0 * (1 - reservedPaddingProportion);
// 头像原图宽度，单位为rpx
const oriImgWidth = availableSpace;

// 裁剪框左右单侧溢出空间，单位为rpx，请与 index.wxss 保持一致
const gridOverflowX = 706.0;
// 裁剪框上下单侧溢出空间，单位为rpx，请与 index.wxss 保持一致
const gridOverflowY = 706.0;

// 预览框宽度，单位为rpx，请与 index.wxss 保持一致
var previewWidth = 300.0;
//预览框高度，单位为rpx
var previewHeight = 300.0

// 头像框资源网址
const urls = [
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/01.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/02.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/03.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/04.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/05.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/06.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/07.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/08.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/09.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/10.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/11.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/12.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/13.png',
  'cloud://cloud1-6gefcec42c5630ec.636c-cloud1-6gefcec42c5630ec-1305909779/img/14.png',
];

Page({
  data: {
    imgUrl: Array(urls.length), // 初始化与相框数目相同的url，作为placeholder
    backgroundImgSrc: "", // 头像原图url
    tplImgSrc: '', // 相框url
    isShowChooseImg: false,
    isShowCanvas: false,
    gridWidth: oriImgWidth, // 头像缩放框的宽度
    scrollableHeight: oriImgWidth, // movable-area的高度，初始化为宽度
    imgAspectRatio: 1, // 头像原图高宽比
    imgScale: 1, // 头像缩放倍率
    imgOffsetX: 0, // 预览界面头像的X方向偏移，单位为px
    imgOffsetY: 0, // 预览界面头像的Y方向偏移，单位为px
    windowWidth: "", // 窗口宽度
    movableViewX: gridOverflowX + "rpx", // 控制movable-view的x
    movableViewY: gridOverflowY + "rpx", // 控制movable-view的x
    previewHeight: 300.0,    //预览框高度，单位为rpx
  },

  onShareAppMessage: function () {

  },

  onShareTimeline: function() {

  },

  onLoad: function () {
    // 获取窗口宽度
    const width = wx.getSystemInfoSync().windowWidth;
    this.setData({
      windowWidth: width
    });

    // 从网络获取头像框
    for (let index = 0; index < urls.length; index++) {
      var that = this;
      wx.getImageInfo({
        src: urls[index],
        success: function (res) {
          var array = that.data.imgUrl;
          array[index] = res.path;
          that.setData({
            imgUrl: array
          })
        },
        fail: function (res) {
          console.log(res)
        }
      });
    }
  },

  // 从图库选择图片
  getLocalImg: function () {
    wx.chooseImage({
      count: 1, // 可选择的图片数量
      sizeType: ['compressed', 'original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],  // 从相册选择和拍摄，默认两个都有
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          isShowContainer: true,
          backgroundImgSrc: tempFilePaths,
        })

        this.imgInfo(this.data.backgroundImgSrc[0]) //点击获取头像 事件 时，获取真实图片的宽高

        // 滚动到预览区域
        wx.pageScrollTo({
          selector: "#avatarPreview",
        })

        this.resetOffset();
      }
    })
  },

  // 获取用户当前头像
  getAvatar: function () {
    this.startLoading();
    

    wx.getUserProfile({
      desc: "获取头像以生成相框",
      success: res1 => {
        var url = res1.userInfo.avatarUrl

        /* 将url最后数字改为0，获取最清晰版本
        ref: avatarUrl: 用户头像，最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 132*132 正方形头像）
        */
        console.log(url.substring(url.length - 1, url.length))
        while (!isNaN(parseInt(url.substring(url.length - 1, url.length)))) {
          url = url.substring(0, url.length - 1)
        }
        url = url.substring(0, url.length - 1)

        // 将头像下载至本地
        var that = this;

        wx.getImageInfo({
          src: url + "/0",
          success: function (res) {
            that.endLoading()
            that.setData({
              backgroundImgSrc: [res.path]
            })
            wx.pageScrollTo({
              selector: "#avatarPreview",
            })
            that.resetOffset();

          },
          fail: function (res) {
            that.endLoading(true);
            console.log(res)
          }
        });
      },
      fail: res => {
        this.endLoading();
        console.log(res)
      }
    })
  },

  //点击相框，将其设置为当前相框
  showChooseImg: function (e) {

    if (!this.data.isShowChooseImg) {
      this.setData({
        isShowChooseImg: true,
      })
    }

    if (this.data.tplImgSrc != e.target.dataset.img && e.target.dataset.img != "") {
      var temp = e.target.dataset;
      this.setData({
        tplImgSrc: temp.img,
      })
    }
  },


  // 在 canvas 绘制头像及相框
  saveImg: function () {

    this.setData({
      isShowCanvas: true,
    });

    setTimeout(() => {   //这里用异步来实现,不然会提示canvas为空
      var context = wx.createCanvasContext('myCanvas');
      //var info = this.imgInfo(this.data.backgroundImgSrc[0])
      console.log(previewHeight, "我调用了")
      console.log(previewWidth)

      // 计算偏移量，注意单位为px
      const offsetX = this.data.imgOffsetX * oriImgWidth / previewWidth / (this.data.windowWidth * (1 - reservedPaddingProportion)) * avatarWidth * this.data.imgScale;
      const offsetY = this.data.imgOffsetY * (oriImgWidth * this.data.imgAspectRatio) / previewHeight / (this.data.windowWidth * (1 - reservedPaddingProportion)) * avatarHeight * this.data.imgScale;

      context.save();

     context.arc(320, 320, 220, 0, 2 * Math.PI);
     context.setFillStyle('black')
     context.clip();

      context.drawImage(this.data.backgroundImgSrc[0], -offsetX, -offsetY, avatarWidth * this.data.imgScale, avatarHeight * this.data.imgScale * this.data.imgAspectRatio);
      context.restore();
      context.drawImage(this.data.tplImgSrc, 0, 0, avatarWidth, avatarHeight);
      context.draw();
      setTimeout(() => {
        this.drawAfter();
      }, 200);
    }, 50)

  },


  imgInfo(url){
    wx.getImageInfo({
      src: url,
      success (res) {
        //previewWidth = res.width  // 获取宽
        previewHeight = 300 * res.height / res.width  // 获取高宽比，这里改变previewHeight是为了适应太宽或者太长的图片的
        console.log(previewWidth)
        console.log(previewHeight)
        return {width:res.width, height:res.height}  // 返回宽和高
      }
    })
  },


  // 异步绘制
  drawAfter: () => {
    wx.canvasToTempFilePath({
      width: avatarWidth,
      heght: avatarHeight,
      destWidth: avatarWidth,
      destHeight: avatarHeight,
      canvasId: 'myCanvas',
      fileType: 'png',
      // quality: 1,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '成功保存至系统相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: () => {
            wx.getSetting({
              success: (res) => {
                if (!res.authSetting["scope.writePhotosAlbum"]) {
                  wx.showModal({
                    title: "保存失败",
                    content: "需要授予小程序访问系统图库的权限",
                    cancelText: "取消",
                    confirmText: "前往设置",
                    success: (res) => {
                      if (res.confirm) {
                        wx.openSetting();
                      }
                    }
                  })
                }
              }
            })
          },
        });

      },
      fail: function (res) {
        console.log(res);
      },
    })
  },

  startLoading: () => {
    wx.showLoading({
      title: '加载中',
    })
  },

  endLoading: (fail = false) => {
    wx.hideLoading()

    if (fail) {
      wx.showToast({
        title: '图片生成失败',
        icon: 'fail',
        duration: 2000
      })
    }
  },

  // 监听裁剪框移动事件
  didMove: function (event) {
    this.updateOffset(event);
  },

  // 监听裁剪框缩放事件
  didScale: function (event) {
    const width = oriImgWidth * event.detail.scale
    this.setData({
      gridWidth: width,
      imgScale: oriImgWidth / width,
    })
    this.updateOffset(event);
console.log(event)
  },

  updateOffset: function (event) {
    this.setData({

      imgOffsetX: (event.detail.x - gridOverflowX * this.data.windowWidth / 750) * previewWidth / oriImgWidth,
      imgOffsetY: (event.detail.y - gridOverflowY * this.data.windowWidth / 750) * previewHeight / oriImgWidth

    })
  },

  resetOffset: function() {
    this.setData({
      movableViewX: gridOverflowX + "rpx",
      movableViewY: gridOverflowY + "rpx",
    })
  },

  touchDidEnd: function (event) {

    this.setData({
      // 重新设置可移动区域的高度
      scrollableHeight: ((oriImgWidth * this.data.imgAspectRatio) - this.data.gridWidth),
      previewHeight: 300 * this.data.imgAspectRatio,
    })

  },

  // 加载原图时，获取长宽比
  onLoadEditImage(e) {
    this.setData({
      imgAspectRatio: e.detail.height / e.detail.width,
    })
    console.log(this.data.imgAspectRatio)
  }
})
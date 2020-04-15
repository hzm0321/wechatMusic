// 输入文字最大的个数
const MAX_WORDS_NUMBER = 140;
// 最大上传图片数量限制
const MAX_IMG_NUMBER = 9;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: `0/${MAX_WORDS_NUMBER}`, // 用户输入的字数
    footerBottom: 0, // 发布按钮距离底部位置
    images: [], // 已经选择的数组
    selectPhoto: true, // 添加图片元素是否显示
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 输入框输入时触发
   */
  onInput(event) {
    let wordNumber = event.detail.value.length
    const wordText = wordNumber >= MAX_WORDS_NUMBER ? '超出最大字数限制' : `${wordNumber}/${MAX_WORDS_NUMBER}`
    this.setData({
      wordsNum: wordText
    })
  },

  /**
   * 输入框获取焦点时触发
   */
  onFocus(event) {
    // 获取键盘高度
    this.setData({
      footerBottom: event.detail.height,
    })
  },

  /**
   * 输入框失去焦点时触发
   */
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },

  /**
   * 选择图片时触发
   */
  onChooseImage() {
    // 当前还能选择几张图片
    let max = MAX_IMG_NUMBER - this.data.images.length;
    wx.chooseImage({
      count: max,
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        })
        max = MAX_IMG_NUMBER - this.data.images.length;
        this.setData({
          selectPhoto: max > 0
        })
      }
    })
  },

  /**
   * 删除图片
   */
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    // 是否恢复加号
    if (this.data.images.length < MAX_IMG_NUMBER) {
      this.setData({
        selectPhoto: true,
      })
    }
  },

  /**
   * 预览图片
   */
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  }
})

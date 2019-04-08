//index.js
var Bmob = require("../../utils/Bmob-1.7.0.min.js")
//获取应用实例
const app = getApp()

Page({
  data: {
    rankData: [],
    // maskHidden: false,
    imagePath:null,
  },

  onLoad: function() {
  
  },
  getRankData:function(){
    const query = Bmob.Query('student');
    query.order("-score");
    query.find().then(res => {
      this.rankData = res;
      this.setData({
        rankData: res,
      })
      console.log(res)
    });

  },
  createNewImg: function() {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)
    var path = "../../images/backgroud.png";
    context.drawImage(path, 0, 0, 375, 800);
    //绘制名字
    for (var i = 0; i < this.rankData.length; i++) {
      //绘制名次
      context.setFontSize(24);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText("" + (i + 1), 40, 30 + (i + 1) * 50);
      context.stroke();
      //绘制名字
      context.setFontSize(24);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText(this.rankData[i].username, 180, 30 + (i + 1) * 50);
      context.stroke();
      //绘制分数
      context.setFontSize(24);
      context.setFillStyle('#333333');
      context.setTextAlign('center');
      context.fillText(this.rankData[i].score + "小时", 320, 30 + (i + 1) * 50);
      context.stroke();
    }
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          that.imagePath = tempFilePath;
          that.saveNewImg();
          console.log("图片", tempFilePath)
          that.setData({
            imagePath: tempFilePath,
            // canvasHidden: true
          });
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }, 200);
  },
  saveNewImg:function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                createHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  onReady: function () {
    console.log("页面渲染完成")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRankData();
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
    this.getRankData();
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
})
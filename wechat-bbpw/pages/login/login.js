// pages/login.js
const app = getApp()
var Bmob = require("../../utils/Bmob-1.7.0.min.js")
var query = Bmob.Query('login');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    isadmin: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrls: [
      '../../images/index/show1.jpg',
      '../../images/index/show2.jpeg',
      '../../images/index/show3.jpeg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // this.getUserInfo();
        wx.switchTab({
          url: '../index/index',
          fail: function() {
            console.info("跳转失败")
          }
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    console.log("获取信息成功,开始页面跳转");
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.saveUserInfo();
    wx.switchTab({
      url: '../index/index',
      fail: function() {
        console.info("跳转失败")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("页面渲染完成")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //用户信息保存
  saveUserInfo: function() {
    if (app.globalData.userInfo) {
      var userData = app.globalData.userInfo;
      console.log("保存用户信息", userData.nickName)
      query.containedIn("nickname", [userData.nickName]);
      console.log("姓名", userData.nickName)
      query.find().then(res => {
        console.log("查询成功")
        if (res.length <= 0) { //姓名不存在直接存入
          query.set("nickname", userData.nickName)
          query.set("isadmin", 0)
          query.save().then(res => {
            console.log(res)
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
          }).catch(err => {
            wx.showToast({
              title: '提交失败',
              icon: 'success',
              duration: 2000
            })
          })
        } else {
          console.log("已经登陆，是否是管理员")
          app.globalData.isadmin = res[0].isadmin == 1 ? true : false;
          wx.setStorage({
            key: 'login',
            data: app.globalData,
          })
        }
      });
    }

  }
})
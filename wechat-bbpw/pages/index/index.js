//index.js
//获取应用实例
var Bmob = require("../../utils/Bmob-1.7.0.min.js")
var util = require("../../utils/util.js")
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    question: [],
    idtoScore: null,
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function() {
    var that = this;
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
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.userInfo = res.userInfo;
          console.log("获取用户信息")
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log("用户信息", app.globalData.userInfo)
    //获取信息


  },
  getQuestion: function() {
    const query = Bmob.Query('question');
    // query.limit(10)
    // query.skip(1)
    query.find().then(res => {
      var data = res;
      var jsonstr = "{"
      for (let i = 0; i < data.length; i++) {
        if (data[i].type == 1 || data[i].type == 2) {
          var joption = JSON.parse(data[i].option);
          var item = [];
          var option = [];
          for (var d in joption) {
            item.push(d)
            option.push({
              "key": d,
              "value": joption[d]
            })

          }

          data[i].option = option;
        } else {
          data[i].content = data[i].content.replace(/_/g, "$underline$")
          var temp = data[i].content.split("$")
          data[i].content = temp.slice(0, temp.length - 1);
          console.log(data[i].content)
        }
        if (i < data.length - 1) {
          jsonstr += '"' + data[i].objectId + '"' + ':"' + data[i].type + '",'
        } else {
          jsonstr += '"' + data[i].objectId + '"' + ':"' + data[i].type + '"'
        }
      }
      jsonstr += "}"
      this.idtoScore = JSON.parse(jsonstr)
      console.log("json", this.idtoScore)
      this.setData({
        question: data,
      })
      console.log(data)
    });
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  formSubmit: function(data) {
    var formData = data.detail.value;
    console.log("表单数据", formData)
    this.uloadScore(formData)
  },
  //分数上传
  uloadScore: function(data) {
    if (data['e181efd75a1'] == "") {
      wx.showToast({
        title: '请填写姓名',
        image: '../../images/nodata.png',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    var totalScore = 0;
    for (var d in data) {
      if (data[d] == "" || data[d] == []) {
        wx.showToast({
          title: '请填写完毕',
          image: '../../images/nodata.png',
          icon: 'loading',
          duration: 2000
        })
        return;
      }
      if (d != 'e181efd75a1') {
        if (this.idtoScore[d] == 1) {
          if (!util.isNumber(data[d])) {
            console.log("1不是数字", data[d], d)
            continue;
          }
          totalScore += parseInt(data[d])
        } else if (this.idtoScore[d] == 2) {
          for (var i = 0; i < data[d].length; i++) {
            if (!util.isNumber(data[d][i])) {
              console.log("2不是数字", data[d][i], d, i)
              continue;
            }
            totalScore += parseInt(data[d][i]);
          }
        } else if (this.idtoScore[d.slice(0, d.length - 1)] == 3) {
          if (!util.isNumber(data[d])) {
            console.log("3不是数字", data[d], d)
            continue;
          }
          totalScore += parseInt(data[d])
        }
      }
    }
    console.log("总分数", totalScore)
    const query = Bmob.Query('student');
    query.containedIn("username", [data['e181efd75a1']]);
    console.log("姓名", data['e181efd75a1'])
    query.find().then(res => {
      if (res.length > 0) { //姓名已经存在，更新数据
        query.get(res[0].objectId).then(res => {
          console.log(res)
          res.set('score', totalScore)
          res.save()
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
      } else { //姓名不存在直接存入
        query.set("username", data['e181efd75a1'])
        query.set("score", totalScore)
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
      }
    });
  },
  onReady: function() {
    console.log("页面渲染完成")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getQuestion();
  },

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
  // wx.switchTab({
  //   url: './index',
  // })
})
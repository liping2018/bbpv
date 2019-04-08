//index.js
//获取应用实例
const app = getApp()
var Bmob = require("../../utils/Bmob-1.7.0.min.js")
const query = Bmob.Query('question');
Page({
  data: {
    question: [],
    editHidden: true,
    delHidden: true,
    addHidden: true,
    objectId: null,
    addCon: "",
    addOpt: "",
    editCon: "",
    editOpt: "",
    type: "",
    isadmin: false,
  },

  onLoad: function() {
    var that = this;
    wx.getStorage({
      key: 'login',
      success: function(res) {
        console.log("本地数据", res)
        that.setData({
          isadmin: res.data.isadmin
        });
      },
    })
  },

  getAllContent: function() {
    query.find().then(res => {
      this.question = res;
      this.setData({
        question: res
      });
      console.log("题目", res)
    });

  },
  addContetn: function() {
    this.setData({
      addHidden: false
    });
  },
  delContetnt: function(event) {
    var objectId = event.target.dataset.id;
    this.objectId = objectId
    console.log("要删除的id", this.objectId)
    this.setData({
      delHidden: false,
    });
  },

  updateContent: function(event) {
    var objectId = event.target.dataset.id;
    this.objectId = objectId
    var temp = null;
    console.log("要编辑的id", this.objectId)
    for (var i = 0; i < this.question.length; i++) {
      if (this.question[i].objectId == this.objectId) {
        temp = this.question[i];
        break;
      }
    }
    this.type = temp.type;
    this.setData({
      editHidden: false,
      addCon: temp.content,
      addOpt: temp.option,
    });
  },

  editCancel: function() {
    this.setData({
      editHidden: true
    });
  },

  editConfirm: function() {
    console.log("editConfirm", this.objectId, this.addCon, this.addOpt)
    query.get(this.objectId).then(res => {
      console.log(res)
      if (this.addCon != "" && this.addCon != undefined) {
        res.set('content', this.addCon)
      }
      if (this.addOpt != "" && this.addOpt != undefined) {
        res.set('option', this.addOpt)
      }
      if (this.type != "" && this.type != undefined) {
        res.set('type', this.type)
      }
      res.save()
      this.setData({
        editHidden: true
      });
      this.addCon = "";
      this.addOpt = "";
      this.getAllContent();
    }).catch(err => {
      console.log(err)
    })
    console.log("clicked confirm");
  },
  delCancel: function() {
    this.setData({
      delHidden: true
    });
  },
  delConfirm: function() {
    this.setData({
      delHidden: true
    });
    console.log("删除的id", this.objectId)
    const query = Bmob.Query('question');
    query.destroy(this.objectId).then(res => {
      console.log(res)
      this.getAllContent();
    }).catch(err => {
      console.log(err)
    })
    console.log("clicked confirm");
  },
  addCancel: function(e) {
    console.log("取消回调", e)
    this.setData({
      addHidden: true
    });
  },
  addConfirm: function() {
    console.log("提交的内容", this.addCon, this.addOpt, this.type)
    if (this.type == "" || this.type == undefined) {
      return
    }
    if (this.addCon == "" || this.addCon == undefined) {
      return
    }
    if (this.type != 3) {
      if (this.addOpt == "" || this.addOpt == undefined) {
        return
      }
      query.set("option", this.addOpt)
    }
    query.set("content", this.addCon)
    query.set("type", this.type)
    query.save().then(res => {
      this.setData({
        addHidden: true
      });

      this.addCon = "";
      this.addOpt = "";
      this.type = "";
      this.getAllContent();
    }).catch(err => {
      console.log(err)
    })
    console.log("clicked confirm");
  },

  //添加内容绑定事件
  inputAddContent: function(e) {
    this.addCon = e.detail.value;
    console.log(e, this.addCon)
  },
  //添加选项绑定事件
  inputAddOption: function(e) {
    this.addOpt = e.detail.value;
    console.log(e, this.addOpt)
  },
  //添加内容类型
  inputAddRadio: function(e) {
    this.type = e.detail.value;
  },

  //修改内容
  inputEditContent: function(e) {
    this.addCon = e.detail.value;
    console.log(e)
  },
  //修改选项
  inputEditOption: function(e) {
    this.addOpt = e.detail.value;
    console.log(e)
  },
  onReady: function() {
    console.log("页面渲染完成")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAllContent();
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


})
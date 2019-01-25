const app = getApp()
const requestme = require('../utils/requestme.js')
wx.cloud.init({
  env: 'englishcorner-2c2f66',
  traceUser: true
})
const db = wx.cloud.database({}).collection('englishcorner')

Page({
  data: {
    selected: true,
    selected1: false,
    editdisabled: true,
    text :"",
    editableid: -1,
    allWords: {}
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  edit: function (e) {
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    this.setData({
      editableid : id,
      editdisabled: false,
    })
  },
  cancel: function (e) {
    console.log(e.currentTarget.id)
    var id = parseInt(e.currentTarget.id)
    var that = this
    if (that.data.lessonWords[that.data.lessonWords.length-1] == ""){
      that.data.lessonWords.pop()
    }
    console.log(that.data.lessonWords)
    this.setData({
      editableid: -1,
      editdisabled: true,
      lessonWords: that.data.lessonWords,
    })
  },
  save: function (e) {
    console.log(e.currentTarget.id)
    var id = parseInt(e.currentTarget.id)
    // this.getValueByKey(id + 1)
    this.setData({
      editableid: -1,
      editdisabled: true,
      text: e.detail.value.textarea
    })
    var that = this
    if (that.data.lessonWords[that.data.lessonWords.length - 1] == "") {
      this.insertWords(this.data.text)
    }else{
      this.updateWordsById(id, this.data.text)  
    }

    wx.showToast({
      title: 'Success',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },
  bindTextArea: function (e) {
    console.log(e.detail.value)
    this.setData({
      text: e.detail.value,
    })
  },

  add: function (e) {
    var that = this
    that.data.lessonWords.push("")
    console.log(that.data.lessonWords)
    this.setData({
      editableid: that.data.lessonWords.length-1,
      editdisabled: false,
      lessonWords: that.data.lessonWords,
    })
  },
  /**
   * 页面的初始数据
   */
  // data: {
  // },

  insertWords: function (words) {
    db.get().then(res => {
      var lessonid = res.data.length
      // console.log(res.data)
      db.add({
        data: {
          lessonid: lessonid,
          words: words
        }
      }).then(res => {
        console.log(res)
        console.log("insert:", lessonid, ":", words)
        this.queryAll()
      })
    })
  },

  delete: function () {

  },
  
  updateWordsById: function (lessonid, words) {
    db.where({
      lessonid: lessonid
    }).get().then(res => {
      var id = res.data[0]._id
      console.log("id::::",id)
      db.doc(id).update({
        data: {
          words: words,
        }
      }).then(res => {
        console.log(res)
        this.queryAll()
      })
    })     
  },

  queryAll: function () {
    return db.get().then(res => {
      this.setData({
        lessonWords : res.data,
      })
      console.log("query all:",this.data.lessonWords)
    })
  },

  // queryByLessonId: function (id) {
  //   db.where({
  //     lessonid: id
  //   }).get().then(res => {

  //     this.setData({
  //       lessonWords: res.data,
  //     })
  //   })  
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.updateWordsById(5, "111111111111111111111111111111111111111")
    // this.insertWords()
    this.queryAll()
  
    // this.getValueByKey("text")
    this.setData({
      dateResults: this.getDateResults(),
    })
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

  getUserSequence : function () {
    var array = [
      'Marco',
      'Craig',
      'Patrick',
      'Mike',
      'Jonas',
      'Fred',
      'Christina'
    ]
    var result = new Array()
    for (var n = 0; n < 300; n++) {
      var group1 = new Array()
      var group2 = new Array()
      var group3 = new Array()
      group1.push(array[0], array[1], array[2], array[3], array[4])
      group2.push(array[2], array[3], array[4], array[5], array[6])
      group3.push(array[0], array[1], array[5], array[6], "Min")
      result.push(group1, group2, group3)
      array = [array[1], array[2], array[3], array[4], array[5], array[6], array[0]]
    }
    console.log(result)
    return result
  },

  getAllDates: function () {
      var today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      var dates = new Array()
      var baseDate = new Date()
      baseDate.setFullYear(2019, 0, 11)
      for (var i = 0; i < 300; i++) {
        if (baseDate.getDay() == 1 || baseDate.getDay() == 3 || baseDate.getDay() == 4) {
          dates.push(baseDate.toUTCString())
        }
        baseDate.setDate(baseDate.getDate() + 1)
      }
      console.log(dates)
      return dates
  },

  toMyDate: function(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  },
  getDateResults: function () {
    var users = this.getUserSequence()
    var latestDate = ""
    var latestTimestamp = ""
    var today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    var allDates = this.getAllDates()
    var days = new Array()
    var dates = new Array()
    var participators = new Array()
    var nearly = true
    var j = 0
    var timestamps = new Array()
    for (var i = 0; i+2 < allDates.length; i++) { 
      var d = new Date(Date.parse(allDates[i]));
      var nextd = new Date(Date.parse(allDates[i + 1]));
      var nextnextd = new Date(Date.parse(allDates[i + 2]));
      var day = d.toDateString().split(" ")[0]
      var nextday = nextd.toDateString().split(" ")[0]
      if (d.getMonth() != nextnextd.getMonth()) {
        participators.push(new Array("All Hands"), new Array("All Hands"))
        days.push(day,nextday)
        dates.push(this.toMyDate(d), this.toMyDate(nextd))
        timestamps.push(d, nextd)
        i = i + 1
        continue
      }

      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(1)
      if (today <= d && nearly) {
        latestDate = this.toMyDate(d)
        latestTimestamp = d
        nearly = false
      } 
      participators.push(users[j])
      days.push(day)
      dates.push(this.toMyDate(d))
      timestamps.push(d)
      j++
    }
    var results = {"participators": participators, "days": days, "dates": dates, "latestDate": latestDate}
    console.log(JSON.stringify(results))

    var dateMembers = new Array()
    for (var i = 0; i < timestamps.length; i++){
      if (timestamps[i] == latestTimestamp){
        for (var j = 0; j < 12; j++){
          dateMembers.push({ "date": timestamps[i + j].getTime(),"members":participators[i+j]})
        }
        break
      }
    }
    console.log(dateMembers)
    this.putKeyValue("result", JSON.stringify(dateMembers))
    return results
  },

  getValueByKey: function (key) {
    console.log('getting: ', key)
    let params = {
      "key": app.globalData.appKey,
      "table": app.globalData.tableName,
      "k": this.base64_encode(key), 		// 必须，待请求的接口服务名称
    };
    
    var results
    let _self = this
   return requestme.getRequest(app.globalData.apiHost + "/ucache/get", params)
    // console.log(abc.)

    // wx.request({
    //   url: app.globalData.apiHost +"/ucache/get", 
    //   data: params,   
    //   method: "GET",                     
    //   success: function (wxRes) {
    //     // TODO：实现你的梦想……
    //     let res = wxRes.data
    //     if (res.retCode && res.retCode == "200") {
    //       // TODO：请求成功
    //       console.log('ok get: ', key, res.result)
    //       _self.setData({allWords:{[key]:res.result.v}})
    //       console.log(_self.data.allWords)
    //       } else {
    //       // TODO：当前操作失败
    //       console.log('fail get: ', key, res)
    //       _self.setData({[key]: null})
    //     }
    //   }
    // })
  },

  putKeyValue: function (key, value) {
    console.log('putting: ', key, ":", value)
    let params = {
      "key": app.globalData.appKey,
      "table": app.globalData.tableName,
      "k": this.base64_encode(key), 		
      "v": this.base64_encode(value), 
    };
    return requestme.getRequest(app.globalData.apiHost + "/ucache/put", params)



    // wx.request({
    //   url: app.globalData.apiHost + "/ucache/put",
    //   data: params,
    //   method: "GET",
    //   success: function (wxRes) {
    //     // TODO：实现你的梦想……
    //     let res = wxRes.data
    //     if (res.retCode && res.retCode == "200") {
    //       // TODO：请求成功
    //       console.log('ok put: ',key, ":",value, res.msg)
    //     } else {
    //       // TODO：当前操作失败
    //       console.log('fail put: ', res)
    //     }
    //   }
    // })
  },

  base64_encode : function (str) { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while(i <len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
        strin += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
        strin += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return strin
  }
})
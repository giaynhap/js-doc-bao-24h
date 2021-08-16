var player;
jnjectYoutubeScript()

function jnjectYoutubeScript() {
  var tag = document.createElement('script');
  tag.id = 'iframe-demo';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
}

function onYouTubeIframeAPIReady() {
  player = new HookPlayer('existing-iframe-example')
}

var HookPlayer = function(id) {
  
  var yt = new YT.Player(id, {
  height: '100%',
  width: '100%',
  videoId: youtubeVideoId,
  playerVars: {
    'playsinline': 1,
    'start':0,
    'controls': 0,
    'modestbranding': 0,
    'showinfo': 0,
    'rel': 0,
    'autoplay': 0,
    "listType":"playlist"
  },
  events: {
    'onReady': this.onPlayerReady.bind(this),
    'onStateChange': this.onPlayerStateChange.bind(this),
    'onError': this.onPlayerError.bind(this)
  }
  });
  
  this.id = id
  this.player = yt
}

HookPlayer.prototype = {
commandType: {
TIME_CHANGE: 0,
INFO: 1,
STATE: 2,
VIDEO_ERROR: 3
},
  createTimer(){
    this.removeTimer()
    this.timeInterval = setInterval(this.onTime.bind(this),500)
  },
  removeTimer(){
    if (this.timeInterval == null){
      return
    }
    clearInterval(this.timeInterval)
  },
  onTime(){
    this.postJson({type: this.commandType.TIME_CHANGE , value:this.getCurrentTime()})
  },
  callbackInfo() {
 
    let during = this.getDuration()
    console.log(during)
    
    if (during < 1 ) {
      this.postJson({type: this.commandType.INFO , during: 0, live: true}) 
    } else {
      this.postJson({type: this.commandType.INFO , during: during, live: false}) 
    }
    
    setTimeout(function(){
      this.postJson({type: this.commandType.TIME_CHANGE , value: 0})
    },200)
  },
  onPlayerReady(event) {
 
    this.callbackInfo()
  },
  onPlayerStateChange(event) {
    
    let status = event.data
    if (status == 1){
      this.createTimer()
    }
    else {
      this.removeTimer()
    }
    this.postJson({type: this.commandType.STATE, value: status})
    
    try{
      var iframeBody =  document.querySelector("iframe").contentWindow.document.body
      var relativeOverlay = iframeBody.querySelector(".ytp-scroll-min.ytp-pause-overlay")
      var titleChanel = iframeBody.querySelector(".ytp-title-channel")
      var cardTitle = iframeBody.querySelector(".ytp-show-cards-title")
      
      if (relativeOverlay != null){
        relativeOverlay.remove()
      }
      
      if (titleChanel != null){
        titleChanel.remove()
      }
      
      if (cardTitle != null ){
        cardTitle.remove()
      }
       
    } catch (e){
    }
  },
  onPlayerError(){
    console.log("onPlayerError")
    this.postJson({type: this.commandType.INFO , during: 1, error:true})
    this.postJson({type: this.commandType.TIME_CHANGE , value: 0})
    this.postJson({type: this.commandType.VIDEO_ERROR , message:"Video Error"})
  },
  play(){
    this.player.playVideo()
  },
  stop(){
    this.seekTo(0)
    this.player.stopVideo()
  },
  pause(){
    this.player.pauseVideo()
  },
  seekTo(second){
    this.player.seekTo(second)
  },
  mute(bool){
    bool? this.player.mute(): this.player.unMute()
  },
  getDuration(){
    return this.player.getDuration()
  },
  getCurrentTime(){
    curentTime =  this.player.getCurrentTime()
    return curentTime;
  },
  postJson(json) {
    console.log(json)
    window.webkit && window.webkit.messageHandlers.playerListenr.postMessage(JSON.stringify(json));
  }
}

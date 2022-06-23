{
  
  
  var HookPlayer = function() {
    this.player = document.body.querySelector("video")
    
    this.player.setAttribute('playsinline', 'playsinline');
    this.player.setAttribute('webkit-playsinline', 'webkit-playsinline');
    
    if (this.player.hasAttribute("controls")) {
      this.player.removeAttribute("controls")
    }
    
    if (this.player.hasAttribute("autoplay")) {
      this.player.removeAttribute("autoplay")
    }

    if (this.player.hasAttribute("loop")) {
      this.player.removeAttribute("loop")
    }
     
    this.player.style.position="absolute"
    this.player.style.width =  window.innerWidth
    this.player.style.height =  window.innerHeight
    this.player.width = window.innerWidth
    this.player.height = window.innerHeight
  //  this.player.style.height = "100vh"
   // this.player.style.minWidth = "100%"
    this.player.onloadeddata = this.onPlayerReady.bind(this)
    this.player.onplaying =  this.onVideoPlay.bind(this)
    this.player.onpause = this.onVideoPause.bind(this)
    this.player.onended = this.onVideoEnded.bind(this)
    this.state = -1

  
  }
  
  HookPlayer.prototype = {
  commandType: {
  TIME_CHANGE: 0,
  INFO: 1,
  STATE: 2
  },
    callbackInfo(){
      var during =  this.player.duration
      if (during < 1 ) {
        return
      }
      if ( this.state != -1){
        return
      }

      this.postJson({type: this.commandType.INFO , during: during})
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
      this.timeInterval = null
    },
    onVideoEnded() {
      this.removeTimer()
      this.state = 0
      this.postJson({type: this.commandType.STATE, value: 0})
    },
    onVideoPause(){
      this.removeTimer()
      this.state = 2
      this.postJson({type: this.commandType.STATE, value: 2})
    },
    onVideoPlay(){
      this.state = 1
      this.postJson({type: this.commandType.STATE, value: 1})
      this.createTimer()
    },
    onPlayerReady(event) {
      this.callbackInfo()
    },
    play() {
      this.player.play()
    },
    pause() {
      this.removeTimer()
      this.player.pause()
    },
    stop() {
      this.removeTimer()
      this.player.pause()
      this.player.stop()
    },
    getDuration() {
      return this.player.duration
    },
    getCurrentTime() {
      return this.player.currentTime
    },
    seekTo(second) {
      this.player.currentTime = second
    },
    mute(bool){
      this.player.muted = bool
    },
    postJson(json) {
      console.log(json)
      window.webkit && window.webkit.messageHandlers.playerListenr.postMessage(JSON.stringify(json));
    },
    onPlayerError(){
      console.log("onPlayerError")
    },
    onTime(){
      this.postJson({type: this.commandType.TIME_CHANGE , value:this.getCurrentTime()})
    },
    callbackInfo() {
      let during = this.getDuration()
      if (during < 1 ) {
        return
      }
      this.postJson({type: this.commandType.INFO , during: during})
    }
  }
  
  
  
  window.player = new HookPlayer()
  
} (window)

stoppable(function(onStop){

  const message = "Click to enable demo"
  const demos = {};

  window.isDemoEnabled = function(p, name){
    if(demos[name] === undefined){
      demos[name] = {
        enabled: false
      }
    }
    if(!demos[name].enabled){
      p.textSize(32)
      const messageWidth = p.textWidth(message)
      p.text(message, p.width / 2 - messageWidth / 2, p.height / 2)
      if(p.mouseIsPressed && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height){
        demos[name].enabled = true
      }
    }
    return demos[name].enabled
  }

})

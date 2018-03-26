function stoppable(callback){
  if(window.barbaStarted){
    callback(window.barbaExit)
  }
}

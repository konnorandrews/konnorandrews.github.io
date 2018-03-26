//alert('Page Loaded!')
stoppable(function(onStop){

  if(window.count == undefined){
    console.log('set count')
    window.count = 0

    window.demo = count => () => {
      console.log('something', count)
    }
  }
  window.count += 1;
  var id = setInterval(window.demo(window.count), 500)
  onStop.then(function() {
    clearInterval(id)
  })

})

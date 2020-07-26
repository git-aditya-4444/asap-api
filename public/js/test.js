document.getElementById('generate-btn').addEventListener('click',()=>{
    fetch('/test',{method="POST"})
    .then(function(response){
        return console.log("ok")
    }).catch(function(res){
        console.log(res)
    })
  })
// manage/scanner
const del = document.querySelector('#scanner-list')
if(del !== null)
{
  del.addEventListener('click', function(e) {
    const id=e.target.parentNode.parentNode.id
    
      fetch(`/manage/scanner/${id}`, {method:'DELETE'})
        .then(function(response) {
          if(response) {
            console.log(response)
             location.reload()
    
    
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
    });
}

//manage/requests
const group = document.getElementById('req-list');
if(group !== null){
  group.addEventListener('click', function(e) {

    if(e.target.className.includes("ok"))
    {
    const id=e.target.parentNode.id
      fetch(`/manage/requests/${id}`, {method:'PATCH'})
        .then(function(response) {
          if(response) {
            location.reload()
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    if(e.target.className.includes("del"))
    {
      const id=e.target.parentNode.id
      fetch(`/manage/requests/${id}`, {method:'DELETE'})
        .then(function(response) {
          if(response) {
            location.reload()
            console.log(response)
    
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    
    });
}

//live data from /places
if(window.location.pathname === '/home/admin')
{
  setInterval(function() {
  
    fetch('/places/adminUI', {method: 'GET'})
      .then(function(response) {
        if(response.ok) return response.json()
        throw new Error('Request failed.');
      }).then(function(data) {
        const places=data
        places.forEach(x=>{
          console.log(data)
            document.getElementById(x._id.toString()).textContent=x.count
        })
      })
      .catch(function(error) {
      });
  }, 1000);
}


const for_reset_btn=document.querySelector('#places-list')
if(for_reset_btn){
  for_reset_btn.addEventListener('click',(e)=>{
    
    if(e.target.className.includes('ok'))
    {
      const id=e.target.parentNode.id
      fetch(`/manage/places/${id}`,{method: 'PATCH'})
      .then((res)=>{
      }).catch((e)=>{
        console.log(e)
      })
    }
    if(e.target.className.includes('del'))
    {
    const id=e.target.parentNode.id
     fetch(`/manage/places/${id}`,{method: 'DELETE'})
     .then((res)=>{
       location.reload()
     }).catch((e)=>{
       console.log(e)
    })
    }
    

  })
}

const delacc=document.getElementById('delacc-btn')
if(delacc !== null)
{
  delacc.addEventListener('click',()=>{
    console.log("clicked")
    fetch('/admin/account',{method:'DELETE'})
    .then((res)=>{
      location.replace('/')
    }).catch((res)=>{
      console.log('not ok')
    })
  })
}

                                                   
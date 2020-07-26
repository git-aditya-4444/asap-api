const del = document.querySelector('#scanner-list')
del.addEventListener('click', function(e) {
const id=e.target.parentNode.parentNode.parentNode.id

  fetch(`/manage/staff/${id}`, {method:'DELETE'})
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
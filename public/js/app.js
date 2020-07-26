console.log('Client-side code running');
//console.log($('li').data('value'))

// deny


const group = document.getElementById('req-list');
group.addEventListener('click', function(e) {

if(e.target.className == "ion-ios-checkmark-outline")
{
const id=e.target.parentNode.parentNode.id

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
if(e.target.className == "ion-ios-close-outline")
{
  const id=e.target.parentNode.parentNode.id
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



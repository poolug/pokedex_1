$(document).ready(function(){
  function requestApi(pokemon) {
    var respuesta
    $.ajax({
      url: pokemon,
      context: document.body,
      method: 'GET',
      success: function(response){
        var n = 1
        respuesta = response
        response.results.forEach(function(info) {
          let details =
          `<div class='col-4'>
            <div class="card mb-3 mt-3 pt-5 pb-5" style="width: 18rem;">
              <div class="card-body">
                <h1 class="card-title text-center">${info.name.charAt(0).toUpperCase()+info.name.substr(1).toLowerCase()}</h1>
                <a id='enlace-${n}' href="#" url="${info.url}" class="btn btn-primary pokemodal">¡Quiero ver más de este pokémon!</a>
              </div>
            </div>
          </div>`
          $('#info').append(details);
          n = n + 1;
        })
        next_url = response.next
        back_url = response.previous

        if (back_url == null) {
          $('#btn_back').hide()
        } else {
          $('#btn_back').show()
        }

        $('.pokemodal').click(function(e){
          e.preventDefault();
          let new_url = ($(this).attr('url'));
          $.ajax({
            url: new_url,
            context: document.body,
            method: 'GET',
            beforeSend: function(){
              $('.erase-before-send').empty()
            },
            success: function(response){
              var pokeImage = response.sprites.front_default
              var pokeImageBack = response.sprites.back_default
              $("#pokeImage").attr("src", pokeImage);
              $("#pokeImageBack").attr("src", pokeImageBack);
              $('#url-pokemon-modal').html((response.species.name.charAt(0).toUpperCase() + response.species.name.substr(1).toLowerCase()));
              response.abilities.forEach(function(abi){ 
                $("#abilityPokemon").append("<p class='list-ability'>"+abi.ability.name.charAt(0).toUpperCase()+abi.ability.name.substr(1).toLowerCase()+"</p>")
              });
              response.types.forEach(function(tipo){
                $("#typePokemon").append("<p>"+tipo.type.name.charAt(0).toUpperCase()+tipo.type.name.substr(1).toLowerCase()+"</p>")
              });
              response.moves.forEach(function(move, index){
                if (index < 5) {
                  $("#movePokemon").append("<p>"+move.move.name.charAt(0).toUpperCase()+move.move.name.substr(1).toLowerCase()+"</p>")
                }
              });
              response.game_indices.forEach(function(index){
                $("#generationPokemon").append("<p>"+index.version.name.charAt(0).toUpperCase()+index.version.name.substr(1).toLowerCase()+"</p>")
              });
            }
          });
          $('#myModal').modal('show');
          $("button[data-dismiss='modal']").click(function(){
            $('#myModal').modal('hide');
          });
        });
      }
    })
    console.log(respuesta)
  }
  var back_url
  var next_url
  requestApi('https://pokeapi.co/api/v2/pokemon/')

  function activeButton () {
    $('.btn__more').click(function(){
      $('#info').empty('.pokemon')
      requestApi(next_url)
    });
    $('#btn_back').click(function(){
      $('#info').empty('.pokemon')
      requestApi(back_url)
    });
  };
  activeButton()
});
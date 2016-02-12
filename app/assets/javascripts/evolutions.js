PokemonApp.PokemonEvolutions = function (id, info) {
  this.id = id;
  this.info = info;
};

PokemonApp.PokemonEvolutions.prototype.render = function () {
  console.log("Rendering evolutions for: #" + this.id);

  $(".js-ev-title").text(`Evolutions for ${this.info.name}`);
  $(".js-ev-loading").show();
  $(".js-ev-list").empty();

  this.info.evolutions.forEach(function (ev) {
    $.ajax({
      url: ev.resource_uri,

      success: function (response) {
        console.log("Got evolution", ev.to);
        console.log(response);

        $(".js-ev-loading").hide();

        var html = `
          <li class="js-ev-li-${response.pkdx_id}">
            ${response.name}
          </li>
        `;

        $(".js-ev-list").append(html);

        PokemonApp.PokemonEvolutions.getSprite(response.pkdx_id, response.sprites[0].resource_uri);
      },

      error: function () {
        alert(`Couldn't retrieve details for evolution: ${ev.to}`)
      }
    })
  });

  $(".js-ev-modal").modal("show");
};


PokemonApp.PokemonEvolutions.getSprite = function (pokemonId, uri) {
  $.ajax({
    url: uri,

    success: function (response) {
      $(`.js-ev-li-${pokemonId}`).append(`<img src="http://pokeapi.co${response.image}">`);
    },

    error: function () {
      alert(`Error getting sprite`);
    }
  });
};


$(document).on("ready", function () {
  $(".js-evolutions").on("click", function (event) {
    var $button = $(event.currentTarget);
    var pokemonId = $button.data("pkmn-id");

    $.ajax({
      url: `/api/pokemon/${pokemonId}`,

      success: function (response) {
        var evolutions = new PokemonApp.PokemonEvolutions(pokemonId, response);
        evolutions.render();
      },

      error: function () {
        alert("No pokemon info");
      }
    })

  });
});

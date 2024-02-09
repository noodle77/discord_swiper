let pokeName;

var typeOne = $('#typeOne'),
    typeTwo = $('#typeTwo'),
    pokeCard = $('#pokeCard'),
    pokeInput = $('#pokeInput'),
    pokeHeight = $('#pokeHeight'),
    pokeWeight = $('#pokeWeight'),
    searchForm = $('#searchForm'),
    abilityOne = $('#abilityOne'),
    abilityTwo = $('#abilityTwo'),
    hiddenAbility = $('#hiddenAbility'),
    shinyFrontImg = $('#shinyFrontImg'),
    defaultFrontImg = $('#defaultFrontImg');

function searchSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    pokeName = pokeInput.val().toLowerCase();

    pokeInput.val('');
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);
    
}

function getPokeApi(pokeName) {
    var requestPokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeName;

    fetch(requestPokeApiUrl)
        .then(function (response) {
            response.json().then(function(data) {
                console.log(data);
                displayPokeStats(data);
            })
        })
    
}

function getPokeTCGApi(pokeName) {
    var requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' (subtypes:"basic" OR subtypes:"Stage 2") -subtypes:"TAG TEAM"';

    fetch(requestPokeTCGUrl)
        .then(function (response) {
            response.json().then(function(results) {
                console.log(results);
                displayPokeTCGApi(results);
            })
        })
}

function displayPokeTCGApi(results) {
    pokeCard.attr('src', results.data[0].images.large)
}

function displayPokeStats(data) {


    typeOne
        .text(data.types[0].type.name.toUpperCase())
        .removeClass()
        .addClass(data.types[0].type.name);
    if (data.types[1]) {
        typeTwo
            .text(data.types[1].type.name.toUpperCase())
            .removeClass()
            .addClass(data.types[1].type.name);
    };

    defaultFrontImg.attr('src', data.sprites.front_default);
    if (data.sprites.front_shiny) {
        shinyFrontImg.attr('src', data.sprites.front_shiny);
    };

    var newHeight = (data.height / 10).toFixed(1);
    var newWeight = (data.weight / 10).toFixed(1);

    pokeHeight.text(newHeight);
    pokeWeight.text(newWeight);

    abilityOne.text(data.abilities[0].ability.name)
    if (data.abilities[1] && data.abilities[1].is_hidden === true){
        hiddenAbility.text(data.abilities[1].ability.name)
    } else if(data.abilities[1]){
        abilityTwo.text(data.abilities[1].ability.name)
    }
    if (data.abilities[2]){
        hiddenAbility.text(data.abilities[2].ability.name)
    }

}

searchForm.on('submit', searchSubmitHandler);

$(document).ready(() => {
    getPokeApi('mew');
    getPokeTCGApi('mew');
})
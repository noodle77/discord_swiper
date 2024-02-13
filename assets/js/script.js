// global variable declarations
let pokeName;

var mydoc = $(document),
    typeOne = $('#typeOne'),
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

// handles form submission
function searchSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    pokeName = pokeInput.val().toLowerCase();

    pokeInput.val('');
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);
}

// fetches Pokémon data from PokeAPI
function getPokeApi(pokeName) {
    var requestPokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeName;

    fetch(requestPokeApiUrl)
        .then(function handleResponse(response) {
            response.json().then(function displayData(data) {
                console.log(data);
                displayPokeStats(data);
            })
        })
}

//fetches Pokémon data from the Pokemon TCG API
function getPokeTCGApi(pokeName) {
    var requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' (subtypes:"basic" OR subtypes:"Stage 2") -subtypes:"TAG TEAM"';

    fetch(requestPokeTCGUrl)
        .then(function handleResponse(response) {
            response.json().then(function displayResults(results) {
                console.log(results);
                displayPokeTCGApi(results);
            })
        })
}

// displays Pokémon trading card data
function displayPokeTCGApi(results) {
    pokeCard.attr('src', results.data[0].images.large)
}

// displays Pokémon stats and information
function displayPokeStats(data) {
    // Set the color of the poke header based on the Pokémon's first type
    $('#pokeHeader').css('color', getColorForType(data.types[0].type.name));

    // sets the color of the mon header based on the Pokémon's second type (if exists)
    if (data.types[1]) {
        $('#monHeader').css('color', getColorForType(data.types[1].type.name));
    } else {
        $('#monHeader').css('color', 'white');
    }

    // displays Pokémon type(s)
    typeOne
        .text(data.types[0].type.name.toUpperCase())
        .removeClass()
        .addClass(data.types[0].type.name);
        
    
    if (data.types[1]) {
        typeTwo
            .text(data.types[1].type.name.toUpperCase())
            .removeClass()
            .addClass(data.types[1].type.name);
    } else {
        typeTwo
        .text('')
        .removeClass()
    
    };  


    // displayd Pokémon images
    defaultFrontImg.attr('src', data.sprites.front_default);
    if (data.sprites.front_shiny) {
        shinyFrontImg.attr('src', data.sprites.front_shiny);
    };

    // displays Pokémon height and weight
    var newHeight = (data.height / 10).toFixed(1);
    var newWeight = (data.weight / 10).toFixed(1);

    pokeHeight.text(newHeight);
    pokeWeight.text(newWeight);

    // displays Pokémon abilities
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

// event listener for form submission
searchForm.on('submit', searchSubmitHandler);

//execute when the document is ready
mydoc.ready(function documentReady() {
    getPokeApi('charizard');
    getPokeTCGApi('charizard');
})

// gets color based on Pokémon type
function getColorForType(type) {
    switch (type) {
        case 'normal':
            return '#AAAA99';
        case 'fire':
            return '#FF4422';
        case 'water':
            return '#3399FF';
        case 'electric':
            return '#FFCC33';
        case 'grass':
            return '#77CC55';
        case 'ice':
            return '#65CCFF';
        case 'fighting':
            return '#BB5544';
        case 'poison':
            return '#AA5599';
        case 'ground':
            return '#DCBB55';
        case 'flying':
            return '#8899FF';
        case 'psychic':
            return '#FF5699';
        case 'bug':
            return '#AABB23';
        case 'rock':
            return '#BBAA66';
        case 'ghost':
            return '#6666BB';
        case 'dragon':
            return '#7766EE';
        case 'dark':
            return '#775544';
        case 'steel':
            return '#AAAABB';
        case 'fairy':
            return '#EE99EE';
        default:
            return 'white'; // returns white for unknown types
    }
}
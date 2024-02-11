let pokeName;

var noEvos = $('#noEvos'),
    typeOne = $('#typeOne'),
    typeTwo = $('#typeTwo'),
    pokeCard = $('#pokeCard'),
    pokeInput = $('#pokeInput'),
    headerOne = $('#headerOne'),
    headerTwo = $('#headerTwo'),
    evolvesTo = $('#evolvesTo'),
    evoCardTo = $('#evoCardTo'),
    pokeHeight = $('#pokeHeight'),
    pokeWeight = $('#pokeWeight'),
    searchForm = $('#searchForm'),
    abilityOne = $('#abilityOne'),
    abilityTwo = $('#abilityTwo'),
    evoCardFrom = $('#evoCardFrom'),
    evolvesFrom = $('#evolvesFrom'),
    headerThree = $('#headerThree'),
    modalButton = $('#modalButton'),
    hiddenAbility = $('#hiddenAbility'),
    shinyFrontImg = $('#shinyFrontImg'),
    defaultFrontImg = $('#defaultFrontImg'),
    nationalDexNumber = $('#nationalDexNumber');

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
                // console.log(data);
                displayPokeStats(data);
            })
        }
    )
    
}

function getPokeTCGApi(pokeName) {
    var requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' -subtypes:"TAG TEAM"';

    fetch(requestPokeTCGUrl)
        .then(function (response) {
            response.json().then(function(results) {
                // console.log(results);
                displayPokeTCGApi(results);
                displayEvos(results);
            })
        }
    )
}

function displayPokeTCGApi(results) {
    pokeCard.attr('src', results.data[0].images.large)
    if (!results.data[0].nationalPokedexNumbers[0]){
        nationalDexNumber.text('???')
    } else {
        nationalDexNumber.text(results.data[0].nationalPokedexNumbers[0])
    }
}

function displayPokeStats(data) {

    typeOne
        .text(data.types[0].type.name.toUpperCase())
        .removeClass()
        .addClass(data.types[0].type.name);
    if (!data.types[1]){
        typeTwo.text('').removeClass();
    } else {
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

    if(data.abilities[0].is_hidden === true){
        hiddenAbility.text(data.abilities[0].ability.name)
    } else {
        abilityOne.text(data.abilities[0].ability.name)
    }

    // First check for ability 1 and 2 if not there text reset.
    // Second check for just ability 1 if not there reset text.
    // Third check for both ability 1 and if ability 1 is_hidden
    // Fourth check if ability 1 is not hidden
    if (!data.abilities[1] && !data.abilities[2]) {
        abilityTwo.text('')
        hiddenAbility.text('')
    } else if (!data.abilities[1]) {
        abilityTwo.text('')
    } else if (data.abilities[1] && data.abilities[1].is_hidden === true){
        hiddenAbility.text(data.abilities[1].ability.name)
    } else if (data.abilities[1]){
        abilityTwo.text(data.abilities[1].ability.name)
    }
    if (data.abilities[2]){
        hiddenAbility.text(data.abilities[2].ability.name)
    }

}

function displayEvos(results) {
    noEvos.hide()
    evolvesFrom.hide()
    evolvesTo.hide()

    if (results.data[0].evolvesFrom) {
        let evolvesFromPokeName = results.data[0].evolvesFrom;
        let evolvesFromUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + evolvesFromPokeName + ' -subtypes:"TAG TEAM"';
        fetch(evolvesFromUrl)
            .then(function (response) {
                response.json().then(function(fromData) {
                    console.log(fromData);
                    evoCardFrom.attr('src', fromData.data[0].images.small);
                })
            }
        )
    }

    if (results.data[0].evolvesTo) {
        let evolvesToPokeName = results.data[0].evolvesTo;
        let evolvesToUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + evolvesToPokeName + ' -subtypes:"TAG TEAM"';
        fetch(evolvesToUrl)
            .then(function (response) {
                response.json().then(function(toData) {
                    console.log(toData);
                    evoCardTo.attr('src', toData.data[0].images.small);
                })
            }
        )
    }

    if (!results.data[0].evolvesFrom && !results.data[0].evolvesTo){
        noEvos.show()
    } else if (results.data[0].evolvesFrom && !results.data[0].evolvesTo) {
        evolvesFrom.show();
    } else if (!results.data[0].evolvesFrom && results.data[0].evolvesTo) {
        evolvesTo.show();
    } else {
        evolvesFrom.show();
        evolvesTo.show();
    }
}

// Specific to Bulma on how modals function
function openModal() {
    function openModal($el) {
        $el.classList.add('is-active');
    }
    
    function closeModal($el) {
        $el.classList.remove('is-active');
    }
    
    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }
    
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
    
        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });
    
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
    
        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });
    
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if(event.key === "Escape") {
            closeAllModals();
        }
    });
}

modalButton.on('click', openModal);
searchForm.on('submit', searchSubmitHandler);

$(document).ready(() => {
    getPokeApi('mew');
    getPokeTCGApi('mew');
})
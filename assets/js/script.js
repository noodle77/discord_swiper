// global variable declarations
let pokeName;
let pokeHistoryArray = [];

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
    historyOne = $('#historyOne'),
    historyTwo = $('#historyTwo'),
    historyThree = $('#historyThree'),
    historyFour = $('#historyFour'),
    historyFive = $('#historyFive'),
    historySix = $('#historySix'),
    historySeven = $('#historySeven'),
    historyEight = $('#historyEight'),
    evoCardFrom = $('#evoCardFrom'),
    evolvesFrom = $('#evolvesFrom'),
    modalButton = $('#modalButton'),
    hiddenAbility = $('#hiddenAbility'),
    shinyFrontImg = $('#shinyFrontImg'),
    defaultFrontImg = $('#defaultFrontImg'),
    nationalDexNumber = $('#nationalDexNumber'),
    clearPokeHistoryBtn = $('#clearPokeHistoryBtn'),
    clearPokeHistoryBtn2 = $('#clearPokeHistoryBtn2');

// Function to handle form submission for Pokémon search
function searchSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    pokeName = pokeInput.val().toLowerCase();

    // Check if the input is empty
    if (!pokeName) {
        alert('Please enter a valid Pokémon name.\n(Not all Gen 8+ Pokémon are available yet)');

    // Check if the searched Pokémon is already in the history
    } else if (pokeHistoryArray.includes(pokeName)) {
        pokeInput.val('');
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);

    // Check if the history array has reached its maximum length
    } else if (pokeHistoryArray >= 8) {
        pokeHistoryArray.pop();

    // If the input is valid and not in the history, add it to the history array
    } else if (pokeName) {
        pokeInput.val('');
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);
        pokeHistoryArray.unshift(pokeName);
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
        displayPokeSearchHistory();
    }
}

// Function to fetch Pokémon data from the PokéAPI
function getPokeApi(pokeName) {
    var requestPokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeName;

    fetch(requestPokeApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    displayPokeStats(data);
                    updatePokeHistoryArray(data);
                })
            } else {
                // If response is not okay, handle the error
                // Remove invalid Pokémon name from history
                pokeHistoryArray.shift();
                // Update local storage with modified history
                localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
                // Display updated search history
                displayPokeSearchHistory();
                // Alert user about the invalid Pokémon name
                alert('Please enter a valid Pokémon name.\n(Not all Gen 8+ Pokémon are available yet)');
            }
        })
        .catch(function (error) {
            alert('Unable to connect to PokéAPI');
        })
    
}

// Function to fetch Pokémon TCG API data
function getPokeTCGApi(pokeName) {
    var requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' (-subtypes:"TAG TEAM")';

    fetch(requestPokeTCGUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function(results) {
                    console.log(results);
                    displayPokeTCGApi(results);
                    displayEvos(results);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Pokémon TCG API');
        })
    
}

// Function to display Pokémon TCG API data
function displayPokeTCGApi(results) {
    pokeCard.attr('src', results.data[0].images.large)

    // Check if nationalPokedexNumbers exists, if not display '???'
    if (!results.data[0].nationalPokedexNumbers[0]){
        nationalDexNumber.text('???')
    } else {
        nationalDexNumber.text(results.data[0].nationalPokedexNumbers[0])
    }
}

// displays Pokémon stats and information
function displayPokeStats(data) {

    // Set the color of the poke header based on the Pokémon's first type
    headerOne.css('color', getColorForType(data.types[0].type.name));

    // sets the color of the mon header based on the Pokémon's second type (if exists)
    if (data.types[1]) {
        headerTwo.css('color', getColorForType(data.types[1].type.name));
    } else {
        headerTwo.css('color', 'white');
    }

    // Display Pokémon type, images, height, weight, and abilities
    typeOne
        .text(data.types[0].type.name.toUpperCase())
        .removeClass()
        .addClass(data.types[0].type.name);
    if (!data.types[1]){
        typeTwo.text('').removeClass();

    // removes css class if no second type exists
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

    // Convert height and weight to appropriate units
    var newHeight = (data.height / 10).toFixed(1);
    var newWeight = (data.weight / 10).toFixed(1);

    pokeHeight.text(newHeight);
    pokeWeight.text(newWeight);

    if(data.abilities[0].is_hidden === true){
        hiddenAbility.text(data.abilities[0].ability.name)
    } else {
        abilityOne.text(data.abilities[0].ability.name)
    }

    // First check for ability 1 and 2 if not there text reset
    if (!data.abilities[1] && !data.abilities[2]) {
        abilityTwo.text('')
        hiddenAbility.text('')
        
    // Second check for just ability 1 if not there reset text
    } else if (!data.abilities[1]) {
        abilityTwo.text('')
        
    // Third check for both ability 1 and if ability 1 is_hidden
    } else if (data.abilities[1] && data.abilities[1].is_hidden === true){
        hiddenAbility.text(data.abilities[1].ability.name)
        
    // Fourth check if ability 1 is not hidden
    } else if (data.abilities[1]){
        abilityTwo.text(data.abilities[1].ability.name)
    }

    if (data.abilities[2]){
        hiddenAbility.text(data.abilities[2].ability.name)
    }

}

// function for the Evos modal
function displayEvos(results) {
    // resets to a base state
    noEvos.hide()
    evolvesFrom.hide()
    evolvesTo.hide()

    // Special evos are not included in this. This function is purely for single basic evos. Some pokemon have multiple evolutions that require different methods of evolution. With 1000 pokemon to sort through it was decided just to leave it to only simple evolutions just to prove we can pull info from the API itself.
    // ex. Eevee has 8 evos. This only checks for evolvesFrom existance. Not evolvesFrom[i] with i representing as many evos as the pokemon has available.
    // The other issue is with the API itself not all cards contain evo info. Even though the pokemon does in fact evolve. Just a lack of info from the API.
    if (results.data[0].evolvesFrom) {
        let evolvesFromPokeName = results.data[0].evolvesFrom;
        let evolvesFromUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + evolvesFromPokeName + ' -subtypes:"TAG TEAM"';
        fetch(evolvesFromUrl)
            .then(function (response) {
                response.json().then(function(fromData) {
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
                    evoCardTo.attr('src', toData.data[0].images.small);
                })
            }
        )
    }

    // First checks if no evolvesFrom and no evolvesTo
    if (!results.data[0].evolvesFrom && !results.data[0].evolvesTo){
        noEvos.show()

    // Second check if only evolvesFrom exists
    } else if (results.data[0].evolvesFrom && !results.data[0].evolvesTo) {
        evolvesFrom.show();

    // Third check if only evolvesTo exists
    } else if (!results.data[0].evolvesFrom && results.data[0].evolvesTo) {
        evolvesTo.show();

    // Else both exist
    } else {
        evolvesFrom.show();
        evolvesTo.show();
    }
}

// Specific to Bulma on how modals function pulled directly from bulma docs
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

// Function for clearing history buttons and array back to a base state
function clearHistory() {
    pokeHistoryArray = [];
    localStorage.clear();
    historyOne.empty();
    historyTwo.empty();
    historyThree.empty();
    historyFour.empty();
    historyFive.empty();
    historySix.empty();
    historySeven.empty();
    historyEight.empty();
}

// Function for the history buttons so to limit the functionality and only display the selected pokemon from the history buttons
function pokeHistoryBtnClickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    pokeName = event.target.innerHTML;
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);
}

// Function for the Search History buttons to be dynamically added as they are created and if a mess up happens they are dynamically removed
function displayPokeSearchHistory() {
    if (pokeHistoryArray[0] != undefined) {
        historyOne.empty();
        historyOne.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[0] + '</button>')
    } else if (pokeHistoryArray[0] === undefined) {
        historyOne.empty();
    }
    if (pokeHistoryArray[1] != undefined) {
        historyTwo.empty();
        historyTwo.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[1] + '</button>')
    } else if (pokeHistoryArray[1] === undefined) {
        historyTwo.empty();
    }
    if (pokeHistoryArray[2] != undefined) {
        historyThree.empty();
        historyThree.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[2] + '</button>')
    } else if (pokeHistoryArray[2] === undefined) {
        historyThree.empty();
    }
    if (pokeHistoryArray[3] != undefined) {
        historyFour.empty();
        historyFour.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[3] + '</button>')
    } else if (pokeHistoryArray[3] === undefined) {
        historyFour.empty();
    }
    if (pokeHistoryArray[4] != undefined) {
        historyFive.empty();
        historyFive.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[4] + '</button>')
    } else if (pokeHistoryArray[4] === undefined) {
        historyFive.empty();
    }
    if (pokeHistoryArray[5] != undefined) {
        historySix.empty();
        historySix.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[5] + '</button>')
    } else if (pokeHistoryArray[5] === undefined) {
        historySix.empty();
    }
    if (pokeHistoryArray[6] != undefined) {
        historySeven.empty();
        historySeven.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[6] + '</button>')
    } else if (pokeHistoryArray[6] === undefined) {
        historySeven.empty();
    }
    if (pokeHistoryArray[7] != undefined) {
        historyEight.empty();
        historyEight.prepend('<button class="button historyBtn is-capitalized is-rounded has-text-danger has-text-weight-bold is-fullwidth">' + pokeHistoryArray[7] + '</button>')
    } else if (pokeHistoryArray[7] === undefined) {
        historyEight.empty();
    }

    $('.historyBtn').on('click', pokeHistoryBtnClickEvent)
}

// Function for updating the pokeHistoryArray
function updatePokeHistoryArray(data) {

    // Checks if the array has content and updates the array and localStorage
    if (pokeHistoryArray.length > 0) {
        pokeHistoryArray = JSON.parse(localStorage.getItem('pokeHistory'));
        pokeHistoryArray.unshift(pokeHistoryArray.splice(pokeHistoryArray.findIndex(pokeName => pokeName === data.name), 1)[0]);
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
        displayPokeSearchHistory();
    }
}

// Checks when first loading the page if the array is not populated yet but there is localStorage still available
// If available updates array to include all that is in the current localStorage sets the pokeName variable and runs the appropriate functions to display the last search pokemon
if (pokeHistoryArray.length == 0 && localStorage.getItem('pokeHistory') != null) {
    let previousPokeHistoryArray = JSON.parse(localStorage.getItem('pokeHistory'))
    pokeHistoryArray = previousPokeHistoryArray;
    pokeName = pokeHistoryArray[0];
    displayPokeSearchHistory();
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);

// When loading for the first time or after clearing history loads with mew just to create a baseline and give content to the otherwise empty page.
} else {
    $(document).ready(() => {
        pokeHistoryArray = ["mew"];
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray))
        pokeName = 'mew';
        displayPokeSearchHistory();
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);
    })
}

// Handlers
modalButton.on('click', openModal);
searchForm.on('submit', searchSubmitHandler);
clearPokeHistoryBtn.on('click', clearHistory);
clearPokeHistoryBtn2.on('click', clearHistory);
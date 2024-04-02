// Variable to store the document
const mydoc = $(document);

// Global variable declarations
let pokeName;
let pokeHistoryArray = [];

// DOM elements
const elements = {
    noEvos: $('#noEvos'),
    typeOne: $('#typeOne'),
    typeTwo: $('#typeTwo'),
    pokeCard: $('#pokeCard'),
    pokeInput: $('#pokeInput'),
    headerOne: $('#headerOne'),
    headerTwo: $('#headerTwo'),
    evolvesTo: $('#evolvesTo'),
    evoCardTo: $('#evoCardTo'),
    pokeHeight: $('#pokeHeight'),
    pokeWeight: $('#pokeWeight'),
    searchForm: $('#searchForm'),
    abilityOne: $('#abilityOne'),
    abilityTwo: $('#abilityTwo'),
    history: [
        $('#historyOne'),
        $('#historyTwo'),
        $('#historyThree'),
        $('#historyFour'),
        $('#historyFive'),
        $('#historySix'),
        $('#historySeven'),
        $('#historyEight')
    ],
    evoCardFrom: $('#evoCardFrom'),
    evolvesFrom: $('#evolvesFrom'),
    modalButton: $('#modalButton'),
    modalButton2: $('#modalButton2'),
    hiddenAbility: $('#hiddenAbility'),
    shinyFrontImg: $('#shinyFrontImg'),
    defaultFrontImg: $('#defaultFrontImg'),
    nationalDexNumber: $('#nationalDexNumber'),
    clearPokeHistoryBtn: $('#clearPokeHistoryBtn'),
    clearPokeHistoryBtn2: $('#clearPokeHistoryBtn2')
};

// Function to handle form submission for Pokémon search
function searchSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    pokeName = elements.pokeInput.val().toLowerCase();

    if (!pokeName) {
        alert('Please enter a valid Pokémon name.\n(Not all Gen 8+ Pokémon are available yet)');
    } else if (pokeHistoryArray.includes(pokeName)) {
        elements.pokeInput.val('');
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);
    } else if (pokeHistoryArray.length >= 8) {
        pokeHistoryArray.pop();
    } else if (pokeName) {
        elements.pokeInput.val('');
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);
        pokeHistoryArray.unshift(pokeName);
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
        displayPokeSearchHistory();
    }
}

// Function to fetch Pokémon data from the PokéAPI
function getPokeApi(pokeName) {
    const requestPokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeName;

    fetch(requestPokeApiUrl)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data);
                    displayPokeStats(data);
                    updatePokeHistoryArray(data);
                });
            } else {
                pokeHistoryArray.shift();
                localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
                displayPokeSearchHistory();
                alert('Please enter a valid Pokémon name.\n(Not all Gen 8+ Pokémon are available yet)');
            }
        })
        .catch(error => {
            alert('Unable to connect to PokéAPI');
        });
}

// Function to fetch Pokémon TCG API data
function getPokeTCGApi(pokeName) {
    const requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' (-subtypes:"TAG TEAM")';

    fetch(requestPokeTCGUrl)
        .then(response => {
            if (response.ok) {
                response.json().then(results => {
                    console.log(results);
                    displayPokeTCGApi(results);
                    displayEvos(results);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(error => {
            alert('Unable to connect to Pokémon TCG API');
        });
}

// Function to display Pokémon TCG API data
function displayPokeTCGApi(results) {
    elements.pokeCard.attr('src', results.data[0].images.large);

    if (!results.data[0].nationalPokedexNumbers[0]) {
        elements.nationalDexNumber.text('???');
    } else {
        elements.nationalDexNumber.text(results.data[0].nationalPokedexNumbers[0]);
    }
}

// Displays Pokémon stats and information
function displayPokeStats(data) {
    const types = data.types;
    const abilities = data.abilities;
    const sprites = data.sprites;

    elements.headerOne.css('color', getColorForType(types[0].type.name));
    elements.headerTwo.css('color', types[1] ? getColorForType(types[1].type.name) : 'white');

    elements.typeOne.text(types[0].type.name.toUpperCase()).removeClass().addClass(types[0].type.name);
    elements.typeTwo.text(types[1] ? types[1].type.name.toUpperCase() : '').removeClass().addClass(types[1] ? types[1].type.name : '');

    elements.defaultFrontImg.attr('src', sprites.front_default);
    if (sprites.front_shiny) elements.shinyFrontImg.attr('src', sprites.front_shiny);

    const newHeight = (data.height / 10).toFixed(1);
    const newWeight= (data.weight / 10).toFixed(1);
    elements.pokeHeight.text(newHeight);
    elements.pokeWeight.text(newWeight);

    if (abilities[0].is_hidden) elements.hiddenAbility.text(abilities[0].ability.name);
    else elements.abilityOne.text(abilities[0].ability.name);

    if (abilities[1]) {
        if (abilities[1].is_hidden) elements.hiddenAbility.text(abilities[1].ability.name);
        else elements.abilityTwo.text(abilities[1].ability.name);
    }

    if (abilities[2]) elements.hiddenAbility.text(abilities[2].ability.name);
}

// Object mapping Pokémon types to colors
const typeColors = {
    'normal': '#AAAA99',
    'fire': '#FF4422',
    'water': '#3399FF',
    'electric': '#FFCC33',
    'grass': '#77CC55',
    'ice': '#65CCFF',
    'fighting': '#BB5544',
    'poison': '#AA5599',
    'ground': '#DCBB55',
    'flying': '#8899FF',
    'psychic': '#FF5699',
    'bug': '#AABB23',
    'rock': '#BBAA66',
    'ghost': '#6666BB',
    'dragon': '#7766EE',
    'dark': '#775544',
    'steel': '#AAAABB',
    'fairy': '#EE99EE'
};

// Gets color based on Pokémon type
function getColorForType(type) {
    // Return the color from the typeColors object, or 'white' if type is unknown
    return typeColors[type] || 'white';
}

// Function to update the Pokémon search history
function updatePokeHistoryArray(data) {
    pokeHistoryArray.unshift(data.species.name);
    if (pokeHistoryArray.length > 8) pokeHistoryArray.pop();
    localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
    displayPokeSearchHistory();
}

// Function to display the Pokémon search history
function displayPokeSearchHistory() {
    // Keep track of encountered Pokémon names to prevent duplicates
    const encountered = new Set();

    // Clear the existing history list
    elements.history.forEach(item => item.empty());

    // Iterate over the history array
    pokeHistoryArray.forEach(pokeName => {
        // Check if the Pokémon is not a duplicate
        if (!encountered.has(pokeName)) {
            // Add the Pokémon to the encountered set
            encountered.add(pokeName);

            // Create a new history item element
            const historyItem = $('<li>').text(pokeName).appendTo(elements.history[0]).show();

            // Add click event listener to the history item
            historyItem.on('click', function () {
                // Trigger a search for the clicked Pokémon
                elements.pokeInput.val(pokeName);
                searchSubmitHandler(new Event('submit'));
            });
        }
    });
}

// Clear search history event listener
elements.clearPokeHistoryBtn.on('click', function () {
    localStorage.removeItem('pokeHistory');
    pokeHistoryArray = [];
    displayPokeSearchHistory();
});

elements.clearPokeHistoryBtn2.on('click', function () {
    localStorage.removeItem('pokeHistory');
    pokeHistoryArray = [];
    displayPokeSearchHistory();
});

// Function to display the evolutions
function displayEvos(results) {
    if (results.data.length < 2) {
        elements.noEvos.show();
        elements.evolvesTo.hide();
        elements.evoCardTo.hide();
        elements.evolvesFrom.hide();
        elements.evoCardFrom.hide();
    } else {
        elements.noEvos.hide();
        elements.evolvesTo.show();
        elements.evoCardTo.show();
        elements.evolvesFrom.show();
        elements.evoCardFrom.show();
    }
}

// Event listener for form submission
elements.searchForm.on('submit', searchSubmitHandler);

// Initialize pokeHistoryArray
if (localStorage.getItem('pokeHistory')) {
    pokeHistoryArray = JSON.parse(localStorage.getItem('pokeHistory'));
}

// Display search history only if pokeHistoryArray is not empty
if (pokeHistoryArray.length > 0) {
    displayPokeSearchHistory();
}

// Clear search history event listener
elements.clearPokeHistoryBtn.on('click', function () {
    localStorage.removeItem('pokeHistory');
    pokeHistoryArray = [];
    displayPokeSearchHistory();
});

elements.clearPokeHistoryBtn2.on('click', function () {
    localStorage.removeItem('pokeHistory');
    pokeHistoryArray = [];
    displayPokeSearchHistory();
});

// Function to trigger search for "mew" on page load
function displayMewOnLoad(event) {
    elements.pokeInput.val('mew'); // Set the input field value to "mew"
    searchSubmitHandler(event); // Trigger the search for "mew"
}

// Call the function to display "mew" on page load
displayMewOnLoad(new Event('submit'));
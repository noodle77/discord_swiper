// Declare variables for storing Pokémon data and search history
let pokeName;
let pokeHistoryArray = [];
let mydoc = document;

// DOM element variables for easier access
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
    headerThree = $('#headerThree'),
    modalButton = $('#modalButton'),
    hiddenAbility = $('#hiddenAbility'),
    shinyFrontImg = $('#shinyFrontImg'),
    defaultFrontImg = $('#defaultFrontImg'),
    nationalDexNumber = $('#nationalDexNumber'),
    clearPokeHistoryBtn = $('#clearPokeHistoryBtn');

// Log the initial state of pokeHistoryArray
console.log(pokeHistoryArray)

// Function to handle form submission for Pokémon search
function searchSubmitHandler(event) {
    event.preventDefault(); // Prevent default form submission behavior
    event.stopPropagation(); // Stop event propagation to prevent multiple event handling

    // Get the value of the input field and convert it to lowercase
    pokeName = pokeInput.val().toLowerCase();

    // Check if the input is empty
    if (!pokeName) {
        alert('Please enter a valid Pokémon name.\n(Not all Gen 8+ Pokémon are available yet)')
    } 
    // Check if the searched Pokémon is already in the history
    else if (pokeHistoryArray.includes(pokeName)) {
        pokeInput.val(''); // Clear the input field
        getPokeApi(pokeName); // Fetch Pokémon data
        getPokeTCGApi(pokeName); // Fetch Pokémon TCG data
    } 
    // Check if the history array has reached its maximum length
    else if (pokeHistoryArray >= 8) {
        pokeHistoryArray.pop(); // Remove the last item from the history array
    } 
    // If the input is valid and not in the history, add it to the history array
    else if (pokeName) {
        pokeInput.val(''); // Clear the input field
        getPokeApi(pokeName); // Fetch Pokémon data
        getPokeTCGApi(pokeName); // Fetch Pokémon TCG data
        pokeHistoryArray.unshift(pokeName); // Add the searched Pokémon to the beginning of the history array
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray)); // Store the history array in local storage
        displayPokeSearchHistory(); // Display the updated search history
    }
}

// Function to fetch Pokémon data from the PokéAPI
function getPokeApi(pokeName) {
    // Construct the URL for the PokéAPI request
    var requestPokeApiUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokeName;

    // Fetch data from the PokéAPI
    fetch(requestPokeApiUrl)
        .then(function (response) {
            // Check if the response is successful
            if (response.ok) {
                // If successful, parse the JSON data
                response.json().then(function(data) {
                    // Call the function to display Pokémon stats and update search history
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
            // Handle errors in connecting to the PokéAPI
            alert('Unable to connect to PokéAPI');
        })
}

// Function to fetch Pokémon TCG data from the Pokémon TCG API
function getPokeTCGApi(pokeName) {
    // Construct the URL for the Pokémon TCG API request
    var requestPokeTCGUrl = 'https://api.pokemontcg.io/v2/cards/?q=name:' + pokeName + ' (-subtypes:"TAG TEAM")';

    // Fetch data from the Pokémon TCG API
    fetch(requestPokeTCGUrl)
        .then(function (response) {
            // Check if the response is successful
            if (response.ok) {
                // If successful, parse the JSON data
                response.json().then(function(results) {
                    // Call the function to display Pokémon TCG data and evolutions
                    displayPokeTCGApi(results);
                    displayEvos(results);
                })
            } else {
                // If response is not okay, handle the error
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            // Handle errors in connecting to the Pokémon TCG API
            alert('Unable to connect to Pokémon TCG API');
        })
        
}


// Function to display Pokémon TCG data
function displayPokeTCGApi(results) {
    // Set the source attribute of pokeCard to the URL of the Pokémon TCG image
    pokeCard.attr('src', results.data[0].images.large);
    // Check if nationalPokedexNumbers exist, if not display '???', otherwise display the first number
    if (!results.data[0].nationalPokedexNumbers[0]){
        nationalDexNumber.text('???');
    } else {
        nationalDexNumber.text(results.data[0].nationalPokedexNumbers[0]);
    }
}

// Function to display Pokémon stats
function displayPokeStats(data) {
    // Display Pokémon type, images, height, weight, and abilities
    typeOne.text(data.types[0].type.name.toUpperCase()).removeClass().addClass(data.types[0].type.name);
    if (!data.types[1]){
        typeTwo.text('').removeClass();
    } else {
        typeTwo.text(data.types[1].type.name.toUpperCase()).removeClass().addClass(data.types[1].type.name);
    }

    // Update the color of headerOne based on the first type of the Pokémon
    headerOne.css('color', `var(--${data.types[0].type.name})`);

    // Set the color of headerTwo based on the second type of the Pokémon, or leave it white if no second type
    if (!data.types[1]) {
        headerTwo.css('color', '#ffffff'); // If no second type, leave headerTwo white
    } else {
        headerTwo.css('color', `var(--${data.types[1].type.name})`); // Change headerTwo color based on second type
    }

    defaultFrontImg.attr('src', data.sprites.front_default);
    if (data.sprites.front_shiny) {
        shinyFrontImg.attr('src', data.sprites.front_shiny);
    };

    // Convert height and weight to appropriate units
    var newHeight = (data.height / 10).toFixed(1);
    var newWeight = (data.weight / 10).toFixed(1);
    pokeHeight.text(newHeight);
    pokeWeight.text(newWeight);

    // Display abilities
    if(data.abilities[0].is_hidden === true){
        hiddenAbility.text(data.abilities[0].ability.name);
    } else {
        abilityOne.text(data.abilities[0].ability.name);
    }

    // Display second ability and hidden ability if available
    if (!data.abilities[1] && !data.abilities[2]) {
        abilityTwo.text('');
        hiddenAbility.text('');
    } else if (!data.abilities[1]) {
        abilityTwo.text('');
    } else if (data.abilities[1] && data.abilities[1].is_hidden === true){
        hiddenAbility.text(data.abilities[1].ability.name);
    } else if (data.abilities[1]){
        abilityTwo.text(data.abilities[1].ability.name);
    }
    if (data.abilities[2]){
        hiddenAbility.text(data.abilities[2].ability.name);
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
                    // console.log(fromData);
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
                    // console.log(toData);
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
        (mydoc.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }
    
    // Add a click event on buttons to open a specific modal
    (mydoc.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = mydoc.getElementById(modal);
    
        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });
    
    // Add a click event on various child elements to close the parent modal
    (mydoc.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
    
        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });
    
    // Add a keyboard event to close all modals
    mydoc.addEventListener('keydown', (event) => {
        if(event.key === "Escape") {
            closeAllModals();
        }
    });
}

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

// handle click events on history buttons
function pokeHistoryBtnClickEvent(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    event.stopPropagation();
    // Get the Pokémon name from the clicked button and fetch data
    pokeName = event.target.innerHTML;
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);
}
// display search history buttons
function displayPokeSearchHistory() {
    // display up to 8 search history buttons, if available
    if (pokeHistoryArray[0] != undefined) {
        historyOne.empty();
        historyOne.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[0] + '</button>')
    } else if (pokeHistoryArray[0] === undefined) {
        historyOne.empty();
    }
    if (pokeHistoryArray[1] != undefined) {
        historyTwo.empty();
        historyTwo.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[1] + '</button>')
    } else if (pokeHistoryArray[1] === undefined) {
        historyTwo.empty();
    }
    if (pokeHistoryArray[2] != undefined) {
        historyThree.empty();
        historyThree.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[2] + '</button>')
    } else if (pokeHistoryArray[2] === undefined) {
        historyThree.empty();
    }
    if (pokeHistoryArray[3] != undefined) {
        historyFour.empty();
        historyFour.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[3] + '</button>')
    } else if (pokeHistoryArray[3] === undefined) {
        historyFour.empty();
    }
    if (pokeHistoryArray[4] != undefined) {
        historyFive.empty();
        historyFive.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[4] + '</button>')
    } else if (pokeHistoryArray[4] === undefined) {
        historyFive.empty();
    }
    if (pokeHistoryArray[5] != undefined) {
        historySix.empty();
        historySix.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[5] + '</button>')
    } else if (pokeHistoryArray[5] === undefined) {
        historySix.empty();
    }
    if (pokeHistoryArray[6] != undefined) {
        historySeven.empty();
        historySeven.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[6] + '</button>')
    } else if (pokeHistoryArray[6] === undefined) {
        historySeven.empty();
    }
    if (pokeHistoryArray[7] != undefined) {
        historyEight.empty();
        historyEight.prepend('<button class="button historyBtn is-capitalized is-rounded is-fullwidth">' + pokeHistoryArray[7] + '</button>')
    } else if (pokeHistoryArray[7] === undefined) {
        historyEight.empty();
    }

    $('.historyBtn').on('click', pokeHistoryBtnClickEvent)
}

// Function to update the search history array based on the latest search
function updatePokeHistoryArray(data) {
    // Check if there are existing entries in the search history array
    if(pokeHistoryArray.length > 0) {
        // Retrieve the search history array from local storage
        pokeHistoryArray = JSON.parse(localStorage.getItem('pokeHistory'));
        // Move the latest search entry to the front of the array
        pokeHistoryArray.unshift(pokeHistoryArray.splice(pokeHistoryArray.findIndex(pokeName => pokeName === data.name), 1)[0]);
        // Update the search history array in local storage
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
        // Update the display of search history buttons on the page
        displayPokeSearchHistory();
    }
}

// Check if there is no search history array but there is a saved history in local storage
if (pokeHistoryArray.length == 0 && localStorage.getItem('pokeHistory') != null) {
    // Retrieve previous search history array from local storage
    let previousPokeHistoryArray = JSON.parse(localStorage.getItem('pokeHistory'));
    // Set current search history array to the retrieved previous one
    pokeHistoryArray = previousPokeHistoryArray;
    // Get the first Pokémon name from the search history array
    pokeName = pokeHistoryArray[0];
    // Display the search history and fetch data for the first Pokémon in the history
    displayPokeSearchHistory();
    getPokeApi(pokeName);
    getPokeTCGApi(pokeName);
} else {
    // If no search history exists, initialize with default value and fetch data for it
    $(mydoc).ready(() => {
        pokeHistoryArray = ["mew"];
        // Store the default search history in local storage
        localStorage.setItem('pokeHistory', JSON.stringify(pokeHistoryArray));
        // Set the current Pokémon name to the default
        pokeName = 'mew';
        // Display the default search history and fetch data for the default Pokémon
        displayPokeSearchHistory();
        getPokeApi(pokeName);
        getPokeTCGApi(pokeName);
    });
}
// Event listener for opening the modal when the modal button is clicked
modalButton.on('click', openModal);

// Event listener for submitting the search form
searchForm.on('submit', searchSubmitHandler);

// Event listener for clearing the search history when the clear history button is clicked
clearPokeHistoryBtn.on('click', clearHistory);
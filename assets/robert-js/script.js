document.getElementById('sButton').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchData();
});

async function fetchData() {
    let pokeName = document.getElementById('inputData').value;
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokeName);
    const data = await response.json();
    let pokeData = data

    displayData(pokeData);
}

function displayData(pokeData) {
    document.getElementById('api').innerText = "Weight: " + pokeData.weight;

}
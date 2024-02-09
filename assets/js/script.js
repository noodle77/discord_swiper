document.getElementById('sButton').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchData();
});

async function fetchData() {
    let pokeName = document.getElementById('pokeData').value;
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokeName);
    const data = await response.json();
    let pokeData = data

    displayData(pokeData);
}

function displayData(pokeData) {
    document.getElementById('newWeight').innerText = "Weight: " + pokeData.weight;

}
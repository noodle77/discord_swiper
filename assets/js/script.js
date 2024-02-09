//add id is 440 and is equal to temfortress news. this api will pull 440 news.

// first step 



// //

// fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
// $(document).ready(function() {
    //     $('#sButton').click(function() {
        //         var gameName = $('#gameName').val();
        
    
        
        // })
        
const getAppId = document.querySelector('#sButton')  
var getGameName = document.querySelector('#gameName').value;
        
function pullAppId () {
    var textToAppId = new XMLHttpRequest();
            
    request.open("GET", "https://api.steampowered.com/ISteamApps/GetAppList/v2/");
            
    request.setAppId("appid", getGameName)
    console.log("appId");
    
}
            




function pushAppId () {
    var idToNews = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=" + appId + "&count=3&maxlength=300&format=json"

fetch(idToNews)
.then( res => res.json())
.then(function(data) {
    console.log(data)
});
}

getAppId.addEventListener("click", pushAppId);
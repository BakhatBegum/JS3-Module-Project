// //You can edit ALL of the code here
// function setup(num) {
//   const allEpisodes = state.getAllEpisodes;
//   makePageForEpisodes(allEpisodes);
//   const numb = document.getElementById("num-epis");
//   numb.textContent = " " + allEpisodes.length + " ";
// }


const rootElem = document.getElementById("root");

function showLoading(){
   rootElem.innerText = '<p>Loading...</p>'
}

function showError(){
  rootElem.innerText = '<p>Error loading data. Please try again later.</p>'
}

function fetchFilms(){
  return fetch('https://api.tvmaze.com/shows/82/episodes')
  .then(function (data) {
    if (!data.ok){
      throw new Error("Failed to fetch the data");
    }
     return data.json()
  })
}

showLoading()

fetchFilms().then(function (episodeList) {
  //const rootElem = document.getElementById("root");
  rootElem.innerText = "";

  episodeList.forEach((episode) => {
    const number = episode.number.toString().padStart(2, '0');
    const season = episode.season.toString().padStart(2, '0');
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("div");
    episodeDiv.innerHTML = `
        <h2 id="forEpisode">${episode.name} - S${season}E${number}</h2>
         <img src = "${episode.image.medium}" alt="${episode.name}">
        <p>${episode.summary}</p>
    `;
    rootElem.appendChild(episodeDiv);
  });
}).catch(function (){
  showError;
});


// function render() {
//   const searching = document.getElementById("search-bar");
//   const allEpisodes = state.getAllEpisodes;
//   searching.addEventListener("input", function () {
//     state.searchTerm = searching.value.toLowerCase();
//     const filteredEpisodes = allEpisodes.filter((episode) => {
//       return (
//         episode.name.toLowerCase().includes(state.searchTerm) ||
//         episode.summary.toLowerCase().includes(state.searchTerm)
//       );
//     });
//     const numb = document.getElementById("num-epis");
//     numb.textContent =
//       " " + filteredEpisodes.length + "/" + allEpisodes.length + " ";
//     makePageForEpisodes(filteredEpisodes);
//   });
// }
// render();
// window.onload = setup;





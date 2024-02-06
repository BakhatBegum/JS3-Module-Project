//You can edit ALL of the code here
function setup(num) {
  const allEpisodes = state.getAllEpisodes;
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerText = "";
  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("div");
    episodeDiv.innerHTML = `
        <h2 id ="forEpisode">${episode.name} - S${episodeSeason(
      episode.season
    )}E${episodeSeason(episode.number)}</h2>
       
 <img src = "${episode.image.medium}" alt="${episode.name}">
        <p>${episode.summary}</p>
    `;
    rootElem.appendChild(episodeDiv);
  });
  function episodeSeason(num) {
    let numString = num.toString();
    let formattedNum = numString.padStart(2, "0");
    return formattedNum;
  }
}
function render() {
  const searching = document.getElementById("search-bar");
  const allEpisodes = state.getAllEpisodes;
  searching.addEventListener("input", function () {
    state.searchTerm = searching.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      return episode.name.toLowerCase().includes(state.searchTerm);
    });
    makePageForEpisodes(filteredEpisodes);
  });
}
render();
window.onload = setup;

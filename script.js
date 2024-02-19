// //You can edit ALL of the code here
// function setup(num) {
//   const allEpisodes = state.getAllEpisodes;
//   makePageForEpisodes(allEpisodes);
//   const numb = document.getElementById("num-epis");
//   numb.textContent = " " + allEpisodes.length + " ";
// }

const rootElem = document.getElementById("root");

function showLoading() {
  rootElem.innerHTML = "<p>Loading...</p>";
}

function showError() {
  rootElem.innerHTML = "<p>Error loading data. Please try again later.</p>";
}

function fetchShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch the data");
      }
      return response.json();
    })
    .catch(function (error) {
      console.error("Error fetching shows:", error);
    });
}

function fetchEpisodes(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
    });
}

function displayEpisodes(episodes) {
  rootElem.innerHTML = "";
  episodes.forEach((episode) => {
    const number = episode.number.toString().padStart(2, "0");
    const season = episode.season.toString().padStart(2, "0");
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");
    episodeDiv.innerHTML = `
      <h2 id="forEpisode">${episode.name} - S${season}E${number}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;
    rootElem.appendChild(episodeDiv);
  });
}

fetchShows()
  .then(function (shows) {
    const selection = document.getElementById("selection");
    const seasonSelection = document.getElementById("seasonSelection");

    shows.forEach(function (show) {
      const option = document.createElement("option");
      option.textContent = show.name;
      option.value = show.id;
      selection.appendChild(option);
    });

    selection.addEventListener("change", function (event) {
      const selectedShowId = event.target.value;
      if (selectedShowId) {
        fetchEpisodes(selectedShowId).then((episodes) => {
          displayEpisodes(episodes);
          seasonSelection.innerHTML = "";
          episodes.forEach((episode) => {
            const option = document.createElement("option");
            option.textContent = `${episode.name} - S${episode.season
              .toString()
              .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
            option.value = `${episode.season}-${episode.number}`;
            seasonSelection.appendChild(option);
          });
        });
      }
    });

    seasonSelection.addEventListener("change", function (event) {
      const selectedOption = event.target.value;
      console.log(selectedOption);
      const [seasonNumber, episodeNumber] = selectedOption.split("-");
      const selectedShowId = selection.value;
      if (selectedShowId && seasonNumber && episodeNumber) {
        fetchEpisodes(selectedShowId).then((episodes) => {
          const selectedEpisode = episodes.find(
            (episode) =>
              episode.season === parseInt(seasonNumber) &&
              episode.number === parseInt(episodeNumber)
          );
          if (selectedEpisode) {
            displayEpisodes([selectedEpisode]);
          }
        });
      }
    });
  })
  .catch(function (error) {
    console.error("Error populating selection:", error);
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

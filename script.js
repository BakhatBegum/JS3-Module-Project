const getEpisodes = document.getElementById("selectEpisodes");
const getShow = document.getElementById("selectShow");
const root = document.getElementById("root");
const btn = document.getElementById("button");
const search = document.getElementById("search");
const allShows = [];
let connectedEpisodes = [];
let isShowsListingVisible = true;

function fetchShows() {
  return fetch("https://api.tvmaze.com/shows")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch shows");
      }
      return res.json();
    })
    .then((data) => {
      root.innerHTML = "";
      for (const show of data) {
        const showDiv = document.createElement("div");
        showDiv.setAttribute("id", "container");

        data.sort((a, b) =>
          a.name.localeCompare(b.name, { sensitivity: "base" })
        );
        displayShowInfo(show, showDiv);

        // Add a click event listener to each show element
        showDiv.addEventListener("click", function () {
          fetchEpisodes(show.id);
        });

        root.appendChild(showDiv);
        console.log(showDiv, "=====");
        allShows.push(show);
      }
      getAllShows();
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

function displayEpisodes(episode, episodeDiv) {
  episodeDiv.innerHTML = `
      <h2 class="forEpisode">${episode.name} </h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p class = "forSummary">${episode.summary}</p>
    `;
}

function getAllShows() {
  getEpisodes.innerHTML = "";
  const intitialOption = document.createElement("option");
  intitialOption.textContent = "Select Show...";
  getEpisodes.appendChild(intitialOption);

  for (const nameShows of allShows) {
    const option = document.createElement("option");
    option.textContent = nameShows.name;
    getEpisodes.value = "Select Shows";
    getEpisodes.appendChild(option);
  }
}

getEpisodes.addEventListener("change", function () {
  const showValue = this.value;
  const selectedShow = allShows.find((show) => show.name.includes(showValue));

  if (selectedShow) {
    fetchEpisodes(selectedShow.id);
  }
});

function displayShowInfo(show, showDiv) {
  console.log("Show object:", show);
  showDiv.innerHTML = `
    <h2 class="forShow">${show.name}</h2>
    <img src="${show.image.medium}" alt="${show.name}">
    <p>${show.summary}</p>
    <p>Genres: ${show.genres.join(", ")}</p>
    <p>Status: ${show.status}</p>
    <p>Rating: ${show.rating.average || "N/A"}</p>
    <p>Runtime: ${show.runtime || "N/A"} minutes</p>
  `;
}

function fetchEpisodes(showId) {
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    })
    .then((data) => {
      root.innerHTML = "";
      getShow.innerHTML = "";
      connectedEpisodes.push(data);

      for (const show of data) {
        const episodeDiv = document.createElement("div");
        episodeDiv.setAttribute("id", "container");
        displayEpisodes(show, episodeDiv);
        root.appendChild(episodeDiv);

        const option = document.createElement("option");
        option.textContent = show.name;
        console.log(option, "=====");
        getShow.appendChild(option);
      }

      const selectedShow = allShows.find((show) => show.id === showId);
      if (selectedShow) {
        const showDiv = document.createElement("div");
        displayShowInfo(selectedShow, showDiv);
        root.appendChild(showDiv);
      }
    })
    .catch((error) => {
      getShow.innerHTML = "";
      console.error("Error fetching episodes:", error);
    });
}

getShow.addEventListener("change", function () {
  const selectedSpecificEpisode = this.value;
  root.innerHTML = "";
  const selectedShowEpisodes = connectedEpisodes.find((show) =>
    show.some((episode) => episode.name.includes(selectedSpecificEpisode))
  );

  const episodeCountDiv = document.createElement("div");
  episodeCountDiv.textContent = `Found ${selectedShowEpisodes.length} shows`;
  root.appendChild(episodeCountDiv);

  for (const episodes of connectedEpisodes) {
    for (const episode of episodes) {
      if (episode.name.includes(selectedSpecificEpisode)) {
        const episodeDiv = document.createElement("div");
        episodeDiv.setAttribute("id", "container");
        displayEpisodes(episode, episodeDiv);
        root.appendChild(episodeDiv);
      }
    }
  }
});

// Add a navigation link to enable the user to return to the "shows listing"
const showListingLink = document.createElement("a");
showListingLink.href = "#";
showListingLink.textContent = "Back to Shows Listing";
showListingLink.addEventListener("click", () => {
  root.innerHTML = "";
  if (!isShowsListingVisible) {
    fetchEpisodes(showId);
  }
});

root.appendChild(showListingLink);

btn.addEventListener("click", function () {
  fetchShows();
  fetchEpisodes(showId);
});

search.addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();
  // Filter shows based on the search term
  const filteredShows = allShows.filter((show) =>
    show.name.toLowerCase().includes(searchTerm)
  );
  // Display the filtered shows
  root.innerHTML = "";
  for (const show of filteredShows) {
    const showDiv = document.createElement("div");
    showDiv.setAttribute("id", "container");
    displayShowInfo(show, showDiv);
    root.appendChild(showDiv);
  }
});

fetchShows();

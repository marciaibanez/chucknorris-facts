import "normalize.css/normalize.css";
import "./style.scss";
import axios from "axios";
import List from "list.js";

const searchForm = document.getElementById("search-form");
const luckyButton = document.getElementById("lucky-button");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchLoading = document.getElementById("search-loading");

let feelingLucky = false;

luckyButton.addEventListener("click", () => {
  feelingLucky = true;

  const event = new Event("submit");
  searchForm.dispatchEvent(event);
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  searchResults.innerHTML = "";

  searchLoading.style.display = "block";

  if (!searchInput.value || searchInput.value.length < 3) {
    alert("Please type at least 3 characters.");
    searchLoading.style.display = "none";
    return;
  }

  axios
    .get("https://api.chucknorris.io/jokes/search?query=" + searchInput.value)
    .then(response => {
      if (!response.data.result.length) {
        searchResults.innerHTML = "<p>No results found.</p>";
        return;
      }

      if (feelingLucky) {
        location.href = response.data.result[0].url;
        return;
      }

      searchResults.innerHTML = `<p>Your search returned ${
        response.data.total
      } results.</p>`;

      response.data.result.forEach(result => {
        const resultElement = document.createElement("li");

        resultElement.classList.add("search-result");
        resultElement.innerHTML = `
<a class="search-result__link" href="${result.url}">
  <img class="search-result__icon" src="${result.icon_url}" />
  <p class="search-result__fact">${result.value}</p>
</a>
`;

        searchResults.appendChild(resultElement);
      });

      const list = new List("search-list", {
        pagination: true,
        page: 10
      });

      list.on('updated', event => {
        window.scrollTo(0, 0);
      })
    })
    .catch(error => {
      alert('Unexpected error')
    })
    .finally(() => {
      searchLoading.style.display = "none";
    });
});

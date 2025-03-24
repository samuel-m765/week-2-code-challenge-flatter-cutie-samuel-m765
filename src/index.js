document.addEventListener("DOMContentLoaded", () => {
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const votesFormContainer = document.getElementById("votes-form-container");
  let currentCharacter = null;

  // Fetch characters and display in character bar
  fetch("http://localhost:3000/characters")
      .then(response => response.json())
      .then(characters => {
          characters.forEach(addCharacterToBar);
      })
      .catch(error => console.error("Error fetching characters:", error));

  function addCharacterToBar(character) {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.classList.add("character-name");
      span.addEventListener("click", () => displayCharacterDetails(character));
      characterBar.appendChild(span);
  }

  function displayCharacterDetails(character) {
      currentCharacter = character;
      
      // Ensure character details are displayed properly
      detailedInfo.innerHTML = `
          <div id="character-info">
              <h2>${character.name}</h2>
              <img src="${character.image}" alt="${character.name}" />
              <p>Votes: <span id="vote-count">${character.votes}</span></p>
          </div>
      `;
      
      // Ensure the form is visible
      if (!votesFormContainer.innerHTML.trim()) {
          votesFormContainer.innerHTML = `
              <form id="votes-form">
                  <input type="number" id="votes" placeholder="Enter votes" />
                  <button type="submit">Add Votes</button>
              </form>
              <button id="reset-votes">Reset Votes</button>
          `;
          attachFormEventListeners();
      }
  }

  function attachFormEventListeners() {
      const votesForm = document.getElementById("votes-form");
      const votesInput = document.getElementById("votes");
      const resetButton = document.getElementById("reset-votes");

      // Handle votes submission
      votesForm.addEventListener("submit", (event) => {
          event.preventDefault();
          if (currentCharacter) {
              let voteCount = document.getElementById("vote-count");
              let newVotes = parseInt(votesInput.value);
              
              if (!isNaN(newVotes) && newVotes > 0) {
                  currentCharacter.votes += newVotes;
                  voteCount.textContent = currentCharacter.votes;
              } else {
                  alert("Please enter a valid positive number for votes.");
              }
          }
          votesInput.value = "";
      });

      // Handle reset votes
      resetButton.addEventListener("click", () => {
          if (currentCharacter) {
              currentCharacter.votes = 0;
              document.getElementById("vote-count").textContent = 0;
          }
      });
  }

  // Handle new character submission
  document.getElementById("character-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const image = document.getElementById("image").value.trim();
      
      if (!name || !image) {
          alert("Please provide both a name and an image URL.");
          return;
      }
      
      const newCharacter = { name, image, votes: 0 };
      
      addCharacterToBar(newCharacter);
      displayCharacterDetails(newCharacter);
      document.getElementById("character-form").reset();
  });
});
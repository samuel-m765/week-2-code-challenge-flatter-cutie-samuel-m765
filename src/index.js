
let currentCharacterIndex = 0;
let charactersData = [];

document.addEventListener('DOMContentLoaded', () => {
    //this will help me fetch the data from the json file and display it on the page
    fetch('http://localhost:3000/characters')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);// is the there is no data or an errors occurs during the data fetch it will trow this error
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of characters');
            }
            charactersData = data; // Data is already the array of characters
            const characterBar = document.getElementById('character-bar');
            const detailedInfo = document.getElementById('detailed-info');

            // this will help to display the names of the animals in the bar and also display the first animal by default
            charactersData.forEach(character => {
                const span = document.createElement('span');
                span.textContent = character.name;
                span.style.cursor = 'pointer';
                span.addEventListener('click', () => {
                    currentCharacterIndex = charactersData.findIndex(c => c.id === character.id);
                    displayCharacterDetails(character);
                });
                characterBar.appendChild(span);
            });

            // this will Display first character by default if there are any characters in the data  
            if (charactersData.length > 0) {
                displayCharacterDetails(charactersData[0]);
            }

            // creating a button that will help to display the next animal incase you don't want to click on the name of the animal in the bar
            const nextBtn = document.createElement('button');
            nextBtn.id = 'next-btn';
            nextBtn.textContent = 'Next Animal';
            detailedInfo.appendChild(nextBtn);

            // this is an eventlistener that will help to display the next animal when the button is clicked
            nextBtn.addEventListener('click', () => {
                currentCharacterIndex = (currentCharacterIndex + 1) % charactersData.length;
                displayCharacterDetails(charactersData[currentCharacterIndex]);
            });
        })
        // this will help to catch any error that occurs during the data fetch  
        .catch(error => {
            console.error('Error fetching characters:', error);
            const characterBar = document.getElementById('character-bar');
            characterBar.textContent = 'Failed to load characters. Please check the server.';
        });

    // this will help to handle the form submission and also display the votes on the page 
    const votesForm = document.getElementById('votes-form');
    votesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const votesInput = document.getElementById('votes');
        const voteCount = document.getElementById('vote-count');
        let currentVotes = parseInt(voteCount.textContent);
        const newVotes = parseInt(votesInput.value);

        if (!isNaN(newVotes) && newVotes >= 0) {
            currentVotes += newVotes;
            voteCount.textContent = currentVotes;
            votesInput.value = ''; 
        }
    });

    // this will help to reset the votes on the page when the reset button is clicked 
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
        document.getElementById('vote-count').textContent = '0';
    });
});

// this function will help to display the details of the animal on the page 
function displayCharacterDetails(character) {
    const nameElement = document.getElementById('name');
    const imageElement = document.getElementById('image');
    const voteCountElement = document.getElementById('vote-count');

    nameElement.textContent = character.name;
    imageElement.src = character.image;
    imageElement.alt = character.name;
    voteCountElement.textContent = character.votes;
}
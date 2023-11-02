//const playerContainer = document.getElementById('all-players-container');
//const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2309-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;
let state = {};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const puppies = await fetch(`${APIURL}players`);
        let readPuppies = await puppies.json();
        return readPuppies.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const puppies = await fetch(`${APIURL}players/${playerId}`);
        let readPuppies = await puppies.json();
        return readPuppies.data.players;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const puppies = await fetch(`${APIURL}players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
        });

        const result = await puppies.json();
        console.log(result);

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

//addNewPlayer(fetchSinglePlayer(787));

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}players/${playerId}`, {method: 'DELETE'})
        return response.json()
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        const container = document.getElementById('all-players-container');
        while (container.firstChild) {
            container.removeChild(container.lastChild);
        }


        playerList.map((puppy) => {
            const dog = document.createElement('section');
            dog.innerHTML = `<h2>${puppy.name}</h2><img src=${puppy.imageUrl}>`
            container.appendChild(dog);

            const details = document.createElement('button');
            details.innerHTML = 'Show Details';
            details.addEventListener('click', async () => {
                dog.innerHTML += `<p>${puppy.breed}</p><p>${puppy.id}</p><p>${puppy.status}</p>`;
            });
            dog.appendChild(details);

            const removeDog = document.createElement('button');
            removeDog.innerHTML = 'Remove'
            removeDog.addEventListener('click', async () => {
                window.location.reload();
                removePlayer(puppy.id);
            })
            dog.appendChild(removeDog);
        });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const container = document.getElementById('new-player-form');

        const nameLabel = document.createElement('label');
        nameLabel.innerText = 'Dog name: ';
        container.appendChild(nameLabel);
        const enterName = document.createElement('input');
        container.appendChild(enterName);

        const breedLabel = document.createElement('label');
        breedLabel.innerText = 'Dog Breed: ';
        container.appendChild(breedLabel);
        const enterBreed = document.createElement('input');
        container.appendChild(enterBreed);

        const idLabel = document.createElement('label');
        idLabel.innerText = 'Dog ID: ';
        container.appendChild(idLabel);
        const enterId = document.createElement('input');
        container.appendChild(enterId);

        const statusLabel = document.createElement('label');
        statusLabel.innerText = 'Dog Status: ';
        container.appendChild(statusLabel);
        const enterStatus = document.createElement('input');
        container.appendChild(enterStatus);

        const imgLabel = document.createElement('label');
        imgLabel.innerText = 'Dog Image Link: ';
        container.appendChild(imgLabel);
        const enterImg = document.createElement('input');
        container.appendChild(enterImg);

        const submit = document.createElement('input');
        submit.type = 'submit';
        container.appendChild(submit);

        submit.addEventListener('click', async () => {
            state.name = enterName.value;
            state.breed = enterBreed.value;
            state.id = enterId.value;
            state.status = enterStatus.value;
            state.imageUrl = enterImg.value;

            addNewPlayer(state);

            renderAllPlayers(await fetchAllPlayers());

            enterName.value = '';
            enterBreed.value = '';
            enterId.value = '';
            enterStatus.value = '';
            enterImg.value = '';
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    //const player = await fetchSinglePlayer(787);
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const limit = 10;
let offset = 0;
const maxRecords = 151;

function loadPokemonItems(offset, limit) {
    pokeAPI.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons
            .map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `)
            .join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordNextPage = offset + limit;
    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {
        const pokemonId = clickedPokemon.getAttribute('data-pokemon-id');
        showPokemonDetails(pokemonId);
    }
});

function showPokemonDetails(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    return fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Não foi possível obter os detalhes do Pokémon');
            }
            return response.json();
        })
        .then((data) => {
            const detailsSection = document.getElementById('pokemonDetails');
            detailsSection.innerHTML = `
                <h2>${data.name}</h2>
                <p><strong>Tipo:</strong> ${data.types[0].type.name}</p>
                <p><strong>Altura:</strong> ${data.height / 10} m</p>
                <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
                <p><strong>Habilidades:</strong> ${data.abilities.map((ability) => ability.ability.name).join(', ')}
                </p>
            `;
            const modal = document.getElementById('pokemonModal');
            modal.style.display = 'block';
            const closeModal = document.querySelector('.close-modal-button');
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

const modal = document.getElementById('pokemonModal');
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

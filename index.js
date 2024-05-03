let pokemonAleatorio = null;
const searchForm = document.getElementById("search-form");
const namePokemonTry = document.getElementById("search-input");
const searchedPokemon = [];
let allPokemonNames = [];

// Objeto de traducción de tipos de Pokémon
const tipoTraduccion = {
    normal: "normal",
    fighting: "lucha",
    flying: "volador",
    poison: "veneno",
    ground: "tierra",
    rock: "roca",
    bug: "bicho",
    ghost: "fantasma",
    steel: "acero",
    fire: "fuego",
    water: "agua",
    grass: "planta",
    electric: "eléctrico",
    psychic: "psíquico",
    ice: "hielo",
    dragon: "dragón",
    dark: "siniestro",
    fairy: "hada"
};

// Función para obtener el nombre del tipo en español con la primera letra en mayúscula
const obtenerTipoEnEspañol = (tipo) => {
    // Convertir el nombre del tipo a minúsculas y usarlo para buscar la traducción
    const tipoTraducido = tipoTraduccion[tipo.toLowerCase()] || tipo;
    // Devolver el tipo traducido con la primera letra en mayúscula
    return tipoTraducido.charAt(0).toUpperCase() + tipoTraducido.slice(1);
};

let numIntentos = 0;
let numIntentosH2 = document.getElementById("numIntentosH2");

namePokemonTry.addEventListener("input", () => {
    const searchTerm = namePokemonTry.value.trim().toLowerCase();
    // Verificar si la cadena de búsqueda no está vacía
    if (searchTerm) {
        const suggestions = allPokemonNames.filter(name => name.toLowerCase().startsWith(searchTerm));
        // Limpiar sugerencias previas
        clearSuggestions();
        // Mostrar las nuevas sugerencias
        showSuggestions(suggestions);
    } else {
        // Si la cadena de búsqueda está vacía, limpiar las sugerencias
        clearSuggestions();
    }
});

// Función para limpiar las sugerencias previas
const clearSuggestions = () => {
    const suggestionContainer = document.getElementById("suggestions");
    suggestionContainer.innerHTML = "";
};

// Función para mostrar las sugerencias
const showSuggestions = (suggestions) => {
    const suggestionContainer = document.getElementById("suggestions");
    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement("div");
        suggestionElement.textContent = suggestion;
        suggestionElement.classList.add("suggestion");
        // Agregar un evento de clic a cada sugerencia
        suggestionElement.addEventListener("click", () => {
            namePokemonTry.value = suggestion;
            clearSuggestions();
        });
        suggestionContainer.appendChild(suggestionElement);
    });
};

const generarNumeroAleatorio = () => {
    return Math.floor(Math.random() * 151) + 1;
};

const guardarDatosPokemon = (data) => {
    pokemonAleatorio = {
        name: data.name,
        id: data.id,
        weight: data.weight,
        height: data.height,
        spriteUrl: data.sprites.front_default,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        // Separar los tipos en dos campos diferentes
        type1: data.types[0].type.name,
        type2: data.types[1] ? data.types[1].type.name : null
    };
};


const getAllNames = async () => {
    try {
        const response = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon`);
        const data = await response.json();

        // Crear un array para almacenar los nombres de los Pokémon
        const namesArray = [];

        // Iterar sobre los primeros 151 resultados y agregar los nombres al array
        for (let i = 0; i < 151; i++) {
            namesArray.push(data.results[i].name);
        }

        // Asignar el array de nombres a la variable externa
        allPokemonNames = namesArray;

        // Devolver el array de nombres
        return namesArray;
    } catch (err) {
        console.error("Error al obtener los nombres de los Pokémon:", err);
        return []; // Devolver un array vacío en caso de error
    }
};


const getPokemonByNumber = async () => {
    try {
        const id = generarNumeroAleatorio();
        const response = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${id}`);
        const data = await response.json();

        guardarDatosPokemon(data);
    } catch (err) {
        console.error("Error al obtener el Pokémon:", err);
    }
};

const getPokemonByText = async () => {
    try {
        const pokemonName = namePokemonTry.value.trim().toLowerCase();
        if (!pokemonName) {
            console.log("Por favor ingresa un nombre de Pokémon válido.");
            return;
        }
        const response = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonName}`);
        const data = await response.json();

        // Guardar el Pokémon buscado en el array
        searchedPokemon.push({
            name: data.name,
            id: data.id,
            weight: data.weight,
            height: data.height,
            spriteUrl: data.sprites.front_default,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
            type1: data.types[0].type.name,
            type2: data.types[1] ? data.types[1].type.name : null
        });

        console.log(searchedPokemon);
        console.log(pokemonAleatorio);

        // Llenar la tabla con los datos del nuevo Pokémon
        fillPokemonTable(searchedPokemon[searchedPokemon.length - 1], pokemonAleatorio);

        // Comparar el nuevo Pokémon con el aleatorio
        compararPokemon(pokemonAleatorio);
        numIntentos += 1;
        if (numIntentos > 0) {
            numIntentosH2.innerText = "Intentos: " + numIntentos;
        }
    } catch (err) {
        console.error("Error al obtener el Pokémon:", err);
    }
};



const compararPokemon = (pokemonAleatorio) => {
    if (!searchedPokemon.length) {
        console.log("No hay Pokémon para comparar.");
        return;
    }

    searchedPokemon.forEach((pokemon) => {
        if (
            pokemonAleatorio.type1 === pokemon.type1 &&
            pokemonAleatorio.type2 === pokemon.type2 &&
            pokemonAleatorio.hp === pokemon.hp &&
            pokemonAleatorio.speed === pokemon.speed &&
            pokemonAleatorio.attack === pokemon.attack &&
            pokemonAleatorio.specialAttack === pokemon.specialAttack &&
            pokemonAleatorio.defense === pokemon.defense &&
            pokemonAleatorio.specialDefense === pokemon.specialDefense &&
            pokemonAleatorio.height === pokemon.height &&
            pokemonAleatorio.weight === pokemon.weight
        ) {
            //alert("¡Enhorabuena!\nEl pokémon era: " + pokemon.name + "\nIntentos: " +numIntentos);
            mostrarPopup(pokemonAleatorio, numIntentos); // Mostrar la ventana emergente
            console.log(pokemon);
        }
    });
};
// Función para hacer scroll hasta abajo de la página
const scrollToBottom = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight;
    window.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
    });
};
// Función para mostrar un popup con la imagen y el nombre del Pokémon
const mostrarPopup = (pokemon, numIntentos) => {
    const imageUrl = pokemon.spriteUrl;
    const pokemonNameUpper = pokemon.name.toUpperCase();
    const popupContent = `
        <div class="popup-content" style="text-align: center;">
            <h2 style="font-size: 50px; margin-bottom: 20px;">¡Enhorabuena!</h2>
            <p style="font-size: 30px;">Adivinaste:</p>
            <p style="font-size: 25px;">Número de intentos: ${numIntentos}</p>
            <p style="font-size: 20px;"><strong>${pokemonNameUpper}</strong></p>
            <img src="${imageUrl}" alt="${pokemon.name}" class="popup-image" style="width: 300px; height: auto;">
        </div>
    `;

    // Seleccionar el div resultado
    const resultadoDiv = document.querySelector('.resultado');

    // Agregar el contenido al div resultado
    resultadoDiv.innerHTML = popupContent;

    // Hacer scroll hasta centrar el div "resultado"
    scrollToBottom();
};


const fillPokemonTable = (pokemon, pokemonAleatorio) => {
    const table = document.querySelector("table");

    // Obtener la fila de datos
    const row = table.insertRow();

    const spriteCell = row.insertCell(0);
    const spriteImg = document.createElement("img");
    spriteImg.src = pokemon.spriteUrl;
    spriteImg.alt = pokemon.name;
    spriteImg.classList.add("pokemon-sprite");
    spriteCell.appendChild(spriteImg);

    // Insertar las celdas con los datos del Pokémon
    const type1Cell = row.insertCell(1);
    type1Cell.textContent = obtenerTipoEnEspañol(pokemon.type1);
    if (pokemon.type1 === pokemonAleatorio.type1) {
        type1Cell.style.backgroundColor = "lightgreen";
    } else {
        type1Cell.style.backgroundColor = "#C70039";
    }

    const type2Cell = row.insertCell(2);
    type2Cell.textContent = pokemon.type2 ? obtenerTipoEnEspañol(pokemon.type2) : "";
    if (pokemon.type2 === pokemonAleatorio.type2) {
        type2Cell.style.backgroundColor = "lightgreen";
    } else {
        type2Cell.style.backgroundColor = "#C70039";
    }

    const hpCell = row.insertCell(3);
    hpCell.textContent = pokemon.hp;
    if (pokemon.hp === pokemonAleatorio.hp) {
        hpCell.style.backgroundColor = "lightgreen";
    } else {
        hpCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.hp > pokemonAleatorio.hp) {
        hpCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.hp < pokemonAleatorio.hp) {
        hpCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }


    const speedCell = row.insertCell(4);
    speedCell.textContent = pokemon.speed;
    if (pokemon.speed === pokemonAleatorio.speed) {
        speedCell.style.backgroundColor = "lightgreen";
    } else {
        speedCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.speed > pokemonAleatorio.speed) {
        speedCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.speed < pokemonAleatorio.speed) {
        speedCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }


    const attackCell = row.insertCell(5);
    attackCell.textContent = pokemon.attack;
    if (pokemon.attack === pokemonAleatorio.attack) {
        attackCell.style.backgroundColor = "lightgreen";
    } else {
        attackCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.attack > pokemonAleatorio.attack) {
        attackCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.attack < pokemonAleatorio.attack) {
        attackCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }

    const specialAttackCell = row.insertCell(6);
    specialAttackCell.textContent = pokemon.specialAttack;
    if (pokemon.specialAttack === pokemonAleatorio.specialAttack) {
        specialAttackCell.style.backgroundColor = "lightgreen";
    } else {
        specialAttackCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.specialAttack > pokemonAleatorio.specialAttack) {
        specialAttackCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.specialAttack < pokemonAleatorio.specialAttack) {
        specialAttackCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }

    const defenseCell = row.insertCell(7);
    defenseCell.textContent = pokemon.defense;
    if (pokemon.defense === pokemonAleatorio.defense) {
        defenseCell.style.backgroundColor = "lightgreen";
    } else {
        defenseCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.defense > pokemonAleatorio.defense) {
        defenseCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.defense < pokemonAleatorio.defense) {
        defenseCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }

    const specialDefenseCell = row.insertCell(8);
    specialDefenseCell.textContent = pokemon.specialDefense;
    if (pokemon.specialDefense === pokemonAleatorio.specialDefense) {
        specialDefenseCell.style.backgroundColor = "lightgreen";
    } else {
        specialDefenseCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.specialDefense > pokemonAleatorio.specialDefense) {
        specialDefenseCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.specialDefense < pokemonAleatorio.specialDefense) {
        specialDefenseCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }

    const heightCell = row.insertCell(9);
    heightCell.textContent = pokemon.height;
    if (pokemon.height === pokemonAleatorio.height) {
        heightCell.style.backgroundColor = "lightgreen";
    } else {
        heightCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.height > pokemonAleatorio.height) {
        heightCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.height < pokemonAleatorio.height) {
        heightCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }

    const weightCell = row.insertCell(10);
    weightCell.textContent = pokemon.weight;
    if (pokemon.weight === pokemonAleatorio.weight) {
        weightCell.style.backgroundColor = "lightgreen";
    } else {
        weightCell.style.backgroundColor = "#C70039";
    }
    // Comparar valores numéricos y agregar flechas hacia arriba o hacia abajo
    if (pokemon.weight > pokemonAleatorio.weight) {
        weightCell.innerHTML += " &#8593;"; // Flecha hacia arriba
    } else if (pokemon.weight < pokemonAleatorio.weight) {
        weightCell.innerHTML += " &#8595;"; // Flecha hacia abajo
    }
};

// Llama a la función fillPokemonTable para cada Pokémon en searchedPokemon
const fillPokemonTableForAll = () => {
    searchedPokemon.forEach(pokemon => fillPokemonTable(pokemon));
};

// Llama a la función fillPokemonTableForAll cada vez que se busque un nuevo Pokémon
searchForm.addEventListener("submit", async (e) => {
    console.log(numIntentos);
    e.preventDefault();
    await getPokemonByText(); // Obtener el nuevo Pokémon
    namePokemonTry.value = "";
});

// Llama a getPokemonByNumber al cargar la página
window.addEventListener("load", async () => {
    await getAllNames(); // Obtener todos los nombres de los Pokémon
    getPokemonByNumber(); // Obtener un Pokémon aleatorio al cargar la página
    console.log(allPokemonNames)
});

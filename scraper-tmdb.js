/*
=======================================
 SCRAPER TMDB — SÉRIES / ANIMES / FILMS / HORREUR
=======================================
 Usage : node scraper-tmdb.js
---------------------------------------
 Génère tmdb-data.js avec les 4 tableaux
=======================================
*/

const TMDB_API_KEY = '877ff0305abbc222d2e6cbecdccd9e08';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const SERIES_IDS = [
    76479, 209144, 66732, 1396, 94605, 93405, 1399, 100088,
    71446, 119051, 71912, 1405, 60574, 94997, 17610, 42007, 1402
];

const ANIMES_IDS = [
    1429, 85937, 37854, 95479, 1431, 246, 1422, 65930, 127533, 2019, 104949, 143170
];

const MOVIES_IDS = [
    550, 680, 238, 155, 11, 497, 807, 27205, 157336, 293660,
    299534, 324857, 335983, 438631, 453395, 497698, 524434, 566525,
    580489, 634649, 675353, 718930, 766507, 786892, 823464, 912649,
    937287, 940721, 945961, 949423, 956842, 967847, 976573, 1022789,
    1040513, 1043848, 1058945, 1064170, 1072756, 1073690, 1088770,
    1093362, 1102080, 1102586, 1105710, 1106005, 1106442, 1107700,
    1108360, 1108601, 1108682, 1109286, 1109585, 1111572, 1111584,
    1111648, 1111756, 1112142, 1112226, 1112426, 1112894, 1113148,
    1113188, 1113420, 1113632
];

const HORROR_IDS = [
    694,    // The Shining
    539,    // Psycho
    348,    // Alien
    162,    // The Exorcist (1973)
    103,    // The Thing (1982)
    1930,   // The Others
    797,    // Halloween (1978)
    8960,   // The Ring (2002)
    948,    // Saw
    377,    // A Nightmare on Elm Street
    260,    // The Blair Witch Project
    2493,   // Scream
    45772,  // The Conjuring
    210577, // Gone Girl
    421,    // The Silence of the Lambs
    1788,   // Misery
    113,    // Rosemary's Baby
    424,    // The Texas Chain Saw Massacre
    300,    // The Descent
    241848, // Get Out
    374430, // Hereditary
    505177, // A Quiet Place
    447332, // A Quiet Place Part II
    569094, // The Invisible Man (2020)
    524969, // IT (2017)
    432346, // The Witch
    439079, // The Babadook
    955025, // Talk to Me
    917119, // Smile
    676547, // Prey (horror)
    614409, // Renfield
    744275, // The Boogeyman
    713704, // Evil Dead Rise
    801073, // M3GAN
    811374, // The Pope's Exorcist
    508570, // The Black Phone
    1001219, // Terrifier 2
    610253,  // Halloween Kills
    616747,  // Halloween Ends
    611395,  // The Night House
    593643,  // The Menu
    631843,  // Old
    651,     // The Exorcist (original 1973) - alternate
    1903,    // Jaws
    949,     // The Sixth Sense
    552,     // Interview with the Vampire
    10336,   // 28 Days Later
    1430,    // The Cabin in the Woods
    49026,   // The Dark and the Wicked
    500,     // Resident Evil
    395990,  // Train to Busan
    310,     // Carrie (1976)
    165,     // The Evil Dead
    82507,   // Sinister (2012)
    406,     // Insidious
    900,     // Pet Sematary (1989)
    15855,   // The Hills Have Eyes (2006)
    12516,   // The Strangers
    505545,  // The Woman in Black
    311,     // The Amityville Horror
    138843,  // The Conjuring 2
    396422,  // Annabelle: Creation
    687,     // Hellraiser
    39514,   // The Last House on the Left
    56630,   // Wolf Creek
    16619,   // Orphan
    9919,    // Mirrors
    1359,    // The Omen (1976)
    176,     // The Fly
    205,     // The Lost Boys
    521,     // The Devil's Advocate
    11661,   // Candyman (1992)
    8363,    // A Nightmare on Elm Street 3: Dream Warriors
    749,     // The Wicker Man (1973)
    10733,   // The Host (2006)
    11324,   // Shutter (2008)
    824,     // M
    277,     // Donnie Darko
    6615,    // Cat People
    14836,   // Eden Lake
    76757,   // Mama
    76163,   // The Possession
    15797,   // Inside (À l'intérieur)
    46838,   // Martyrs (2008)
    482,     // The Lawnmower Man
    43803,   // Let the Right One In
    186,     // Freaks
    37493,   // Drag Me to Hell
    10192,   // Shrek
    62,      // A Boy and His Dog
    821,     // Jacob's Ladder
    659,     // The Ring Two
    8447,    // Quarantine
    25763,   // [REC]
    483,     // The Haunting
    284,     // The Others
    11738,   // The Devil's Backbone
    1440,    // Eraserhead
    2249,    // The Pit and the Pendulum
    2211,    // Dementia 13
    47824,   // Oculus
    778,     // The Haunting of Hill House (1963)
    10774,   // House on Haunted Hill (1999)
    36955,   // The Innkeepers
    49021,   // House of the Devil
    75761,   // The Conjuring
    22459,   // The Collector
    18329,   // The ABCs of Death
    622,     // American Psycho
    546,     // Cape Fear
    291,     // Dawn of the Dead
    1426,    // The Devil's Rejects
    420,     // Dracula (1992)
    5955,    // The Eye
    9559,    // Final Destination
    668,     // Friday the 13th
    1817,    // Ginger Snaps
    579,     // Phantasm
    2266,    // Prom Night
    9654,    // The Hitcher
    8656,    // I Know What You Did Last Summer
    425,     // The Wicker Man
];

async function fetchSerieOuAnime(id) {
    const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`❌ Erreur TV ID ${id}: ${res.status}`);
        return null;
    }
    const data = await res.json();
    const poster = data.poster_path
        ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    return {
        title: data.name,
        image: poster,
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        tmdbId: data.id,
        type: 'tv',
        episodes: [],
        overview: data.overview || ''
    };
}

async function fetchFilm(id) {
    const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error(`❌ Erreur Movie ID ${id}: ${res.status}`);
        return null;
    }
    const data = await res.json();
    const poster = data.poster_path
        ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    return {
        title: data.title,
        image: poster,
        rating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
        tmdbId: data.id,
        type: 'movie',
        year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
        overview: data.overview || ''
    };
}

async function main() {
    console.log('📡 Scraping TMDB...\n');

    console.log('📺 Récupération des séries...');
    const seriesResults = [];
    for (const id of SERIES_IDS) {
        const serie = await fetchSerieOuAnime(id);
        if (serie) seriesResults.push(serie);
        await new Promise(r => setTimeout(r, 250));
    }
    console.log(`✅ ${seriesResults.length} séries récupérées\n`);

    console.log('🎌 Récupération des animes...');
    const animesResults = [];
    for (const id of ANIMES_IDS) {
        const anime = await fetchSerieOuAnime(id);
        if (anime) animesResults.push(anime);
        await new Promise(r => setTimeout(r, 250));
    }
    console.log(`✅ ${animesResults.length} animes récupérés\n`);

    console.log('🎬 Récupération des films...');
    const moviesResults = [];
    for (const id of MOVIES_IDS) {
        const movie = await fetchFilm(id);
        if (movie) moviesResults.push(movie);
        await new Promise(r => setTimeout(r, 250));
    }
    console.log(`✅ ${moviesResults.length} films récupérés\n`);

    console.log('👻 Récupération des films d\'horreur...');
    const horrorResults = [];
    for (const id of HORROR_IDS) {
        const movie = await fetchFilm(id);
        if (movie) horrorResults.push(movie);
        await new Promise(r => setTimeout(r, 250));
    }
    console.log(`✅ ${horrorResults.length} films d'horreur récupérés\n`);

    const seriesJS = JSON.stringify(seriesResults, null, 4);
    const animesJS = JSON.stringify(animesResults, null, 4);
    const moviesJS = JSON.stringify(moviesResults, null, 4);
    const horrorJS = JSON.stringify(horrorResults, null, 4);

    const output = `/* =========================
SERIES (scrapées TMDB - ${new Date().toLocaleDateString('fr-FR')})
========================= */

const series = ${seriesJS};

/* =========================
ANIMES (scrapés TMDB - ${new Date().toLocaleDateString('fr-FR')})
========================= */

const animes = ${animesJS};

/* =========================
MOVIES (scrapés TMDB - ${new Date().toLocaleDateString('fr-FR')})
========================= */

let moviesData = ${moviesJS};

/* =========================
HORROR (scrapés TMDB - ${new Date().toLocaleDateString('fr-FR')})
========================= */

const horror = ${horrorJS};
`;

    const fs = await import('fs');
    fs.writeFileSync('tmdb-data.js', output, 'utf-8');
    console.log('💾 Fichier tmdb-data.js créé avec succès !');
}

main().catch(console.error);
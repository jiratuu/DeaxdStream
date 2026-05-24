/* =========================
COMPTEUR DE MEMBRES UNIQUES
========================= */

const COUNTER_KEY = 'deaxd_member_id';

function initMemberCounter() {
  let memberId = localStorage.getItem(COUNTER_KEY);

  if (!memberId) {
    memberId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(COUNTER_KEY, memberId);
  }

  let raw = localStorage.getItem('deaxd_member_count');
  let countData;

  if (raw) {
    try {
      countData = JSON.parse(raw);
    } catch (e) {
      countData = { ids: [], count: 0 };
    }
  } else {
    countData = { ids: [], count: 0 };
  }

  if (!countData.ids.includes(memberId)) {
    countData.ids.push(memberId);
    countData.count = countData.ids.length;
    localStorage.setItem('deaxd_member_count', JSON.stringify(countData));
  }

  const memberEl = document.getElementById('memberCount');
  if (memberEl) {
    memberEl.textContent = countData.count;
  }
}

/* =========================
ÉLÉMENTS
========================= */

const grid = document.getElementById("grid");
const home = document.getElementById("home");
const loginOverlay = document.getElementById("loginOverlay");
const loginBtn = document.getElementById("loginBtn");
const loginBtnHeader = document.getElementById("loginBtnHeader");
const user = document.getElementById("user");
const pass = document.getElementById("pass");
const remember = document.getElementById("remember");
const profileCircle = document.getElementById("profileCircle");
const gear = document.getElementById("gear");
const menu = document.getElementById("menu");
const logoutBtn = document.getElementById("logoutBtn");
const discordBtn = document.getElementById("discordBtn");
const recoGrid = document.getElementById("recoGrid");
const todayDate = document.getElementById("todayDate");
const refreshRecomBtn = document.getElementById("refreshRecomBtn");
const heroTrack = document.getElementById("heroTrack");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroRating = document.getElementById("heroRating");
const heroBadge = document.getElementById("heroBadge");
const heroPlayBtn = document.getElementById("heroPlayBtn");

/* =========================
PAGES
========================= */

const episodePage = document.createElement("section");
episodePage.style.display = "none";
document.body.appendChild(episodePage);

/* =========================
PLAYER PAGE
========================= */

const playerPage = document.createElement("section");
playerPage.id = "playerPage";
playerPage.style.display = "none";

playerPage.innerHTML = `
<div class="page-header">
    <button class="back-btn" id="closePlayerBtn">← Retour</button>
    <h2 id="playerTitle">Lecture</h2>
    <div style="margin-left:auto;display:flex;gap:10px;align-items:center;">
        <button class="back-btn" id="prevSourceBtn" title="Source précédente">◀</button>
        <span id="sourceIndicator" style="color:#999;font-size:13px;"></span>
        <button class="back-btn" id="nextSourceBtn" title="Source suivante">▶</button>
    </div>
</div>
<div id="playerContainer">
    <div id="playerWrapper">
        <div id="loadingMessage" style="text-align:center;padding:40px;color:#999;">
            <p style="font-size:20px;margin-bottom:12px;">⏳ Chargement...</p>
            <p id="loadingDetails" style="font-size:14px;">Préparation du lecteur</p>
        </div>
        <iframe id="playerIframe" src="" allowfullscreen style="display:none;width:100%;max-width:1000px;height:562px;border:none;border-radius:16px;box-shadow:0 0 30px rgba(255,0,0,0.2);"></iframe>
    </div>
    <div style="display:flex;justify-content:center;gap:12px;margin-top:20px;">
        <button class="lang-btn active" data-lang="fr" id="langVF">🇫🇷 VF</button>
        <button class="lang-btn" data-lang="en" id="langVO">🇬🇧 VO</button>
    </div>
</div>
`;

document.body.appendChild(playerPage);

/* =========================
LANGUE
========================= */

let currentLang = "fr";

const langStyle = document.createElement("style");
langStyle.textContent = `
.lang-btn {
    padding: 10px 24px;
    border: 2px solid #333;
    border-radius: 25px;
    background: #1a1a2e;
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.25s;
}
.lang-btn:hover {
    border-color: red;
    color: red;
}
.lang-btn.active {
    background: linear-gradient(135deg, #ff1f1f, #b80000);
    border-color: red;
    color: white;
}
`;
document.head.appendChild(langStyle);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("lang-btn")) {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentLang = e.target.dataset.lang;
        if (playerState.currentSources.length > 0) {
            rebuildSourcesAndReload();
        }
    }
});

/* =========================
TABS
========================= */

let currentTab = "series";
let currentSerie = null;

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTab = btn.dataset.tab;
        renderGrid();
    };
});

/* =========================
BARRE DE RECHERCHE
========================= */

const searchBar = document.createElement('input');
searchBar.type = 'text';
searchBar.id = 'searchBar';
searchBar.placeholder = '🔍 Chercher série, film, animé...';

const rightHeader = document.querySelector('.right-header');
rightHeader.insertBefore(searchBar, rightHeader.firstChild);

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchTMDB(searchBar.value.trim());
        searchBar.value = '';
    }
});

/* =========================
CONNEXION
========================= */

loginBtn.onclick = function() {
    const username = user.value.trim();
    const password = pass.value.trim();

    if (!username || !password) {
        alert("Veuillez entrer un nom d'utilisateur et un mot de passe.");
        return;
    }

    if (remember.checked) {
        localStorage.setItem("deaxd_user", username);
    }

    profileCircle.style.display = "flex";
    profileCircle.textContent = username.charAt(0).toUpperCase();
    loginBtnHeader.style.display = "none";
    loginOverlay.style.display = "none";
};

loginBtnHeader.onclick = function() {
    loginOverlay.style.display = "flex";
};

loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) {
        loginOverlay.style.display = "none";
    }
});

logoutBtn.onclick = function() {
    profileCircle.style.display = "none";
    loginBtnHeader.style.display = "flex";
    localStorage.removeItem("deaxd_user");
};

const savedUser = localStorage.getItem("deaxd_user");
if (savedUser) {
    profileCircle.style.display = "flex";
    profileCircle.textContent = savedUser.charAt(0).toUpperCase();
    loginBtnHeader.style.display = "none";
}

/* =========================
MENU (ENGrenage)
========================= */

gear.onclick = function() {
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
};

document.addEventListener("click", (e) => {
    if (!e.target.closest(".settings")) {
        menu.style.display = "none";
    }
});

discordBtn.onclick = function() {
    window.open("https://discord.gg/deaxd", "_blank");
};

/* =========================
HERO CARROUSEL
========================= */

let heroItems = [];
let currentHeroIndex = 0;
let heroInterval;

function initHeroCarousel() {
    const allForHero = series.slice(0, 5).map(s => ({ ...s, cat: 'series' }));
    heroItems = allForHero.sort(() => Math.random() - 0.5).slice(0, 5);
    renderHero();
    startHeroAutoPlay();
}

function renderHero() {
    heroTrack.innerHTML = "";
    heroItems.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.className = "hero-slide";
        slide.style.backgroundImage = `url('${item.image}')`;
        heroTrack.appendChild(slide);
    });
    updateHeroInfo(0);
}

function updateHeroInfo(index) {
    const item = heroItems[index];
    if (!item) return;
    heroTitle.textContent = item.title;
    heroDesc.textContent = item.overview || "Découvrez cette œuvre incontournable sur Deaxd.";
    heroRating.textContent = `⭐ ${item.rating}`;
    heroBadge.textContent = "📺 Série";
    heroPlayBtn.onclick = () => {
        if (item.episodes.length > 0) {
            openSerie(item);
        } else {
            fetchAllEpisodes(item).then(() => openSerie(item));
        }
    };
    document.querySelectorAll(".hero-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    currentHeroIndex = index;
}

function goToHero(index) {
    clearInterval(heroInterval);
    updateHeroInfo(index);
    startHeroAutoPlay();
}

function startHeroAutoPlay() {
    clearInterval(heroInterval);
    heroInterval = setInterval(() => {
        const next = (currentHeroIndex + 1) % heroItems.length;
        updateHeroInfo(next);
    }, 5000);
}

document.querySelectorAll(".hero-dot").forEach(dot => {
    dot.addEventListener("click", () => {
        goToHero(parseInt(dot.dataset.index));
    });
});

setTimeout(initHeroCarousel, 500);

/* =========================
TMDB API
========================= */

const TMDB_API_KEY = '877ff0305abbc222d2e6cbecdccd9e08';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/* =========================
RECHERCHE TMDB
========================= */

async function searchTMDB(query) {
    if (!query) return;

    try {
        const seriesRes = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`);
        const seriesData = await seriesRes.json();

        const moviesRes = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`);
        const moviesDataJson = await moviesRes.json();

        let results = [];

        seriesData.results.slice(0, 8).forEach(item => {
            results.push({
                title: item.name,
                image: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
                tmdbId: item.id,
                type: 'tv',
                episodes: [],
                totalEpisodes: null,
                overview: item.overview || ''
            });
        });

        moviesDataJson.results.slice(0, 8).forEach(item => {
            results.push({
                title: item.title,
                image: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
                tmdbId: item.id,
                type: 'movie',
                year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
                overview: item.overview || ''
            });
        });

        grid.innerHTML = "";
        results.forEach(item => {
            const card = createCard(item);
            grid.appendChild(card);
        });

        if (results.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;grid-column:1/-1;padding:40px;">🔍 Aucun résultat trouvé</p>';
        }

    } catch (error) {
        console.error("Erreur de recherche TMDB:", error);
        grid.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;grid-column:1/-1;padding:40px;">❌ Erreur lors de la recherche</p>';
    }
}

/* =========================
CHERCHER LE NOMBRE TOTAL D'ÉPISODES D'UNE SÉRIE
========================= */

async function fetchEpisodeCount(serie) {
    if (serie.totalEpisodes) return serie.totalEpisodes;
    try {
        const res = await fetch(`${TMDB_BASE_URL}/tv/${serie.tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const data = await res.json();
        let count = 0;
        (data.seasons || []).forEach(s => {
            if (s.season_number > 0) {
                count += s.episode_count || 0;
            }
        });
        serie.totalEpisodes = count;
        return count;
    } catch (e) {
        serie.totalEpisodes = null;
        return null;
    }
}

/* =========================
RECHERCHE DES ÉPISODES TMDB (COMPLÈTE)
========================= */

async function fetchAllEpisodes(serie) {
    try {
        const tvRes = await fetch(`${TMDB_BASE_URL}/tv/${serie.tmdbId}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const tvData = await tvRes.json();

        const seasons = tvData.seasons || [];
        const allEpisodes = [];

        for (const season of seasons) {
            if (season.season_number === 0) continue;

            const epRes = await fetch(`${TMDB_BASE_URL}/tv/${serie.tmdbId}/season/${season.season_number}?api_key=${TMDB_API_KEY}&language=fr-FR`);
            const epData = await epRes.json();

            (epData.episodes || []).forEach(ep => {
                allEpisodes.push({
                    id: ep.id,
                    title: ep.name,
                    season: ep.season_number,
                    episode: ep.episode_number,
                    overview: ep.overview || "Pas de description",
                    still: ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : null,
                    rating: ep.vote_average ? ep.vote_average.toFixed(1) : 'N/A'
                });
            });

            await new Promise(r => setTimeout(r, 200));
        }

        serie.episodes = allEpisodes;
        serie.totalEpisodes = allEpisodes.length;
        serie.seasons = seasons.filter(s => s.season_number > 0).map(s => s.season_number);

        return allEpisodes;

    } catch (error) {
        console.error("Erreur récupération épisodes:", error);
        serie.episodes = [];
        serie.totalEpisodes = 0;
        serie.seasons = [];
        return [];
    }
}

/* =========================
OUVRIR UNE SÉRIE
========================= */

function openSerie(serie) {
    currentSerie = serie;

    home.style.display = "none";
    episodePage.style.display = "block";
    playerPage.style.display = "none";

    const totalEps = serie.totalEpisodes || serie.episodes?.length || "?";

    episodePage.innerHTML = `
    <div class="page-header">
        <button class="back-btn" id="backToHomeBtn">← Retour</button>
        <h2>${serie.title}</h2>
        <span style="margin-left:auto;color:#888;font-size:14px;">⭐ ${serie.rating} · ${totalEps} épisodes</span>
    </div>
    <div class="filter-bar" id="filterBar">
        <select class="filter-select" id="seasonSelect">
            <option value="">Toutes les saisons</option>
        </select>
    </div>
    <div class="episodes-list" id="episodesList"></div>
    `;

    const backBtn = document.getElementById("backToHomeBtn");
    backBtn.onclick = () => {
        episodePage.style.display = "none";
        home.style.display = "block";
    };

    const episodesList = document.getElementById("episodesList");
    const seasonSelect = document.getElementById("seasonSelect");

    if (serie.seasons) {
        serie.seasons.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = `Saison ${s}`;
            seasonSelect.appendChild(opt);
        });
    }

    function renderEpisodes(seasonFilter = "") {
        episodesList.innerHTML = "";

        let episodes = serie.episodes;
        if (seasonFilter) {
            episodes = episodes.filter(ep => ep.season === parseInt(seasonFilter));
        }

        if (episodes.length === 0) {
            episodesList.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;grid-column:1/-1;padding:40px;">📭 Aucun épisode trouvé</p>';
            return;
        }

        episodes.forEach(ep => {
            const card = document.createElement("div");
            card.className = "episode-card";

            const stillHtml = ep.still ? `<img src="${ep.still}" style="width:100%;border-radius:10px;margin-bottom:12px;object-fit:cover;height:150px;">` : '';

            card.innerHTML = `
                ${stillHtml}
                <h3>S${ep.season}E${ep.episode} — ${ep.title}</h3>
                <p>${ep.overview}</p>
                <p class="ep-meta">⭐ ${ep.rating}</p>
                <button class="play-btn" data-season="${ep.season}" data-episode="${ep.episode}">▶ Regarder</button>
            `;

            card.querySelector(".play-btn").onclick = () => {
                playEpisode(serie, ep);
            };

            episodesList.appendChild(card);
        });
    }

    seasonSelect.onchange = () => {
        renderEpisodes(seasonSelect.value);
    };

    renderEpisodes();
}

/* =========================
CONSTRUCTION DES URLs PAR LANGUE
========================= */

function slugify(title) {
    return title
        .replace(/[´']/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[''']/g, "")
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "%20");
}

function getSerieURL(tmdbId, title, season, episode, lang) {
    if (lang === "fr") {
        // 🇫🇷 VF — Lectureurs fiables
        return [
            {
                name: "VidSrc FYI",
                url: `https://vidsrc.fyi/embed/tv/${tmdbId}/${season}/${episode}`
            },
            {
                name: "VidSrc Me",
                url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
            },
            {
                name: "VidSrc XYZ",
                url: `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
            },
            {
                name: "2Embed CC",
                url: `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
            },
            {
                name: "MultiEmbed",
                url: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
            },
            {
                name: "Embed SU",
                url: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
            },
            {
                name: "VidSrc To",
                url: `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
            },
            {
                name: "Frembed",
                url: `https://frembed.one/embed/serie/${tmdbId}?sa=${season}&epi=${episode}`
            },
            {
                name: "2Embed Online",
                url: `https://www.2embed.online/embed/tv/${tmdbId}/${season}/${episode}`
            },
            {
                name: "VidSrc Dev",
                url: `https://www.vidsrc.dev/embed/tv/${tmdbId}/${season}/${episode}`
            }
        ];
    } else {
        // 🇬🇧 VO — VidAPI
        return [
            {
                name: "VO - VidAPI",
                url: `https://vaplayer.ru/embed/tv/${tmdbId}/${season}/${episode}`
            },
            {
                name: "VO - VidAPI (query)",
                url: `https://vaplayer.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
            }
        ];
    }
}

function getMovieURL(tmdbId, title, lang) {
    if (lang === "fr") {
        // 🇫🇷 VF — Lectureurs fiables
        return [
            {
                name: "VidSrc FYI",
                url: `https://vidsrc.fyi/embed/movie/${tmdbId}`
            },
            {
                name: "VidSrc Me",
                url: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
            },
            {
                name: "VidSrc XYZ",
                url: `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`
            },
            {
                name: "2Embed CC",
                url: `https://www.2embed.cc/embed/${tmdbId}`
            },
            {
                name: "MultiEmbed",
                url: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
            },
            {
                name: "Embed SU",
                url: `https://embed.su/embed/movie/${tmdbId}`
            },
            {
                name: "VidSrc To",
                url: `https://vidsrc.to/embed/movie/${tmdbId}`
            },
            {
                name: "Frembed",
                url: `https://frembed.one/embed/movie/${tmdbId}`
            },
            {
                name: "2Embed Online",
                url: `https://www.2embed.online/embed/movie/${tmdbId}`
            },
            {
                name: "VidSrc Dev",
                url: `https://www.vidsrc.dev/embed/movie/${tmdbId}`
            }
        ];
    } else {
        // 🇬🇧 VO — VidAPI
        return [
            {
                name: "VO - VidAPI",
                url: `https://vaplayer.ru/embed/movie/${tmdbId}`
            },
            {
                name: "VO - VidAPI (query)",
                url: `https://vaplayer.ru/embed/movie?tmdb=${tmdbId}`
            }
        ];
    }
}

/* =========================
REBUILD SOURCES QUAND ON CHANGE DE LANGUE
========================= */

function rebuildSourcesAndReload() {
    if (playerState.isMovie) {
        const movie = playerState.currentSerie;
        playerState.currentSources = getMovieURL(movie.tmdbId, movie.title, currentLang);
    } else {
        const serie = playerState.currentSerie;
        const ep = playerState.currentEpisode;
        playerState.currentSources = getSerieURL(serie.tmdbId, serie.title, ep.season, ep.episode, currentLang);
    }
    playerState.currentSourceIndex = 0;
    loadSource(0);
}

/* =========================
LECTEUR D'ÉPISODE
========================= */

const playerState = {
    currentSources: [],
    currentSourceIndex: 0,
    currentSerie: null,
    currentEpisode: null,
    isMovie: false
};

function playEpisode(serie, episode) {
    playerState.currentSerie = serie;
    playerState.currentEpisode = episode;
    playerState.isMovie = false;

    playerState.currentSources = getSerieURL(serie.tmdbId, serie.title, episode.season, episode.episode, currentLang);
    playerState.currentSourceIndex = 0;

    episodePage.style.display = "none";
    playerPage.style.display = "block";

    document.getElementById("playerTitle").textContent = `${serie.title} — S${episode.season}E${episode.episode}`;

    loadSource(0);
}

/* =========================
LECTEUR DE FILM
========================= */

function playMovie(movie) {
    playerState.currentSerie = movie;
    playerState.currentEpisode = null;
    playerState.isMovie = true;

    playerState.currentSources = getMovieURL(movie.tmdbId, movie.title, currentLang);
    playerState.currentSourceIndex = 0;

    home.style.display = "none";
    episodePage.style.display = "none";
    playerPage.style.display = "block";

    document.getElementById("playerTitle").textContent = movie.title;

    loadSource(0);
}

/* =========================
CHARGER UNE SOURCE
========================= */

function loadSource(index) {
    if (index < 0 || index >= playerState.currentSources.length) return;

    playerState.currentSourceIndex = index;
    const source = playerState.currentSources[index];

    const iframe = document.getElementById("playerIframe");
    const loading = document.getElementById("loadingMessage");
    const indicator = document.getElementById("sourceIndicator");

    indicator.textContent = `${source.name}`;

    loading.style.display = "block";
    document.getElementById("loadingDetails").textContent = `Connexion à ${source.name} (source ${index + 1}/${playerState.currentSources.length})...`;
    iframe.style.display = "none";
    iframe.src = "";

    setTimeout(() => {
        iframe.src = source.url;
        iframe.style.display = "block";
        loading.style.display = "none";
    }, 800);
}

/* =========================
NAVIGATION SOURCES
========================= */

document.getElementById("prevSourceBtn").onclick = () => {
    let newIndex = playerState.currentSourceIndex - 1;
    if (newIndex < 0) newIndex = playerState.currentSources.length - 1;
    loadSource(newIndex);
};

document.getElementById("nextSourceBtn").onclick = () => {
    let newIndex = playerState.currentSourceIndex + 1;
    if (newIndex >= playerState.currentSources.length) newIndex = 0;
    loadSource(newIndex);
};

/* =========================
FERMER LE PLAYER
========================= */

document.getElementById("closePlayerBtn").onclick = () => {
    playerPage.style.display = "none";

    const iframe = document.getElementById("playerIframe");
    iframe.src = "";
    iframe.style.display = "none";
    document.getElementById("loadingMessage").style.display = "block";

    if (playerState.currentEpisode) {
        episodePage.style.display = "block";
    } else {
        home.style.display = "block";
    }
};

/* =========================
RECOMMANDATIONS DU JOUR
========================= */

function updateRecommendations() {
    const today = new Date();
    const options = { day: 'numeric', month: 'long' };
    todayDate.textContent = `— ${today.toLocaleDateString('fr-FR', options)}`;

    let allContent = [
        ...series.map(s => ({ ...s, isMovie: false, cat: 'series' })),
        ...moviesData.map(m => ({ ...m, isMovie: true, cat: 'movies' }))
    ];

    if (allContent.length === 0) {
        allContent = series.map(s => ({ ...s, isMovie: false, cat: 'series' }));
    }

    const shuffled = allContent.sort(() => Math.random() - 0.5);
    const recommendations = shuffled.slice(0, 8);
    recoGrid.innerHTML = "";
    recommendations.forEach(item => {
        const card = document.createElement("div");
        card.className = "reco-card";
        const badge = item.isMovie ? "🎬 Film" : (item.cat === "animes" ? "🎌 Animé" : "📺 Série");
        card.innerHTML = `
            <img src="${item.image}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
            <div class="reco-card-content">
                <h4>${item.title}</h4>
                <p>⭐ ${item.rating}</p>
            </div>
            <span class="reco-badge">${badge}</span>
        `;
        card.onclick = () => {
            if (item.isMovie) {
                playMovie(item);
            } else {
                if (item.episodes.length > 0) {
                    openSerie(item);
                } else {
                    fetchAllEpisodes(item).then(() => openSerie(item));
                }
            }
        };
        recoGrid.appendChild(card);
    });
}

refreshRecomBtn.onclick = () => {
    updateRecommendations();
    refreshRecomBtn.style.transform = "rotate(360deg)";
    refreshRecomBtn.style.transition = "transform 0.4s";
    setTimeout(() => { refreshRecomBtn.style.transform = "rotate(0deg)"; }, 400);
};

/* =========================
RENDER GRID — AVEC COMPTAGE D'ÉPISODES
========================= */

function renderGrid() {
    grid.innerHTML = "";
    let items = [];
    if (currentTab === "series") {
        items = series;
    } else if (currentTab === "animes") {
        items = animes;
    } else if (currentTab === "movies") {
        if (moviesData.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;grid-column:1/-1;padding:40px;">🔍 Cherche un film avec la barre de recherche</p>';
            return;
        }
        items = moviesData;
    } else if (currentTab === "horror") {
        if (typeof horror !== 'undefined' && horror.length > 0) {
            items = horror;
        } else {
            grid.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;grid-column:1/-1;padding:40px;">👻 Aucun film d\'horreur disponible</p>';
            return;
        }
    }
    items.forEach(item => {
        const card = createCard(item);
        grid.appendChild(card);
        if (item.type === "tv" && !item.totalEpisodes && !item.episodes.length) {
            fetchEpisodeCount(item).then(count => {
                const p = card.querySelector(".ep-count");
                if (p) p.textContent = count ? `${count} épisodes` : "... épisodes";
            });
        }
    });
}

function createCard(item) {
    const card = document.createElement("div");
    card.className = "card";
    const isMovie = item.type === "movie" || item.isMovie;

    let subtitle;
    if (isMovie) {
        subtitle = item.year || "Film";
    } else {
        const totalEp = item.totalEpisodes || item.episodes?.length;
        subtitle = totalEp ? `${totalEp} épisodes` : `<span class="ep-count">... épisodes</span>`;
    }

    card.innerHTML = `
        <img src="${item.image}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x750?text=No+Poster'">
        <div class="card-content">
            <h3>${item.title}</h3>
            <p>⭐ ${item.rating}</p>
            <p style="font-size:12px;color:#888;margin-top:6px;">${subtitle}</p>
        </div>
    `;
    card.onclick = () => {
        if (isMovie) {
            playMovie(item);
        } else {
            if (item.episodes.length > 0) {
                openSerie(item);
            } else {
                fetchAllEpisodes(item).then(() => openSerie(item));
            }
        }
    };
    return card;
}

/* =========================
INITIALISATION
========================= */

initMemberCounter();
renderGrid();
updateRecommendations();
loginOverlay.style.display = "none";
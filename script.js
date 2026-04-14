const API_KEY = '8f5c9dbe'; // Substitua pela sua chave
const SERIES_TITLE = 'The walking Dead'; // Exemplo

async function fetchSeriesData() {
    try {
        // 1. Busca dados gerais da série
        const response = await fetch(`https://www.omdbapi.com/?t=${SERIES_TITLE}&apikey=${API_KEY}`);
        const series = await response.json();

        renderHeader(series);

        // 2. Busca cada temporada
        const totalSeasons = parseInt(series.totalSeasons);
        const matrixWrapper = document.getElementById('matrix-wrapper');

        for (let s = 1; s <= totalSeasons; s++) {
            const seasonResponse = await fetch(`https://www.omdbapi.com/?t=${SERIES_TITLE}&Season=${s}&apikey=${API_KEY}`);
            const seasonData = await seasonResponse.json();
            renderSeasonRow(s, seasonData.Episodes);
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function renderHeader(series) {
    const header = document.getElementById('movie-header');
    header.innerHTML = `
        <img src="${series.Poster}" alt="Poster">
        <div>
            <h1>${series.Title}</h1>
            <p>${series.Plot}</p>
            <span><strong>Rating Geral:</strong> ${series.imdbRating}</span>
        </div>
    `;
}

function renderSeasonRow(seasonNumber, episodes) {
    const wrapper = document.getElementById('matrix-wrapper');
    const row = document.createElement('div');
    row.className = 'matrix-row';

    const label = document.createElement('div');
    label.className = 'season-label';
    label.innerText = `Temp. ${seasonNumber}`;
    row.appendChild(label);

    episodes.forEach(ep => {
        const cell = document.createElement('div');
        const rating = parseFloat(ep.imdbRating);
        
        cell.className = 'episode-cell ' + getRatingClass(rating);
        cell.innerText = ep.imdbRating !== "N/A" ? ep.imdbRating : "-";
        cell.title = `E${ep.Episode}: ${ep.Title}`; // Tooltip com nome do ep
        
        row.appendChild(cell);
    });

    wrapper.appendChild(row);
}

function getRatingClass(rating) {
    if (isNaN(rating)) return 'none';
    if (rating >= 8.5) return 'high';
    if (rating >= 7.0) return 'medium';
    return 'low';
}

fetchSeriesData();
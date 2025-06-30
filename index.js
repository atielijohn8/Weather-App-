document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0';

  const weatherInfo = document.getElementById('weather-info');
  const solSelector = document.getElementById('sol-selector');
  const likeBtn = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');
  const commentInput = document.getElementById('comment-input');

  let likeCounter = 0;
  let selectedSol = null;
  let weatherData = {};

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const sols = data.sol_keys;
      weatherData = data;

      sols.forEach(sol => {
        const btn = document.createElement('button');
        btn.textContent = `Sol ${sol}`;
        btn.addEventListener('click', () => {
          selectedSol = sol;
          displayWeather(data[sol], sol);
        });
        solSelector.appendChild(btn);
      });

      // Display first sol by default
      if (sols.length > 0) {
        selectedSol = sols[0];
        displayWeather(data[selectedSol], selectedSol);
      }
    })
    .catch(err => {
      weatherInfo.textContent = 'Failed to load weather data.';
      console.error(err);
    });

  function displayWeather(solData, sol) {
    weatherInfo.innerHTML = `
      <h2>Sol ${sol}</h2>
      <p>Average Temp: ${solData.AT?.av || 'N/A'}°C</p>
      <p>Wind Speed: ${solData.HWS?.av || 'N/A'} m/s</p>
      <p>Pressure: ${solData.PRE?.av || 'N/A'} Pa</p>
    `;
    likeCounter = 0;
    likeCount.textContent = `Likes: ${likeCounter}`;
    commentList.innerHTML = '';
  }

  likeBtn.addEventListener('click', () => {
    likeCounter++;
    likeCount.textContent = `Likes: ${likeCounter}`;
  });

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const comment = commentInput.value.trim();
    if (comment !== '') {
      const li = document.createElement('li');
      li.textContent = comment;
      commentList.appendChild(li);
      commentInput.value = '';
    }
  });
});

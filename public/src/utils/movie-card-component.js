import { durationConverter } from './duration-converter.js';

export function createMovieCard(movie) {
    const movieCard = document.createElement('article');
    movieCard.classList.add('movie');
  
    movieCard.innerHTML = `
      <div class="poster">
        <img src="${movie.poster_url}" alt="Poster of ${movie.title}" />
      </div>
      <div class="info">
        <div class="info-details">
          <h2 class="title">
            ${movie.title}<span class="rating ${movie.age_rating}">${movie.age_rating}</span>
          </h2>
          <p class="caption">
            ${movie.description}
          </p>
          <p class="cast">
            <span class="white">Гол дүр:</span>
            <span class="gray">${movie.cast.join(', ')}</span>
          </p>
          <p class="duration">
            Үргэлжлэх хугацаа: <span class="gray">${durationConverter(movie.duration)}</span>
          </p>
          <p class="lang">
            <svg
              class="cc-icon gray"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="white"
            >
              <path
                d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z"
              />
            </svg>
            <span class="gray">${movie.cc === 'mongolian' ? 'Монгол хэл' : 'Англи хэл'}</span>
          </p>
        </div>
        <div class="showtime-details">
          <div class="button-group">
            <button class="time-button active">ӨНӨӨДӨР</button>
            <button class="time-button">МАРГААШ</button>
            <button class="time-button show-all-times">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentColor"
              >
                <path
                  d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"
                />
              </svg>
              БҮХ ЦАГ ХАРАХ
            </button>
          </div>
          <div class="timetable-container"></div>
          <div class="today">
            <div class="branch branch-1">
              <h4>Өргөө 1 <span class="location">Хороолол</span></h4>
              <div class="schedule">
                <a href="#" class="time">11:00</a>
                <a href="#" class="time">14:00</a>
                <a href="#" class="time">17:00</a>
                <a href="#" class="time">20:00</a>
              </div>
            </div>
            <div class="branch branch-2">
              <h4>Өргөө 2 <span class="location">IT Парк</span></h4>
              <div class="schedule">
                <a href="#" class="time">11:00</a>
                <a href="#" class="time">14:00</a>
                <a href="#" class="time">17:00</a>
                <a href="#" class="time">20:00</a>
                <a href="#" class="time">23:00</a>
              </div>
            </div>
            <div class="branch branch-3">
              <h4>
                Өргөө 3 <span class="location">IMAX Шангри-Ла</span>
              </h4>
              <div class="schedule">
                <a href="#" class="time">11:00</a>
                <a href="#" class="time">14:00</a>
                <a href="#" class="time">17:00</a>
                <a href="#" class="time">20:00</a>
              </div>
            </div>
            <div class="branch branch-4">
              <h4>Өргөө 4 <span class="location">Дархан хот</span></h4>
              <div class="schedule">
                <a href="#" class="time">11:00</a>
                <a href="#" class="time">14:00</a>
                <a href="#" class="time">17:00</a>
                <a href="#" class="time">20:00</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  
    return movieCard;
  }
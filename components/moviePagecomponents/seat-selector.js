class Seatselector extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this._selectedScreenInfo = null;
        this._seatLayout = null;
        this._selectedSeats = [];

        this._handleScreenSelected = this._handleScreenSelected.bind(this);
    }
    static get observedAttributes(){
        return [];
    }
    connectedCallback(){
        document.addEventListener('screen-selected', this._handleScreenSelected);
        this.render();
    }
    disconnectedCallback(){
        document.removeEventListener('screen-selected', this._handleScreenSelected);
    }
    attributeChangedCallback(name,oldValue,newValue){

    }
    _handleScreenSelected(event){
        console.log('Seat Selector received screen-selected:', event.detail);
        this._selectedScreenInfo = event.detail;
        this._seatLayout = null;
        this._selectedSeats = [];
        this.render();
    }
    async fetchSelectedMovieDetails(){

    }
    async render(){
        this.shadowRoot.innerHTML = `
        <style>
        :root {
  --primary-color: #ffa500;
  --secondary-color: #ffb733;
  --text-color: white;
  --bg-color: rgb(22, 22, 22);
  --screen-color: rgb(154, 153, 153);
  --screen-hover: rgb(42, 42, 42);
  --border-color: white;

  --black-text: black;
  --lighter-black: rgb(32, 32, 32);
  --gray-text: gray;
  --gray-lighter-text: rgb(174, 173, 173);
  --white-text: white;
}
            .seatSelectionWrapper {
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;

  & .details {
    font-size: 1.15rem;
    display: flex;
    flex-direction: column;

    & selected-movie-detail {
      display: flex;
      flex-direction: column;
    }

    & selected-seat-detail {
      display: flex;
      flex-direction: column;
    }
  }
}

.seatSelection {
  margin-top: 5em 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & .theaterScreen {
    text-align: center;
    font-size: 1.2rem;
    color: #e0f7fa;
    margin-bottom: 2rem;
    padding: 1rem 0;

    width: 80%;
    margin-left: auto;
    margin-right: auto;

    background: linear-gradient(to right, #1e1e1e, #2a2a2a);
    border-radius: 0 0 100% 100% / 0 0 30% 30%;

    box-shadow: 0 8px 20px var(--white-text),
      0 0 60px var(--gray-lighter-text) inset;
  }

  & .seatWrapper {
    display: flex;
    justify-content: center;
    gap: 1.5em;
    padding: 2em;

    & .aisle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: nowrap;
      gap: 1em;

      & .row {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 0.2em;
      }
    }
  }

  & .seat {
    background-color: var(--gray-text);
    height: 25px;
    width: 20px;
    margin: 3px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  & .index {
    background-color: transparent;
  }

  & .seat:hover {
    background-color: var(--white-text);
    cursor: pointer;
  }

  & .index:hover {
    background-color: transparent;
    cursor: default;
  }
}

.details {
  /* background-color: red; */
  min-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 30px;

  & h1 {
    border-bottom: 1px solid var(--border-color);
    text-align: center;
  }

  & p {
    line-height: 1.7em;
  }

  & .seat-detail-wrapper {
    /* background-color: orange; */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    & .seatTable {
      /* background-color: red; */
      min-width: 200px;
      display: grid;
      grid-template-columns: 50% 50%;
      grid-template-rows: 50% 50%;
      gap: 30px;
      margin-bottom: 20px;

      & div {
        display: flex;
        gap: 30px;
      }
    }
  }
}

.details {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  & h1 {
    border-bottom: 1px solid var(--border-color);
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  & p {
    line-height: 1.7em;
    margin: 0;

    & span {
      font-weight: bold;
      color: var(--white-text);
      margin-right: 5px;
    }
  }

  & .seat-detail-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border: 1px solid var(--gray-text);
    border-radius: 8px;

    & p:last-child {
      font-size: 1.2em;
      font-weight: bold;
      color: var(--primary-color);
      margin-top: 10px;
    }

    & input[type="submit"][value="continue"] {
      width: 100%;
      background-color: var(--primary-color);
      color: var(--black-text);
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: bold;
      margin-top: 10px;
      transition: background-color 0.3s ease;

    }

    & input[type="submit"][value="continue"]:hover {
      background-color: var(--secondary-color);
    }
  }

  & .seatTable {
    min-width: 200px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 30px;
    margin-bottom: 20px;

    & div {
      display: flex;
      align-items: center;
    }

    & div:nth-child(1),
    div:nth-child(2) {
      font-weight: bold;
    }
  }
}
        </style>
        <div class = "seatSelectionWrapper">
            <div class="seatSelection">
        <div class="theaterScreen"></div>
        <div class="seatWrapper"></div>
      </div>
      <div class="details">
        <div class="selected-movie-detail">
          <h1>Movie choice</h1>
          <p><span>Movie theater: </span> ${this._selectedScreenInfo.theater || 'N/A'}</p>
          <p><span>Hall: </span> ${this._selectedScreenInfo.screen || 'N/A'}</p>
          <p><span>Movie name: </span> ${this._selectedScreenInfo.movieName}</p>
          <p><span>Move time: </span> ${this._selectedScreenInfo.time}</p>
        </div>
        <div class="selected-seat-detail">
          <h1>Seat selection</h1>
          <div class="seat-detail-wrapper">
            <p>Сонгох боломжтой тасалбарын тоо</p>
            <p><span>0</span>/10</p>
            <div class="seatTable">
              <div>Тасалбарын төрөл</div>
              <div>Тасалбарын тоо</div>
              <div>Тасалбар</div>
              <div>4</div>
            </div>
            <p>Нийт: 68000</p>
            <input type="submit" id="proceed-to-info-input" value="continue" />
          </div>
        </div>
      </div>
      </div>
        `;
    }
}
customElements.define("seat-selector", Seatselector);
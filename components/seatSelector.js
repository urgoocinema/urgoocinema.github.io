import { fetchBranches, fetchOccupiedSeats } from "./fetch.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
   :host {
      /* Default Dark Mode Variables */
      /*--main-background: #28282B; */
      --main-background: rgb(22, 22, 22);
      --primary-text: #fff;
      --secondary-text: #555; /* For row numbers, etc. */
      --hall-name-text: #fff;
      --legend-text-color: #fff;

      /* Booking Info - Dark Mode */
      --booking-info-background: #3a3a3e;
      --booking-info-text: #e0e0e0;
      --booking-info-box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);

      /* Screen SVG - Dark Mode */
      --screen-svg-path: url("../pics/screen-dark/screen.svg");

      /* Seat Icon Paths - Dark Mode */
      --icon-regular-seat: url("../pics/seat-icons-dark/regular_seat_icon.svg");
      --icon-saver-seat: url("../pics/seat-icons-dark/saver_seat_icon.svg");
      --icon-super-saver-seat: url("../pics/seat-icons-dark/super_saver_seat_icon.svg");
      --icon-vip-seat: url("../pics/seat-icons-dark/vip_seat_icon.svg");
      --icon-sold-regular-seat: url("../pics/seat-icons-dark/sold_regular_seat_icon.svg");
      --icon-sold-saver-seat: url("../pics/seat-icons-dark/sold_saver_seat_icon.svg");
      --icon-sold-super-saver-seat: url("../pics/seat-icons-dark/sold_super_saver_seat_icon.svg");
      --icon-sold-vip-seat: url("../pics/seat-icons-dark/sold_vip_seat_icon.svg");
      --icon-selected-regular-seat: url("../pics/seat-icons-dark/selected_regular_seat_icon.svg");
      --icon-selected-saver-seat: url("../pics/seat-icons-dark/selected_saver_seat_icon.svg");
      --icon-selected-super-saver-seat: url("../pics/seat-icons-dark/selected_super_saver_seat_icon.svg");
      --icon-selected-vip-seat: url("../pics/seat-icons-dark/selected_vip_seat_icon.svg");
    
      /* Modal Styles - Dark Mode */
      --ss-modal-overlay-bg: rgba(0, 0, 0, 0.7);
      --ss-modal-content-bg: #2c2c2c;
      --ss-modal-text-color: #e0e0e0;
      --ss-modal-close-button-hover-box-shadow: 0 0 50px 0 rgba(247, 149, 30, 0.55), inset 0 0 20px 0 rgba(247, 149, 30, 0.45);
      --ss-modal-close-button-hover-text-shadow: 0 0 4px rgba(255, 220, 180, 0.75);
    }

    @media (prefers-color-scheme: light) {
      :host {
        /* Light Mode Variable Overrides */
        --main-background: #f8f8f8;
        --primary-text: #272727;
        --secondary-text: #777;
        --hall-name-text: #272727;
        --legend-text-color: #272727;

        /* Booking Info - Light Mode */
        --booking-info-background: #fff;
        --booking-info-text: #272727;
        --booking-info-box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        
        /* Screen SVG - Light Mode */
        --screen-svg-path: url("../pics/screen-light/screen.svg");

        /* Seat Icon Paths - Light Mode */
        --icon-regular-seat: url("../pics/seat-icons/regular_seat_icon.svg");
        --icon-saver-seat: url("../pics/seat-icons/saver_seat_icon.svg");
        --icon-super-saver-seat: url("../pics/seat-icons/super_saver_seat_icon.svg");
        --icon-vip-seat: url("../pics/seat-icons/vip_seat_icon.svg");
        --icon-sold-regular-seat: url("../pics/seat-icons/sold_regular_seat_icon.svg");
        --icon-sold-saver-seat: url("../pics/seat-icons/sold_saver_seat_icon.svg");
        --icon-sold-super-saver-seat: url("../pics/seat-icons/sold_super_saver_seat_icon.svg");
        --icon-sold-vip-seat: url("../pics/seat-icons/sold_vip_seat_icon.svg");
        --icon-selected-regular-seat: url("../pics/seat-icons/selected_regular_seat_icon.svg");
        --icon-selected-saver-seat: url("../pics/seat-icons/selected_saver_seat_icon.svg");
        --icon-selected-super-saver-seat: url("../pics/seat-icons/selected_super_saver_seat_icon.svg");
        --icon-selected-vip-seat: url("../pics/seat-icons/selected_vip_seat_icon.svg");
      
        /* Modal Styles - Light Mode */
        --ss-modal-overlay-bg: rgba(0, 0, 0, 0.5);
        --ss-modal-content-bg: #fff;
        --ss-modal-text-color: #272727;
        --ss-modal-close-button-hover-box-shadow: 0 0 50px 0 rgba(247, 149, 30, 0.35), inset 0 0 20px 0 rgba(247, 149, 30, 0.3);
        --ss-modal-close-button-hover-text-shadow: 0 0 3px #fff;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .container {
      height: 100%;
    }
    /* Seat picker wrapper */
    .seat-picker {
      height: 100%;
      width: 100%;
      background-color: var(--main-background);
      padding-bottom: 1rem;
    }
    /* A simple screen representation */
    .screen {
      text-align: center;
    }
    .screen svg {
      width: 100%;
      height: auto;
    }
    /* Seat grid container */
    .seats {
      display: grid; /* Use grid for vertical stacking of rows */
      gap: 6px;
      margin-bottom: 10px;
      max-width: 100%; /* Ensure the container doesn't exceed parent */
      /* Make container width fit its content (the seat rows) */
      width: fit-content;
      /* Center the container horizontally */
      margin-left: auto;
      margin-right: auto;
      /* overflow-x: hidden; /* No longer needed with fit-content */
    }
    /* Each row is arranged in a single horizontal grid line */
    .row {
      display: grid;
      grid-auto-flow: column; /* Arrange seats horizontally */
      /* Define auto column size: try to be 25px, shrink to 6.35px minimum */
      grid-auto-columns: minmax(6.35px, 25px);
      gap: 5px;
      justify-content: center; /* Center the block of seats horizontally */
      max-width: 100%; /* Prevent row from exceeding parent width */
      margin: 0 1rem;
    }
    /* Override grid settings for screen image and name rows */
    .screen-image-row,
    .screen-name-row {
      display: block; /* Change display from grid to block */
      justify-content: initial; /* Reset justify-content */
      grid-auto-flow: initial; /* Reset grid-auto-flow */
      grid-auto-columns: initial; /* Reset grid-auto-columns */
      overflow-x: hidden;
      text-align: center; /* Center content like screen SVG and hall name */
    }
    .screen {
      width: 121%;
      & svg {
        transform: translateX(-8%);
      }
    }
    .screen-name-row {
    margin-top: -1rem; /* Add some space above the screen name */
      margin-bottom: 0.5rem; /* Add some space below the screen name */
    }
     .hall-name-container h5 {
      color: var(--hall-name-text);
      font-weight: 400;
      font-size: clamp(0.8rem, 2vw, 1rem); /* Responsive font size */
    }
    /* Base style for seats using SVG icons */
    .seat {
      /* width: clamp(6.35px, 5vw, 25px); Let the grid column control the width */
      aspect-ratio: 1; /* Maintain square shape based on width */
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      cursor: pointer;
      transition: transform 0.1s ease;
      min-width: 6.35px; /* Ensure seat doesn't collapse below minimum */
    }
    .seat:hover {
      transform: scale(1.1);
    }
   .row-number {
      /* Sizing and Shape */
      min-width: 6.35px; /* Match min-width of seats */
      aspect-ratio: 1; /* Make it square like seats */

      /* Text Styling */
      color: var(--secondary-text); /* Dark grey color for the number */
      font-size: 10px; 
      font-weight: bold;

      /* Alignment */
      display: flex;
      align-items: center;
      justify-content: center;

      /* Non-interactive */
      cursor: default;
    }
    /* Seat types: adjust the filenames as per your folder */
    .seat.regular {
      background-image: var(--icon-regular-seat);
    }
    .seat.saver {
      background-image: var(--icon-saver-seat);
    }
    .seat.super-saver{
      background-image: var(--icon-super-saver-seat);
    }
    .seat.vip {
      background-image: var(--icon-vip-seat);
    }
    /* Occupied state: show an overlay occupied icon */
    .seat.regular.occupied {
      pointer-events: none;
      background-image: var(--icon-sold-regular-seat);
    }
    .seat.saver.occupied {
      pointer-events: none;
      background-image: var(--icon-sold-saver-seat);
    }
    .seat.super-saver.occupied {
      pointer-events: none;
      background-image: var(--icon-sold-super-saver-seat);
    }
    .seat.vip.occupied {
      pointer-events: none;
      background-image: var(--icon-sold-vip-seat);
    }
    /* Selected state */
    .seat.regular.selected {
      background-image: var(--icon-selected-regular-seat);
      &:hover {
        transform: none;
      }
    }
    .seat.saver.selected {
      background-image: var(--icon-selected-saver-seat);
      &:hover {
        transform: none;
      }
    }
    .seat.super-saver.selected {
      background-image: var(--icon-selected-super-saver-seat);
      &:hover {
        transform: none;
      }
    }
    .seat.vip.selected {
      background-image: var(--icon-selected-vip-seat);
      &:hover {
        transform: none;
      }
    }
    /* Legend Styles */
    .seat-price {
      padding: 15px 10px;
      display: flex;
      overflow-x: auto; /* Allow the outer container to scroll if needed */
    }
    .legend-container {
      display: flex;
      gap: 15px; /* Space between legend items */
      min-width: max-content; /* Set minimum width */
      margin-left: auto;
      margin-right: auto;
      padding: 0 10px; /* Add some padding so items don't touch edges when scrolling */
    }
    .legend-item {
      display: flex;
      align-items: center; /* Vertically align icon and text */
      gap: 5px; /* Space between icon and text */
    }
     .legend-icon {
      width: 18px; /* Size of the legend icon */
      height: 18px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      /* Apply seat type backgrounds */
      &.regular {
        background-image: var(--icon-regular-seat);
      }
      &.saver {
        background-image: var(--icon-saver-seat);
      }
      &.super-saver {
        background-image: var(--icon-super-saver-seat);
      }
      &.vip {
        background-image: var(--icon-vip-seat);
      }
      /* Apply state backgrounds */
      &.regular.occupied {
        background-image: var(--icon-sold-regular-seat);
      }
      &.regular.selected {
        background-image: var(--icon-selected-regular-seat);
      }
      /* Add other occupied/selected types if needed */
    }
    .legend-text {
      font-size: clamp(0.65rem, 1.5vw, 0.75rem);
      color: var(--legend-text-color); 
    }
    .legend-price {
      font-weight: bold;
    }
    /* Booking info section */
    .booking-info {
      text-align: center;
      background: var(--booking-info-background);
      color: var(--booking-info-text);
      padding: 10px;
      border-radius: 8px;
      box-shadow: var(--booking-info-box-shadow);
    }
    .hidden {
      visibility: hidden;
    }

.modal {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--ss-modal-overlay-bg);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal.show {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  max-width: 380px;
  background: var(--ss-modal-content-bg);
  padding: 2rem;
  border: 3px rgb(228, 155, 15) solid;
  border-left: 7px rgb(228, 155, 15) dashed;
  border-radius: 4px;
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.modal-hidden {
  display: none;
}

.modal.show .modal-content {
  transform: scale(1);
}
.notice {
  margin-top: 1.3rem;
  font-size: 1rem;
  color: var(--ss-modal-text-color);
  font-weight: 300;
  text-align: left;
}
  .close-text {
  cursor: pointer;
  color: var(--ss-modal-text-color);
    font-weight: 400;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.9rem;

    width: max-content;
    border-width: 2.4px;
    border-style: solid;
    background: none;
    border-image-source: linear-gradient(to right, #b74d1c 0%, #f7941e 48%, #eec42a 100%);
    border-image-slice: 1;
    margin: 1.5rem auto 0;
    padding: 0.7rem 2.6rem;
    text-transform: uppercase;
    border-radius: 4px;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    transition: all 0.27s ease;
    &:hover {
      box-shadow: var(--ss-modal-close-button-hover-box-shadow);
      text-shadow: var(--ss-modal-close-button-hover-text-shadow);
    }
  }
.modal-content h2 {
      background-image: linear-gradient(90deg, #dc6a1a, #eec42a);
      color: transparent;
      background-clip: text;
      font-size: 1.7rem;
      letter-spacing: 0.04em;
      margin-bottom: 1rem;
      text-transform: uppercase;
      font-weight: 350;
      text-align: center;
}
    @media (max-width: 768px) {
      .seat-picker {
        width: 100%; /* Make seat picker take full width on small screens */
      }
      .row {
        gap: 2px; /* Reduce gap between seats on small screens */
      }
    }
    @media (max-width: 480px) {
      .row-number {
      font-size: 7.5px;
      }
    }
    @media (max-width: 420px) {
      .legend-text {
        font-size: 11px;
      }
    }
  </style>
  <section class="seat-picker">
  <div class="seat-wrapper">
    <div class="seats">
    </div>
  </div>
    <div class="seat-price">
      <div class="legend-container">
      </div>
    </div>
  </section>

    <div id="modal" class="modal modal-hidden">
      <div class="modal-content">
        <h2>Суудлаа гараар сонгоно уу</h2>
        <div class="notice"></div>
        <div id="close-modal-text" class="close-text">Ойлголоо</div>
      </div>
    </div>
`;

export class SeatSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.parent = document.createElement("div");
    this.parent.classList.add("container");

    this.shadowRoot.appendChild(this.parent);
    this.parent.appendChild(template.content.cloneNode(true));
    this.container = this.parent.querySelector(".seats");

    this.layoutData = [];
    this.occupiedData = [];

    this.seatLayout = [];
    this.occupiedSeats = [];

    this.movieTitle = null;
    this.movieId = null;
    this.branchId = null;
    this.hallId = null;
    this.day = null;
    this.hour = null;
    this.seatTypes = [];

    this.uniqueId = null;
    this.formattedDay = null;
    this.formattedHour = null;

    this.maxAllowedSeats = null;
    this.currentSelectedSeats = [];

    this.orderSteps = null;

    this.isLightMode = null;

    this.modal = this.parent.querySelector("#modal");
    this.modalText = this.parent.querySelector(".notice");
    this.closeModalText = this.parent.querySelector("#close-modal-text");
  }

  static get observedAttributes() {
    return [
      "movie_title",
      "movie_id",
      "branch_id",
      "hall_id",
      "day",
      "hour",
      "allowed-seats",
      "auto-picker",
    ];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "movie_title") this.movieTitle = newVal;
    if (attr === "movie_id") this.movieId = Number(newVal);
    if (attr === "branch_id") this.branchId = Number(newVal);
    if (attr === "hall_id") this.hallId = Number(newVal);
    if (attr === "day") this.day = newVal;
    if (attr === "hour") this.hour = newVal;
    if (attr === "allowed-seats") {
      const num = Number(newVal);
      if (!isNaN(num) && num > 0) {
        this.maxAllowedSeats = num;
        this.enforceSeatLimit(this.maxAllowedSeats);
      }
    }
    if (attr === "auto-picker") {
      this.handleAutoSelection(
        Number(newVal.split(",")[0]),
        newVal.split(",")[1]
      );
    }
  }

  enforceSeatLimit(maxSeats) {
    let seatsChanged = false;
    if (this.currentSelectedSeats.length > maxSeats) {
      while (this.currentSelectedSeats.length > maxSeats) {
        const seatToDeselect = this.currentSelectedSeats[0];
        const seatElement = this.container.querySelector(
          `[data-seat="${seatToDeselect.row}-${seatToDeselect.column}"]`
        );
        if (seatToDeselect) {
          seatElement.classList.remove("selected");
        }
        this.currentSelectedSeats.shift();
        seatsChanged = true;
      }
    }
    if (seatsChanged) {
      this.updatedSelectedSeatsDispatchEvent();
    }
  }

  // meta-row only!!!
  getSeatDetails(row, col) {
    for (const type of this.seatTypes) {
      if (type.rows.includes(row)) {
        return { type: type.type, price: type.price, label: type.label };
      }
    }
    return { type: "unknown", price: 0, label: "Unknown" };
  }

  updatedSelectedSeatsDispatchEvent() {
    this.dispatchEvent(
      new CustomEvent("seats-updated", {
        detail: {
          showtimeId: this.uniqueId,
          selectedSeats: this.currentSelectedSeats,
          movieTitle: this.movieTitle,
          branchId: this.branchId,
          hallId: this.hallId,
          day: this.day,
          hour: this.hour,

          seatTypes: this.seatTypes,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  async connectedCallback() {
    await this.helperFetch();
    this.prepareData();

    const lightSchemeMediaQuery = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: light)")
      : null;

    if (lightSchemeMediaQuery) {
      this.isLightMode = lightSchemeMediaQuery.matches;
      lightSchemeMediaQuery.addEventListener("change", (e) => {
        this.isLightMode = e.matches;
        this.renderSeats();
      });
    } else {
      this.isLightMode = false; // Default to dark mode if media query is not supported
    }

    this.renderSeats();
    this.renderPriceLegend();
    this.updatedSelectedSeatsDispatchEvent();

    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("seat")) {
        const seat = e.target;

        if (
          seat.classList.contains("occupied") ||
          seat.classList.contains("hidden")
        )
          return;

        if (seat.classList.contains("selected")) {
          const [row, column] = seat
            .getAttribute("data-seat")
            .split("-")
            .map(Number);
          this.currentSelectedSeats = this.currentSelectedSeats.filter(
            (s) => s.row !== row || s.column !== column
          );
          seat.classList.remove("selected");
        } else if (
          this.currentSelectedSeats.length + 1 <=
          this.maxAllowedSeats
        ) {
          const [meta_row, meta_column] = seat
            .getAttribute("data-meta-seat")
            .split("-")
            .map(Number);
          const [row, column] = seat
            .getAttribute("data-seat")
            .split("-")
            .map(Number);
          const details = this.getSeatDetails(meta_row, meta_column);
          this.currentSelectedSeats.push({
            row,
            column,
            type: details.type,
            price: details.price,
            label: details.label,
          });
          seat.classList.add("selected");
          console.log("max-s baga buyu tentsuu tul nemev");
        } else if (
          this.currentSelectedSeats.length + 1 >
          this.maxAllowedSeats
        ) {
          this.container
            .querySelector(
              `[data-seat="${this.currentSelectedSeats[0].row}-${this.currentSelectedSeats[0].column}"]`
            )
            .classList.remove("selected");
          this.currentSelectedSeats.shift();
          const [meta_row, meta_column] = seat
            .getAttribute("data-meta-seat")
            .split("-")
            .map(Number);
          const [row, column] = seat
            .getAttribute("data-seat")
            .split("-")
            .map(Number);
          const details = this.getSeatDetails(meta_row, meta_column);
          this.currentSelectedSeats.push({
            row,
            column,
            type: details.type,
            price: details.price,
            label: details.label,
          });
          seat.classList.add("selected");
          console.log("max-s hetersen tul ehnii elementiig hasaad nemev");
        }
        this.updatedSelectedSeatsDispatchEvent();
        console.log(this.currentSelectedSeats, this.maxAllowedSeats);
      }
    });

    this.closeModalText.addEventListener("click", () => {
      this.hideModal();
    });
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.hideModal();
      }
    });
  }

  openModal(count, label) {
    this.modal.classList.remove("modal-hidden");
    setTimeout(() => {
      this.modal.classList.add("show");
    }, 100);
    this.modalText.innerHTML = "";
    this.modalText.innerHTML = `Таны сонгосон ${label.toUpperCase()} төрлийн суудлаас зэрэгцээ ${count}ш суудал үлдээгүй байна.`;
  }
  hideModal() {
    this.modal.classList.remove("show");
    setTimeout(() => {
      this.modal.classList.add("modal-hidden");
    }, 300);
  }

  handleAutoSelection(count, type) {
    if (!type || count <= 0) {
      this.updatedSelectedSeatsDispatchEvent();
      return;
    }

    // 1. Deselect any currently selected seats
    this.currentSelectedSeats.forEach((seatInfo) => {
      const seatEl = this.container.querySelector(
        `[data-seat="${seatInfo.row}-${seatInfo.column}"]`
      );
      if (seatEl) {
        seatEl.classList.remove("selected");
      }
    });
    this.currentSelectedSeats = [];

    const rows = this.container.querySelectorAll(".row[data-row]");
    const allPossibleBlocks = []; // Store all found adjacent blocks

    for (const rowElement of rows) {
      // 2. Get all candidate seats in this row of the specified type that are not occupied or hidden
      const candidateSeatsInRow = Array.from(
        rowElement.querySelectorAll(`.seat.${type}:not(.hidden):not(.occupied)`)
      )
        .map((seatEl) => {
          const seatId = seatEl.getAttribute("data-seat");
          const metaSeatId = seatEl.getAttribute("data-meta-seat");
          // Ensure seat has valid data-seat and data-meta-seat attributes
          if (!seatId || !metaSeatId) return null;
          const [seatRow, seatCol] = seatId.split("-").map(Number);
          const [metaSeatRow, metaSeatCol] = metaSeatId.split("-").map(Number);
          return {
            element: seatEl,
            row: seatRow,
            col: seatCol,
            metaRow: metaSeatRow,
            metaCol: metaSeatCol,
          };
        })
        .filter(Boolean) // Remove any null entries
        .sort((a, b) => a.col - b.col); // Sort by display column number

      if (candidateSeatsInRow.length < count) {
        continue; // Not enough available seats of this type in this row
      }

      // 3. Slide a window of size `count` across the sorted available seats in the row
      for (let i = 0; i <= candidateSeatsInRow.length - count; i++) {
        const potentialBlock = candidateSeatsInRow.slice(i, i + count);

        // Check for adjacency: display column numbers AND meta column numbers must be consecutive
        let isAdjacent = true;
        if (count > 1) {
          // Adjacency check only needed if count > 1
          for (let j = 0; j < count - 1; j++) {
            if (
              potentialBlock[j + 1].col !== potentialBlock[j].col + 1 ||
              potentialBlock[j + 1].metaCol !== potentialBlock[j].metaCol + 1
            ) {
              isAdjacent = false;
              break;
            }
          }
        }

        if (isAdjacent) {
          // Add this valid block to our list of possibilities
          allPossibleBlocks.push(potentialBlock);
        }
      }
    }

    // 4. If suitable blocks were found, randomly select one
    if (allPossibleBlocks.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPossibleBlocks.length);
      const selectedBlock = allPossibleBlocks[randomIndex];

      // 5. Select these seats
      selectedBlock.forEach((seatObj) => {
        const seatElement = seatObj.element;
        seatElement.classList.add("selected");

        const metaSeatAttr = seatElement.getAttribute("data-meta-seat");
        if (!metaSeatAttr) {
          return; // Skip this seat if meta info is missing
        }
        const [meta_row, meta_column] = metaSeatAttr.split("-").map(Number);
        const details = this.getSeatDetails(meta_row, meta_column);

        this.currentSelectedSeats.push({
          row: seatObj.row, // Display row from data-seat
          column: seatObj.col, // Display column from data-seat
          type: details.type, // Actual type from getSeatDetails
          price: details.price,
          label: details.label,
        });
      });

      console.log(
        `${type} төрлийн суудлаас зэрэгцээ ${this.currentSelectedSeats.length}-г автоматаар сонгов.`,
        this.currentSelectedSeats
      );
    } else {
      this.openModal(count, this.seatTypes.find((seat) => seat.type === type).label);
    }

    // 6. Dispatch event with the newly selected seats (or empty if none found/selected)
    this.updatedSelectedSeatsDispatchEvent();
  }

  renderSeats() {
    this.container.innerHTML = "";
    // Determine color scheme and select appropriate screen template
    const currentScreenTemplate = this.isLightMode
      ? templateScreenLightMode
      : templateScreen;
    this.container.appendChild(currentScreenTemplate.content.cloneNode(true));

    this.container.querySelector(".hall-name").textContent = `ТАНХИМ ${
      this.hallId
    } ${this.seatLayout.name.replace(/танхим/i, "")}`;

    //seat layout raw data
    for (let i = 0; i < this.seatLayout.layout.rows; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      row.setAttribute("data-meta-row", `${i + 1}`);
      for (let j = 0; j < this.seatLayout.layout.columns; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.setAttribute("data-meta-seat", `${i + 1}-${j + 1}`);
        row.appendChild(seat);
      }
      this.container.appendChild(row);
    }

    //baihgui suudluud
    for (let i = 0; i < this.seatLayout.layout.unavailable_seats.length; i++) {
      const unavailableSeat = this.seatLayout.layout.unavailable_seats[i];
      const seat = this.container.querySelector(
        `[data-meta-seat="${unavailableSeat.row}-${unavailableSeat.column}"]`
      );
      seat.classList.add("hidden");
    }

    //seat types
    for (let i = 0; i < this.seatTypes.length; i++) {
      const seatType = this.seatTypes[i];
      for (let j = 0; j < seatType.rows.length; j++) {
        const row = seatType.rows[j];
        this.container
          .querySelector(`[data-meta-row="${row}"]`)
          .querySelectorAll(".seat")
          .forEach((seat) => {
            seat.classList.add(seatType.type);
          });
      }
    }

    const rows = this.container.querySelectorAll(".row");

    //data-id to seats
    for (let i = 0, j = 1; i < rows.length; i++) {
      if (this.isRowEmpty(rows[i])) {
        continue;
      }
      rows[i].setAttribute("data-row", `${j}`);
      for (let k = 0, s = 1; k < rows[i].children.length; k++) {
        const seat = rows[i].children[k];
        if (this.isSeatEmpty(seat)) {
          continue;
        }
        seat.setAttribute("data-seat", `${j}-${s}`);
        s++;
      }
      j++;
    }

    //row number
    const rowsContainerForRowNumber =
      this.container.querySelectorAll(`[data-row]`);
    for (let i = 0; i < rowsContainerForRowNumber.length; i++) {
      const rowNumber = document.createElement("div");
      rowNumber.classList.add("row-number");
      rowNumber.textContent = `${i + 1}`;
      rowsContainerForRowNumber[i].prepend(rowNumber);
    }
    for (let i = 0; i < rowsContainerForRowNumber.length; i++) {
      const rowNumber = document.createElement("div");
      rowNumber.classList.add("row-number");
      rowNumber.textContent = `${i + 1}`;
      rowsContainerForRowNumber[i].append(rowNumber);
    }

    //occupied seats
    if (this.occupiedSeats) {
      for (let i = 0; i < this.occupiedSeats.length; i++) {
        const occupiedSeat = this.occupiedSeats[i];
        const seat = this.container.querySelector(
          `[data-meta-seat="${occupiedSeat.row}-${occupiedSeat.column}"]`
        );
        seat.classList.add("occupied");
      }
    }
  }

  isRowEmpty(row) {
    for (let i = 0; i < row.children.length; i++) {
      const seat = row.children[i];
      if (!seat.classList.contains("hidden")) return false;
    }
    return true;
  }
  isSeatEmpty(seat) {
    return seat.classList.contains("hidden");
  }

  renderPriceLegend() {
    const legendContainer = this.parent.querySelector(".legend-container");
    legendContainer.innerHTML = "";

    this.seatTypes.forEach((seat) => {
      const legendItem = document.createElement("div");
      legendItem.classList.add("legend-item");

      const legendIcon = document.createElement("div");
      legendIcon.classList.add("legend-icon", seat.type);

      const legendText = document.createElement("span");
      legendText.classList.add("legend-text");
      const formattedPrice = (seat.price / 1000).toFixed(1);
      legendText.innerHTML = `${seat.label} <span class="legend-price">₮${formattedPrice}К</span>`;

      legendItem.appendChild(legendIcon);
      legendItem.appendChild(legendText);
      legendContainer.appendChild(legendItem);
    });

    const occupiedLegendItem = document.createElement("div");
    occupiedLegendItem.classList.add("legend-item");
    const occupiedLegendIcon = document.createElement("div");
    occupiedLegendIcon.classList.add("legend-icon", "regular", "occupied");
    const occupiedLegendText = document.createElement("span");
    occupiedLegendText.classList.add("legend-text");
    occupiedLegendText.textContent = `Зарагдсан`;
    occupiedLegendItem.appendChild(occupiedLegendIcon);
    occupiedLegendItem.appendChild(occupiedLegendText);
    legendContainer.appendChild(occupiedLegendItem);
  }

  async helperFetch() {
    const layoutData = await fetchBranches();
    this.layoutData = layoutData.branches;
    const occupiedData = await fetchOccupiedSeats();
    this.occupiedData = occupiedData.OccupiedSeats;
  }

  prepareData() {
    this.formattedDay = this.day.replace(/-/g, "");
    this.formattedHour = this.hour.replace(":", "");
    this.uniqueId = `${this.movieId}_${this.branchId}_${this.hallId}_${this.formattedDay}_${this.formattedHour}`;

    const currentBranch = this.layoutData.find(
      (branch) => branch.id === this.branchId
    );
    if (!currentBranch) {
      console.error(
        `Салбарын мэдээлэл (Branch ID: ${this.branchId}) олдсонгүй.`
      );
      this.seatLayout = {
        layout: { rows: 0, columns: 0, unavailable_seats: [], seatTypes: [] },
        name: "Unknown танхим",
      };
      this.seatTypes = [];
      this.occupiedSeats = [];
      return;
    }
    this.seatLayout = currentBranch.halls.find(
      (hall) => hall.id === this.hallId
    );
    if (!this.seatLayout) {
      console.error(
        `"Branch ID: ${this.branchId}" салбарын "Hall ID: ${this.hallId}" танхимын мэдээлэл олдсонгүй.`
      );
      this.seatLayout = {
        layout: { rows: 0, columns: 0, unavailable_seats: [], seatTypes: [] },
        name: "Unknown танхим",
      };
      this.seatTypes = [];
      this.occupiedSeats = [];
      return;
    }

    this.occupiedSeats = this.occupiedData?.find(
      (show) => show.showtimeId === this.uniqueId
    )?.occupiedSeats;

    const seatTypesData = this.seatLayout.layout.seatTypes;
    this.seatTypes = [];
    for (let i = 0; i < seatTypesData.length; i++) {
      const seatType = seatTypesData[i];
      this.seatTypes.push({
        type: seatType.type,
        rows: seatType.rows,
        label: seatType.label,
        price: seatType.price,
        caption: seatType.caption,
      });
    }
    this.seatTypes.sort((a, b) => b.price - a.price);
  }

  disconnectedCallback() {}
}

customElements.define("seat-selector", SeatSelector);

const templateScreen = document.createElement("template");
templateScreen.innerHTML = `
  <div class="screen-image-row">
    <div class="screen">
<svg
  width="100%"
  height="100%"
  viewBox="0 0 552 100"
  class="seat-map__screen-image"
>
  <!-- Maximum ground illumination -->
  <g opacity="1" filter="url(#filter0_f_2284_34995)">
    <path
      d="M276.5 88.5347C375.116 88.5347 441 71.2976 441 50.0347C441 28.7717 375.116 11.5347 276.5 11.5347C177.884 11.5347 112 28.7717 112 50.0347C112 71.2976 177.884 88.5347 276.5 88.5347Z"
      fill="#333333"
    />
  </g>
  <!-- Screen border line -->
  <path d="M64 15H488V17H64V15Z" fill="#888888" />
  <!-- Screen surface illuminated -->
  <path
    d="M91.6985 45H458.171L488 18H64L91.6985 45Z"
    fill="#fafafa"
  />
  <!-- Inner highlight -->
  <g filter="url(#filter1_i_2284_34995)">
    <path
      d="M91.6985 45H458.171L488 18H64L91.6985 45Z"
      fill="#ffffff"
    />
  </g>
  <!-- Enhanced edge glows with higher opacity -->
  <g opacity="0.9" filter="url(#filter2_f_2284_34995)">
    <path
      d="M92.7306 45H457.151L508 75H44L92.7306 45Z"
      fill="url(#paint1_linear_2284_34995)"
    />
  </g>
  <g opacity="0.8" filter="url(#filter3_f_2284_34995)">
    <path
      d="M92.9807 45H456.903L550 75H2L92.9807 45Z"
      fill="url(#paint2_linear_2284_34995)"
    />
  </g>
  <g opacity="0.85" filter="url(#filter4_f_2284_34995)">
    <path
      d="M92.5678 45H457.312L487 75H65L92.5678 45Z"
      fill="url(#paint3_linear_2284_34995)"
    />
  </g>
  <!-- Thicker ground glow line increased opacity -->
  <path
    opacity="0.8"
    d="M149 45.5347V44.5347H402V45.5347H149Z"
    fill="url(#paint4_linear_2284_34995)"
  />
  <defs>
    <!-- Expanded Gaussian blur for more feathered glow -->
    <filter
      id="filter0_f_2284_34995"
      x="51"
      y="-20"
      width="451"
      height="140"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="12"
        result="effect1_foregroundBlur_2284_34995"
      />
    </filter>
    <!-- unchanged inner shadow filter -->
    <filter
      id="filter1_i_2284_34995"
      x="64"
      y="17"
      width="424"
      height="28"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feOffset dy="0" />
      <feGaussianBlur stdDeviation="2" />
      <feComposite
        in2="hardAlpha"
        operator="arithmetic"
        k2="-1"
        k3="1"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
      />
      <feBlend
        mode="normal"
        in2="shape"
        result="effect1_innerShadow_2284_34995"
      />
    </filter>
    <!-- stronger blur on edge glow filters -->
    <filter
      id="filter2_f_2284_34995"
      x="-20"
      y="25"
      width="600"
      height="60"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="8"
        result="effect1_foregroundBlur_2284_34995"
      />
    </filter>
    <filter
      id="filter3_f_2284_34995"
      x="-20"
      y="25"
      width="600"
      height="60"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="8"
        result="effect1_foregroundBlur_2284_34995"
      />
    </filter>
    <filter
      id="filter4_f_2284_34995"
      x="-20"
      y="25"
      width="600"
      height="60"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape"
      />
      <feGaussianBlur
        stdDeviation="8"
        result="effect1_foregroundBlur_2284_34995"
      />
    </filter>
    <!-- unchanged gradients -->
    <linearGradient
      id="paint1_linear_2284_34995"
      x1="276"
      y1="75"
      x2="276"
      y2="45.8095"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#aaa" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient
      id="paint2_linear_2284_34995"
      x1="276"
      y1="75"
      x2="276"
      y2="45.8095"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#aaa" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient
      id="paint3_linear_2284_34995"
      x1="276"
      y1="75"
      x2="276"
      y2="45.8095"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#aaa" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient
      id="paint4_linear_2284_34995"
      x1="149"
      y1="45.5347"
      x2="402"
      y2="45.5347"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#888" stop-opacity="0" />
      <stop offset="0.027" stop-color="#888" />
      <stop offset="0.97" stop-color="#888" />
      <stop offset="1" stop-color="#888" stop-opacity="0" />
    </linearGradient>
  </defs>
</svg>

    </div>
  </div>
  <div class="screen-name-row">
    <div class="hall-name-container">
      <h5 class="hall-name">ТАНХИМ</h5>
    </div>
  </div>
`;
const templateScreenLightMode = document.createElement("template");
templateScreenLightMode.innerHTML = `
  <div class="screen-image-row">
    <div class="screen">
<svg
        width="100%"
        height="100%"
        viewBox="0 0 552 100"
        class="seat-map__screen-image"
      >
        <g opacity="0.91" filter="url(#filter0_f_2284_34995)">
          <path
            d="M276.5 88.5347C375.116 88.5347 441 71.2976 441 50.0347C441 28.7717 375.116 11.5347 276.5 11.5347C177.884 11.5347 112 28.7717 112 50.0347C112 71.2976 177.884 88.5347 276.5 88.5347Z"
            fill="#F3EBE8"
          ></path>
        </g>
        <path d="M64 15H488V17H64V15Z" fill="white"></path>
        <path
          d="M91.6985 45H458.171L488 18H64L91.6985 45Z"
          fill="url(#paint0_linear_2284_34995)"
        ></path>
        <g filter="url(#filter1_i_2284_34995)">
          <path
            d="M91.6985 45H458.171L488 18H64L91.6985 45Z"
            fill="#D8D8D8"
          ></path>
        </g>
        <g opacity="0.95" filter="url(#filter2_f_2284_34995)">
          <path
            d="M92.7306 45H457.151L508 75H44L92.7306 45Z"
            fill="url(#paint1_linear_2284_34995)"
          ></path>
        </g>
        <g opacity="0.65" filter="url(#filter3_f_2284_34995)">
          <path
            d="M92.9807 45H456.903L550 75H2L92.9807 45Z"
            fill="url(#paint2_linear_2284_34995)"
          ></path>
        </g>
        <g filter="url(#filter4_f_2284_34995)">
          <path
            d="M92.5678 45H457.312L487 75H65L92.5678 45Z"
            fill="url(#paint3_linear_2284_34995)"
          ></path>
        </g>
        <path
          opacity="0.69933"
          d="M149 45.5347V44.5347H402V45.5347H149Z"
          fill="url(#paint4_linear_2284_34995)"
        ></path>
        <defs>
          <filter
            id="filter0_f_2284_34995"
            x="101"
            y="0.534668"
            width="351"
            height="99"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="5.5"
              result="effect1_foregroundBlur_2284_34995"
            ></feGaussianBlur>
          </filter>
          <filter
            id="filter1_i_2284_34995"
            x="64"
            y="17"
            width="424"
            height="28"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            ></feColorMatrix>
            <feOffset dy="-1"></feOffset>
            <feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            ></feComposite>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0681612 0"
            ></feColorMatrix>
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_2284_34995"
            ></feBlend>
          </filter>
          <filter
            id="filter2_f_2284_34995"
            x="42.9"
            y="43.9"
            width="466.2"
            height="32.2"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="0.55"
              result="effect1_foregroundBlur_2284_34995"
            ></feGaussianBlur>
          </filter>
          <filter
            id="filter3_f_2284_34995"
            x="0.9"
            y="43.9"
            width="550.2"
            height="32.2"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="0.55"
              result="effect1_foregroundBlur_2284_34995"
            ></feGaussianBlur>
          </filter>
          <filter
            id="filter4_f_2284_34995"
            x="63.9"
            y="43.9"
            width="424.2"
            height="32.2"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="0.55"
              result="effect1_foregroundBlur_2284_34995"
            ></feGaussianBlur>
          </filter>
          <linearGradient
            id="paint0_linear_2284_34995"
            x1="276"
            y1="45"
            x2="276"
            y2="18"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#9C9898"></stop>
            <stop offset="1" stop-color="#D0CCCB"></stop>
          </linearGradient>
          <linearGradient
            id="paint1_linear_2284_34995"
            x1="276"
            y1="75"
            x2="276"
            y2="45.8095"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#D3D0D0" stop-opacity="0"></stop>
            <stop
              offset="1"
              stop-color="#C5C1C0"
              stop-opacity="0.340636"
            ></stop>
          </linearGradient>
          <linearGradient
            id="paint2_linear_2284_34995"
            x1="276"
            y1="75"
            x2="276"
            y2="45.8095"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#D3D0D0" stop-opacity="0"></stop>
            <stop
              offset="1"
              stop-color="#C5C1C0"
              stop-opacity="0.340636"
            ></stop>
          </linearGradient>
          <linearGradient
            id="paint3_linear_2284_34995"
            x1="276"
            y1="75"
            x2="276"
            y2="45.8095"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#D3D0D0" stop-opacity="0"></stop>
            <stop
              offset="1"
              stop-color="#C5C1C0"
              stop-opacity="0.340636"
            ></stop>
          </linearGradient>
          <linearGradient
            id="paint4_linear_2284_34995"
            x1="149"
            y1="45.5347"
            x2="402"
            y2="45.5347"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#AFAEAE" stop-opacity="0"></stop>
            <stop offset="0.0270686" stop-color="#AFAEAE"></stop>
            <stop offset="0.969667" stop-color="#AFAEAE"></stop>
            <stop offset="1" stop-color="#AFAEAE" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
  <div class="screen-name-row">
    <div class="hall-name-container">
      <h5 class="hall-name">ТАНХИМ</h5>
    </div>
  </div>
`;

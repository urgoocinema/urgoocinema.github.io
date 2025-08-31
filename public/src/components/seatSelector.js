import { fetchBranches, fetchOccupiedSeats } from "../../API/fetch.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    /* Seat picker wrapper */
    .seat-picker {
      width: 100%;
      background-color: #f8f8f8;
      border-radius: 8px;
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
      /* Define auto column size: try to be 22px, shrink to 6.35px minimum */
      grid-auto-columns: minmax(6.35px, 22px);
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
      overflow: hidden;
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
      color: #272727; /* Make hall name visible on light background */
      font-weight: 400;
      font-size: clamp(0.8rem, 2vw, 1rem); /* Responsive font size */
    }
    /* Base style for seats using SVG icons */
    .seat {
      /* width: clamp(6.35px, 5vw, 22px); Let the grid column control the width */
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
      color: #555; /* Dark grey color for the number */
      font-size: 10px; /* Adjust size as needed */
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
      background-image: url("../pics/seat-icons/regular_seat_icon.svg");
    }
    .seat.saver {
      background-image: url("../pics/seat-icons/saver_seat_icon.svg");
    }
    .seat.super-saver{
      background-image: url("../pics/seat-icons/super_saver_seat_icon.svg");
    }
    .seat.vip {
      background-image: url("../pics/seat-icons/vip_seat_icon.svg");
    }
    /* Occupied state: show an overlay occupied icon */
    .seat.regular.occupied {
      pointer-events: none;
      background-image: url("../pics/seat-icons/sold_regular_seat_icon.svg");
    }
    .seat.saver.occupied {
      pointer-events: none;
      background-image: url("../pics/seat-icons/sold_saver_seat_icon.svg");
    }
    .seat.super-saver.occupied {
      pointer-events: none;
      background-image: url("../pics/seat-icons/sold_super_saver_seat_icon.svg");
    }
    .seat.vip.occupied {
      pointer-events: none;
      background-image: url("../pics/seat-icons/sold_vip_seat_icon.svg");
    }
    /* Selected state */
    .seat.regular.selected {
      background-image: url("../pics/seat-icons/selected_regular_seat_icon.svg");
      &:hover {
        transform: none;
      }
    }
    .seat.saver.selected {
      background-image: url("../pics/seat-icons/selected_saver_seat_icon.svg");
      &:hover {
        transform: none;
      }
    }
    .seat.super-saver.selected {
      background-image: url("../pics/seat-icons/selected_super_saver_seat_icon.svg");
      &:hover {
        transform: none;
      }
    }
    .seat.vip.selected {
      background-image: url("../pics/seat-icons/selected_vip_seat_icon.svg");
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
        background-image: url("../pics/seat-icons/regular_seat_icon.svg");
      }
      &.saver {
        background-image: url("../pics/seat-icons/saver_seat_icon.svg");
      }
      &.super-saver {
        background-image: url("../pics/seat-icons/super_saver_seat_icon.svg");
      }
      &.vip {
        background-image: url("../pics/seat-icons/vip_seat_icon.svg");
      }
      /* Apply state backgrounds */
      &.regular.occupied {
        background-image: url("../pics/seat-icons/sold_regular_seat_icon.svg");
      }
      &.regular.selected {
        background-image: url("../pics/seat-icons/selected_regular_seat_icon.svg");
      }
      /* Add other occupied/selected types if needed */
    }
    .legend-text {
      font-size: 12px;
      color: #555; /* Adjust color as needed */
    }
    .legend-price {
      font-weight: bold;
    }
    /* Booking info section */
    .booking-info {
      text-align: center;
      background: #fff;
      color: #272727;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .hidden {
      visibility: hidden;
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
        font-size: 6px; /* Adjust row number size for smaller screens */
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

    this.maxAllowedSeats = 1;
    this.currentSelectedSeats = [];
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
  }

  enforceSeatLimit(maxSeats) {
    let seatsChanged = false;
    if (this.currentSelectedSeats.length > maxSeats) {
      while (this.currentSelectedSeats.length > maxSeats) {
        const seatToDeselect = this.currentSelectedSeats[0];
        const seatElement = this.container
          .querySelector(
            `[data-seat="${seatToDeselect.row}-${seatToDeselect.column}"]`
          )
        if(seatToDeselect) {
          seatElement.classList.remove("selected");
        }
        this.currentSelectedSeats.shift();
        seatsChanged = true;
      }
    }
    if(seatsChanged) {
      this.updatedSelectedSeatsDispatchEvent();
    }
  }

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
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  async connectedCallback() {
    await this.helperFetch();
    this.prepareData();

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
          const [row, column] = seat
            .getAttribute("data-seat")
            .split("-")
            .map(Number);
          const details = this.getSeatDetails(row, column);
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
          const [row, column] = seat
            .getAttribute("data-seat")
            .split("-")
            .map(Number);
          const details = this.getSeatDetails(row, column);
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
  }

  renderSeats() {
    this.container.innerHTML = "";
    this.container.appendChild(templateScreen.content.cloneNode(true));

    this.container.querySelector(".hall-name").textContent = `ТАНХИМ ${
      this.hallId
    } ${this.seatLayout.name.replace(/танхим/i, "")}`;

    for (let i = 0; i < this.seatLayout.layout.rows; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      row.setAttribute("data-row", `${i + 1}`);
      for (let j = 0; j < this.seatLayout.layout.columns; j++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.setAttribute("data-seat", `${i + 1}-${j + 1}`);
        row.appendChild(seat);
      }
      this.container.appendChild(row);
    }

    for (let i = 0; i < this.seatLayout.layout.unavailable_seats.length; i++) {
      const unavailableSeat = this.seatLayout.layout.unavailable_seats[i];
      const seat = this.container.querySelector(
        `[data-seat="${unavailableSeat.row}-${unavailableSeat.column}"]`
      );
      seat.classList.add("hidden");
    }

    for (let i = 0, j=0; i < this.seatLayout.layout.rows; i++) {
      if(this.isRowEmpty(this.container.querySelector(`[data-row="${i + 1}"]`))){
        continue;
      }
      const rowNumber = document.createElement("div");
      rowNumber.classList.add("row-number");
      rowNumber.textContent = `${j + 1}`;
      this.container.querySelector(`[data-row="${i + 1}"]`).prepend(rowNumber);
      j++;
    }
    for (let i = 0, j=0; i < this.seatLayout.layout.rows; i++) {
      if(this.isRowEmpty(this.container.querySelector(`[data-row="${i + 1}"]`)))
        continue;
      const rowNumber = document.createElement("div");
      rowNumber.classList.add("row-number");
      rowNumber.textContent = `${j + 1}`;
      this.container.querySelector(`[data-row="${i + 1}"]`).append(rowNumber);
      j++;
    }

    for (let i = 0; i < this.seatTypes.length; i++) {
      const seatType = this.seatTypes[i];
      for (let j = 0; j < seatType.rows.length; j++) {
        const row = seatType.rows[j];
        this.container
          .querySelector(`[data-row="${row}"]`)
          .querySelectorAll(".seat")
          .forEach((seat) => {
            seat.classList.add(seatType.type);
          });
      }
    }

    if (this.occupiedSeats) {
      for (let i = 0; i < this.occupiedSeats.length; i++) {
        const occupiedSeat = this.occupiedSeats[i];
        const seat = this.container.querySelector(
          `[data-seat="${occupiedSeat.row}-${occupiedSeat.column}"]`
        );
        seat.classList.add("occupied");
      }
    }
  }

  isRowEmpty(row) {
    for (let i = 0; i < row.children.length; i++) {
      const seat = row.children[i];
      if (!seat.classList.contains("hidden"))
        return false;
    }
    return true;
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
      const formattedPrice = seat.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      legendText.innerHTML = `${seat.label} <span class="legend-price">${formattedPrice}₮</span>`;

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
      });
    }
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
  <div class="row screen-name-row">
    <div class="hall-name-container">
      <h5 class="hall-name">ТАНХИМ</h5>
    </div>
  </div>
`;

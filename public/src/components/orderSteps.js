const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      padding: 1rem;
      background: #fff; 
      color: #272727; 
      border-radius: 8px; 
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
      width: 100%; 
    }
    .order-summary-container {
      text-align: center;
    }
    h3 {
      margin-top: 0;
      font-size: 1.2em;
      color: #ffa500; /* Orange to match theme */
    }
    p {
      font-size: 0.9em;
      margin-bottom: 10px;
    }
    .ticket-quantity {
      margin: 15px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .ticket-quantity label {
      font-size: 0.9em;
    }
    .ticket-quantity input[type="number"] {
      width: 40px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px;
    }
    .ticket-quantity button {
      padding: 5px 10px;
      background-color: #ffa500;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .selected-seats-list {
      list-style: none;
      padding: 0;
      margin: 10px 0;
      font-size: 0.85em;
    }
    .selected-seats-list li {
      padding: 3px 0;
    }
    .total-price {
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 15px;
    }
    .total-price span {
      color: #ffa500;
    }
    .confirm-button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4CAF50; /* Green for confirm */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
    }
    .confirm-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  </style>
  <div class="order-summary-container">
    <h3 id="movie-title-display">Киноны нэр</h3>
    <p id="showtime-info">Үзвэрийн цаг: <span id="showtime-details"></span></p>
    
    <div class="ticket-quantity">
      <label for="num-tickets">Тасалбар:</label>
      <button id="decrement-tickets" aria-label="Decrease ticket count">-</button>
      <input type="number" id="num-tickets" value="1" min="1" max="10" readonly>
      <button id="increment-tickets" aria-label="Increase ticket count">+</button>
    </div>

    <h4>Сонгосон суудлууд:</h4>
    <ul id="selected-seats-list">
      <li>Суудал сонгоогүй байна.</li>
    </ul>
    
    <div class="total-price">
      Нийт дүн: <span id="total-price-value">0</span>₮
    </div>
    
    <button id="confirm-booking" class="confirm-button" disabled>Захиалга баталгаажуулах</button>
  </div>
`;

export class OrderSteps extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

    this.selectedSeats = [];
    this.showtimeId = null;
    this.movieTitle = "Кино";
    this.showtimeDetailsText = "N/A";
    this.ticketQuantity = 1;

    this.movieTitleDisplay = this.shadowRoot.getElementById(
      "movie-title-display"
    );
    this.showtimeDetailsDisplay =
      this.shadowRoot.getElementById("showtime-details");
    this.numTicketsInput = this.shadowRoot.getElementById("num-tickets");
    this.decrementButton = this.shadowRoot.getElementById("decrement-tickets");
    this.incrementButton = this.shadowRoot.getElementById("increment-tickets");
    this.selectedSeatsList = this.shadowRoot.getElementById(
      "selected-seats-list"
    );
    this.totalPriceValue = this.shadowRoot.getElementById("total-price-value");
    this.confirmButton = this.shadowRoot.getElementById("confirm-booking");
  }

  static get observedAttributes() {
    return ["showtime-id"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "showtime-id") {
      this.showtimeId = newVal;
    }
  }

  connectedCallback() {
    // Oir sibling elementiig getRootNode() ashiglan gadaad Node-s oloh (light DOM)
    this.seatSelector = this.getRootNode().querySelector("seat-selector");

    if (this.seatSelector) {
        // Listen for seat updates from seat-selector
        this.seatSelector.addEventListener("seats-updated", (e) => this.handleSeatsUpdated(e.detail));
        // Set initial allowed seats on seat-selector
        this.seatSelector.setAttribute("allowed-seats", this.ticketQuantity.toString());
    } else {
        console.error("OrderSteps: seat-selector олдсонгүй.");
    }

    this.decrementButton.addEventListener("click", () => this.updateTicketQuantity(-1));
    this.incrementButton.addEventListener("click", () => this.updateTicketQuantity(1));
    this.confirmButton.addEventListener("click", () => this.handleConfirmBooking());

    this.render();
  }

  updateTicketQuantity(change) {
    const newQuantity = this.ticketQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) { //Нэг удаадаа 10 хүртэлх тасалбар захиалах
      this.ticketQuantity = newQuantity;
      this.numTicketsInput.value = this.ticketQuantity;
      if (this.seatSelector) {
        this.seatSelector.setAttribute("allowed-seats", this.ticketQuantity.toString());
      }
      // If current selected seats exceed new quantity, seat-selector's _enforceSeatLimit will handle it
      // and fire a new 'seats-updated' event.
    }
  }

  handleSeatsUpdated(detail) {
    this.selectedSeats = detail.selectedSeats || [];
    this.showtimeId = detail.showtimeId;
    this.movieTitle = detail.movieTitle || "Кино";
    
    // Format showtime details for display
    const date = new Date(detail.day);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    this.showtimeDetailsText = `${formattedDate}, ${detail.hour} - ${detail.branchId} салбар, Танхим ${detail.hallId}`;

    this.render();
  }

  calculateTotalPrice() {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }

  render() {
    this.movieTitleDisplay.textContent = this.movieTitle;
    this.showtimeDetailsDisplay.textContent = this.showtimeDetailsText;
    this.numTicketsInput.value = this.ticketQuantity;

    if (this.selectedSeats.length > 0) {
      this.selectedSeatsList.innerHTML = this.selectedSeats
        .map(
          (seat) =>
            `<li>Эгнээ ${seat.row}, Суудал ${seat.column} (${seat.label} - ${seat.price}₮)</li>`
        )
        .join("");
      this.confirmButton.disabled = false;
    } else {
      this.selectedSeatsList.innerHTML = "<li>Суудал сонгоогүй байна.</li>";
      this.confirmButton.disabled = true;
    }

    const totalPrice = this.calculateTotalPrice();
    this.totalPriceValue.textContent = totalPrice.toLocaleString();
  }

  handleConfirmBooking() {
    if (this.selectedSeats.length === 0) {
      alert("Та эхлээд суудлаа сонгоно уу!");
      return;
    }
    // Here you would proceed with the booking
    console.log("Booking Confirmed (Placeholder):");
    console.log("Showtime ID:", this.showtimeId);
    console.log("Movie:", this.movieTitle);
    console.log("Showtime:", this.showtimeDetailsText);
    console.log("Selected Seats:", this.selectedSeats);
    console.log("Total Price:", this.calculateTotalPrice());
    alert("Захиалга баталгаажлаа (түр)! Дэлгэрэнгүйг консол дээр харна уу.");
    // Potentially navigate to a confirmation page or show a modal
  }

  disconnectedCallback() {
    // Clean up event listeners if seatSelector might be removed/re-added, though less common here
    if (this.seatSelector) {
        this.seatSelector.removeEventListener("seats-updated", this.handleSeatsUpdated);
    }
  }
}

customElements.define("order-steps", OrderSteps);

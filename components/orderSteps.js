import { fetchBranches, fetchOccupiedSeats } from "./fetch.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      --primary-bg: #fff;
      --primary-text-color: #272727;
      --secondary-text-on-custom-bg: #fff; /* For text on specific backgrounds like .please-choose-seat */
      --accent-text-color: black; /* For various buttons/text that are currently black */

      --border-color-default: #d6d6d6; /* Light border, e.g. ticket quantity buttons */
      --border-color-medium: #bebebe; /* Medium border, e.g. auto-button general */
      --border-color-strong: black; /* Strong border, e.g. seat-category-item default, auto-button.regular */

      --disabled-opacity: 0.5; /* General disabled opacity */
      --disabled-border-color: #d6d6d6; /* confirm-button:disabled border */

      --list-divider-color: hsla(
        0,
        0%,
        46%,
        0.1
      ); /* #selected-seats-list border */

      --modal-overlay-bg: rgba(0, 0, 0, 0.5);
      --modal-content-bg: white;

      --legend-arrow-stroke-color: #bbb;
      --legend-item-hover-bg: #f0f0f0;

      --info-box-bg: #757575; /* .please-choose-seat background and .triangle-up border */
      --button-hover-text-shadow-color: #fff;

      /* Brand button hover effects */
      --brand-button-hover-box-shadow: 0 0 50px 0 rgba(247, 149, 30, 0.35), inset 0 0 20px 0 rgba(247, 149, 30, 0.3);
      --brand-button-hover-text-shadow: 0 0 3px var(--button-hover-text-shadow-color);

      /* Seat icon paths - Light Mode */
      --icon-regular: url("./pics/seat-icons/regular_seat_icon.svg");
      --icon-saver: url("./pics/seat-icons/saver_seat_icon.svg");
      --icon-super-saver: url("./pics/seat-icons/super_saver_seat_icon.svg");
      --icon-vip: url("./pics/seat-icons/vip_seat_icon.svg");
      --icon-selected-regular: url("./pics/seat-icons/selected_regular_seat_icon.svg");
      --icon-selected-saver: url("./pics/seat-icons/selected_saver_seat_icon.svg");
      --icon-selected-super-saver: url("./pics/seat-icons/selected_super_saver_seat_icon.svg");
      --icon-selected-vip: url("./pics/seat-icons/selected_vip_seat_icon.svg");
      --icon-empty: url("./pics/seat-icons/empty_seat_icon.svg");
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --primary-bg: #1e1e1e;
        --primary-text-color: #e0e0e0;
        --accent-text-color: #e0e0e0;

        --border-color-default: #c8c8c8;
        --border-color-medium: #444;
        --border-color-strong: #ccc;

        --disabled-border-color: #444;
        --list-divider-color: hsla(0, 0%, 70%, 0.15);

        --modal-overlay-bg: rgba(0, 0, 0, 0.7);
        --modal-content-bg: #2c2c2c;

        --legend-arrow-stroke-color: #777;
        --legend-item-hover-bg: #3a3a3a;

        --info-box-bg: #4a4a4a;
        --button-hover-text-shadow-color: #000;

        /* Brand button hover effects - Dark Mode */
        --brand-button-hover-box-shadow: 0 0 50px 0 rgba(247, 149, 30, 0.55), inset 0 0 20px 0 rgba(247, 149, 30, 0.45);
        --brand-button-hover-text-shadow: 0 0 4px rgba(255, 220, 180, 0.75);

        /* Seat icon paths - Dark Mode */
        --icon-regular: url("./pics/seat-icons-dark/regular_seat_icon.svg");
        --icon-saver: url("./pics/seat-icons-dark/saver_seat_icon.svg");
        --icon-super-saver: url("./pics/seat-icons-dark/super_saver_seat_icon.svg");
        --icon-vip: url("./pics/seat-icons-dark/vip_seat_icon.svg");
        --icon-selected-regular: url("./pics/seat-icons-dark/selected_regular_seat_icon.svg");
        --icon-selected-saver: url("./pics/seat-icons-dark/selected_saver_seat_icon.svg");
        --icon-selected-super-saver: url("./pics/seat-icons-dark/selected_super_saver_seat_icon.svg");
        --icon-selected-vip: url("./pics/seat-icons-dark/selected_vip_seat_icon.svg");
        --icon-empty: url("./pics/seat-icons-dark/empty_seat_icon.svg");
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :host {
      display: block;
      padding: 1rem;
      background: var(--primary-bg);
      color: var(--primary-text-color);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .container {
      height: 100%;
      padding: 4rem;
    }
    .order-summary-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    h3 {
      margin-top: 0;
      font-size: 1.2em;
      color: #ffa500; /* Orange to match theme - unchanged */
    }
    p {
      font-size: 0.9em;
      margin-bottom: 10px;
    }

    .ticket-quantity {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .button-group {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      & button {
        touch-action: manipulation;
      }
    }
    .label {
      background-image: linear-gradient(
        90deg,
        #dc6a1a,
        #eec42a
      ); /* Unchanged brand color */
      color: transparent;
      background-clip: text;
      font-weight: 350;
      letter-spacing: 0.035em;
      font-size: 1.5rem;
      text-align: left;
    }
    #num-tickets {
      font-size: 1.15rem;
      font-weight: bold;
    }
    .ticket-quantity button {
      padding: 5px 10px;
      background-color: transparent;
      color: var(--accent-text-color);
      border: 1px solid var(--border-color-default);
      border-radius: 50%;
      cursor: pointer;
      width: 39px;
      height: 39px;
    }
    .ticket-quantity button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .confirm-button {
      border-width: 2.3px;
      border-style: solid;

      background: none;
      border-image-source: linear-gradient(
        to right,
        #b74d1c 0%,
        #f7941e 48%,
        #eec42a 100%
      ); /* Unchanged brand color */

      border-image-slice: 1;

      width: 100%;
      margin-top: 1rem;
      padding: 1rem 2rem;
      color: var(--accent-text-color);
      text-transform: uppercase;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      transition: all 0.27s ease;
    }
    .confirm-button:hover {
      box-shadow: var(--brand-button-hover-box-shadow);
      text-shadow: var(--brand-button-hover-text-shadow);
    }
    #confirmation {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .total-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      margin-top: 0.3rem;
    }
    .sub-tickets {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      opacity: 0.6;
    }
    .sub-service-charge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      opacity: 0.6;
    }
    .sub-vat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      opacity: 0.6;
    }
    .confirm-button:disabled {
      opacity: var(--disabled-opacity);
      border-width: 2.3px; /* Ensure border width consistency */
      border-style: solid; /* Ensure border style consistency */
      border-image-source: none; /* Remove gradient border for disabled state */
      border-color: var(
        --disabled-border-color
      ); /* Use variable for disabled border */
      cursor: not-allowed;
      &:hover {
        box-shadow: none;
        text-shadow: none;
      }
    }
    .initial-question h2 {
      background-image: linear-gradient(
        90deg,
        #dc6a1a,
        #eec42a
      ); /* Unchanged brand color */
      color: transparent;
      background-clip: text;
      font-weight: 350;
      letter-spacing: 0.04em;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }
    //seat-category-container
    p {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .seat-category-container {
      display: flex;
      flex-direction: column;
    }
    .button-item {
      display: flex;
      gap: 10px;
      width: 100%;
      border: 1px solid var(--border-color-strong);
      border-left-width: 5.6px;
      border-left-style: solid;
      border-left-color: var(--border-color-strong);
      border-radius: 5px;
      background-color: transparent;
      font-family: Roboto Condensed, sans-serif;
      cursor: pointer;
      padding: 12px;
      margin-bottom: 1rem;
      color: var(--primary-text-color); /* Use primary text color */
    }
    .legend-heading {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      & .legend-seat-name {
        text-align: left;
        font-size: 1rem;
      }
      & .legend-price {
        font-size: 1rem;
        font-weight: bold;
      }
    }
    .legend-caption {
      font-size: 0.75rem;
      font-weight: 300;
      margin-top: 0.2rem;
      text-align: left;
    }
    .legend-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
    }
    .legend-arrow path {
      stroke: var(--legend-arrow-stroke-color);
    }
    .legend-icon.vip {
    }
    .seat-category-container .regular {
      border-left-color: var(
        --border-color-strong
      ); /* Explicitly use variable */
      & .legend-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: var(--icon-regular);
      }
    }
    .seat-category-container .saver {
      border-color: #41d282; /* Unchanged type color */
      border-left-color: #41d282; /* Unchanged type color */
      & .legend-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: var(--icon-saver);
      }
    }
    .seat-category-container .super-saver {
      border-color: #c81919; /* Unchanged type color */
      border-left-color: #c81919; /* Unchanged type color */
      & .legend-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: var(--icon-super-saver);
      }
    }
    .seat-category-container .vip {
      border-left-color: var(
        --border-color-strong
      ); /* Explicitly use variable */
      & .legend-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: var(--icon-vip);
      }
    }

    #selected-seats-list {
      margin: 1rem 0;
      padding: 1rem 0;
      gap: 10px;
      border-top: 1px solid var(--list-divider-color);
      border-bottom: 1px solid var(--list-divider-color);
    }
    .selected-seats-table {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .auto-button-container {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }
    .auto-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      background: none;
      color: var(--accent-text-color);
      padding: 0.5rem 0.8rem;
      border: 1px solid var(--border-color-medium);
      border-radius: 2px 0 0 2px;
      cursor: pointer;
      font-size: 0.8rem;
      touch-action: manipulation;
    }
    .auto-button.regular,
    .auto-type.regular {
      border-color: var(--border-color-strong);
    }
    .auto-button.saver,
    .auto-type.saver {
      border-color: #6fce89; /* Unchanged type color */
    }
    .auto-button.super-saver,
    .auto-type.super-saver {
      border-color: #b34c37; /* Unchanged type color */
    }
    .auto-button.vip,
    .auto-type.vip {
      border-color: #f5a623; /* Unchanged brand color */
    }
    .auto-type {
      display: flex;
      justify-content: center;
      align-items: center;
      background: none;
      color: var(--accent-text-color);
      border: 1px solid var(--border-color-medium);
      border-radius: 0 2px 2px 0;
      border-left: none;
      padding: 0 0.2rem;
      cursor: pointer;
      font-size: 0.8rem;
      touch-action: manipulation;
      padding: 0.2rem 0.3rem;
      & img {
        width: 20px;
      }
    }
    .selected-price-table {
      margin-top: 1.2rem;
    }
    .selected-price-table div {
      display: flex;
      justify-content: space-between;
    }
    .selected-item {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .selected-icon {
      width: 30px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
    }
    .selected-text {
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
    }
    .selected-row-span {
      opacity: 0.5;
    }
    .selected-icon.vip {
      background-image: var(--icon-selected-vip);
    }
    .selected-icon.regular {
      background-image: var(--icon-selected-regular);
    }
    .selected-icon.saver {
      background-image: var(--icon-selected-saver);
    }
    .selected-icon.super-saver {
      background-image: var(--icon-selected-super-saver);
    }
    .selected-icon.empty {
      background-image: var(--icon-empty);
    }
    .please-choose-seat {
      position: relative;
      width: 100%;
      & .text {
        display: inline-block;
        background-color: var(--info-box-bg);
        color: var(--secondary-text-on-custom-bg);
        width: 100%;
        padding: 0.2rem 1.5rem;
        text-align: center;
      }
    }
    .triangle-up {
      position: relative;
      bottom: -18px;
      right: 23px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 6px solid var(--info-box-bg);
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--modal-overlay-bg);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .modal.show {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-content {
      max-width: 300px;
      background: var(--modal-content-bg);
      padding: 2rem;
      border: 3px rgb(228, 155, 15) solid;
      border-left: 7px rgb(228, 155, 15) dashed;
      border-radius: 4px;
      transform: scale(0.95);
      transition: transform 0.3s ease;
    }

    .hidden {
      display: none;
    }

    .modal.show .modal-content {
      transform: scale(1);
    }
    .close-text {
      cursor: pointer;
      color: var(--accent-text-color);
      font-weight: 400;
      text-align: center;
      text-transform: uppercase;
      font-size: 0.9rem;

      width: max-content;
      border-width: 2.4px;
      border-style: solid;
      background: none;
      border-image-source: linear-gradient(
        to right,
        #b74d1c 0%,
        #f7941e 48%,
        #eec42a 100%
      ); /* Unchanged brand color */
      border-image-slice: 1;
      margin: 1.5rem auto 0;
      padding: 0.7rem 2.6rem;
      text-transform: uppercase;
      border-radius: 4px;
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      transition: all 0.27s ease;
      &:hover {
        box-shadow: var(--brand-button-hover-box-shadow);
        text-shadow: var(--brand-button-hover-text-shadow);
      }
    }
    .close {
      position: absolute;
      top: 8px;
      right: 12px;
      cursor: pointer;
      font-size: 1.5rem;
      color: var(--primary-text-color); /* Use primary text for close icon */
    }
    .modal-content h2 {
      background-image: linear-gradient(
        90deg,
        #dc6a1a,
        #eec42a
      ); /* Unchanged brand color */
      color: transparent;
      background-clip: text;
      font-weight: 350;
      letter-spacing: 0.04em;
      margin-bottom: 1rem;
      text-transform: uppercase;
      font-weight: 350;
      text-align: center;
    }
    .modal-content .seat-categories {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      width: max-content;
      margin: 0 auto;
    }
    .modal-content .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font-weight: 300;
      padding: 0.35rem;
      color: var(--primary-text-color); /* Use primary text color */
      &:hover {
        background-color: var(--legend-item-hover-bg);
      }
      & .legend-icon {
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
      & .legend-icon.vip {
        background-image: var(--icon-vip);
      }
      & .legend-icon.regular {
        background-image: var(--icon-regular);
      }
      & .legend-icon.saver {
        background-image: var(--icon-saver);
      }
      & .legend-icon.super-saver {
        background-image: var(--icon-super-saver);
      }
    }
    .modal-content .legend-item.active {
      background-color: var(
        --legend-item-hover-bg
      ); /* Use hover bg for active */
    }
    @media (max-width: 1250px) {
      .container {
        padding: 2rem;
      }
      .order-summary-container {
        margin: 0 1rem;
      }
    }
    @media (max-width: 1028px) {
      .container {
        padding: 1rem;
      }
      .initial-question h2,
      .label {
        font-size: 1.3rem;
      }
      .selected-icon {
        width: 25px;
        height: 25px;
      }
      .triangle-up {
        right: 21px;
      }
      #confirmation {
        position: static;
      }
    }
    @media (max-width: 650px) {
      .initial-question h2,
      .label {
        font-size: 1.2rem;
      }
    }
  </style>
  <div class="initial-question">
    <h2>СУУДЛЫН ТӨРЛӨӨ СОНГОНО УУ</h2>
    <section class="type-picker-container">
      <div class="seat-category-container"></div>
    </section>
  </div>
  <div class="order-summary-container">
    <div>
      <div class="ticket-quantity">
        <div class="label">СУУДЛЫН ТОО</div>
        <div class="button-group">
          <button id="decrement-tickets" aria-label="Decrease ticket count">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="12px"
              height="28.489px"
              fill="var(--primary-text-color)"
              viewBox="0 0 122.875 28.489"
              enable-background="new 0 0 122.875 28.489"
              xml:space="preserve"
            >
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M108.993,0c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.682-6.26,13.958-13.942,14.018c-31.683,0.222-63.368,0.444-95.051,0.666C6.2,28.549-0.016,22.369,0,14.685 C0.018,7.002,6.261,0.726,13.943,0.667C45.626,0.445,77.311,0.223,108.993,0L108.993,0z"
                />
              </g>
            </svg>
          </button>
          <span id="num-tickets"></span>
          <button id="increment-tickets" aria-label="Increase ticket count">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="12px"
              height="28.489px"
              fill="var(--primary-text-color)"
              viewBox="0 0 122.875 122.648"
              enable-background="new 0 0 122.875 122.648"
              xml:space="preserve"
            >
              <g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M108.993,47.079c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.683-6.26,13.959-13.942,14.019L75.24,75.138l-0.235,33.73c-0.063,7.619-6.338,13.789-14.014,13.78 c-7.678-0.01-13.848-6.197-13.785-13.818l0.233-33.497l-33.558,0.235C6.2,75.628-0.016,69.448,0,61.764 c0.018-7.683,6.261-13.959,13.943-14.018l33.692-0.236l0.236-33.73C47.935,6.161,54.209-0.009,61.885,0 c7.678,0.009,13.848,6.197,13.784,13.818l-0.233,33.497L108.993,47.079L108.993,47.079z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>

      <div id="selected-seats-list">
        <div class="selected-seats-table"></div>
        <div class="auto-button-container">
          <button class="auto-button">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12.5"
              viewBox="0 0 122.61 122.88"
              fill="var(--accent-text-color)"
            >
              <title>update</title>
              <path
                d="M111.9,61.57a5.36,5.36,0,0,1,10.71,0A61.3,61.3,0,0,1,17.54,104.48v12.35a5.36,5.36,0,0,1-10.72,0V89.31A5.36,5.36,0,0,1,12.18,84H40a5.36,5.36,0,1,1,0,10.71H23a50.6,50.6,0,0,0,88.87-33.1ZM106.6,5.36a5.36,5.36,0,1,1,10.71,0V33.14A5.36,5.36,0,0,1,112,38.49H84.44a5.36,5.36,0,1,1,0-10.71H99A50.6,50.6,0,0,0,10.71,61.57,5.36,5.36,0,1,1,0,61.57,61.31,61.31,0,0,1,91.07,8,61.83,61.83,0,0,1,106.6,20.27V5.36Z"
              />
            </svg>
            Автомат сонгогч
          </button>
          <button class="auto-type">
            <img />
          </button>
        </div>
        <div class="selected-price-table"></div>
      </div>
    </div>
    <div id="confirmation">
      <div class="sub-prices">
        <div class="sub-tickets">
          <span>Тасалбар</span>
          <span id="sub-tickets-value">0₮</span>
        </div>
        <div class="sub-service-charge">
          <span>Үйлчилгээний хөлс (2%)</span>
          <span id="sub-service-charge-value">0₮</span>
        </div>
        <div class="sub-vat">
          <span>НӨАТ</span>
          <span id="sub-vat-value">0₮</span>
        </div>
      </div>
      <div class="total-price">
        <span>Төлөх дүн:</span><span id="total-price-value">0₮</span>
      </div>
      <button id="confirm-booking" class="confirm-button" disabled>
        Захиалга баталгаажуулах
      </button>
    </div>

    <div id="modal" class="modal hidden">
      <div class="modal-content">
        <span id="close-modal" class="close hidden">&times;</span>
        <h2>Суудлын төрлөө сонгоно уу</h2>
        <div class="seat-categories"></div>
        <div id="close-modal-text" class="close-text">Буцах</div>
      </div>
    </div>
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
    this.orderSummaryContainer = this.container.querySelector(
      ".order-summary-container"
    );
    this.initialQuestionContainer =
      this.container.querySelector(".initial-question");

    this.selectedSeats = [];
    this.showtimeId = null;
    this.movieTitle = "Кино";
    this.moviePoster = null;
    this.seatTypes = [];
    this.showtimeDetailsText = "N/A";
    this.ticketQuantity = 1;
    this.initialSeatPickerRendered = false;

    this.movieTitleDisplay = this.shadowRoot.getElementById(
      "movie-title-display"
    );
    this.showtimeDetailsDisplay =
      this.shadowRoot.getElementById("showtime-details");
    this.numTicketsInput = this.shadowRoot.getElementById("num-tickets");
    this.decrementButton = this.shadowRoot.getElementById("decrement-tickets");
    this.incrementButton = this.shadowRoot.getElementById("increment-tickets");
    this.selectedSeatsTable = this.shadowRoot.querySelector(
      ".selected-seats-table"
    );
    this.selectedPriceTable = this.shadowRoot.querySelector(
      ".selected-price-table"
    );
    this.totalPriceValue = this.shadowRoot.getElementById("total-price-value");
    this.vatPriceValue = this.shadowRoot.getElementById("sub-vat-value");
    this.ticketsPriceValue =
      this.shadowRoot.getElementById("sub-tickets-value");
    this.serviceChargeValue = this.shadowRoot.getElementById(
      "sub-service-charge-value"
    );
    this.confirmButton = this.shadowRoot.getElementById("confirm-booking");

    this.autoButton = this.shadowRoot.querySelector(".auto-button");
    this.autoTypeBtn = this.shadowRoot.querySelector(".auto-type");
    this.autoType = null;
    this.autoTypeImg = this.shadowRoot.querySelector(".auto-type img");

    this.modal = this.shadowRoot.getElementById("modal");
    this.closeModalBtn = this.shadowRoot.getElementById("close-modal");
    this.closeModalText = this.shadowRoot.getElementById("close-modal-text");
  }

  static get observedAttributes() {
    return ["showtime-id", "movie-poster"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "showtime-id") {
      this.showtimeId = newVal;
    }
    if (attr === "movie-poster") {
      this.moviePoster = newVal;
    }
  }

  connectedCallback() {
    this.seatSelector = this.getRootNode().querySelector("seat-selector");

    if (this.seatSelector) {
      this.seatSelector.addEventListener("seats-updated", (e) =>
        this.handleSeatsUpdated(e.detail)
      );
      this.seatSelector.setAttribute(
        "allowed-seats",
        this.ticketQuantity.toString()
      );
    } else {
      console.error("OrderSteps: seat-selector олдсонгүй.");
    }

    this.orderSummaryContainer.style.display = "none";

    this.decrementButton.addEventListener("click", () =>
      this.updateTicketQuantity(-1)
    );
    this.incrementButton.addEventListener("click", () =>
      this.updateTicketQuantity(1)
    );
    this.confirmButton.addEventListener("click", () =>
      this.handleConfirmBooking()
    );

    this.autoButton.addEventListener("click", () => {
      if (this.autoType === null) {
        this.openModal();
        return;
      }
      this.seatAutoPicker(this.ticketQuantity, this.autoType);
      this.updateTicketQuantity(0);
    });
    this.autoTypeBtn.addEventListener("click", () => {
      this.openModal();
    });
    this.closeModalBtn.addEventListener("click", () => {
      this.hideModal();
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

  openModal() {
    this.modal.classList.remove("hidden");
    setTimeout(() => {
      this.modal.classList.add("show");
    }, 100);
    this.renderModalSeatPicker();
  }
  hideModal() {
    this.modal.classList.remove("show");
    setTimeout(() => {
      this.modal.classList.add("hidden");
    }, 300);
  }

  renderInitialSeatPicker() {
    this.initialQuestionContainer.style.display = "block";

    const container = this.container.querySelector(".seat-category-container");
    container.innerHTML = "";
    this.seatTypes.forEach((type) => {
      const formattedPrice = type.price.toLocaleString();

      const btn = document.createElement("button");
      btn.classList.add("button-item", type.type);
      btn.innerHTML = `
        <div class="legend-icon"></div>
        <div class="legend-wrapper">
          <div class="legend-text">
            <span class="legend-heading"
              ><span class="legend-seat-name">${type.label} суудал</span
              ><span class="legend-price">${formattedPrice}₮</span></span
            >
            <p class="legend-caption">${type.caption}</p>
          </div>
          <div class="legend-arrow">
            <svg width="30px" height="30px" viewBox="-286 411.9 18 18">
              <path
                fill="none"
                stroke="#bbb"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width=".8"
                d="M-277.5 417l3 3.9-3 3.9"
              ></path>
            </svg>
          </div>
        </div>
      `;
      container.appendChild(btn);
      btn.addEventListener("click", () => {
        // this.autoType = type.type;
        // if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        //   this.autoTypeImg.src = `./pics/seat-icons/${type.type}_seat_icon.svg`;
        // } else {
        //   this.autoTypeImg.src = `./pics/seat-icons-dark/${type.type}_seat_icon.svg`;
        // }
        // this.autoButton.classList.add(type.type);
        // this.autoTypeBtn.classList.add(type.type);
        this.seatAutoPicker(2, type.type);
        this.updateTicketQuantity(0);
      });
    });
    this.initialSeatPickerRendered = true;
  }

  renderModalSeatPicker() {
    const container = this.modal.querySelector(".seat-categories");
    container.innerHTML = "";
    this.seatTypes.forEach((type) => {
      const span = document.createElement("span");
      span.classList.add("legend-item");
      if (this.autoType === type.type) {
        span.classList.add("active");
      }
      span.innerHTML = `
        <span class="legend-icon ${type.type}"></span>
        <span class="legend-seat-name">${type.label} суудал</span>
      `;
      span.addEventListener("click", () => {
        this.autoType = type.type;
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          this.autoTypeImg.src = `./pics/seat-icons/${type.type}_seat_icon.svg`;
        } else {
          this.autoTypeImg.src = `./pics/seat-icons-dark/${type.type}_seat_icon.svg`;
        }
        this.autoButton.classList.remove(
          "regular",
          "saver",
          "super-saver",
          "vip"
        );
        this.autoButton.classList.add(type.type);
        this.autoTypeBtn.classList.remove(
          "regular",
          "saver",
          "super-saver",
          "vip"
        );
        this.autoTypeBtn.classList.add(type.type);
        this.seatAutoPicker(this.ticketQuantity, this.autoType);
        this.updateTicketQuantity(0);
        this.hideModal();
      });
      container.appendChild(span);
    });
  }

  seatAutoPicker(count, type) {
    const seatSelector = this.getRootNode().querySelector("seat-selector");
    if (seatSelector) {
      this.ticketQuantity = count;
      seatSelector.setAttribute("allowed-seats", count.toString());
      seatSelector.setAttribute("auto-picker", `${count},${type}`);
    } else {
      console.error("OrderSteps: seat-selector олдсонгүй.");
    }
  }

  renderOrderSummary() {
    this.initialQuestionContainer.style.display = "none";
    this.orderSummaryContainer.style.display = "flex";
    this.numTicketsInput.textContent = this.ticketQuantity;

    if (this.selectedSeats.length > 0) {
      this.selectedSeatsTable.innerHTML = this.selectedSeats
        .map(
          (seat) =>
            `<span class="selected-item">
          <span class="selected-icon ${seat.type}"></span>
          <span class="selected-text">
            <span class="selected-row-span">Эгнээ ${seat.row}</span> <span class="selected-seat-span">Суудал ${seat.column}</span>
          </span>
        </span> 
        `
        )
        .join("");
      if (this.selectedSeats.length < this.ticketQuantity) {
        let diff = this.ticketQuantity - this.selectedSeats.length;
        while (diff > 1) {
          diff--;
          this.selectedSeatsTable.innerHTML += `<span class="selected-item">
            <span
              class="selected-icon empty"
              style="position: relative;"
            ></span>
          </span>`;
        }
        this.selectedSeatsTable.innerHTML += `<span class="selected-item">
          <span class="selected-icon empty" style="position: relative;"></span>
          <div class="triangle-up"></div>
        </span>`;
        this.selectedSeatsTable.innerHTML += `
          <div class="please-choose-seat">
            <span class="text">Суудлаа сонгохын тулд зураг дээр дарна уу</span>
          </div>
        `;
      }
      const seatsOfTypeCount = this.selectedSeats.reduce((acc, seat) => {
        if (!acc[seat.label]) {
          acc[seat.label] = { price: seat.price, count: 0 };
        }
        acc[seat.label].count += 1;
        return acc;
      }, {});

      this.selectedPriceTable.innerHTML = Object.entries(seatsOfTypeCount)
        .map(
          ([label, { price, count }]) =>
            `<div>
             <span>${count} x ${label}</span>
             <span>₮${((count * price) / 1000).toFixed(1)}K</span>
            </div>`
        )
        .join("");
      this.confirmButton.disabled = false;
    } else {
      this.selectedSeatsTable.innerHTML = "";
      let diff = this.ticketQuantity - this.selectedSeats.length;
      while (diff > 1) {
        diff--;
        this.selectedSeatsTable.innerHTML += `<span class="selected-item">
            <span
              class="selected-icon empty"
              style="position: relative;"
            ></span>
          </span>`;
      }
      this.selectedSeatsTable.innerHTML += `<span class="selected-item">
          <span class="selected-icon empty" style="position: relative;"></span>
          <div class="triangle-up"></div>
        </span>`;
      this.selectedSeatsTable.innerHTML += `
          <div class="please-choose-seat">
            <span class="text">Суудлаа сонгохын тулд зураг дээр дарна уу</span>
          </div>
        `;
      this.selectedPriceTable.innerHTML = "";
      this.confirmButton.disabled = true;
    }

    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      this.autoTypeImg.src = `./pics/seat-icons/${this.autoType}_seat_icon.svg`;
    } else {
      this.autoTypeImg.src = `./pics/seat-icons-dark/${this.autoType}_seat_icon.svg`;
    }

    const totalTicketsPrice = this.calculateTicketsPrice();
    const totalVatPrice = this.calculateVatPrice();
    const totalPrice = this.calculateTotalPrice();
    this.ticketsPriceValue.textContent =
      totalTicketsPrice.toLocaleString() + "₮";
    this.serviceChargeValue.textContent =
      this.calculateServiceChargePrice().toLocaleString() + "₮";
    this.vatPriceValue.textContent = totalVatPrice.toLocaleString() + "₮";
    this.totalPriceValue.textContent = totalPrice.toLocaleString() + "₮";
  }

  updateTicketQuantity(change) {
    const newQuantity = this.ticketQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.ticketQuantity = newQuantity;
      this.numTicketsInput.textContent = this.ticketQuantity;
      if (this.seatSelector) {
        this.seatSelector.setAttribute(
          "allowed-seats",
          this.ticketQuantity.toString()
        );
      }
      if (this.ticketQuantity == 1) {
        this.decrementButton.disabled = true;
      } else if (this.ticketQuantity == 10) {
        this.incrementButton.disabled = true;
      } else {
        this.decrementButton.disabled = false;
        this.incrementButton.disabled = false;
      }
    }
    if (this.selectedSeats.length <= this.ticketQuantity) {
      this.renderOrderSummary();
    }
  }

  handleSeatsUpdated(detail) {
    this.selectedSeats = detail.selectedSeats || [];
    this.showtimeId = detail.showtimeId;
    this.movieTitle = detail.movieTitle || "Кино";
    this.moviePoster = detail.moviePoster || null;
    this.seatTypes = detail.seatTypes || null;

    if (Array.isArray(detail.seatTypes) && detail.seatTypes.length > 1) {
      this.seatTypes = detail.seatTypes;
      if (this.initialSeatPickerRendered === false) {
        this.renderInitialSeatPicker();
      } else {
        this.updateTicketQuantity(0);
      }
    } else {
      this.updateTicketQuantity(0);
    }
  }

  calculateTicketsPrice() {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }
  calculateServiceChargePrice(percent = 2) {
    return this.calculateTicketsPrice() * (percent / 100);
  }
  calculateVatPrice() {
    return (
      (this.calculateTicketsPrice() + this.calculateServiceChargePrice()) * 0.1
    );
  }
  calculateTotalPrice() {
    return this.calculateTicketsPrice() + this.calculateServiceChargePrice();
  }

  handleConfirmBooking() {
    if (this.selectedSeats.length === 0) {
      alert("Та эхлээд суудлаа сонгоно уу!");
      return;
    }

    console.log("Захиалга баталгаажлаа:");
    console.log("Showtime ID:", this.showtimeId);
    console.log("Movie:", this.movieTitle);
    console.log("Showtime:", this.showtimeDetailsText);
    console.log("Selected Seats:", this.selectedSeats);
    console.log("Tickets Price:", this.calculateTicketsPrice());
    console.log("Service Charge:", this.calculateServiceChargePrice());
    console.log("VAT:", this.calculateVatPrice());
    console.log("Total Price:", this.calculateTotalPrice());
    alert("Захиалга баталгаажлаа! (Дэлгэрэнгүйг console дээр харах)");
  }

  disconnectedCallback() {
    if (this.seatSelector) {
      this.seatSelector.removeEventListener(
        "seats-updated",
        this.handleSeatsUpdated
      );
    }
  }
}

customElements.define("order-steps", OrderSteps);

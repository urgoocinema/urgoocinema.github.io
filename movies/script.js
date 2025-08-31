document.addEventListener('DOMContentLoaded', () => {

  const movieInfoSection = document.getElementById("movie-info-section");
  const screensAvailableSection = document.getElementById("screensAvailable");
  const seatSelectionSection = document.getElementById("seatSelectionWrapper-section");
  const paymentInfoSection = document.getElementById("payment-info-Wrapper-section");
  const paymentMethodSection = document.getElementById("payment-method-wrapper-section");
  const ticketsection = document.getElementById("ticketshow");

  const theatherSelect = document.getElementById("theather");
  const screenElements = movieInfoSection ? movieInfoSection.getElementsByClassName("screen") : [];
  const confirmSeatButton = document.getElementById("proceed-to-info-input");
  const paymentInfoForm = paymentInfoSection ? paymentInfoSection.querySelector('form') : null;
  const paymentMethodDiv = document.getElementById
  if (theatherSelect && screensAvailableSection) {
    theatherSelect.addEventListener('change', () => {
      screensAvailableSection.classList.remove("awaiting-input");
      screensAvailableSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (screenElements && screenElements.length > 0 && seatSelectionSection) {
    Array.from(screenElements).forEach(screen => {
      screen.addEventListener('click', () => {
        seatSelectionSection.classList.remove("awaiting-input");
        seatSelectionSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  } else {
    console.warn("Screen elements or seat selection section not found. Scrolling from screen selection will not work.");
  }



  if (confirmSeatButton && paymentInfoSection) {
    confirmSeatButton.addEventListener('click', () => {
      paymentInfoSection.classList.remove("awaiting-input");
      paymentInfoSection.scrollIntoView({ behavior: "smooth" });
    });
  } else {
    console.warn("Seat confirmation button or payment info section not found. Scrolling from seat selection will not work.");
  }


  if (paymentInfoForm && paymentMethodSection) {
    paymentInfoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      paymentMethodSection.classList.remove("awaiting-input");
      paymentMethodSection.scrollIntoView({ behavior: "smooth" });
    });
  } else {
    console.warn("Payment info form or payment method section not found. Scrolling from info input will not work.");
  }

  const quickbookSearchButton = document.querySelector('.quickbook button[type="submit"]');
  if (quickbookSearchButton && movieInfoSection) {
    quickbookSearchButton.addEventListener('click', (event) => {
      event.preventDefault();
      movieInfoSection.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    console.warn("Quickbook search button or movie info section not found.");
  }

});
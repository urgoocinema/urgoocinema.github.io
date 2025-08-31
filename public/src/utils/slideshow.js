let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
export function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
export function currentSlide(n) {
  showSlides(slideIndex = n);
}

export default function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

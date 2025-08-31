// seat layout
const seatWrapper = document.querySelector(".seatWrapper");
const layout = [
  [5, 5, 5, 5],
  [2, 2, 2, 2],
  [5, 5, 5, 5],
  [2, 2, 2, 2],
  [5, 5, 5, 5]
];

let seatHTML = "";
let max = 0;

layout.forEach((row) => {
  if (row.length > max) {
    max = row.length;
  }
  seatHTML += '<div class = "aisle">';
  for (let i = 0; i < row.length; i++) {
    seatHTML += '<div class = "row">';
    for (let j = 0; j < row[i]; j++) {
      seatHTML += '<div class = "seat"></div>';
    }
    seatHTML += "</div>";
  }
  seatHTML += "</div>";
});
let indexHTML = '<div class = "aisle">';
for (let i = 1; i <= max; i++) {
  indexHTML += ('<div class="seat index">' + i + '</div>');
}

indexHTML += '</div>';//seat indexes
seatWrapper.innerHTML += (indexHTML + seatHTML + indexHTML);
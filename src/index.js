document.addEventListener("DOMContentLoaded", () => {
  let form = document.querySelector("form");
  form.addEventListener("submit", newHog);
  getHogs();

});

let allHogs;

function getHogs() {
  fetch('http://localhost:3000/hogs')
  .then(res => res.json())
  .then(json => {
    allHogs = json;
    displayHogs(json);
  })
}

function displayHogs(hogs) {
  let container = document.getElementById('hog-container');
  container.innerHTML = '';
  hogs.forEach(hog => {
    let checked = ''
    if (hog.greased) {checked = "checked"}
    let div = document.createElement('div')
    div.className = "hog-card";
    div.id = `${hog.id}`

    let htmlText = `
    <h2>${hog.name}</h2><br>
    <h4>${hog.specialty}</h4><br>
    <h4>${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}</h4><br>
    <img src="${hog.image}"><br>
    <label>Greased:</label>`;

    let input = document.createElement('input')
    input.type = "checkbox";
    input.checked = hog.greased;
    input.addEventListener("click", changeGreased)

    let button = document.createElement('button');
    button.innerHTML = "Delete";
    button.addEventListener('click', deleteHog)

    let br = document.createElement('br')

    div.innerHTML += htmlText;
    div.appendChild(input);
    div.appendChild(br);
    div.appendChild(button);
    container.appendChild(div);
  })
}

function deleteHog(event) {
  let hogId = event.currentTarget.parentElement.id;
  fetch(`http://localhost:3000/hogs/${hogId}`, {method: "DELETE"})
  .then(res => res.json())
  .then(json => {
    getHogs();
    displayHogs(allHogs);
  })
}

function changeGreased(event) {
  event.preventDefault();
  let hogId = event.currentTarget.parentElement.id;
  fetch(`http://localhost:3000/hogs/${hogId}`, {
    method: "PATCH",
    body: JSON.stringify({greased: event.currentTarget.checked}),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }).then(res => res.json())
  .then(json => {
    getHogs();
    displayHogs(allHogs);
  })
}

function newHog(event) {
  event.preventDefault();
  params = {
    name: event.target.name.value,
    specialty: event.target.specialty.value,
    "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": event.target.weight.value,
    image: event.target.img.value,
    greased: event.target.greased.checked
  }

  postHog(params)
}

function postHog(hogParams) {
  fetch('http://localhost:3000/hogs', {
    method: 'POST',
    body: JSON.stringify(hogParams),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  }).then(res => res.json())
  .then(json => {
    allHogs.push(json);
    displayHogs(allHogs);
    // This should be refactored
  })
}

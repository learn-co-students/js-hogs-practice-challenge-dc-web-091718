const HOGS_URL = "http://localhost:3000/hogs"

function hogsContainer() {
  return document.querySelector("#hog-container")
}

function hogForm() {
  return document.querySelector("#hog-form")
}

function goFetchHogs() {
  fetch(HOGS_URL)
    .then(response => response.json())
    .then(hogs => displayHogs(hogs))
}

function displayHogs(hogs) {
  for(const hog of hogs) {
    hogsContainer().appendChild(hogCard(hog))
  }
}

function toggleGreased(event) {
  fetch(HOGS_URL + `/${this.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: this.id,
      greased: !this.greased
    })
  })
}

function hogCard(hog) {
  let card = document.createElement('div')
  card.className = "hog-card"
  card.id = `hog-${hog.id}`

  let name = document.createElement('h3')
  name.innerText = hog.name

  let image = document.createElement('img')
  image.src = hog.image

  let specialty = document.createElement('p')
  specialty.innerText = "Specialty: " + hog.specialty

  let greased = document.createElement('form')
  let greasedCheck = document.createElement('input')
  greasedCheck.type = "checkbox"
  hog.greased ? greasedCheck.checked = true : greasedCheck.checked = false

  greasedCheck.addEventListener('click', toggleGreased.bind(hog))


  greasedLabel = document.createElement('label')
  greasedLabel.innerText = "Greased"
  greased.appendChild(greasedCheck)
  greased.appendChild(greasedLabel)

  
  let highestMedalAchieved = document.createElement('p')
  highestMedalAchieved.innerText = "Highest Medal: " + hog["highest medal achieved"]

  let weight = document.createElement('p')
  weight.innerText = "Weight relative to French Door Refrigerator: " + hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"] + " lbs"

  let deleteButton = document.createElement('button')
  deleteButton.innerText = "Delete Hog"
  deleteButton.addEventListener('click', deleteHog.bind(hog))

  card.appendChild(name)
  card.appendChild(image)
  card.appendChild(specialty)
  card.appendChild(greased)
  card.appendChild(highestMedalAchieved)
  card.appendChild(weight)
  card.appendChild(deleteButton)

  return card
}

function deleteHog(event) {
  fetch(HOGS_URL + `/${this.id}`, {
    method: "DELETE"
  }).then(() => removeHog.call(this))
}

function removeHog() {
  document.querySelector(`#hog-${this.id}`).remove()
}

function createHog(hogParams) {
  fetch(HOGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(hogParams)
  })
    .then(response => response.json())
    .then(hog => hogsContainer().appendChild(hogCard(hog)))
}

function onFormSubmit(event) {
  event.preventDefault()
  createHog(parsedHog());
}

function parsedHog() {
  const name = hogForm().children[0].value
  const specialty = hogForm().children[2].value
  const medal = hogForm().children[4].value
  const weight = hogForm().children[6].value
  const image = hogForm().children[8].value
  const greased = hogForm().children[10].children[0].checked

  return {
    name: name,
    specialty: specialty,
    medal: medal,
    weight: weight,
    image: image,
    greased: greased
  }
}

document.addEventListener('DOMContentLoaded', () => {
  goFetchHogs();

  hogForm().addEventListener('submit', onFormSubmit)
})
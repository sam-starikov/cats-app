//клиентский код
const cardContainer = document.querySelector('.cards')

cats.forEach(obj => {
  const cardInstance = new Card(obj, '#card-template')
  const newCardElem = cardInstance.getElement()
  cardContainer.append(newCardElem)
})

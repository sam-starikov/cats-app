//клиентский код
const cardContainer = document.querySelector('.cards')
const btnOpenPopupForm = document.querySelector('#add-cat-form')
const formAddCat = document.querySelector('#popup-form-cat')
const popupAddCatInstansce = new Popup('popup-add-cat')

cats.forEach(obj => {
  const cardInstance = new Card(obj, '#card-template')
  const newCardElem = cardInstance.getElement()
  cardContainer.append(newCardElem)
})

function handleFormAddCat(event) {
  event.preventDefault()
  const elementsFormCat = [...formAddCat.elements]
  const dataFromForm = serializaForm(elementsFormCat)

  const cardInstance = new Card(dataFromForm, '#card-template')
  const newCardElem = cardInstance.getElement()
  cardContainer.append(newCardElem)
  console.log(dataFromForm)
}

function serializaForm(elements) {
  const formData = {}

  elements.forEach(input => {
    if (input.type !== 'submit' && input.type !== 'checkbox') {
      formData[input.name] = input.value
    }
    if (input.type === 'checkbox') {
      formData[input.name] = input.checked
    }
  })
  return formData
}

popupAddCatInstansce.setEventListener()

btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
// Важно, submit на Форму а не click на кнопку
formAddCat.addEventListener('submit', handleFormAddCat)

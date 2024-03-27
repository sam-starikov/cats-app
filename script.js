//клиентский код
const cardContainer = document.querySelector('.cards')
const btnOpenPopupForm = document.querySelector('#add-cat-form')
const formAddCat = document.querySelector('#popup-form-cat')
const popupAddCatInstansce = new Popup('popup-add-cat')
const btnFormAdd = document.querySelector('.form__btn')

function createNewItem(newDataObj) {
    const cardInstance = new Card(newDataObj, '#card-template')
    const newCardElem = cardInstance.getElement()
    cardContainer.append(newCardElem)

    //!
    // cardInstance.deleteElement(newDataObj)
}

function handleAddFormCat(event) {
    const elementsFormCat = [...formAddCat.elements]
    const dataFromForm = serializaForm(elementsFormCat)
    api.addNewObj(dataFromForm).then(() => {
        createNewItem(dataFromForm)
        popupAddCatInstansce.close()
    })
    event.preventDefault()
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

function checkLocalStorage() {
    const dataLocalStorage = JSON.parse(localStorage.getItem('cats'))

    if (dataLocalStorage && dataLocalStorage.length) {
        dataLocalStorage.forEach(obj => {
            createNewItem(obj)
        })
    } else {
        api.getAllData().then(data => {
            data.forEach(obj => {
                createNewItem(obj)
            })
            localStorage.setItem('cats', JSON.stringify(data))
        })
    }
}
checkLocalStorage()

popupAddCatInstansce.setEventListener()

btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
// Важно, submit на Форму а не click на кнопку
formAddCat.addEventListener('submit', handleAddFormCat)

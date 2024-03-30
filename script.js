//клиентский код

/* Imports es6 module */
import { api } from './scripts/Api.js'
import { Card } from './scripts/Card.js'
import { Popup } from './scripts/Popup.js'
import { MAX_LIVE_COOKIES, MAX_LIVE_STORAGE } from './scripts/constants.js'
import { isTimeExpire, serializeForm, setDataRefreshCookies, setDataRefreshLocalStorage } from './scripts/utils.js'

/* Variables */
const cardContainer = document.querySelector('.cards')
const formAddCat = document.querySelector('#popup-form-cat')
const formLogin = document.querySelector('#popup-form-login')

const btnOpenPopupForm = document.querySelector('#add-cat-form')
const btnOpenPopupLogin = document.querySelector('#login-btn')
const btnDeleteCard = document.querySelector('.card__delete')

const popupAddCatInstansce = new Popup('popup-add-cat')
const popupLoginInstansce = new Popup('popup-login')

let isAuth = !!Cookies.get('email')
/*  */

/* Functions */

//handlers
function handleAddFormCat(event) {
    const elementsFormCat = [...formAddCat.elements]
    const dataFromForm = serializeForm(elementsFormCat)
    api.addNewObj(dataFromForm).then(() => {
        createNewItem(dataFromForm)
        updateLocalStorage(dataFromForm, { type: 'ADD_CAT' })
        popupAddCatInstansce.close()
    })
    event.preventDefault()
}

function handleLoginForm(event) {
    const elementsFromLoginForm = [...formLogin.elements]
    const dataFromForm = serializeForm(elementsFromLoginForm)

    Cookies.set('email', `${dataFromForm.email}`, { expires: setDataRefreshCookies(MAX_LIVE_COOKIES) })
    isAuth = true
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    popupLoginInstansce.close()
    checkLocalStorage()
    event.preventDefault()
}

function handleLogOut() {
    Cookies.remove('email')
    isAuth = false
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    popupLoginInstansce.open()
}

function handleDeleteItem(params) {
    api.deleteById()
    updateLocalStorage(data, { type: 'DELETE_CAT' })
}
//

function createNewItem(newDataObj) {
    const cardInstance = new Card(newDataObj, '#card-template')
    const newCardElem = cardInstance.getElement()
    cardContainer.append(newCardElem)
}

function checkLocalStorage() {
    const dataLocalStorage = JSON.parse(localStorage.getItem('cats'))
    const getTimeExpires = localStorage.getItem('catsRefreshData')

    if (dataLocalStorage && dataLocalStorage.length && isTimeExpire(getTimeExpires)) {
        dataLocalStorage.forEach(obj => {
            createNewItem(obj)
        })
    } else {
        api.getAllData().then(data => {
            data.forEach(obj => {
                createNewItem(obj)
            })
            updateLocalStorage(data, { type: 'ALL_CATS' })
        })
    }
}

function updateLocalStorage(data, action) {
    const storage = JSON.parse(localStorage.getItem('cats'))

    switch (action.type) {
        case 'ALL_CATS':
            localStorage.setItem('cats', JSON.stringify(data))
            setDataRefreshLocalStorage(MAX_LIVE_STORAGE, 'catsRefreshData')
            break
        case 'ADD_CAT':
            storage.push(data)
            localStorage.setItem('cats', JSON.stringify(storage))
            break

        case 'DELETE_CAT':
            const filteredStorage = storage.filter(el => el.id !== data.id)
            localStorage.setItem('cats', JSON.stringify(filteredStorage))

        default:
            break
    }
}

function setLoginBtnStyle() {
    return !isAuth ? 'Sign in' : 'Sign Out'
}
/*  */

/* Listeners */
popupAddCatInstansce.setEventListener()
// popupLoginInstansce.setEventListener()

btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
btnOpenPopupLogin.addEventListener('click', handleLogOut)
// btnDeleteCard.addEventListener('click', handleDeleteItem)

formAddCat.addEventListener('submit', handleAddFormCat)
formLogin.addEventListener('submit', handleLoginForm)
// Важно, submit на Форму а не click на кнопку
/*  */

/* Authorization */
if (!isAuth) {
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    popupLoginInstansce.open()
    //!
    document.removeEventListener('keyup', popupLoginInstansce._handleEscClose)
} else {
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    checkLocalStorage()
}
/*  */

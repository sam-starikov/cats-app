//клиентский код

/* Imports es6 module */
import { api } from './scripts/Api.js'
import { Card } from './scripts/Card.js'
import { Popup } from './scripts/Popup.js'

/* Variables */
const cardContainer = document.querySelector('.cards')
const formAddCat = document.querySelector('#popup-form-cat')
const formLogin = document.querySelector('#popup-form-login')

const btnOpenPopupForm = document.querySelector('#add-cat-form')
const btnOpenPopupLogin = document.querySelector('#login-btn')

const popupAddCatInstansce = new Popup('popup-add-cat')
const popupLoginInstansce = new Popup('popup-login')

let isAuth = !!Cookies.get('email')
/*  */

/* Functions */
function createNewItem(newDataObj) {
    const cardInstance = new Card(newDataObj, '#card-template')
    const newCardElem = cardInstance.getElement()
    cardContainer.append(newCardElem)

    //!
    // cardInstance.deleteElement(newDataObj)
}

function handleAddFormCat(event) {
    const elementsFormCat = [...formAddCat.elements]
    const dataFromForm = serializeForm(elementsFormCat)
    api.addNewObj(dataFromForm).then(() => {
        createNewItem(dataFromForm)
        popupAddCatInstansce.close()
    })
    event.preventDefault()
}

function handleLoginForm(event) {
    const elementsFromLoginForm = [...formLogin.elements]
    const dataFromForm = serializeForm(elementsFromLoginForm)

    Cookies.set('email', `${dataFromForm.email}`, { expires: setDataRefreshCookies(60) })
    isAuth = true
    btnOpenPopupLogin.textContent = setLoginBtnText()
    popupLoginInstansce.close()
    checkLocalStorage()
    event.preventDefault()
}

function serializeForm(elements) {
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

function setDataRefreshCookies(minutes) {
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    return setTime
}

function setDataRefreshLocalStorage(minutes) {
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    localStorage.setItem('catsRefreshData', setTime)
}

function isTimeExpire(localStorageTimeData) {
    return new Date() < new Date(localStorageTimeData)
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
            localStorage.setItem('cats', JSON.stringify(data))
            setDataRefreshLocalStorage(60)
        })
    }
}

function handleLogOut() {
    Cookies.remove('email')
    isAuth = false
    btnOpenPopupLogin.textContent = setLoginBtnText()
    popupLoginInstansce.open()
}

function setLoginBtnText() {
    return !isAuth ? 'Sign in' : 'Sign Out'
}
/*  */

/* Listeners */
popupAddCatInstansce.setEventListener()
// popupLoginInstansce.setEventListener()

btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
btnOpenPopupLogin.addEventListener('click', handleLogOut)

formAddCat.addEventListener('submit', handleAddFormCat)
formLogin.addEventListener('submit', handleLoginForm)
// Важно, submit на Форму а не click на кнопку
/*  */

/* Authorization */
if (!isAuth) {
    btnOpenPopupLogin.textContent = setLoginBtnText()
    popupLoginInstansce.open()
    //!
    document.removeEventListener('keyup', popupLoginInstansce._handleEscClose)
} else {
    btnOpenPopupLogin.textContent = setLoginBtnText()
    checkLocalStorage()
}
/*  */

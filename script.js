//клиентский код

/* Imports es6 module */
import { Api } from './scripts/Api.js'
import { Card } from './scripts/Card.js'
import { CardInfo } from './scripts/CardInfo.js'
import { Popup } from './scripts/Popup.js'
import { PopupImage } from './scripts/PopupImage.js'
import { CONFIG_API, MAX_LIVE_COOKIES, MAX_LIVE_STORAGE } from './scripts/constants.js'
import {
    convertToJSON,
    isTimeExpire,
    serializeForm,
    setDataRefreshCookies,
    setDateRefreshLocalStorage,
} from './scripts/utils.js'

/* Variables */
const cardContainer = document.querySelector('.cards')
const formAddCat = document.querySelector('#popup-form-wish')
const formLogin = document.querySelector('#popup-form-login')

const btnOpenPopupForm = document.querySelector('#add-cat-form')
const btnOpenPopupLogin = document.querySelector('#login-btn')

const burgerMenu = document.querySelector('.burger')

burgerMenu.addEventListener('click', () => {
    const headerControls = document.querySelector('.header__controls')
    const headerLogo = document.querySelector('.header__logo')
    const headerPlate = document.querySelector('.header')
    headerControls.classList.toggle('active')
    burgerMenu.classList.toggle('active')
    headerLogo.classList.toggle('active')
    headerPlate.classList.toggle('active')
    document.body.classList.toggle('lock')
})

/* Classes */
const api = new Api(CONFIG_API) //передаем данные в конструктор

const popupLoginInstansce = new Popup('popup-login') //передаем данные в конструктор

const popupAddCatInstansce = new Popup('popup-add-wish') //передаем данные в конструктор
popupAddCatInstansce.setEventListener() // вызываем метод установки слушателей

const popupCardInfoInstance = new Popup('popup-card-info') //передаем данные в конструктор
popupCardInfoInstance.setEventListener()

const popupCardImageInstance = new PopupImage('popup-image') //передаем данные в конструктор
popupCardImageInstance.setEventListener()

const cardInfoInstance = new CardInfo('#card-info-template', handleDeleteItem) //передаем данные в конструктор
const cardInfoElem = cardInfoInstance.getElement() // записываем в переменную то что нам вернул метод getElement т.е. карточку

console.log(cardInfoElem)

let isAuth = !!Cookies.get('email')
/*  */

/* Functions */

//handlers
function handleShowImageCard(dataCard) {
    popupCardImageInstance.open(dataCard)
}
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

function handleDeleteItem(cardInstance) {
    console.log(cardInstance)
    api.deleteById(cardInstance.getId()).then(() => {
        updateLocalStorage(cardInstance.getData(), { type: 'DELETE_CAT' })
        cardInstance.deleteView()
        popupCardInfoInstance.close()
    })
}

function handleOpenEditorCard(cardInstance) {
    popupCardInfoInstance.setContent(cardInfoElem)
    cardInfoInstance.setData(cardInstance)
    popupCardInfoInstance.open()
}
//

function createNewItem(dataFromForm) {
    const cardInstance = new Card(dataFromForm, '#card-template', handleOpenEditorCard, handleShowImageCard)
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
    const storage = JSON.parse(localStorage.getItem('wish-list'))

    switch (action.type) {
        case 'ALL_CATS':
            localStorage.setItem('wish-list', convertToJSON(data))
            setDateRefreshLocalStorage(MAX_LIVE_STORAGE, 'storage-refresh-date')
            break
        case 'ADD_CAT':
            storage.push(data)
            localStorage.setItem('wish-list', convertToJSON(storage))
            break

        case 'DELETE_CAT':
            const filteredStorage = storage.filter(el => el.id !== data.id)
            localStorage.setItem('wish-list', convertToJSON(filteredStorage))

        default:
            break
    }
}

function setLoginBtnStyle() {
    return !isAuth ? 'Sign in' : 'Sign Out'
}
/*  */

/* Listeners */
btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
btnOpenPopupLogin.addEventListener('click', handleLogOut)

formAddCat.addEventListener('submit', handleAddFormCat)
formLogin.addEventListener('submit', handleLoginForm)
// Важно, submit на Форму а не click на кнопку
/*  */

/* Authorization */
if (!isAuth) {
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    popupLoginInstansce.open()

    //! Вызов приватного метода. Исправить
    document.removeEventListener('keyup', popupLoginInstansce._handleEscClose)
} else {
    btnOpenPopupLogin.textContent = setLoginBtnStyle()
    checkLocalStorage()
}
/*  */

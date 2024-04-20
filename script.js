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

let isAuth = !!Cookies.get('email')

/* Classes */
const api = new Api(CONFIG_API)

const popupLoginInstansce = new Popup('popup-login')

const popupAddCatInstansce = new Popup('popup-add-wish')
popupAddCatInstansce.setEventListener()

const popupCardInfoInstance = new Popup('popup-card-info')
popupCardInfoInstance.setEventListener()

const popupCardImageInstance = new PopupImage('popup-image')
popupCardImageInstance.setEventListener()

const cardInfoInstance = new CardInfo(
    '#card-info-template',
    handleDeleteItem,
    handleEditInfoCard,
    handleLike,
    handleShowImageCard
)
const cardInfoElem = cardInfoInstance.getElement()

/* Functions */
function handleShowImageCard(dataCard) {
    popupCardImageInstance.open(dataCard)
}
function handleAddFormCat(event) {
    const elementsFormCat = [...formAddCat.elements]
    const dataFromForm = serializeForm(elementsFormCat)
    api.addNewObj(dataFromForm).then(() => {
        createNewCard(dataFromForm)
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

function handleEditInfoCard(cardInstance, editedData) {
    const { id, name, description } = editedData
    api.updateById(id, { name, description }).then(() => {
        cardInstance.setNewData(editedData)
        popupCardInfoInstance.close()
        updateLocalStorage(editedData, { type: 'EDITED_DATA' })
    })
}

function handleLike(cardInstance, editedData) {
    const { id, favourite } = editedData
    api.updateById(id, { favourite }).then(() => {
        cardInstance.setNewData(editedData)
        updateLocalStorage(editedData, { type: 'EDITED_DATA' })
    })
}

function createNewCard(data) {
    const cardInstance = new Card(data, '#card-template', handleOpenEditorCard, handleShowImageCard, handleLike)
    const newCardElem = cardInstance.getElement()
    cardContainer.append(newCardElem)
}

function checkLocalStorage() {
    const dataLocalStorage = JSON.parse(localStorage.getItem('wish-list-data'))
    const getTimeExpires = localStorage.getItem('storage-refresh-date')

    if (dataLocalStorage && dataLocalStorage.length && isTimeExpire(getTimeExpires)) {
        dataLocalStorage.forEach(obj => {
            createNewCard(obj)
        })
    } else {
        api.getAllData().then(data => {
            data.forEach(obj => {
                createNewCard(obj)
            })
            updateLocalStorage(data, { type: 'ALL_CATS' })
        })
    }
}

function updateLocalStorage(data, action) {
    const storage = JSON.parse(localStorage.getItem('wish-list-data'))

    switch (action.type) {
        case 'ALL_CATS':
            localStorage.setItem('wish-list-data', convertToJSON(data))
            setDateRefreshLocalStorage(MAX_LIVE_STORAGE, 'storage-refresh-date')
            return
        case 'ADD_CAT':
            storage.push(data)
            localStorage.setItem('wish-list-data', convertToJSON(storage))
            return
        case 'EDITED_DATA':
            const updateStorage = storage.map(el => (el.id === data.id ? data : el))
            localStorage.setItem('wish-list-data', convertToJSON(updateStorage))
            return
        case 'DELETE_CAT':
            const filteredStorage = storage.filter(el => el.id !== data.id)
            localStorage.setItem('wish-list-data', convertToJSON(filteredStorage))
            return
        default:
            return
    }
}

function setLoginBtnStyle() {
    return !isAuth ? 'Sign in' : 'Sign Out'
}

/* Listeners */
btnOpenPopupForm.addEventListener('click', () => popupAddCatInstansce.open())
btnOpenPopupLogin.addEventListener('click', handleLogOut)

formAddCat.addEventListener('submit', handleAddFormCat)
formLogin.addEventListener('submit', handleLoginForm)

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

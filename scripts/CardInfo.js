import { normalizeCount, generateRate } from './utils.js'

export class CardInfo {
    constructor(selectorTemplate, handleDeleteItem, handleLike, handleEdit) {
        this._selectorTemplate = selectorTemplate
        // this._handleLike = handleLike
        // this._handleEdit = handleEdit
        this._handleDeleteItem = handleDeleteItem
        this._data = {}
    }

    setData(cardInstance) {
        this._cardInstance = cardInstance
        this._data = this._cardInstance.getData()

        this.cardId.textContent = this._data.id
        this.cardImg.src = this._data.img_link
        this.cardName.textContent = this._data.name
        this.cardRate.innerHTML = generateRate(this._data.rate)
        this.cardAgeVal.textContent = this._data.age
        this.cardAgeText.textContent = normalizeCount(this._data.age, ['год', 'года', 'лет'])
        this.cardDesc.textContent = this._data.description
    }

    _getTemplate() {
        //возвр. содержимое шаблона в виде DOM узла
        // второй способ сhildren[0]
        return document.querySelector(this._selectorTemplate).content.children[0]
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true)

        this.btnEdit = this.element.querySelector('.card-info__edit')
        this.btnSave = this.element.querySelector('.card-info__save')
        this.btnDelete = this.element.querySelector('.card-info__delete')
        this.btnLike = this.element.querySelector('.card-info__favourite')

        this.cardId = this.element.querySelector('.card-info__id')
        this.cardImg = this.element.querySelector('.card-info__img')
        this.cardName = this.element.querySelector('.card-info__name')
        this.cardRate = this.element.querySelector('.card-info__rate')

        this.cardAgeVal = this.element.querySelector('.card-info__age-value')
        this.cardAgeText = this.element.querySelector('.card-info__age-text')
        this.cardDesc = this.element.querySelector('.card-info__description')

        this.setEventListener()

        return this.element
    }

    setEventListener() {
        this.btnDelete.addEventListener('click', () => this._handleDeleteItem(this._cardInstance))
    }
}

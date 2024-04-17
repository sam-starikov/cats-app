import { CORRECT_DECLENSIONS } from './constants.js'
import { normalizeCount, generateRate } from './utils.js'

export class CardInfo {
    constructor(selectorTemplate, handleDeleteItem, handleEditInfoCard, handleLike) {
        this._selectorTemplate = selectorTemplate
        this._handleDeleteItem = handleDeleteItem
        this._handleEditInfoCard = handleEditInfoCard
        this._handleLike = handleLike
        this._data = {}
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

    setData(cardInstance) {
        this._cardInstance = cardInstance
        this._data = this._cardInstance.getData()
        this.cardId.textContent = `Id ${this._data.id}`
        this.cardImg.src = this._data.img_link
        this.cardName.textContent = this._data.name
        this.cardRate.innerHTML = generateRate(this._data.rate)
        this.cardAgeVal.textContent = this._data.age
        this.cardDesc.textContent = this._data.description

        this.cardDesc.contentEditable = false
        this.cardName.contentEditable = false

        if (this._data.age) {
            this.cardAgeText.textContent = normalizeCount(this._data.age, CORRECT_DECLENSIONS)
        }

        if (!this.btnSave.classList.contains('card-info__save_hidden')) {
            this.btnSave.classList.add('card-info__save_hidden')
        }
        if (this.btnEdit.classList.contains('card-info__edit_hidden')) {
            this.btnEdit.classList.remove('card-info__edit_hidden')
        }

        this._updateViewLike()
    }

    _setLike = () => {
        this._data.favourite = !this._data.favourite
        this._updateViewLike()
        this._handleLike(this._cardInstance, this._data)
    }

    _updateViewLike() {
        if (this._data.favourite) {
            this.btnLike.classList.add('card-info__favourite_active')
        } else {
            this.btnLike.classList.remove('card-info__favourite_active')
        }
    }

    _getTemplate() {
        return document.querySelector(this._selectorTemplate).content.children[0]
    }

    _toggleContentEditable = () => {
        this.cardDesc.contentEditable = !this.cardDesc.isContentEditable
        this.cardName.contentEditable = !this.cardName.isContentEditable

        this._toggleHiddebBtn()
    }

    _toggleHiddebBtn() {
        this.btnEdit.classList.toggle('card-info__edit_hidden')
        this.btnSave.classList.toggle('card-info__save_hidden')
    }

    _saveEditData = () => {
        this._toggleContentEditable()

        if (this._data.description !== this.cardDesc.textContent || this._data.name !== this.cardName.textContent) {
            this._data.description = this.cardDesc.textContent
            this._data.name = this.cardName.textContent
            this._handleEditInfoCard(this._cardInstance, this._data)
        }
    }

    setEventListener() {
        this.btnDelete.addEventListener('click', () => this._handleDeleteItem(this._cardInstance))

        this.btnEdit.addEventListener('click', this._toggleContentEditable)

        this.btnSave.addEventListener('click', this._saveEditData)

        this.btnLike.addEventListener('click', this._setLike)
    }
}

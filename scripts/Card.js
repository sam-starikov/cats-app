export class Card {
    constructor(data, selectorTemplate, handleOpenEditorCard, handleShowImageCard, handleLike) {
        this._data = data
        this._selectorTemplate = selectorTemplate
        this._handleOpenEditorCard = handleOpenEditorCard
        this._handleShowImageCard = handleShowImageCard
        this._handleLike = handleLike
    }

    _getTemplate() {
        return document.querySelector(this._selectorTemplate).content.querySelector('.card')
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true)
        this.cardImg = this.element.querySelector('.card__img')
        this.cardLike = this.element.querySelector('.card__like')
        this.infoBtn = this.element.querySelector('.card__info')
        this.cardName = this.element.querySelector('.card__name')

        this.cardImg.src = this._data.img_link

        if (this._data.favourite) {
            this.cardLike.classList.add('card__like_active')
        }

        this.setEventListener()

        return this.element
    }

    _updateViewLike() {
        if (this._data.favourite) {
            this.cardLike.classList.add('card__like_active')
        } else {
            this.cardLike.classList.remove('card__like_active')
        }
    }

    setNewData(editedData) {
        this._data = editedData
        this._updateViewLike()
    }

    _setLike = () => {
        this._data.favourite = !this._data.favourite
        this._updateViewLike()
        this._handleLike(this, this._data)
    }

    getId() {
        return this._data.id
    }

    getData() {
        return this._data
    }

    deleteView() {
        this.element.remove()
        this.element = null
    }

    setEventListener() {
        this.infoBtn.addEventListener('click', () => this._handleOpenEditorCard(this))
        this.cardImg.addEventListener('click', () => {
            this._handleShowImageCard(this._data)
        })
        this.cardLike.addEventListener('click', this._setLike)
    }
}

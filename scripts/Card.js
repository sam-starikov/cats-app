export class Card {
    constructor(data, selectorTemplate, handleOpenEditorCard, handleShowImageCard) {
        this._data = data
        this._selectorTemplate = selectorTemplate
        this._handleOpenEditorCard = handleOpenEditorCard
        this._handleShowImageCard = handleShowImageCard
    }

    _getTemplate() {
        //возвр. содержимое шаблона в виде DOM узла
        return document.querySelector(this._selectorTemplate).content.querySelector('.card')
    }

    getElement() {
        //клонируем полученное содержимое
        this.element = this._getTemplate().cloneNode(true)
        this.cardImg = this.element.querySelector('.card__img')
        this.cardLike = this.element.querySelector('.card__like')
        this.infoBtn = this.element.querySelector('.card__info')
        this.cardName = this.element.querySelector('.card__name')

        if (this._data.favourite) {
            this.cardLike.classList.add('card__like_active')
        }

        this.updateView()
        this.setEventListener()

        return this.element
    }

    updateView() {
        this.cardImg.src = this._data.img_link
        // this.cardLike
    }

    setNewData(editedData) {
        this._data = editedData
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
    }
}

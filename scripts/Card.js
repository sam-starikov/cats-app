export class Card {
    constructor(data, selectorTemplate, handleOpenEditorCard, handleShowImageCard) {
        this._data = data
        this._selectorTemplate = selectorTemplate
        this._handleOpenEditorCard = handleOpenEditorCard
        this._handleShowImageCard = handleShowImageCard
    }

    _getTemplate() {
        //приватный - вызывается внутри класса

        //возвр. содержимое шаблона в виде DOM узла
        return document.querySelector(this._selectorTemplate).content.querySelector('.card')
    }

    getElement() {
        // публичный - вызывается снаружи

        //клонируем полученное содержимое
        this.element = this._getTemplate().cloneNode(true)

        this.cardTitle = this.element.querySelector('.card__name')
        this.cardImg = this.element.querySelector('.card__img')
        const cardLike = this.element.querySelector('.card__like')
        this.editBtn = this.element.querySelector('.card__edit')

        if (!this._data.favourite) {
            cardLike.remove()
        }

        // this.cardTitle.textContent = this._data.name
        this.cardImg.src = this._data.img_link

        this.setEventListener()

        return this.element
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
        // this.element.addEventListener('click', event => {
        //     if (event.target.closest('.card__delete')) {
        //         this.deleteView()
        //         this._handleDeleteItem(this.getId(), this.getData())
        //     }
        // })

        this.editBtn.addEventListener('click', () => this._handleOpenEditorCard(this))
        this.cardImg.addEventListener('click', () => {
            this._handleShowImageCard(this._data)
        })
    }
}

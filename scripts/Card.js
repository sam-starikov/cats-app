export class Card {
    constructor(data, selectorTemplate) {
        this._data = data
        this._selectorTemplate = selectorTemplate
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

        const cardTitle = this.element.querySelector('.card__name')
        const cardImg = this.element.querySelector('.card__img')
        const cardLike = this.element.querySelector('.card__like')

        // this._data.favourite ? null : cardLike.remove()
        if (!this._data.favourite) {
            cardLike.remove()
        }
        cardTitle.textContent = this._data.name
        cardImg.src = this._data.img_link

        return this.element
    }

    deleteElement(newDataObj) {
        const deleteBtn = document.querySelector('.card__delete')
        deleteBtn.addEventListener('click', () => {
            this.element.remove()
        })
        api.deleteById(newDataObj.id)
    }
}

export class CardInfo {
    constructor(selectorTemplate, handleLike, handleEdit, handleDelete) {
        this._selectorTemplate = selectorTemplate
        this._handleLike = handleLike
        this._handleEdit = handleEdit
        this._handleDelete = handleDelete
        this._data = {}
    }

    setData() {}

    _getTemplate() {
        //возвр. содержимое шаблона в виде DOM узла
        // второй способ сhildren[0]
        return document.querySelector(this._selectorTemplate).content.children[0]
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true)
    }
}

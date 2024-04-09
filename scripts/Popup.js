export class Popup {
    constructor(className) {
        // Принимаем в конструктор class нашего popoup из разметки (строка)
        //  Ищем его записывваем в this.popup

        this._className = `.${className}`
        this.popup = document.querySelector(this._className)
        this._handleEscClose = this._handleEscClose.bind(this) // биндем this именно для этого Класса
    }

    _handleEscClose(event) {
        if (event.key === 'Escape') {
            this.close()
        }
    }

    open() {
        this.popup.classList.add('popup_active')
        // сайд эффект
        document.addEventListener('keyup', this._handleEscClose)
    }

    close() {
        this.popup.classList.remove('popup_active')
        // сайд эффект
        document.removeEventListener('keyup', this._handleEscClose)
    }

    setContent(contentNode) {
        const contentContainer = this.popup.querySelector('.popup__content') // ищем ноду куда будем встраивать карточку
        contentContainer.innerHTML = null // при каждом вызове очищаем ??
        contentContainer.append(contentNode) // встраиваем карточку которую получили в popup
    }

    setEventListener() {
        this.popup.addEventListener('click', event => {
            if (event.target.classList.contains('popup') || !!event.target.closest('.popup__btn')) {
                this.popup.classList.remove('popup_active')
            }
        })
    }
}

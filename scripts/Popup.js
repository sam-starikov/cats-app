class Popup {
  constructor(className) {
    this._className = `.${className}`
    this.popup = document.querySelector(this._className)
    this._handleEscClose = this._handleEscClose.bind(this)
  }

  _handleEscClose(event) {
    if (event.key === 'Escape') {
      this.close()
    }
  }

  open() {
    document.addEventListener('keyup', this._handleEscClose)
    this.popup.classList.add('popup_active')
    this.popup.querySelector('.form__input').focus()
  }

  close() {
    document.removeEventListener('keyup', this._handleEscClose)
    this.popup.classList.remove('popup_active')
  }

  setEventListener() {
    this.popup.addEventListener('click', event => {
      if (event.target.classList.contains('popup-add-cat') || !!event.target.closest('.popup__btn')) {
        this.popup.classList.remove('popup_active')
      }
    })
    // this.popup.addEventListener('keyup', event => {
    //   if (event.key === 'Escape') {
    //     this.popup.classList.remove('popup_active')
    //   }
    // })
  }
}

// popupAddCatInstansce.open()
// popupAddCatInstansce.close()

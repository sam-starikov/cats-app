import { Popup } from './Popup.js'

export class PopupImage extends Popup {
    open(dataCard) {
        super.open()
        const cardImg = this.popup.querySelector('.popup__img')
        cardImg.src = dataCard.img_link
        console.log(cardImg)
    }
}

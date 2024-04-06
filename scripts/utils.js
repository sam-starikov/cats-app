import { MAX_RATE, MILLISECONDS_PER_MINUTE } from './constants.js'

export function serializeForm(elements) {
    const formData = {}

    elements.forEach(input => {
        if (input.type !== 'submit' && input.type !== 'checkbox') {
            formData[input.name] = input.value
        }
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked
        }
    })
    return formData
}

export function isTimeExpire(localStorageTimeData) {
    return new Date() < new Date(localStorageTimeData)
}

export function setDataRefreshCookies(minutes) {
    const setTime = new Date(new Date().getTime() + minutes * MILLISECONDS_PER_MINUTE)
    return setTime
}

export function setDataRefreshLocalStorage(minutes, key) {
    const setTime = new Date(new Date().getTime() + minutes * MILLISECONDS_PER_MINUTE)
    localStorage.setItem(key, setTime)
}

export const normalizeCount = (number, words_arr) => {
    number = Math.abs(number)
    if (Number.isInteger(number)) {
        let options = [2, 0, 1, 1, 1, 2]
        return words_arr[number % 100 > 4 && number % 100 < 20 ? 2 : options[number % 10 < 5 ? number % 10 : 5]]
    }
    return words_arr[1]
}

export function generateRate(rate) {
    const rateArr = []
    for (let i = 0; i < MAX_RATE; i++) {
        if (i < rate) {
            rateArr.push('<i class="fa-solid fa-star"></i>')
        } else {
            rateArr.push('<i class="fa-regular fa-star"></i>')
        }
    }

    return rateArr.join('')
}

;('<i class="fa-solid fa-star"></i>')
;('<i class="fa-regular fa-star"></i>')
;('<i class="fa-solid fa-star-half-stroke"></i>')

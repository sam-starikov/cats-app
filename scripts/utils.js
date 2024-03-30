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
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    return setTime
}

export function setDataRefreshLocalStorage(minutes, key) {
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    localStorage.setItem(key, setTime)
}

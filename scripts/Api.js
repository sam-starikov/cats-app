/* Тут создаем класс Api для запросов к серверу. Создаем экземпляр(instance) и пользуемся его мотодами которые написали */

import { convertToJSON } from './utils.js'

export class Api {
    constructor(config) {
        // в constractor принимаем параметры, в данном случае переменную CONFIG_API - это Обьект (Принимаем данные которые будут использоваться в инстансах и методах. Записываем в this)
        this._url = config.url // записываем в this(!).нашеНазваниеПеременной для использования в методах инстанса
        this._headers = config.headers
    }

    //методы

    _onResponse(resp) {
        return resp.ok ? resp.json() : Promise.reject({ ...resp, message: 'Ошибка сервера' })
    }

    getAllData() {
        return fetch(`${this._url}/data`).then(this._onResponse)
    }

    addNewObj(data) {
        return fetch(`${this._url}/data`, {
            method: 'POST',
            headers: this._headers,
            body: convertToJSON(data), //при добавлении нового обькта в БД, передаем его(обьект,данные) в body
        }).then(this._onResponse)
    }

    updateById(id, data) {
        return fetch(`${this._url}/data/${id}`, {
            method: 'PUT',
            headers: this._headers,
            body: convertToJSON(data),
        }).then(this._onResponse)
    }

    deleteById(id) {
        return fetch(`${this._url}/data/${id}`, {
            method: 'DELETE',
        }).then(this._onResponse)
    }
}

//допилить
/*  getById(id) {
    return fetch(`${this._url}/data/${id}`).then(resp => resp.json())
  } */

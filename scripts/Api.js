import { CONFIG_API } from './constants.js'

class Api {
    constructor(config) {
        this._url = config.url
        this._headers = config.headers
    }

    _onResponse(resp) {
        return resp.ok ? resp.json() : Promise.reject({ ...resp, message: 'Ошибка сервера' })
    }

    getAllData() {
        return fetch(`${this._url}/data`).then(this._onResponse)
    }

    //допилить
    /*  getById(id) {
    return fetch(`${this._url}/data/${id}`).then(resp => resp.json())
  } */

    addNewObj(data) {
        return fetch(`${this._url}/data`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(data),
        })
    }

    updateById(id, data) {
        fetch(`${this._url}/data/${id}`, {
            method: 'PUT',
            headers: this._headers,
            body: JSON.stringify(data),
        })
    }

    deleteById(id) {
        return fetch(`${this._url}/data/${id}`, {
            method: 'DELETE',
        }).then(this._onResponse)
    }
}

export const api = new Api(CONFIG_API)

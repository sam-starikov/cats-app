const CONFIG_API = {
  url: 'https://6492f092428c3d2035d0f278.mockapi.io',
  headers: { 'Content-Type': 'application/json' },
}

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
      body: JSON.stringify(data),
      headers: this._headers,
    })
  }

  updateById(id, data) {
    fetch(`${this._url}/data/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this._headers,
    })
  }

  deleteById(id) {
    fetch(`${this._url}/data/${id}`, {
      method: 'DELETE',
    })
  }
}

const api = new Api(CONFIG_API)

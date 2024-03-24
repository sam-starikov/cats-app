const CONFIG_API = {
  url: 'https://6492f092428c3d2035d0f278.mockapi.io',
  headers: { 'Content-Type': 'application/json' },
}

class Api {
  constructor(config) {
    this._url = config.url
    this._headers = config.headers
  }

  getData() {
    return fetch(`${this._url}/data`).then(resp => resp.json())
  }

  addNewObj(data) {
    fetch(`${this._url}/data`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this._headers,
      
    })
  }
}

const api = new Api(CONFIG_API)

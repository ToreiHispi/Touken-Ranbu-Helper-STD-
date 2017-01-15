class TRHRequestListener {
  static init () {
    // Listen Response
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      let tohken = request.request.url.match(/http:\/\/(.*?)\.touken-ranbu\.jp\/(.*)/)
      if (tohken != null) {
        let server = tohken[1]
        let path   = tohken[2]
        if (server === 'static' && path.indexOf('.bin') > -1) {
          // Load Bin Data
          request.getContent((content, encoding) => {
            TRHMasterData.init(content)
          })
        } else if (server !== 'static' && path.indexOf('?uid=') > -1) {
          let action = path.split('?')[0]
          let postData = _.isObject(request['request']['postData'])
            ? _(request['request']['postData']['text'])
                .replace(/%5F/g, '_')
                .split('&')
                .map(o => o.split('='))
            : {}
          request.getContent((content, encoding) => {
            let jsonObj = JSON.parse(content)
            jsonObj['postData'] = _.isArray(postData) ? _.fromPairs(postData) : postData
            if (_(jsonObj).pick(['iv', 'data']).keys().value().length === 2) {
              // Need decrypt
              let iv = jsonObj.iv
              let inflatedData = jsonObj.data
              let decryptData  = CryptoJS.AES.decrypt(
                { ciphertext: CryptoJS.enc.Hex.parse(inflatedData) },
                  CryptoJS.enc.Utf8.parse("9ij8pNKv7qVJnpj4"),
                { iv: CryptoJS.enc.Hex.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
              )
              // Magic ?
              let jsonText = decryptData.substr(0, decryptData.lastIndexOf('}') + 1)
              // To Object
              let dataObj = JSON.parse(jsonText)
              // Assign
              _.assign(jsonObj, dataObj)
            }
            // Route
            TRHRequestRouter.route(action, jsonObj)
          })
        }
      }
    })
  }
}

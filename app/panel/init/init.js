// Init Panel
chrome.devtools.inspectedWindow.eval('window.location.href', {}, function (result, exceptionInfo) {
  // Init
  if (result.indexOf('tohken') > -1) {
    // Create Panel
    chrome.devtools.panels.create(
      '~TRH~ D',
      null,
      '/app/panel/index.html',
      function (panel) {
        // Welcome
        chrome.runtime.sendMessage({
          type: 'notify',
          message: {
            title: 'Welcome to ~TRH~',
            message: 'Please find the new "Touken Ranbu Helper (STD EN)" tab in the Dev panel.',
            context: 'Build version： Dev 1.3.0'
          }
        })
      }
    )
  }
})

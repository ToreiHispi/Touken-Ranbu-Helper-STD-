// Send Welcome Message
chrome.runtime.sendMessage({
  type: 'notify',
  message: {
    title: 'Welcome to ~TRH~',
    message: 'To open the tool, press F12 or right-click in a blank space and select "Inspect".',
    context: 'Build version： v1.2.2'
  }
})

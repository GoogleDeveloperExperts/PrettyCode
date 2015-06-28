/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',//Open the minified and CSP enabled code
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 600}
    }
  );
});

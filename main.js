//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

//Get data from the syncStorage
chrome.storage.sync.get(
  ['language', 'theCode', 'theme', 'fontPt'],
  function(localStorage) {
    mainContent.language = localStorage.language || '--';
    mainContent.code = localStorage.theCode || '';
    mainContent.theme = localStorage.theme || 'light';
    mainContent.fontPt = localStorage.fontPt || 14;
  });

mainContent.addEventListener('dom-change', function() {
  //Set the font-size
  mainContent.ptChange({detail: mainContent.fontPt});

  //Now that the template is bound update the code in the textArea
  //mainContent.$.codeValue = mainContent.code;
  //mainContent.$.agTa.update(mainContent.$.taCode); //Update the autoGrowArea;

  //Find the label of the selected language to set it on the paper-dropdown-menu
  /*var mnItems = document.querySelectorAll('paper-item');
  [].some.call(mnItems, function(mnItem) {
    if (mnItem.dataset.value == mainContent.language) {
      //Item found, update the selectedItem to change the label
      mainContent.$.pdmLanguage.selectedItemLabel = mnItem.innerText;
      return true;
    }
    return false;
  });*/

  //Select the theme on the slider
  //mainContent.$.ptbTheme.checked = (mainContent.theme == 'dark');

  //Update Computed Styles
  Polymer.updateStyles();

  //Run validation
  mainContent.validateForSlides();
});

//Computed Styles
mainContent._computedBodyClass = function(theme) {
  return 'fit layout vertical theme-' + (theme || 'light');
};

mainContent._computedThemeClass = function(theme){
  return 'theme-' + (theme || 'light');
};

mainContent._computedDestinationClass = function(theme) {
  return 'flex theme-' + (theme || 'light');
};

mainContent._selTheme = function(theme) {
  var tmpTheme = theme || 'light';
  
  return (tmpTheme == 'dark');
  
};

mainContent.codeChanged = function(newVal) {
  
  chrome.storage.sync.set({'theCode': mainContent.code}, function() {
    //Nothing to do
  });
  //Code Changed, run the validation for slides
  mainContent.validateForSlides();
  
};

mainContent.languageSelected = function(selMenu) {
  //Changed selected language, update the value and store
  if (selMenu.detail.isSelected) {
    mainContent.language = selMenu.detail.item.dataset.value;
    chrome.storage.sync.set({'language': mainContent.language}, function() {
      //Nothing to do
    });

    //Set the theme and lang
    Polymer.updateStyles();
  }

};

mainContent.chTheme = function() {
  //if checked theme is dark, otherwise light
  if (mainContent.$.ptbTheme.checked) {
    mainContent.theme = 'dark';
  }else {
    mainContent.theme = 'light';
  }
  chrome.storage.sync.set({'theme': mainContent.theme}, function() {
    //Nothing to do
  });

  //Update styles
  Polymer.updateStyles();

};

var ptToPx = function(valPt) {
  return (16 / 12) * valPt;//return the font-size in px from the ptValue
};

mainContent.ptChange = function(newVal) {
  
  chrome.storage.sync.set({'fontPt': newVal.detail.value}, function() {
    //Nothing to do
  });

  //Get the px approximate size
  mainContent.fontPx = ptToPx(newVal.detail.value) + 'px';

  //AutoGrow Text Area
  mainContent.$.agTa.style.fontSize = mainContent.fontPx;
  
  //Pre Element
  if (mainContent.$.destination.shadowRoot) {
    var preElement = mainContent.$.destination.shadowRoot.querySelector('pre');
    preElement.style.fontSize = mainContent.fontPx;
  }
  Polymer.updateStyles();

};

mainContent.selPrettyCode = function(sender) {
  //Get the pre element inside the prettify-element
  if (mainContent.$.destination.shadowRoot) {
    var preElement = mainContent.$.destination.shadowRoot.querySelector('pre');
    //Select the text range
    var doc = document;
    var selection = window.getSelection();
    var range = doc.createRange();
    range.selectNodeContents(preElement);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

mainContent.validateForSlides = function() {
  var divW = document.querySelector('#slidesWarnings');
  
  if (divW){
    var warn = [];
    
    var MAX_LINES = 20;
    if ((mainContent.code.match(/\n/g) || []).length >= MAX_LINES) {
      warn.push('More than ' + MAX_LINES +
        ' lines of code will be hard to read on a slide.');
    }
  
    var lines = mainContent.code.split('\n') || [];
    var MAX_LINE_LENGTH = 80;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].length > MAX_LINE_LENGTH) {
        warn.push('Line ' + (i + 1) + ' has more than ' +
          MAX_LINE_LENGTH + ' characters!');
      }
    }
    if (warn.length > 0) {
      divW.innerHTML = warn.join('<br>');
    }else {
      divW.innerHTML = 'Perfect code for slides';
    }
  }
};


//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

//Get data from the localStorage
mainContent.lang = localStorage.lang || '--';
mainContent.code = localStorage.theCode || '';
mainContent.theme = localStorage.theme || 'light';
mainContent.fontPt = localStorage.fontPt || 14;

mainContent.addEventListener('template-bound', function(){

  //Set the font-size
  mainContent.ptChange();

  //Now that the template is bound update the code in the textArea
  mainContent.$.taCode.value = mainContent.code;
  mainContent.$.agTa.update(mainContent.$.taCode); //Update the autoGrowArea;

  //Add a change listener to the textArea
  mainContent.$.taCode.addEventListener('input', function() {
    localStorage.theCode = mainContent.code = mainContent.$.taCode.value;
    //Code Changed, run the validation for slides
    mainContent.validateForSlides();
  });

  //Find the label of the selected language to set it on the paper-dropdown-menu
  var mnItems =document.querySelectorAll('paper-item');
  [].some.call(mnItems, function(mnItem){
    if (mnItem.dataset.value==mainContent.lang){
      //Item found, update the selectedItem to change the label
      mainContent.$.pdmLanguage.selectedItemLabel=mnItem.innerText;
      return true;
    }
    return false;
  });

  //Select the theme on the slider
  mainContent.$.ptbTheme.checked=(mainContent.theme=='dark');

  //Set the theme and lang on all the components
  setThemeAndLang();

  //Run validation
  mainContent.validateForSlides();
});

var setThemeAndLang = function(){
  //Change the classes on the prettyprint element accordingly
  document.body.className = 'theme-' + mainContent.theme;

  mainContent.$.taCode.className = 'theme-' + mainContent.theme;

  mainContent.$.destination.className = 'theme-' + mainContent.theme;

  //Change the language class if needed
  /*if (mainContent.lang != '--') {
    mainContent.$.destination.className += ' lang-' + mainContent.lang;
  }*/
}

mainContent.languageSelected = function(selMenu){
  //Changed selected language, update the value and store
  if(selMenu.detail.isSelected){
    localStorage.lang = mainContent.lang=selMenu.detail.item.dataset.value;

    //Set the theme and lang
    setThemeAndLang();
  }

}

mainContent.chTheme = function(){
  //if checked theme is dark, otherwise light
  if(mainContent.$.ptbTheme.checked){
    localStorage.theme = mainContent.theme = 'dark';
  }else{
    localStorage.theme = mainContent.theme = 'light';
  }

  //Set the theme and lang
  setThemeAndLang();

}

var ptToPx = function(valPt){
  return (16/12)*valPt;//return the font-size in px from the ptValue
}

mainContent.ptChange = function(){
  //TODO:Validate the value before saving it and using it to calculate the px value
  localStorage.fontPt = mainContent.fontPt;

  //Get the px approximate size
  var fontPx = ptToPx(mainContent.fontPt) + 'px';

  //AutoGrow Text Area
  mainContent.$.agTa.style.fontSize = fontPx;
  //Text Area
  mainContent.$.taCode.style.fontSize = fontPx;
  //Pre Element
  var preElement = mainContent.$.destination.shadowRoot.querySelector('pre');
  preElement.style.fontSize = fontPx;

}

mainContent.selPrettyCode = function(sender){
  //Get the pre element inside the prettyfy-element
  var preElement = sender.currentTarget.shadowRoot.querySelector('pre');

  //Select the text range
  var doc = document;
  var selection = window.getSelection();
  var range = doc.createRange();
  range.selectNodeContents(preElement);
  selection.removeAllRanges();
  selection.addRange(range);

}

mainContent.validateForSlides = function(){
  var divW = document.querySelector("#slidesWarnings");
  var warn = [];

  var MAX_LINES = 20;
  if ((mainContent.code.match(/\n/g) || []).length >= MAX_LINES) {
    warn.push('More than ' + MAX_LINES + ' lines of code will be hard to read on a slide.');
  }

  var lines = mainContent.code.split('\n') || [];
  var MAX_LINE_LENGTH = 80;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length > MAX_LINE_LENGTH) {
      warn.push('Line ' + (i + 1) + ' has more than ' + MAX_LINE_LENGTH + ' characters!');
      break;
    }
  }
  if (warn.length>0){
    divW.innerHTML = warn.join('<br>');
  }else{
    divW.innerHTML='Perfect code for slides';
  }
}




//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

//Get data from the localStorage
mainContent.lang = localStorage.lang || '--';
mainContent.code = localStorage.theCode || '';
mainContent.theme = localStorage.theme || 'dark';
mainContent.fontPt = localStorage.fontPt || 16;

mainContent.addEventListener('template-bound', function(){
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

});

mainContent.languageSelected = function(selMenu){
  //Changed selected language, update the value and store
  if(selMenu.detail.isSelected){
    localStorage.lang = mainContent.lang=selMenu.detail.item.dataset.value;
    //TODO: Change the language class
    if (mainContent.lang != '--') {
      mainContent.$.destination.addClass('lang-' + mainContent.lang);
    }
  }else{
    //Deselected language
    if (mainContent.lang != '--') {
      mainContent.$.destination.removeClass('lang-' + mainContent.lang);
    }
  }

}

mainContent.selTheme = function(themeBtn){
  //Change the theme and store it
  localStorage.theme = mainContent.theme = themeBtn.currentTarget.dataset.theme;

  //Change the classes on the prettyprint element accordingly
  document.body.className = 'theme-' + mainContent.theme;

  //Set the theme
  mainContent.$.destination.className = 'theme-' + mainContent.theme;

}

mainContent.chTheme = function(){
  //TODO: if checked theme is light, otherwise dark
}

mainContent.ptToPx = function(valPt){
  return (16/12)*valPt;//return the font-size in px from the ptValue
}

mainContent.ptChange = function(inputChanged){
  //TODO:Validate the value before saving it and using it to change the font of the
  //inputChanged.target.value
  debugger;
}

mainContent.validateForSlides = function(){
  var divW = document.querySelector("#slidesWarnings");
  var warn = [];
  //TODO: Implement all the validations

  var MAX_LINES = 15;
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
}




//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

mainContent.addEventListener('template-bound', function(){
  //TODO: Get references and star doing things
  mainContent.lang = "--";
});

mainContent.languageSelected = function(detail){
  //Check if a new language for the formatting is selected
  if (detail.detail.isSelected){
    mainContent.lang=detail.detail.item.dataset.value;
  }

}


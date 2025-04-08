$(document).ready(function(){
    $("#template-nav").load("template/nav.html");
    $("#template-nav-fold").load("template/nav-fold.html");
    $("#template-footer").load("template/footer.html");
    $("#template-header").load("template/header.html");
    $("#switcher").load("template/switcher.html");
    
    //load gallery select to portal

      var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
      ];
      $( "#namaPensyarah" ).autocomplete({
        source: availableTags
      });
    
  });

  function handleClick(input){
    if(input.value == 1){
      $('input.disabled').prop("disabled",false);
      $('select.disabled').prop("disabled",false);
      $('textarea.disabled').prop("disabled",false);
      $('button.deleteBtn').addClass("hidden");
      $('button.saveBtn').removeClass("hidden");
      $('#disabledButton').val(0);
    }
    else{
      $('input.disabled').prop("disabled",true);
      $('select.disabled').prop("disabled",true);
      $('textarea.disabled').prop("disabled",true);
      $('button.deleteBtn').removeClass("hidden");
      $('button.saveBtn').addClass("hidden");
      $('#disabledButton').val(1);
    }
    
  }

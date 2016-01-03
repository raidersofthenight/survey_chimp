//= require jquery 
//= require jquery-ui
//= require_tree .
//= require bootstrap-sprockets
//= require jquery.spritely.js

$(document).ready(function() {

// AJAX call to remove a question from the DOM once delete button is hit

  $('.delete-question-form').on('click', function(e) {
    e.preventDefault();
    console.log("DELETE ajax call being hit");

    var form = this;
    var url = $(this).attr("action");
    var type = "DELETE";
    var data = $(this).serialize();

    var request = $.ajax({
      url: url,
      type: type,
      data: data
    });

    request.done(function(ajaxDelete) {
      var panel = $(form).parent().parent();
      $(panel).fadeOut(500).done().remove();
    });

    request.fail(function(serverData){
      console.log("FAIL: " + serverData);
    });
  });




// AJAX call to add a question to the DOM once 'add question' button is hit

  $('#add_question').on("submit", function(e){
    e.preventDefault();
    console.log("SUBMIT!-----------------------------------------------")

    var form = this;
    var url = $(this).attr("action");
    var type = "PUT";
    var data = $(this).serialize();

    var request = $.ajax({
      url: url,
      type: type,
      data: data
    });

    request.done(function(questionPartial){
      console.log(questionPartial);
      $($('#add_question').children()[2]).val('');
      $(questionPartial).hide().appendTo('.question-container').fadeIn(500);
    });

    request.fail(function(serverData){
      console.log("FAIL: " + serverData);
    });
  });




// AJAX call to make the 'new survey' dialogue fade out and subsequently have 'add question' dialogue
// fade in when the "create" button is clicked

  $('#create_survey_btn').on("click", function(e) {
    e.preventDefault();
    console.log("CREATE SURVEY AJAX CALL WORKING----------------------");

    var form = $(this).parent().children().eq(1).children();
    var url = $(form).attr("action");
    var type = "POST";
    var data = $(form).serialize();

    var request =$.ajax({
      url: url,
      type: type,
      data: data
    });

    request.done(function(serverData) {
      console.log("Here is the serverData:");
      console.log(serverData);
      console.log("------------------------end--------------------------");

      // Make .survey-title-container fade out and make .ajax-container fade in
      $('.survey-title-container').fadeOut(500).promise().done(function() {
        $('.survey-title-container').remove();
        $(".ajax-container").delay(500).append(serverData).hide().fadeIn("slow");
      });
    });
  });



// Allows the 'new-question-form' to fade in when the "Add Question" button is clicked

  $(document).on('click', '#show-question-form', function(e) {
    e.preventDefault();

    var link_value = document.getElementById("show-question-form").getAttribute("href");
    console.log(link_value);

    $('.add-question-prompt-container').fadeOut(500).promise().done(function() {
      $('.add-question-prompt-container').remove();
    });

    console.log("container removed");
    $(".content").load(link_value);
  });



// AJAX call to add question to survey

  $(document).on("click", "#add-question-btn", function(e) {
    e.preventDefault();
    console.log("ADD QUESTION AJAX CALL WORKING----------------------");
    
    var form = $(this).parent();
    var url = $(form).attr('action');
    var type = "POST";
    var data = $(form).serialize();

    console.log(data);

    var request = $.ajax({
      url: url,
      type: type,
      data: data
    });

    request.done(function(serverData) {
      $('#add_question')[0].reset();
      $('.new-question-form').animate({
        top: '+=60'
        }, 500 ).promise().done(function() {
        $('.content').prepend(serverData).hide().fadeIn("slow");
      });
      console.log("Server returning _question_partial.html.erb:")
      console.log(serverData);
    });

    request.fail(function(serverData) {
      // TODO: LOGIC TO HANDLE ERROR CREATING NEW QUESTION
    })

    console.log("------------------------end--------------------------");
  });



// AJAX call to open modal dialog box where user can specify response type

  $(document).on("click", ".set-resp-type-btn", function(e) {
      e.preventDefault();
      console.log("SET RESPONSE TYPE AJAX CALL WORKING----------------------");
      
      var link_value = $(this).attr('formaction');
      console.log(link_value);

      $('.modal').load(link_value);
      $('.modal').dialog();
  });


 // Function to control radio button actions to display response type options 

  $(document).on("change", ".optradio", function() {

    if (this.value == "textinput") {
      $('#optradio-r2, #optradio-r3').hide(function() {
        $('#optradio-r1').show();
      });
    }
    else if (this.value == "multichoice") {
      $('#optradio-r1, #optradio-r3').hide(function() {
        $('#optradio-r2').show();
      });
    }
    else {
      $('#optradio-r1, #optradio-r2').hide(function() {
        $('#optradio-r3').show();
      });
    }
  });



 // Functions to add an answer choice to a multiple choice and multiple answer question
 // These functions also include logic to auto-letter each answer choice (e.g. a, b, c...)

  function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  }

  var mc_choice_count = 3;
  $(document).on('click', "#mc-add-choice", function() {
    var prev_td = "#l" + (mc_choice_count - 1);
    var prev_letter = $(prev_td).text();
    var current_letter = nextChar(prev_letter);
    var content = "<tr><td class='numerator' id='l" + mc_choice_count + "'>" + current_letter + "</td><td><input class='answer-choice' type='text' name='text' placeholder='write an answer choice'></td></tr>";
    $("#actbl1").append(content);
    mc_choice_count++;
  });

  var ma_choice_count = 3;
  $(document).on('click', "#ma-add-choice", function() {
    var prev_td = "#n" + (ma_choice_count - 1);
    var prev_letter = $(prev_td).text();
    var current_letter = nextChar(prev_letter);
    var content = "<tr><td class='numerator' id='n" + ma_choice_count + "'>" + current_letter + "</td><td><input class='answer-choice' type='text' name='text' placeholder='write an answer choice'></td></tr>";
    $("#actbl2").append(content);
    ma_choice_count++;
  });
  

  // Function to control radio buttons that allow user to choose between a short and a long text input response

  $(document).on("change", ".txtinput-resp", function () {
    if (this.name = "txtinput-resp-short") {
      alert("this is working");

    }
    else {
      alert("this is working too");
    }
  });

  // Function to pan the background image
  
  $('body').pan({fps: 30, speed: 2, dir: 'left'});


  // Useless stuff vv

  // $(document).on('ajax:success', '.delete-question-form', function() {
  //   console.log("IS THIS WORKING YET?");
  //   var panel = $(this).closest('.panel');
  //   panel.fadeOut(function() { panel.remove(); });
  // });

  // $('.question-container').on('submit', "#delete_button", function(e){
  //   e.preventDefault();

  //   console.log("LISTENER HIT")
  //   var form = this;
  //   var path = $(this).attr('action');
  //   var data = $(this).serialize();

  //   var request = $.ajax({
  //     url: path,
  //     type: 'delete',
  //     data: data
  //   });

  //   request.done(function(){
  //     $(form).parent().parent().remove();
  //   });

  //   request.fail(function(){
  //     console.log("FAILURE");
  //   });
  // });
  // 
});

var questionsArray = {
    "Section A": [],
    "Section B": [],
    "Section C": [],
    "Section D": [],
    "Section E": []
};

// Function to handle radio button selection and update the questionsArray
window.selectRadio = function (id) {

    // Call the original selectRadio function to check the radio button
    document.getElementById(id).checked = true;
    // Extract question number and value from the id
    var [questionNumber, value] = id.split('_');
    // Find the question in the questionsArray and update its answer
    Object.keys(questionsArray).forEach(sectionKey => {
        var selectedQuestion = questionsArray[sectionKey].find(q => q.question_number === questionNumber);

        if (selectedQuestion) {
            $("." + selectedQuestion.question_number).removeClass(sectionKey.replace(' ', ''), 'cteTotalAnswer');
            $("." + selectedQuestion.question_number).removeClass('cteTotalAnswer');

            $("#" + id).addClass(sectionKey.replace(' ', ''));
            $("#" + id).addClass('cteTotalAnswer');

            selectedQuestion.answer = $("#" + id).val();

            countReal = $('.' + sectionKey.replace(' ', '')).length;
            checkingCount()

            // $("#countSec" + questionNumber[0]).html(`<b class="label rounded">` + countReal + `/` + (($("." + questionNumber[0] + "Count").length) / 4) + `</b>`);
        }
    });

};


$(function () {
    $.ajaxSetup({
        cache: false
    });

    $.fn.select2.defaults.set("theme", "bootstrap");

    $("#loading_modal").modal('show');

    let student_id = window.sessionStorage.std_studentid;
    let fk_acaCal = window.sessionStorage.fk_acaCal;
    let cotDet = window.sessionStorage.cotDet;
    let crsCode = window.sessionStorage.crsCode;

    $('#stdId').val(student_id);
    $('#fk_acaCal').val(fk_acaCal);
    $('#cotDet').val(cotDet);
    $('#crsCode').val(crsCode);
    $('#fk_rsb').val(window.sessionStorage.rsbID);

});
var confirmed = false;


//-------------------------------------------------- add new --------------------------------------------------//
$("#formAddEvaluation").on('submit', function (e) {
    if (!confirmed) {
        e.preventDefault();
        swal({
            title: "Save Evaluation",
            text: "Are you sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function () {
            let std_studentid = $('#stdId').val();
            let fk_acaCal = $('#fk_acaCal').val();
            let cotDet = $('#cotDet').val();
            let crsCode = $('#crsCode').val();

            // Create an object to hold the data
            var markData = {
                q1: $('#q1').val(),
                q2: $('#q2').val(),
                q3: $('#q3').val(),
                q4: $('#q4').val(),
                q5: $('#q5').val(),
                q6: $('#q6').val(),
                q7: $('#q7').val(),
                q8: $('#q8').val(),
                q9: $('#q9').val(),
                q10: $('#q10').val(),
                q11: $('#q11').val(),
                q12: $('#q12').val(),
                q13: $('#q13').val(),
                q14: $('#q14').val(),
                q15: $('#q15').val(),
                q16: $('#q16').val(),
                q17: $('#q17').val(),
                q18: $('#q18').val(),
                q19: $('#q19').val(),
                q20: $('#q20').val(),
                q21: $('#q21').val(),
                q22: $('#q22').val(),
                q23: $('#q23').val(),
                q24: $('#q24').val(),
                q25: $('#q25').val(),
                q26: $('#q26').val(),
                q27: $('#q27').val(),
                q28: $('#q28').val(),
                q29: $('#q29').val(),
                q30: $('#q30').val(),
                q31: $('#q31').val(),
                q32: $('#q32').val(),
                q33: $('#q33').val(),
                q34: $('#q34').val(),
                q35: $('#q35').val(),
                q36: $('#q36').val(),
                q37: $('#q37').val(),
                q38: $('#q38').val(),
                q39: $('#q39').val(),
                q40: $('#q40').val()
            };

            // Convert the object to a JSON-formatted string
            var jsonMarkData = JSON.stringify(markData);




            var form = new FormData();
            form.append("std_studentid", std_studentid);
            form.append("fk_cotDet", cotDet);
            form.append("crs_code", crsCode);
            form.append("aca_session", fk_acaCal);
            form.append("markData", jsonMarkData);
            form.append("recordstatus", 'ADD');

            var settings = {
                "url": host + "api_pengurusan_pelajar/public/misStdEvaluate/register",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": "picoms " + window.sessionStorage.token
                },
                "processData": false,
                "mimeType": "multipart/form-data",
                "contentType": false,
                "data": form
            };

            $.ajax(settings).done(function (response) {
                let result = JSON.parse(response);
                if (result.success) {

                    swal("Save Evaluation Success", "Evaluation", "success");

                    setTimeout(() => {
                        window.location.reload();

                    }, 2000);

                    // if( std_sttsAca != 1 ){ chgSttsAcdmc(student_id); }
                    // if( pk_curSem == '' ){ chgStdSem(student_id, totalSem, aca_session) }
                }
                else { swal("Failed", response.message, "error"); }
            });
        });
    }
});
//-------------------------------------------------- add new --------------------------------------------------//




// Add event listener to the save button
$('#saveButton').on('click', function () {
    // Get the total number of answers and the expected total from the input
    var totalAnswers = $(".cteTotalAnswer").filter(function () {
        return $(this).val().trim() !== "";
    }).length;

    var totalRadios = $("input[type='radio']:checked").length;
    // var totalCompletedAnswers = totalAnswers + totalRadios;
    var expectedTotal = parseInt($("#totalJawapan").val());


    if ($(".cteTotalAnswer").length === expectedTotal) {
        // Collect all answers
        var answers = {};

        $(".open-ended").each(function () {
            var questionNumber = $(this).attr('id').split('_')[1];
            var selectedAnswer = $(this).val();
            answers[questionNumber] = selectedAnswer;
        });

        $("input[type='radio']:checked").each(function () {
            var questionNumber = $(this).attr('name');
            var selectedAnswer = $(this).val();
            answers[questionNumber] = selectedAnswer;
        });
        // Update questionsArray with the collected answers
        //  if (Object.keys(answers).length == $(".cteTotalAnswer").length) {
        
        //     for (var questionNumber in answers) {

        //         if (answers.hasOwnProperty(questionNumber)) {
        //             updateQuestionsArray(questionNumber, answers[questionNumber]);
        //         }
        //     }
        //  }
        updateQuestionsArray();


        // Add any additional save logic here

    } else {
        // Show alert if not all questions are answered
        swal('PLEASE COMPLETE ALL QUESTIONS FIRST');
    }
});

// Function to update the questionsArray with the selected answer
function updateQuestionsArray() {

    // Object.keys(questionsArray).forEach(sectionKey => {

    //     var selectedQuestion = questionsArray[sectionKey].find(q => q.question_number === questionNumber);
    //     if (selectedQuestion) {
    
    
    //         selectedQuestion.answer = selectedAnswer;
    //     }
    // });


    listLect = (window.sessionStorage.senaraiLectEva).split(',');
    // listLect = () ? 

    for (let i = 0; i < listLect.length; i++) {
        let form_stdFeedback = new FormData();
        form_stdFeedback.append('feedback_std', JSON.stringify(questionsArray));
        form_stdFeedback.append('fk_cte_question', $("#pk_cte_question").val());
        form_stdFeedback.append('std_studentid', window.sessionStorage.std_studentid);
        form_stdFeedback.append('fk_cotDet', window.sessionStorage.cotDet);
        form_stdFeedback.append('aca_session', window.sessionStorage.fk_acaCal);
        form_stdFeedback.append('fk_crs', window.sessionStorage.crsCode);
        form_stdFeedback.append('fk_rsb', window.sessionStorage.rsbID);
        form_stdFeedback.append('emp_id', listLect[i]);

        // form.append('cal_cohort', sem);
        // form.append('acya_cal_category', aca_cal_category);

        obj_stdFeedback = new post(host + 'api_pengurusan_pelajar/public/cte/stdFeedback/create', form_stdFeedback, 'picoms ' + window.sessionStorage.token).execute();

        if (obj_stdFeedback.success) {

            // Show a success alert with SweetAlert
            swal({
                title: "Success Answered",
                text: "Course Teaching Evaluation",
                type: "success"
            }).then(function () {
                // Set session storage content
                window.sessionStorage.content = "pljr_courseList";

                // Load the content of pljr_courseList.html into the #content element
                $('#content').load('pljr_courseList.html');
            });

        } else {
            // console.log(obj_stdFeedback);

        }



    }


}

displayQuestion(function () {
    soalanCTE = JSON.parse(objDisplaydata.soalan);
    $("#pk_cte_question").val(objDisplaydata.pk_cte);
    var totalSoalan = 0;

    $.each(soalanCTE, function (section, questions) {
        var sectionSplit = section.split(" ");
        var totalQuestionBySection = '';
        var jawapan = 1;

        // sectDet_

        $('#sectionCount_' + sectionSplit[1]).val((questions.Senarai_soalan).length);

        $('#sectDet_' + sectionSplit[1]).html(questions.sectionDetail);
        let displayQuestionStd = questions.Senarai_soalan;







        secDet = (questions.sectionDetail === '') ? '' : questions.sectionDetail;
        // Replace spaces in section name with underscores to create table id
        table_id = section.replace(/\s+/g, '_');
        section = table_id.split('_');

        $('#table_' + table_id).html('');
        // $('#secDet_' + section[1]).html(secDet);
        $('#sectDet_' + table_id).html(((secDet['BM']) || '') + `<br> <small>` + ((secDet['BI']) || '') + `</small>`);







        $.each(displayQuestionStd, function (iQuestion, questionVal) {


            $('[data-target=#tab-' + sectionSplit[1] + ']').removeClass('none');






            totalSoalan++;



            if (questionVal.typeQuestion === 'single-answer') {


                totalQuestion = `
            <div class="col-lg-10 offset-lg-1">
                <div class="box lt">
                    <div class="box-header grey-200">
                        <li class="list-item">
                            <a href="#" class="list-left"><p class="h5">${jawapan++}.</p></a>
                            <div class="list-body">
                                <input type="hidden" id="${questionVal.number}" value="${questionVal.number}">
                                <div><p class="h5">${questionVal.BM}</p></div>
                                <small class="text-muted text-ellipsis"><i><h5>${questionVal.BI}</h5></i></small>
                            </div>
                        </li>
                    </div>
                    <div class="box-divider m-a-0"></div>
                    <div class="box-body p-v-md">
                        <div class="row row-sm text-center">
                        <div class="col-xs-3 center-radio">
                           <label for="${questionVal.number}_1" onclick="selectRadio('${questionVal.number}_1')" class="d-block">Strongly Disagree</label>
                               <span class="emoji d-block" onclick="selectRadio('${questionVal.number}_1')">😡</span>
                               <div class="radio-container">
                                   <input class="form-check-input ${sectionSplit[1]}Count ${questionVal.number}" onclick="selectRadio('${questionVal.number}_1')" type="radio" name="${questionVal.number}" id="${questionVal.number}_1" value="strongly_disagree" style="margin-inline: auto ; margin-bottom: auto;">
                               </div>
                           </div>
                           <div class="col-xs-3 center-radio">
                               <label for="${questionVal.number}_2" onclick="selectRadio('${questionVal.number}_2')" class="d-block">Disagree</label>
                               <span class="emoji d-block" onclick="selectRadio('${questionVal.number}_2')">😟</span>
                               <div class="radio-container">
                                   <input class="form-check-input ${sectionSplit[1]}Count ${questionVal.number}" onclick="selectRadio('${questionVal.number}_2')" type="radio" name="${questionVal.number}" id="${questionVal.number}_2" value="disagree" style="margin-inline: auto ; margin-bottom: auto;">
                               </div>
                           </div>
                           <div class="col-xs-3 center-radio">
                               <label for="${questionVal.number}_3" class="d-block" onclick="selectRadio('${questionVal.number}_3')">Agree</label>
                               <span class="emoji d-block" onclick="selectRadio('${questionVal.number}_3')">😊</span>
                               <div class="radio-container">
                                   <input class="form-check-input ${sectionSplit[1]}Count ${questionVal.number}" onclick="selectRadio('${questionVal.number}_3')" type="radio" name="${questionVal.number}" id="${questionVal.number}_3" value="agree" style="margin-inline: auto ; margin-bottom: auto;">
                               </div>
                           </div>
                           <div class="col-xs-3 center-radio">
                               <label for="${questionVal.number}_4" class="d-block" onclick="selectRadio('${questionVal.number}_4')">Strongly Agree</label>
                               <span class="emoji d-block" onclick="selectRadio('${questionVal.number}_4')">😍</span>
                               <div class="radio-container">
                                   <input class="form-check-input ${sectionSplit[1]}Count ${questionVal.number}" onclick="selectRadio('${questionVal.number}_4')" type="radio" name="${questionVal.number}" id="${questionVal.number}_4" value="strongly_agree" style="margin-inline: auto ; margin-bottom: auto;">
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

                // Add the question to the section
                totalQuestionBySection += totalQuestion;

                // Add the question number and an initial answer to the questionsArray
                questionsArray["Section " + sectionSplit[1]].push({
                    question_number: questionVal.number,
                    typeQuestion: questionVal.typeQuestion,
                    answer: ""
                });
            } else if (questionVal.typeQuestion === 'open-ended') {


                totalQuestion = `
            <div class="col-lg-10 offset-lg-1">
                <div class="box lt">
                    <div class="box-header grey-200">
                        <li class="list-item">
                            <a href="#" class="list-left"><p class="h4">${jawapan++}.</p></a>
                            <div class="list-body">
                                <input type="hidden" id="${questionVal.number}" value="${questionVal.number}">
                                <div><p class="h5">${questionVal.BM}</p></div>
                                <small class="text-muted text-ellipsis"><i><h5>${questionVal.BI}</h2></i></small>
                            </div>
                        </li>
                    </div>
                    <div class="box-divider m-a-0"></div>
                    <div class="box-body p-v-md">
                        <div class="row row-sm text-center">
                   
                          <textarea id="answer_${questionVal.number}" class="form-control ${sectionSplit[1]}Count ${questionVal.typeQuestion}" onchange="updateAnswerOpen('${questionVal.number}')" rows="6" data-minwords="6" required="" placeholder="Type your message"></textarea>
                          
                
                        </div>
                    </div>
                </div>
            </div>
            `;

                // Add the question to the section
                totalQuestionBySection += totalQuestion;

                // Add the question number and an initial answer to the questionsArray
                questionsArray["Section " + sectionSplit[1]].push({
                    question_number: questionVal.number,
                    typeQuestion: questionVal.typeQuestion,
                    answer: ""
                });


            }



        });

        // Append the questions to the respective section
        $("#box_" + sectionSplit[1]).append(totalQuestionBySection);
        $("#totalJawapan").val(totalSoalan);

    });
});

function displayQuestion(returnValue) {

    let objDisplay = new get(host + 'api_pengurusan_pelajar/public/cte/viewActiveQuestion', 'picoms ' + window.sessionStorage.token).execute();

    if (objDisplay.success) {

        objDisplaydata = objDisplay.data;
        returnValue();


    } else {

        swal("Failed To Load", 'No Question active', "error");
        let prevPage = window.sessionStorage.prevPage;
        window.sessionStorage.content = "pljr_courseList";
        $('#content').load('pljr_courseList.html');

    }

}


// // Function to handle radio button selection and update the questionsArray
// window.selectRadio = function (id) {
// console.log(id);

//     // Call the original selectRadio function to check the radio button
//     document.getElementById(id).checked = true;
//     // Extract question number and value from the id

//     var [questionNumber, value] = id.split('_');
//     console.log(questionNumber);

//     // Find the question in the questionsArray and update its answer
//     Object.keys(questionsArray).forEach(sectionKey => {
//         var selectedQuestion = questionsArray[sectionKey].find(q => q.question_number === questionNumber);

//         if (selectedQuestion) {
//             // selectedQuestion.answer = value;

//             $("." + selectedQuestion.question_number).removeClass(sectionKey.replace(' ', ''), 'cteTotalAnswer');
//             $("." + selectedQuestion.question_number).removeClass('cteTotalAnswer');

//             $("#" + id).addClass(sectionKey.replace(' ', ''));
//             $("#" + id).addClass('cteTotalAnswer');

//             console.log($('.' + selectedQuestion.question_number).length);
//             selectedQuestion.answer = $("#" + id).val();

//             countReal = $('.' + sectionKey.replace(' ', '')).length;

//             $("#countSec" + questionNumber[0]).html(`<b class="label rounded">` + countReal + `/` + (($("." + questionNumber[0] + "Count").length) / 4) + `</b>`);
//         }
//     });
// };


function countFunction(questionSection) {
    myArray = questionSection.split("");
    $("#countSec" + myArray[0]).html();
}




function updateAnswerOpen(id) {


    let timer;

    // Call the original selectRadio function to check the radio button
    // document.getElementById(id).checked = true;
    // Extract question number and value from the id
    // var [questionNumber, value] = id.split('_');
    // Find the question in the questionsArray and update its answer
    Object.keys(questionsArray).forEach(sectionKey => {
        var selectedQuestion = questionsArray[sectionKey].find(q => q.question_number === id);

        if (selectedQuestion) {
            // selectedQuestion.answer = $('#answer_'+id).blur();
            $("#answer_" + id).on("keyup", function () {
                var searchid = $(this).val().trim();

                clearInterval(timer);
                timer = setTimeout(function () {
                    // console.log('User finished typing !!');
                    selectedQuestion.answer = searchid;
                }, 200);
            });
            // $("." + selectedQuestion.question_number).removeClass(sectionKey.replace(' ', ''), 'cteTotalAnswer');
            // $("." + selectedQuestion.question_number).removeClass('cteTotalAnswer');

            // $("#" + id).addClass(sectionKey.replace(' ', ''));
            // $("#" + id).addClass('cteTotalAnswer');

            // console.log($('.' + selectedQuestion.question_number).length);
            // selectedQuestion.answer = $("#" + id).val();

            // countReal = $('.' + sectionKey.replace(' ', '')).length;

            // $("#countSec" + questionNumber[0]).html(`<b class="label rounded">` + countReal + `/` + (($("." + questionNumber[0] + "Count").length) / 4) + `</b>`);
        }
    });

    if ($("#answer_" + id).val() == '') {
        $("#answer_" + id).removeClass('cteTotalAnswer')
        // console.log($("#answer_" + id).val());
    } else {
        $("#answer_" + id).addClass('cteTotalAnswer')
        // console.log($("#answer_" + id).val());

    }

    checkingCount()
}


function checkingCount() {

    a = $('.ACount.cteTotalAnswer').length;
    b = $('.BCount.cteTotalAnswer').length;
    c = $('.CCount.cteTotalAnswer').length;
    d = $('.DCount.cteTotalAnswer').length;
    e = $('.ECount.cteTotalAnswer').length;


    $("#countSecA").html(`<b class="label rounded">` + a + `/` + $("#sectionCount_A").val() + `</b>`);
    $("#countSecB").html(`<b class="label rounded">` + b + `/` + $("#sectionCount_B").val() + `</b>`);
    $("#countSecC").html(`<b class="label rounded">` + c + `/` + $("#sectionCount_C").val() + `</b>`);
    $("#countSecD").html(`<b class="label rounded">` + d + `/` + $("#sectionCount_D").val() + `</b>`);
    $("#countSecE").html(`<b class="label rounded">` + e + `/` + $("#sectionCount_E").val() + `</b>`);

}
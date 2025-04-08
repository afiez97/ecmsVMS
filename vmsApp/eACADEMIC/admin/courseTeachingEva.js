var questionsArray = {
    "Section A": {
        "sectionDetail": '',
        "Senarai_soalan": []
    },
    "Section B": {
        "sectionDetail": '',
        "Senarai_soalan": []
    },
    "Section C": {
        "sectionDetail": '',
        "Senarai_soalan": []
    },
    "Section D": {
        "sectionDetail": '',
        "Senarai_soalan": []
    },
    "Section E": {
        "sectionDetail": '',
        "Senarai_soalan": []
    }
};

$(function () {
    $.ajaxSetup({
        cache: false
    });

    displayQuestion();
    $.fn.select2.defaults.set("theme", "bootstrap");

    // acaCalActive(function(){
    //     $('#semester').append('<option value="">- Choose Academic Session -</option>');
    //     let names = "";
    //     $.each(obj_kalendar.data, function (i, item){
    //         select = "";
    //         if(getSession == item.cur_year.replace('/','')+'/'+item.cal_cohort){
    //             select = "selected";
    //         }

    //         if(names != item.cur_year.replace('/','')+'/'+item.cal_cohort){
    //             names = item.cur_year.replace('/','')+'/'+item.cal_cohort;

    //             $('#semester').append('<option '+select+' value="'+item.cal_id+'" calYear="'+item.cur_year+'" calSem="'+item.cal_cohort+'">'+item.cur_year.replace('/','')+'/'+item.cal_cohort+'</option>');
    //         }
    //     });

    //     $('.slct2').select2({
    //         width: null,
    //         containerCssClass: ':all:'
    //     });
    // });


    // $('#formAddQuestion').submit(function (event) {
    //     event.preventDefault();

    //     var questionBM = $('#questionBM').val().trim();
    //     var questionBI = $('#questionBI').val().trim();
    //     var typeQuestion = $('#type_question').val();
    //     var section = $('#section').val();
    //     var sectionLetter = section.charAt(section.length - 1); // Extract section letter (A, B, C, ...)
    //     // Check if Senarai_soalan exists and is an array; if not, initialize it
    //     // Object.keys(questionsArray).forEach(section => {
    //     //     // Ensure Senarai_soalan property exists in each section
    //     //     if (!questionsArray[section].find(item => item.Senarai_soalan)) {
    //     //         questionsArray[section].push({ Senarai_soalan: [] });
    //     //     }
    //     // });
    //     // // Ensure questionsArray[section] is initialized and has Senarai_soalan property
    //     // if (!questionsArray[section]) {
    //     //     questionsArray[section] = [{ Senarai_soalan: [] }];
    //     // } else if (!questionsArray[section][0].Senarai_soalan) {
    //     //     questionsArray[section][0].Senarai_soalan = [];
    //     // }


    //     var listed = questionsArray[section][0].Senarai_soalan;

    //     if (questionBM && questionBI) {

    //         var newQuestion = {
    //             number: sectionLetter + (listed.length + 1), // Concatenate section letter and question number
    //             BM: questionBM,
    //             BI: questionBI,
    //             typeQuestion: typeQuestion
    //         };
    //         // questionsArray[section].push({ Senarai_soalan: newQuestion });
    //         listed.push(newQuestion);

    //         console.log('Updated Questions Array:', questionsArray);
    //         // Here you can perform additional operations, such as sending the data to the server
    //         // Clear the input fields
    //         $('#questionBM').val('');
    //         $('#questionBI').val('');

    //         createTbl(questionsArray);
    //         $('#mdlAddQuestions').modal('hide');
    //     } else {
    //         alert('Please enter questions in both languages.');
    //     }
    //     console.log(questionsArray);
    // });

    $('#formAddQuestion').submit(function (event) {
        event.preventDefault();

        var questionBM = $('#questionBM').val().trim();
        var questionBI = $('#questionBI').val().trim();
        var typeQuestion = $('#type_question').val();
        var section = $('#section').val(); // Get the selected section
        var sectionLetter = section.charAt(section.length - 1); // Extract section letter (A, B, C, ...)

        // // Check if Senarai_soalan exists for the selected section
        // if (!questionsArray[section][1] || !questionsArray[section][1].Senarai_soalan) {
        //     // If not, initialize it
        //     questionsArray[section][1] = { Senarai_soalan: [] };
        // }

        var listed = questionsArray[section].Senarai_soalan;
        let listedLength = listed ? listed.length : 0;
        if (questionBM && questionBI) {
            var newQuestion = {
                number: sectionLetter + (listedLength + 1), // Concatenate section letter and question number
                BM: questionBM,
                BI: questionBI,
                typeQuestion: typeQuestion
            };

            // Push newQuestion into Senarai_soalan array for the specified section
            questionsArray[section].Senarai_soalan.push(newQuestion);

            console.log('Updated Questions Array:', questionsArray);

            // Clear the input fields
            $('#questionBM').val('');
            $('#questionBI').val('');

            // Call the createTbl function to update the table
            createTbl(questionsArray);

            // Hide the modal after successfully adding the question
            $('#mdlAddQuestions').modal('hide');
        } else {
            alert('Please enter questions in both languages.');
        }

        console.log(questionsArray);
    });


    // var questionsArray = [];

    // $('#formAddQuestion').submit(function(event) {
    //     event.preventDefault();

    //     var questionBM = $('#questionBM').val().trim();
    //     var questionBI = $('#questionBI').val().trim();

    //     if (questionBM && questionBI) {
    //         var newQuestion = {
    //             BM: questionBM,
    //             BI: questionBI
    //         };
    //         questionsArray.push(newQuestion);
    //         console.log('Updated Questions Array:', questionsArray);
    //         // Here you can perform additional operations, such as sending the data to the server
    //         $('#mdlAddQuestions').modal('hide');
    //     } else {
    //         alert('Please enter questions in both languages.');
    //     }
    // });



});



function loadData(indexs) {

    $("#numberQuestion").val(indexs);
    // const number = indexs;
    let foundItem = null;
    for (section in questionsArray) {

        Senarai_soalan = questionsArray[section];
        items = Senarai_soalan.Senarai_soalan;
        // console.log(items);
        // console.log(items.Senarai_soalan);

        foundItem = items.find(item => item.number === indexs);
        if (foundItem) break;
    }

    if (foundItem) {
        // Retrieve the BM and BI text
        bmText = foundItem.BM;
        biText = foundItem.BI;
        // console.log('<p>BM: ' + bmText + '</p><p>BI: ' + biText + '</p>');

        // Display the text in the modal
        $('#upt_questionBM').val(bmText);
        $('#upt_questionBI').val(biText);
    }

    $("#mdlUptForm").modal("show");

    // $("#mdlUptForm").modal("show");

}
//-------------------------------------------------- create table CECT Course --------------------------------------------------//
function createTbl(data) {

    // console.log(data);
    var columns = [
        { name: "bil", title: "No." },
        { name: "question", title: "Soalan / Question" },
        { name: "upt_btn", title: "Action", breakpoints: "md sm xs" }
    ];
    questionsArray = data;
    // Iterate through each section in questionsArray
    // Object.keys(data).forEach(section => {
    //     // Ensure Senarai_soalan property exists in each section
    //     if (!data[section].find(item => item.Senarai_soalan)) {
    //         data[section].push({ Senarai_soalan: [] });
    //     }
    // });
    // Iterate over each section in the data
    $.each(data, function (section, questions) {

        typeSection = section;
        secDet = (questions.sectionDetail === '') ? '' : questions.sectionDetail;
        // Replace spaces in section name with underscores to create table id
        table_id = section.replace(/\s+/g, '_');
        section = table_id.split('_');
        $('#table_' + table_id).html('');
        // $('#secDet_' + section[1]).html(secDet);
        $('#descHead_' + table_id).html(((secDet['BM'])||'')+`<br> <small>`+((secDet['BI'])||'')+`</small>`);
    
        // let senaraiSoalan = questions[0].Senarai_soalan;
        senaraiSoalan = questions.Senarai_soalan || [];

        // capaianCTE = load_capaian();

        load_capaian();
        capaianCTE = window.capaianData;
        // console.log(capaianCTE);
        let addCTE = capaianCTE[0];
        let uptCTE = capaianCTE[1];
        let delCTE = capaianCTE[2];

        var CTEAddDisabled = '';
        var CTEUpdateDisabled = '';
        var CTEDelDisabled = '';
        if (addCTE == 0){
            CTEAddDisabled = 'disabled';
        }

        if (uptCTE == 0) {
            CTEUpdateDisabled = 'disabled';
        }

        if (delCTE == 0) {
            CTEDelDisabled = 'disabled';
        }



        // Check if there are questions for the current section
        if (senaraiSoalan.length > 0) {

            var list = []; // Define list variable here
            var bil = 1;

            // Iterate over each question in the section
            $.each(senaraiSoalan, function (index, question) {
                list.push({

                    bil: bil++,
                    // Display question in both BM and BI with line break
                    question: `<a>${question.BM}<br>${question.BI}</a>`,
                    upt_btn: `<button class="btn btn-icon success" `+CTEUpdateDisabled+` title="Update"
                            onclick="loadData('${question.number}')" data-ui-toggle-class="zoom"
                            data-ui-target="#animate"><i class="ion-android-create"></i></button>
                            <button type="button"  class="btn btn-icon danger" `+CTEDelDisabled+` title="Remove"
                            onclick="del_rekodArray('${typeSection}','${question.number}')"><i class="ion-trash-b"></i></button>`
                });
            });

            // Initialize FooTable for the current section
            $('#table_' + table_id).footable({
                columns: columns,
                rows: list, // Pass list here
                paging: {
                    enabled: true,
                    size: 10
                }
                // Add filtering and other options if needed
            });
        }
    });
}
//-------------------------------------------------- end create table CECT Course --------------------------------------------------//

function addQuestion(section) {

    $('#section').val(section);

    $('#mdlAddQuestions').modal('show');

}

// Handle form submission
$('#updateQuestion').submit(function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the updated values from the modal inputs
    number = $('#numberQuestion').val();
    bmText = $('#upt_questionBM').val();
    biText = $('#upt_questionBI').val();

    // Find and update the corresponding item in the array
    for (section in questionsArray) {

        Senarai_soalan = questionsArray[section];
        items = Senarai_soalan.Senarai_soalan;


        // items = questionsArray[section];
        foundIndex = items.findIndex(item => item.number === number);
        if (foundIndex !== -1) {
            items[foundIndex].BM = bmText;
            items[foundIndex].BI = biText;
            break;
        }
    }

    createTbl(questionsArray)
    // Optionally, you can console.log the updated array

    // Close the modal
    $("#mdlUptForm").modal("hide");
});

var confirmed = false;
$('#saveButton').click(function () {
    let soalan = questionsArray;
    if (!confirmed) {
        swal({
            title: "Add Question",
            text: "Are You Sure?",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#2196f3",
            closeOnConfirm: true,
            allowOutsideClick: false,
            html: false
        }).then(function (result) {

            let maker = 'afiez';
            // let maker = $("#pgm_semester").val();
            var form = new FormData();
            form.append("soalan", JSON.stringify(soalan)); // Convert questionsArray to JSON string
            form.append("maker", maker);
            obj = new post(host + 'api_pengurusan_pelajar/public/cte/register', form, 'picoms ' + window.sessionStorage.token).execute();

            // var settings = {
            //     "url": host + "api_pengurusan_pelajar/public/cte/register",
            //     "method": "POST",
            //     "timeout": 0,
            //     "headers": {
            //         "Authorization": "picoms " + window.sessionStorage.token
            //     },
            //     "processData": false,
            //     "mimeType": "multipart/form-data",
            //     "contentType": false,
            //     "data": form
            // };


            // $.ajax(settings).done(function(response) {

            //     result = JSON.parse(response);
            //     if (!result.success) {  
            //         Swal.fire(result.message, result.data, "error"); // Use Swal.fire instead of Swal
            //         return;
            //     }
            //     window.location.reload();
            // })
            // .fail(function(xhr, status, error) {
            //     console.error("AJAX request failed:", status, error);
            //     Swal.fire(result.message, result.data, "error"); // Use Swal.fire instead of Swal
            // });


            if (obj.success) {
                window.location.reload();
            } else {
                console.log(obj.message);
                swal(obj.message, obj.data, "error"); // Use Swal.fire instead of Swal
                return;
            }
        });
    }
});


function displayQuestion() {

    let objDisplay = new get(host + 'api_pengurusan_pelajar/public/cte/viewActiveQuestion', 'picoms ' + window.sessionStorage.token).execute();

    if (objDisplay.success) {

        createTbl(JSON.parse(objDisplay.data.soalan));
        // JSON.parse(objDisplay.data.soalan)
        // console.log(objDisplay.data.soalan);
        // console.log(JSON.parse(objDisplay.data.soalan));

    }

    // console.log(questionsArray);
}


function del_rekodArray(sectionFunc, number) {
    for (let section in questionsArray) {
        // Find the index of the object with the given number in the current section
        Senarai_soalan = questionsArray[sectionFunc];
        items = Senarai_soalan.Senarai_soalan;


        index = items.findIndex(item => item.number === number);

        if (index !== -1) {
            // console.log(sectionFunc);

            splitSect = sectionFunc.split(' ');
            items.splice(index, 1);
            items.forEach((item, index) => {

                item.number =  splitSect[1]+`${index + 1}`;
                // console.log(item);
            });
            break; // Exit the loop once the item is removed
        }
    }

    createTbl(questionsArray)
}



function addDescription(sectionMdl) {

    $("#descSection").val(sectionMdl)
    for (let section in questionsArray) {
        // Find the index of the object with the given number in the current section

        if (sectionMdl== section) {


            bySection = questionsArray[sectionMdl];
            lengthDesc = !(bySection.sectionDetail)? '': bySection.sectionDetail;

            if (lengthDesc == '') {
                $("#DescBM").val('');
                $("#DescBI").val('');
            } else {
                $("#DescBM").val(bySection.sectionDetail["BM"]);
                $("#DescBI").val(bySection.sectionDetail["BI"]);
            }
        
            // desc ={"BM":"uji a","BI":"test A"};
            // // bySection.sectionDetail={"BM":"uji a","BI":"test A"};
            // if (JSON.stringify(lengthDesc) === JSON.stringify(desc)) {
            // // bySection.sectionDetail={"BM":"uji a","BI":"test A"};
           
            // $("#DescBM").val(bySection.sectionDetail["BM"]);
            // $("#DescBI").val(bySection.sectionDetail["BI"]);
            // } else {
            //     $("#DescBM").val(bySection.sectionDetail["BM"]);
            //     $("#DescBI").val(bySection.sectionDetail["BI"]);
            // }


                    
        }


        // index = items.findIndex(item => item.number === number);
        // console.log(questionsArray);    


    }


    $('#mdlAddDesc').modal('show');

}



$("#regDescription").on('click', function(e) {
    e.preventDefault()

    DescBM =  $("#DescBM").val();
    DescBI =  $("#DescBI").val();
    desc ={"BM":DescBM,"BI":DescBI};


    sectionMdl =  $("#descSection").val()
    for (let section in questionsArray) {
        // Find the index of the object with the given number in the current section

        if (sectionMdl== section) {


            bySection = questionsArray[sectionMdl];
            // lengthDesc = bySection.sectionDetail;

        
            // desc ={"BM":"uji a","BI":"test A"};
            // bySection.sectionDetail={"BM":"uji a","BI":"test A"};
            bySection.sectionDetail=desc;
            // if (JSON.stringify(lengthDesc) === JSON.stringify(desc)) {
            // // bySection.sectionDetail={"BM":"uji a","BI":"test A"};
           
            // $("#DescBM").val(bySection.sectionDetail["BM"]);
            // $("#DescBI").val(bySection.sectionDetail["BI"]);
            // } else {
            //     $("#DescBM").val(bySection.sectionDetail["BM"]);
            //     $("#DescBI").val(bySection.sectionDetail["BI"]);
            // }

            break;
        }


        // index = items.findIndex(item => item.number === number);


    }
    createTbl(questionsArray);

    $('#formAddDesc')[0].reset();
    $('#mdlAddDesc').modal('hide');


})
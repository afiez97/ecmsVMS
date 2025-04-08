var kateProg1 = '01', kateProg2 = '02', kateProg3 = '03', kateProg4 = '04', datekat_01 = '', datekat_02 = '', datekat_03 = '', datekat_04 = '';



$(function () {
    $.ajaxSetup({
        cache: false
    });
    if (window.sessionStorage.NewUser == 'SSO') {
        swal({
            title: 'Default/Limited Access Hepa',
            // text: 'If you want to access more content, <br> please contact Super Admin',  
            html: 'If you want to access more content,<p>Please contact <b>Super Admin</b></p>',  // Your message with HTML formatting
            icon: 'info'
        });


    }
    // countGender('0', function () {

    //     var totalBed = obj_countGender.data;
    //     $('#ToBed').html(totalBed);
    //     $('#MonthYearpick').trigger('change');

    //     $('#MonthYearpick').on('change', function () {



    //     penghuni(function () {
    //         TotalOccupied = obj_penghuni.data
    //         TotalOccupiedFemale = TotalOccupied.Female;
    //         TotalOccupiedMale = TotalOccupied.Male;
    //         countGender('Female', function () {
    //         var totalFemalebilik = obj_countGender.data;

    //         let Bilikkosonggirl = totalFemalebilik - TotalOccupiedFemale;
    //         let bilikkosongLelaki = totalBed - totalFemalebilik - TotalOccupiedMale;
    //         console.log(totalBed);

    //         generatechartBed(Bilikkosonggirl, bilikkosongLelaki, totalBed);
    //         // console.log(bilikkosongLelaki);


    //         });

    //         $('#gegirlOccu').html(TotalOccupiedFemale);
    //         $('#MenOccu').html(TotalOccupiedMale);
    //     });


    //     });
    // }); //nie utk count total bilik wether itu perempuan, lelaki, & total smua


    // percent complete for aduan umum
    listAduUmum(function () {
        let allUmum = obj_repUmum.data.length;

        listAduUmumCmpltd(function () {
            let umumCMplt = obj_repUmumCmplt.data.length;
            let percent = '';

            if (!(allUmum == 0 || umumCMplt == 0)) {
                percent = (umumCMplt / allUmum) * 100;
            }
            else { percent = 0; }

            $('#divUmum').attr("style", "width: " + percent.toFixed(0) + "%");
            $('#divUmum').html(percent.toFixed(0) + "%");
        });
    });

    // percent complete for aduan kerosakan
    listKerosakan(function () {
        let allUmum = obj_repRosak.data.length;

        listKerosakanCmplt(function () {
            let umumCMplt = obj_repRosakCmplt.data.length;
            let percent = '';

            if (!(allUmum == 0 || umumCMplt == 0)) {
                percent = (umumCMplt / allUmum) * 100;
            }
            else { percent = 0; }

            $('#divKerosakan').attr("style", "width: " + percent.toFixed(0) + "%");
            $('#divKerosakan').html(percent.toFixed(0) + "%");
        });
    });

    // list all hostel status==Active
    listHstlActive(function () {
        $.each(obj_hostel.data, function (i, item) {
            $('#listHostel').append('<p class="m-a-1">' +
                '<span class="text-uppercase"><b>' + item.hostel_name + ' : </b></span>' +
                '<span id="hstl' + item.hostel_id + '">0</span><span> BED</span>' +
                '</p>');

            bedList(item.hostel_id, function () {
                count = obj_bedList.data.length;
                $.each(obj_bedList.data, function (j, itemJ) {
                    $('#hstl' + item.hostel_id).html(count);
                });
            });
        });
    });

    // total change==New
    alertChange(function () {
        $('#totalNew').html(obj_alertChange.data.length);
    });

    // total change==Accept
    alertChgAccpt(function () {

        $('#totalAccept').html(obj_alrtChng.data.length);
    });

    // total change==Reject
    alertChgRjct(function () {
        $('#totalReject').html(obj_alrtChng.data.length);
    });

    // total change==Verify
    alertChgVrfy(function () {
        $('#totalVerify').html(obj_alrtChng.data.length);
    });

    // total change==Complete
    alertChgCmplt(function () {
        $('#totalComplete').html(obj_alrtChng.data.length);
    });
    // Creating a date object
    var today = new Date();


    // $('#dataMonth').html(today.toLocaleString('default', { month: 'long' })+" "+(new Date).getFullYear());
    countKatProgram(kateProg1);
    countKatProgram(kateProg2);
    countKatProgram(kateProg3);
    countKatProgram(kateProg4);
    // listProgramAll();
    setIntervalDateKat();

});

function countGender(gender, returnValue) {

    var settings = {
        "url": host + "api_hep/public/hepHostelRoom/listAll/" + gender,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_countGender = response;
        // console.log(obj_campusMainDanHostel);
        returnValue();
    });
}
function listAduUmum(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepaduan/listAduUmum",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_repUmum = response;
        returnValue();
    });
}

function listAduUmumCmpltd(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepaduan/listAduUmumCmplt",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_repUmumCmplt = response;
        returnValue();
    });
}

function listKerosakan(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepaduan/listKerosakan",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_repRosak = response;
        returnValue();
    });
}

function listKerosakanCmplt(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepaduan/listRosakCmplt",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_repRosakCmplt = response;
        returnValue();
    });
}

function listHstlActive(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostel/listActive",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_hostel = response;
        returnValue();
    });
}

function alertChgAccpt(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChngAccept",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alrtChng = response;
        returnValue();
    });
}

function alertChgRjct(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChngRjct",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alrtChng = response;
        returnValue();
    });
}

function alertChgVrfy(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChgVrfy",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alrtChng = response;
        returnValue();
    });
}

function alertChgCmplt(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChange/alertChgCmplt",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_alrtChng = response;
        returnValue();
    });
}
campusMainDanHostel(function () {

    // var cityCampusValues = [
    //     143,
    //     114,
    //     296,
    //     2,
    //     179,
    //     347,
    //     85,
    //     146,
    //     409,
    //     161,
    //     269
    // ];

    // var cityCampusValuesReside = [
    //     140,
    //     114,
    //     280,
    //     2,
    //     140,
    //     310,
    //     83,
    //     156,
    //     309,
    //     110,
    //     100
    // ];

    // console.log(cityCampusCategories);
    // console.log(cityCampusValues);

    // // cityCampusCategories =[
    // //     "UCMI 11",
    // //     "UCMI 4",
    // //     "DUTAMAS",
    // //     "PICOMS 20 (PV12B)",
    // //     "UCMI 5",
    // //     "UCMI 12",
    // //     "UCMI 9",
    // //     "PICOMS 23",
    // //     "PICOMS 20 (PV12)",
    // //     "PICOMS 19",
    // //     "UCMI 24 (YT)"
    // // ]
    // // cityCampusValues = [
    // //     143,
    // //     114,
    // //     296,
    // //     2,
    // //     179,
    // //     347,
    // //     85,
    // //     146,
    // //     409,
    // //     161,
    // //     269
    // // ]
    // // cityCampusValuesReside = [
    // //     140,
    // //     114,
    // //     280,
    // //     2,
    // //     140,
    // //     310,
    // //     83,
    // //     156,
    // //     309,
    // //     110,
    // //     100
    // // ]


    let data = obj_campusMainDanHostel.data1;
    let data2 = obj_campusMainDanHostel.data2;
    var mainCampusData = data["MAIN CAMPUS"];
    var cityCampusData = data["CITY CAMPUS"];
// console.log(data);
    var mainCampusData2 = data2["MAIN CAMPUS"];
    var cityCampusData2 = data2["CITY CAMPUS"];

    
// Comparing objects
let keys1 = Object.keys(cityCampusData);
let keys2 = Object.keys(cityCampusData2);

// Comparing objects
let keys3 = Object.keys(mainCampusData);
let keys4 = Object.keys(mainCampusData2);

// Sort keys to ensure order doesn't affect comparison
keys1.sort();
keys2.sort();
keys3.sort();
keys4.sort();
// console.log(keys1);
// console.log(keys2);


// Check if both objects have the same keys

//afiez tmbah and logic tu, before this || or
 // if ((JSON.stringify(keys1) === JSON.stringify(keys2)|| JSON.stringify(keys3) === JSON.stringify(keys4))) {

if ((JSON.stringify(keys1) === JSON.stringify(keys2)&& JSON.stringify(keys3) === JSON.stringify(keys4))) {
    // If the keys are the same, execute this block
    console.log("Both objects have the same keys.");

    // Add your code logic here
} else {
    // If the keys are different, execute this block
    console.log("Objects have different keys.");

    // Add keys from cityCampusData2 that are not present in cityCampusData
    keys2.forEach(key => {
        if (!keys1.includes(key)) {
            cityCampusData[key] = 0; // Set the value to 0 for new keys
        }
    });
    
    // Add keys from cityCampusData2 that are not present in cityCampusData
    keys4.forEach(key => {
        if (!keys3.includes(key)) {
            mainCampusData[key] = 0; // Set the value to 0 for new keys
        }
    });
}

var mainCampusCategories = Object.keys(mainCampusData);
var mainCampusValues = Object.values(mainCampusData);

var cityCampusCategories = Object.keys(cityCampusData);
var cityCampusValues = Object.values(cityCampusData);

    // 
    var mainCampusValuesReside = Object.values(mainCampusData2);
    var cityCampusValuesReside = Object.values(cityCampusData2);

    function extractNumericValue(name) {
        const matches = name.match(/\d+/); // Extract numeric values
        return matches ? parseInt(matches[0], 10) : 0;
    }
    
    // Sort city campus data by hostel name with custom sorting
    cityCampusCategories.sort((a, b) => extractNumericValue(a) - extractNumericValue(b));
    cityCampusValues = cityCampusCategories.map(category => cityCampusData[category]);
    cityCampusValuesReside = cityCampusCategories.map(category => cityCampusData2[category]);
    
    // console.log(obj_campusMainDanHostel);
    var customColors = ['#4B90C0', '#4BC0C0'];

    // Create the main campus chart
    var mainCampusChart = echarts.init(document.getElementById('mainCampusChart'));

    var mainCampusOption = {
        tooltip: {
            trigger: 'axis', // Set the trigger type to 'axis' for horizontal bar charts
            axisPointer: {
                type: 'shadow' // Use 'shadow' type for better visibility
            },
            formatter: function (params) {
                // Customize the tooltip content here
                return params[0].name + ': ' + params[0].value + ' Room';
            }
        },
        grid: { containLabel: true },

        // title: {
        //     text: 'Main Campus Horizontal Bar Chart with Custom Colors'
        // },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: mainCampusCategories
        },
        legend: {
            data: ['Beds Not Available', 'Bed Available'] // Add legend data here
        },
        series: [
            {
                name: 'Beds Not Available', // Legend name for the first series
                type: 'bar',
                data: mainCampusValues,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function (params) {
                        // return params.value + ' Beds Not Available';
                        return params.value ;
                    }
                },
                itemStyle: {
                    // color: customColors[0] 
                    color: '#808080' 
                }
            },
            {
                name: 'Bed Available', // Legend name for the second series
                type: 'bar',
                stack: 'stackGroup', 
                data: mainCampusValuesReside,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function (params) {
                        return params.value;
                        // return params.value + ' Bed Available';
                    }
                },
                itemStyle: {
                    // color: '#808080' 
                    color: customColors[0] 
                }
            }
        ]
    };

    // Set the chart option and render the main campus chart
    mainCampusChart.setOption(mainCampusOption);

    // Create the city campus chart
    var cityCampusChart = echarts.init(document.getElementById('cityCampusChart'));

    var cityCampusOption = {
        tooltip: {
            trigger: 'axis', // Set the trigger type to 'axis' for horizontal bar charts
            axisPointer: {
                type: 'shadow' // Use 'shadow' type for better visibility
            },
            formatter: function (params) {
                // Customize the tooltip content here
                return params[0].name + ': ' + params[0].value + ' Room';
            }
        },
        // title: {
        //     text: 'City Campus Horizontal Bar Chart with Custom Colors'
        // },
        grid: { containLabel: true },

        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: cityCampusCategories
        },
        legend: {
            data: ['Beds Not Available', 'Bed Available'] // Add legend data here
        },
        series: [
            {
                name: 'Beds Not Available', // Legend name for the first series
                type: 'bar',
                stack: 'stackGroup', 
                data: cityCampusValues,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function (params) {
                        return params.value ;
                        // return params.value + ' Beds Not Available';
                    }
                },
                itemStyle: {
                    color: '#808080' 
                }
            },
            {
                name: 'Bed Available', // Legend name for the second series
                type: 'bar',
                stack: 'stackGroup', 
                data: cityCampusValuesReside,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: function (params) {
                        return params.value;
                        // return params.value + ' Bed Available';
                    }
                },
                itemStyle: {
                    color: customColors[1] 
                }
            }
        ]
    };

    // Set the chart option and render the city campus chart
    cityCampusChart.setOption(cityCampusOption);


    window.addEventListener('resize', function () {
        mainCampusChart.resize();
        cityCampusChart.resize();
    });
});

function campusMainDanHostel(returnValue) {
    var settings = {
        "url": host + "api_hep/public/hepHostelChkinout/dashboardMainCity",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        obj_campusMainDanHostel = response;
        // console.log(obj_campusMainDanHostel );
        returnValue();
    });
}
// countGender('0',function(){


//     let totalBed = obj_countGender.data;
//     $('#ToBed').html(totalBed);

//     penghuni(function(){ 
//          TotalOccupied = obj_penghuni.data
//         TotalOccupiedFemale = TotalOccupied.Female;
//         TotalOccupiedMale = TotalOccupied.Male;
//         countGender('Female',function(){
//         var totalFemalebilik= obj_countGender.data;

//         let Bilikkosonggirl= totalFemalebilik-TotalOccupiedFemale;
//         let bilikkosongLelaki= totalBed-totalFemalebilik-TotalOccupiedMale;
//         // console.log(bilikkosongLelaki);

//         generatechartBed(Bilikkosonggirl,bilikkosongLelaki, totalBed);
//         // console.log(bilikkosongLelaki);


//         });

//         $('#gegirlOccu').html(TotalOccupiedFemale);
//         $('#MenOccu').html(TotalOccupiedMale);
//     });



// }); //nie utk count total bilik wether itu perempuan, lelaki, & total smua


function countKatProgram(kat_program) {
    // console.log(kat_program);
    kat_program_id = kat_program;


    if (kat_program == '01') {
        prog_category_id = 'External Invitation';

    } else if (kat_program == '02') {
        prog_category_id = 'Creditable Activities';

    } else if (kat_program == '03') {
        prog_category_id = 'Non-Credit Activities';

    } else if (kat_program == '04') {
        prog_category_id = 'Lain-lain';


    }
    // console.log(prog_category_id);


    var form = new FormData();
    form.append("prog_category_id", prog_category_id);

    // 


    var settings = {
        "url": host + "api_hep/public/hepProgram/countbyKat",
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

        count = JSON.parse(response);
        countTotal = count;
        $("#kat_" + (kat_program)).html(count.data.total);

        // returnValue();
    });
}

function setIntervalDateKat() {
    // Define an array to store date and program IDs
    var dateAndPrograms = [
        { dateId: "datekat_01", programId: kateProg1 },
        { dateId: "datekat_02", programId: kateProg2 },
        { dateId: "datekat_03", programId: kateProg3 },
        { dateId: "datekat_04", programId: kateProg4 }
    ];

    var previousValues = {};

    var x = setInterval(function () {
        dateAndPrograms.forEach(function (item) {
            var dateId = item.dateId;
            // console.log(dateId);

            var programId = item.programId;
            // console.log(programId);

            var currentValue = $("#" + dateId).val();
            var previousValue = previousValues[dateId];
            if (currentValue !== previousValue) {
                previousValues[dateId] = currentValue;

                if (currentValue !== "") {
                    dateBudget(programId, currentValue);
                } else {
                    dateBudget(programId, '0');

                }
            }
        });
    }, 1000);
}

function dateBudget(kat_program, date) {


    if (kat_program == '01') {
        prog_category_id = 'External Invitation';

    } else if (kat_program == '02') {
        prog_category_id = 'Creditable Activities';

    } else if (kat_program == '03') {
        prog_category_id = 'Non-Credit Activities';

    } else if (kat_program == '04') {
        prog_category_id = 'Lain-lain';


    }

    date = date.split(`/`);
    month = date[0];
    year = date[1];

    // console.log(month + " X " + year+ " id =  "+ prog_category_id);
    var form = new FormData();
    form.append("prog_category_id", prog_category_id);
    form.append("month", month);
    form.append("year", year);

    var settings = {
        "url": host + "api_hep/public/hepProgram/TotalBudget",
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
        objCount = JSON.parse(response);
        $("#budget_" + kat_program).html("RM " + objCount.Count);

        // returnValue();
    });
}

// // Function to update the booking count
// function updateBookingCount() {
//     var settings = {
//         "url": host + "api_hep/public/hepHostelBooking/countAlert",
//         "method": "GET",
//         "timeout": 0,
//         "headers": {
//             "Authorization": "picoms " + window.sessionStorage.token
//         },
//     };

//     $.ajax(settings).done(function (response) {
//         obj_alrtBook = response;

//         // Count the number of items in the "data" array
//         var count = response.data.length;

//         // Update the HTML content with the count
//         $("#bookingCount").text("Pending: " + count);
//     });
// }

// // Intersection Observer configuration
// var options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.5 // Adjust as needed
// };

// // Create the Intersection Observer
// var observer = new IntersectionObserver(function (entries, observer) {
//     entries.forEach(function (entry) {
//         if (entry.isIntersecting) {
//             // If the element is visible on the screen, update the booking count
//             updateBookingCount();
//             observer.unobserve(entry.target);
//         }
//     });
// }, options);

// // Observe the element with the ID "bookingCountContainer"
// observer.observe(document.getElementById('bookingCountContainer'));


// Function to update the booking count
function updateBookingCount() {
    fetchDataAndUpdate("#bookingCount", "api_hep/public/hepHostelBooking/countAlert");
}

// Function to update the change count
function updateChangeCount() {
    fetchDataAndUpdate("#changeCount", "api_hep/public/hepHostelChange/alertChgNew");
}


// Function to update the checkout count
function updateChkOutNew() {
    fetchDataAndUpdate("#checkoutCount", "api_hep/public/hepHostelChkinout/alertChkOutNewOnly");
}

// Function to update the damage complaint count
function updateDmgComplaint() {
    fetchDataAndUpdate("#checkDmgHostel", "api_hep/public/hep_aduanResponden/complaintNewAlert");
}

// Function to fetch data and update the count
function fetchDataAndUpdate(elementId, apiUrl) {
    var settings = {
        "url": host + apiUrl,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "picoms " + window.sessionStorage.token
        },
    };

    $.ajax(settings).done(function (response) {
        // Assuming the count is available in the "data" array
        var count = response.data.length;

        // Update the HTML content with the count
        $(elementId).text("Pending: " + count);
    });
}

// Intersection Observer configuration
var options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Adjust as needed
};

// Create the Intersection Observer for booking count
var bookingObserver = new IntersectionObserver(handleIntersection, options);
bookingObserver.observe(document.getElementById('bookingCountContainer'));

// Create the Intersection Observer for change count
var changeObserver = new IntersectionObserver(handleIntersection, options);
changeObserver.observe(document.getElementById('changeCountContainer'));

// Create the Intersection Observer for checkout count
var checkoutObserver = new IntersectionObserver(handleIntersection, options);
checkoutObserver.observe(document.getElementById('checkoutCountContainer'));

// Create the Intersection Observer for damage complaint count
var dmgComplaintObserver = new IntersectionObserver(handleIntersection, options);
dmgComplaintObserver.observe(document.getElementById('dmgComplaintContainer'));

// Callback function for Intersection Observer
function handleIntersection(entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // If the element is visible on the screen, update the count
            if (entry.target.id === 'bookingCountContainer') {
                updateBookingCount();
            } else if (entry.target.id === 'changeCountContainer') {
                updateChangeCount();
            } else if (entry.target.id === 'checkoutCountContainer') {
                updateChkOutNew();
            } else if (entry.target.id === 'dmgComplaintContainer') {
                updateDmgComplaint();
            }

            observer.unobserve(entry.target);
        }
    });
}
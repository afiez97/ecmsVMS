// DROP DOWN LIST PROGRAM START
function liststatus(data) {
  var self = this;
  self.id = ko.observable(data.id);
  self.status_name = ko.observable(data.status_name);
}

function statusViewModel() {
  var self = this;
  self.list = ko.observableArray();
  self.twm_status = ko.observable();

  var settings = {
    "url": host+"api_tetapan_picoms/public/statusList",
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response)
    var listing = JSON.stringify(response.data);

    setTimeout(function () {
      $.each(JSON.parse(listing), function (index, item) {
        self.list.push(new liststatus(item));
      });
    }, 500);
  });
}

$(document).ready(function () {
  const listStatus = document.querySelector("#status");
  ko.applyBindings(new statusViewModel(), listStatus);
});
// DROP DOWN LIST PROGRAM END
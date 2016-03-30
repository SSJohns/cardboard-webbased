$(document).ready(function(){
  $('a.toggler').click(function(){
      $(this).toggleClass('off');
  });
});

$(document).ready(function() {
    $("img").on("click", function(event) {
        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;
        $("#myDialog").dialog("open");
        $("#myDialog").dialog({
            autoOpen  : false,
            modal     : true,
            title     : "Comment To Add",
            buttons   : {
                      'OK' : function() {
                          var textValue = $('#myTextBox').val();
                          var change1 = document.getElementById("changesAdded");
                          var ul = document.getElementById("changesAdded");
                          var li = document.createElement("li");
                          li.appendChild(document.createTextNode(textValue));
                          ul.appendChild(li);
                      },
                      'Close' : function() {
                          $(this).dialog('close');
                      }
                        }
        });
    });
});

function set_body_height() { // set body height = window height
  $('body').height($(window).height());
}

$(document).ready(function() {
  $(window).bind('resize', set_body_height);
  set_body_height();
});

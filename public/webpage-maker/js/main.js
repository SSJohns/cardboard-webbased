$(document).ready(function(){
  $('a.toggler').click(function(){
      $(this).toggleClass('off');
  });
});

$(document).ready(function() {
    $("img").on("click", function(event) {
        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;
        var textValue = window.prompt("sometext","defaultText") + " at X: " + x + " Y: " + y
        var change1 = document.getElementById("changesAdded");
        var ul = document.getElementById("changesAdded");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(textValue));
        ul.appendChild(li);
    });
});

function set_body_height() { // set body height = window height
  $('body').height($(window).height());
}

$(document).ready(function() {
  $(window).bind('resize', set_body_height);
  set_body_height();
});

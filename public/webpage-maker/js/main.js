var firebaseRef = "https://cardboard-webpage.firebaseIO.com/images/";

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
        //get the hash in this webpage
        var idx = window.location.href.indexOf('#');
        var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
        var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
        spinner.spin(document.getElementById('spin'));
        // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
        f.set(filePayload, function() {
          spinner.stop();
          document.getElementById("pano").src = e.target.result;
          $('#file-upload').hide();
          // Update the location bar so the URL can be shared with others
          editWebPage(hash);
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

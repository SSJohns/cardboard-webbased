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
        var textValue = window.prompt("Insert a Description of this Location","");
        var textPlace = textValue + " at X: " + x + " Y: " + y;
        var change1 = document.getElementById("changesAdded");
        var ul = document.getElementById("changesAdded");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(textPlace));
        ul.appendChild(li);
        //get the hash in this webpage
        var idx = window.location.href.indexOf('#');
        var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
        var dNow = new Date();
        var s = dNow.getMonth() + dNow.getDate() + dNow.getFullYear() + dNow.getHours() + dNow.getMinutes();
        console.log(s);
        var f = new Firebase(firebaseRef + 'pano/' + hash + '/comment/' +  makeid());
        // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
        f.child('X').set(x);
        f.child('Y').set(y);
        f.child('text').set(textValue);
    });
});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function set_body_height() { // set body height = window height
  $('body').height($(window).height());
}

$(document).ready(function() {
  $(window).bind('resize', set_body_height);
  set_body_height();
});

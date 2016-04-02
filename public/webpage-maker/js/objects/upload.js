var spinner = new Spinner({color: '#ddd'});
var firebaseRef = "https://cardboard-webpage.firebaseIO.com/images/";

function handleFileSelect(evt) {
  var f = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var filePayload = e.target.result;
      // Generate a location that can't be guessed using the file's contents and a random number
      var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
      var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
      spinner.spin(document.getElementById('spin'));
      // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
      f.set(filePayload, function() {
        spinner.stop();
        document.getElementById("pano").src = e.target.result;
        $('#file-upload').hide();
        // Update the location bar so the URL can be shared with others
        var idx = window.location.href.indexOf('/');
        var webpage = (idx > 0) ? window.location.href.slice(0, idx + 1) : '';
        webpage = window.location.origin + "/cardboard-webbased/#" + hash;
        window.location.hash = hash;
        var section_set = document.getElementById("uploader");
        section_set.innerHTML =  webpage;
        //section_set.appendChild(link);
        //document.body.appendChild(section_set);
        console.log(window.location);
      });
    };
  })(f);
  reader.readAsDataURL(f);
}

$(function() {
  $('#spin').append(spinner);
console.log('spinning');
  var idx = window.location.href.indexOf('#');
  var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
  if (hash === '') {
    // No hash found, so render the file upload button.
    $('#file-upload').show();
    document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
    console.log("done");
  } else {
    // A hash was passed in, so let's retrieve and render it.
    console.log("rendering")
    spinner.spin(document.getElementById('spin'));
    var f = new Firebase(firebaseRef + '/pano/' + hash + '/filePayload');
    f.once('value', function(snap) {
      var payload = snap.val();
      if (payload != null) {
        eraseWorld();
        init(payload);
        console.log(payload);
      } else {
        $('#body').append("Not found");
      }
      spinner.stop();
    });
  }
});

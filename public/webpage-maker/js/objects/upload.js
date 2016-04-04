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
        //<input type="text" value="&lt;a href=&quot;http://www.mysite.com/link&quot; target=&quot;_blank&quot;&gt;&lt;img src=&quot;http://www.mysite.com/img.jpg&quot; border=&quot;0&quot; alt=&quot;mysite.com&quot;&gt;&lt;/a&gt;" />
        window.location.hash = hash;
        var section_set = document.getElementById("uploader");
        var link = document.createElement('input');
        link.setAttribute('type','text');
        link.setAttribute('value',webpage);
        link.setAttribute('ahref',webpage);
        //link.setAttribute('target',webpage);
        link.setAttribute('src',webpage);
        link.setAttribute('border','0');
        link.setAttribute('alt',webpage);

        section_set.appendChild(link);
      });
    };
  })(f);
  reader.readAsDataURL(f);
}

$(function() {
  $('#spin').append(spinner);
  var idx = window.location.href.indexOf('#');
  var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
  if (hash === '') {
    // No hash found, so render the file upload button.
    $('#file-upload').show();
    document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
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
      } else {
        $('#body').append("Not found");
      }
      spinner.stop();
    });
  }
});

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}






function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}


// Login part of the app

//window.onload = function () {
//    var emailDetails = document.getElementById("txtEmail");
//    var passDetails = document.getElementById("txtPassword");
//    var btnLogin = document.getElementById("btnLogin");
//    var btnLogout = document.getElementById("btnLogout");
//    var btnSignin = document.getElementById("create");
//    var textInput = document.getElementById("testInput");
//    var sendInput = document.getElementById("post");
//
//}
//
////add event listener for login button
////loging in 
//btnLogin.addEventListener("click", e => {
//    var email = emailDetails.value;
//    var pass = passDetails.value;
//    var auth = firebase.auth();
//
//    var promise = auth.signInWithEmailAndPassword(email, pass);
//    promise.catch(e => console.log(e.message));
//
//});
//
//
////loging out
//btnLogout.addEventListener("click", e => {
//    firebase.auth().signOut();
//});
//



var emailAddress = document.getElementById("txtEmail");
var emailPass = document.getElementById("txtPass");
document.getElementById("login").addEventListener("click", login);
document.getElementById("btnLogout").addEventListener("click", logOut);
document.getElementById("create-post").addEventListener("click", writeNewPost);


$("#posts").hide();

getPosts();

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    //User is signed in.
   
    $("#posts").show();

  } else {
    
    $("#posts").hide();
    // No user is signed in.
  }
});

function login() {
    
    var email = emailAddress.value;
    var pss = emailPass.value;
    var auth = firebase.auth();
    var promise = auth.signInWithEmailAndPassword(email, pss).then(
    function(){
     getPosts();
    });
    

}

function logOut() {
    console.log("was pressed");
    firebase.auth().signOut();
}


function writeNewPost() {

  if (!$("#textInput").val()) {
    return
  }

  var text = document.getElementById("textInput").value;
  var userName = firebase.auth().currentUser.displayName;

  // A post entry.
  var postData = {
    name: userName,
    body: text
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('Ubiqum').push().key;
  
  var updates = {};
  updates[newPostKey] = postData;

  $("#textInput").val("");



  return firebase.database().ref().child('Ubiqum').update(updates);
}


function getPosts() {

  firebase.database().ref('Ubiqum').on('value', function (data) {

    var logs = document.getElementById("posts");
    logs.innerHTML = "";

    var posts = data.val();

    var template = "";

    for (var key in posts) {
      if (posts[key].name == firebase.auth().currentUser.displayName) {
        template += `
          <div class="notification is-info">
            <p id="insideChatRight1" class="name">${posts[key].name} says:</p>
            <p id="insideChatRight2">${posts[key].body}</p>
          </div>
        `;
      } else {
        template += `
          <div class="notification is-primary">
            <p id="insideChatLeft1" class="name">${posts[key].email} says:</p>
            <p id="insideChatLeft2">${posts[key].body}</p>
          </div>
        `;
      }

    }

    logs.innerHTML = template;

    
  });
}
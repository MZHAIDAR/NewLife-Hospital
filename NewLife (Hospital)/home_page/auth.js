db.collection('appointments').get().then(snapshot => {
    console.log(snapshot.docs)
  })
  
  
  //listsener
  auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user logged in: ', user);
      } else {
        console.log('user logged out');
      }
    })

// Sign Up
const signupForm = document.querySelector('#signup-form');
if(signupForm){
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-name'].value;
    const type = signupForm['signup-type'].value;
  
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      console.log(cred.user);
      db.collection('users').doc(cred.user.uid).set({
          name: name,
          email: email,
          type: type
      }).then(() => window.location.href = "home.html");
      //reset the signup form and welcoming
      signupForm.reset();
      alert(`Welcome to spandan, ${name}`)
    }).catch((err)=>{
      alert(err.message);
    })
  });
}

//logout

const logout = document.querySelector('#logout');
if(logout){
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
      window.location.href = "/home_page/login.html"
    })
  });
}



// login form    
const loginForm = document.querySelector('#login-form');
if(loginForm){
  console.log('here')
  try{
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // get user info
      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;
    
      // log the user in
      auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log(cred.user);
        window.location.href = "home.html";
        // resetting login form
        loginForm.reset();
      }).catch(()=>{
        alert("User credentials are incorrect!!!!")
      })
    
    });
  }catch(err){
    alert(err);
  }
}
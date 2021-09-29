import * as firebase from "firebase"

var firebaseConfig={
    apiKey: "AIzaSyCwOJ1BAHphxGnPpp5V1VbwnkAXqMt0D3s",
    authDomain: "transfeeradev.firebaseapp.com",
    databaseURL:"https://transfeeradev-default-rtdb.firebaseio.com/",
    projectId: "transfeeradev",
    storageBucket: "transfeeradev.appspot.com",
    messagingSenderId: "53533026456",
    appId: "1:53533026456:web:7aa2f901d035b9804dc8ed"
}

// Initialize Firebase
var fireDb = firebase.initializeApp(firebaseConfig);

export default fireDb.database().ref();
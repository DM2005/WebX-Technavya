importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCtGocvbP6NMxTT8LK5VJFAJaZXD0PLsFk",
  authDomain: "nirogcare-in.firebaseapp.com",
  projectId: "nirogcare-in",
  storageBucket: "nirogcare-in.firebasestorage.app",
  messagingSenderId: "1039659631079",
  appId: "1:1039659631079:web:590680cbc51d97b00e3d42",
  measurementId: "G-SEZFH495VL"
};

firebase.initializeApp(firebaseConfig);

//retrive firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload){
    console.log("Retrive Background Message",payload);
    
})



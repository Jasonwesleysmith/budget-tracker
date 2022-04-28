// functions to save to database, on upgraded, on success on error
let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
  };

  request.onsuccess = function(event) {
   
    db = event.target.result;
  
    if (navigator.onLine) {
      uploadPizza();
    }
  };
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

  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');
  
    const budgetObjectStore = transaction.objectStore('pending');
  
    // add record to your store with add method.
    budgetObjectStore.add(record);
  }

  function uploadBudget() {
    
    const transaction = db.transaction(['pending'], 'readwrite');
  
    const pizzaObjectStore = transaction.objectStore('pending');
  
    const getAll = budgetObjectStore.getAll();
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
          fetch('/api/transaction/bulk', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
    
              const transaction = db.transaction(['pending'], 'readwrite');
              const pizzaObjectStore = transaction.objectStore('pending');
              // clear all items in your store
              budgetObjectStore.clear();
            })
            .catch(err => {
              // set reference to redirect back here
              console.log(err);
            });
        }
      };
  }

  window.addEventListener('online', uploadBudget);


  
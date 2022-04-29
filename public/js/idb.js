let db;
const request = indexedDB.open('transaction', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function (event) {

    db = event.target.result;

    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {

    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('pending');

    budgetObjectStore.add(record);
    alert('budget has ben updated!');
}

function uploadBudget() {

    const transaction = db.transaction(['pending'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('pending');

    const getAll = budgetObjectStore.getAll();
    getAll.onsuccess = function () {

        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['pending'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('pending');

                    budgetObjectStore.clear();
                })
                .catch(err => {

                    console.log(err);
                });
        }
    };
}

window.addEventListener('online', uploadBudget);



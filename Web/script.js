const baseUrl = 'http://localhost:3000/timetable/';
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        alert('Hiba történt:', error);
    }
}

async function displayTimetable() {
    const data = await fetchData(baseUrl);
    const div = document.getElementById('timetable');

    const dayOrder = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

    const timetableMap = {};
    dayOrder.forEach(day => {
        timetableMap[day] = {};
    });

    data.forEach(e => {
        if (timetableMap[e.day]) {
            timetableMap[e.day][e.time] = e.subject;
        }
    });

    let timetable = '<table>';
    timetable += '<tr><th>Nap</th>';
    for (let i = 0; i <= 12; i++) {
        timetable += `<th>${i}. óra</th>`;
    }
    timetable += '</tr>';

    dayOrder.forEach(day => {
        timetable += `<tr><td>${day}</td>`;
        for (let i = 0; i <= 12; i++) {
            const subject = timetableMap[day][i] || '';
            timetable += `<td>${subject}</td>`;
        }
        timetable += '</tr>';
    });

    timetable += '</table>';
    div.innerHTML = timetable;
}

async function createSubject() {
    const dayForAdd = document.getElementById("dayForAdd");
    const timeForAdd = document.getElementById("timeForAdd");
    const subjectForAdd = document.getElementById("subjectForAdd");
    let isExist = false

    const data = await fetchData(baseUrl);
    data.forEach(e =>{
        if(e.day == dayForAdd.value && e.time == timeForAdd.value){
            isExist = true;
            return alert("Hiba történt: " +  dayForAdd.value + " " + timeForAdd.value + ".-ban már van óra! ");
        }
    });

    if (subjectForAdd.value != null && subjectForAdd.value != "" && !isExist) {
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ day: dayForAdd.value, time: timeForAdd.value, subject: subjectForAdd.value  })
                
            });
            console.log(response);
            if (response.ok) {
                displayTimetable();
            } else {
               return alert('Hiba történt a létrehozáskor.'+ response.error);
            }
        } catch (error) {
            return alert('Hiba történt:'+ error);
        }
    }else{
        return alert("Hiba történt: Üres bemenet vagy létező óra!");
    }
}

async function deleteSubject() {
    const dayForDelete = document.getElementById("dayForDelete");
    const timeForDelete = document.getElementById("timeForDelete");
    let isExist = false
    let idForDelete = null;

    const data = await fetchData(baseUrl);
    data.forEach(e =>{
        if(e.day == dayForDelete.value && e.time == timeForDelete.value){
            isExist = true;
            idForDelete = e.id;
        }
    });

    if (isExist) {
        try {
            const response = await fetch(baseUrl+idForDelete, {
                method: 'DELETE'
            });
            if (response.ok) {
                displayTimetable();
            } else {
                return alert('Hiba történt a kurzus törlésekor.');
            }
        } catch (error) {
            return alert('Hiba történt:'+ error);
        }
    }else{
        return alert("Hiba történt: Nincs ilyen óra!");
    }
}

async function editSubject() {
    const dayForUpdate = document.getElementById("dayForUpdate");
    const timeForUpdate = document.getElementById("timeForUpdate");
    const subjectForUpdate = document.getElementById("subjectForUpdate");
    let isExist = false
    let idForUpdate= null;

    if(subjectForUpdate.value != null && subjectForUpdate.value != ''){
        const data = await fetchData(baseUrl);
        data.forEach(e =>{
            if(e.day == dayForUpdate.value && e.time == timeForUpdate.value){
                isExist = true;
                idForUpdate = e.id;
            }
        });
        if (isExist) {
            try {
                const response = await fetch(baseUrl+idForUpdate, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ day: dayForUpdate.value, time: timeForUpdate.value, subject: subjectForUpdate.value  })
                });
                if (response.ok) {
                    displayTimetable();
                } else {
                    return alert('Hiba történt a tantárgy szerkesztésekor.');
                }
            } catch (error) {
                return alert('Hiba történt:'+ error);
            }
        }else{
            return alert("Hiba történt: Nincs ilyen óra!");

        }
    }else{
       return alert("Hiba történt: Üres bemenet!");
    }
    
}

const value = document.getElementById("value");
const input = document.getElementById("timeForAdd");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

const value2 = document.getElementById("value2");
const input2 = document.getElementById("timeForDelete");
value2.textContent = input2.value;
input2.addEventListener("input", (event) => {
  value2.textContent = event.target.value;
});

const value3 = document.getElementById("value3");
const input3 = document.getElementById("timeForUpdate");
value3.textContent = input3.value;
input3.addEventListener("i  nput", (event) => {
  value3.textContent = event.target.value;
});

displayTimetable();
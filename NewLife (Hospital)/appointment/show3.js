const appointmentlist = document.querySelector('#appointmentlist');

function renderappointment(docname, docsection, doccontact, doccase, doctime, docstatus, id, usertype, userId) {

    let li = document.createElement('div');
    let name = document.createElement('p');
    let section = document.createElement('p');
    let contact = document.createElement('p');
    let caset = document.createElement('p');
    let time = document.createElement('p');
    let status = document.createElement('p');
    let space = document.createElement('span');
    let reject = document.createElement('button');
    let approve = document.createElement('button');

    name.textContent = `NAME: ${docname}`;
    section.textContent = `DEPARTMENT: ${docsection}`;
    contact.textContent = `CONTACT: ${doccontact}`;
    caset.textContent = `CASE TYPE: ${doccase}`;
    var timestamp = doctime;
    var date = new Date(timestamp);
    if(date.getMonth()+1>10){
        if(date.getDate()>10){
            time.textContent= `DATE AND TIME: On ${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()} At ${date.getHours()} Hours`;
        }
        else{
            time.textContent= `DATE AND TIME: On 0${date.getDate()}/${(date.getMonth()+1)}/${date.getFullYear()} At ${date.getHours()} Hours`;
        }
    }
    else{
        if(date.getDate()>10){
            time.textContent= `DATE AND TIME: On ${date.getDate()}/0${(date.getMonth()+1)}/${date.getFullYear()} At ${date.getHours()} Hours`;
        }
        else{
            time.textContent= `DATE AND TIME: On 0${date.getDate()}/0${(date.getMonth()+1)}/${date.getFullYear()} At ${date.getHours()} Hours`;
        }
    }
    //time.textContent = `Date And Time: ${date}`;
    status.textContent = `STATUS: ${docstatus}`;
    reject.textContent = 'Reject';
    approve.textContent = 'Approve';
    space.textContent = ' ';

    li.appendChild(status);
    li.appendChild(name);
    li.appendChild(section);
    li.appendChild(contact);
    li.appendChild(caset);
    li.appendChild(time);
    if (usertype == "doctor") {
        li.appendChild(reject);
        li.appendChild(space);
        li.appendChild(approve);

        reject.addEventListener('click', async () => {
            try{
                let prevAppointments = await db.collection('appointments').doc(userId).get();
                prevAppointments = prevAppointments.data().userAppointments;
                prevAppointments[id].status = "Rejected";
                await db.collection('appointments').doc(userId).update({
                    userAppointments: prevAppointments
                })
                location.reload();
            }
            catch(err){
                console.log("something went wrong", err);
            }
        })

        approve.addEventListener('click', async() => {
            try{
                let prevAppointments = await db.collection('appointments').doc(userId).get();
                prevAppointments = prevAppointments.data().userAppointments;
                prevAppointments[id].status = "Approved";
                await db.collection('appointments').doc(userId).update({
                    userAppointments: prevAppointments
                })
                location.reload();
            }
            catch(err){
                console.log("something went wrong", err);
            }
        })
    }
    li.classList.add('some-clss')
    appointmentlist.appendChild(li);
}

auth.onAuthStateChanged(user => {

    if(!user){
        alert("You are not logged in!!");
        window.location.href = "/home_page/login.html"
    }

    db.collection("users").doc(user.uid).get().then(doc => {
        const usertype = doc.data().type;
        if (usertype == "doctor") {
            db.collection("appointments")
                .get()
                .then(querySnapshot => {                    
                    querySnapshot.forEach((appointment) => {
                        const res = appointment.data().userAppointments;
                        res.forEach((obj, indx) => {
                            console.log(obj)
                            if(obj.status=="Rejected"){
                                renderappointment(obj.name, obj.section, obj.contact, obj.case, obj.time, obj.status, indx, usertype, appointment.id);
                            }
                        })
                    })
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
        else {
            db.collection("appointments").doc(user.uid)
                .get()
                .then(querySnapshot => {
                    const res = querySnapshot.data().userAppointments;
                    res.forEach((obj, indx) => {
                        console.log(obj)
                        if(obj.status=="Rejected"){
                            renderappointment(obj.name, obj.section, obj.contact, obj.case, obj.time, obj.status, indx, usertype);
                        }
                    })
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
    });

})

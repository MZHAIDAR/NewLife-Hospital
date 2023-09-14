//this for tracking status of user loggin or out
auth.onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        const form = document.querySelector('#book-appointment');


        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const prevAppointments = await db.collection('appointments').doc(user.uid)
            .get()
            .then(doc => doc.data()?.userAppointments);
            if(prevAppointments){
                db.collection('appointments').doc(user.uid).update({
                    userAppointments: [...prevAppointments, {
                        name: form.name.value,
                        contact: form.contact.value,
                        case: form.case.value,
                        section: form.section.value,
                        time: form.time.value,
                        status: "Pending"
                    }]
                })  
                .then(() => window.location.href = "/appointment/show2.html")
            }
            else{
                db.collection('appointments').doc(user.uid).set({
                    userAppointments: [{
                        name: form.name.value,
                        contact: form.contact.value,
                        case: form.case.value,
                        section: form.section.value,
                        time: form.time.value,
                        status: "Pending"
                    }]
                })  
                .then(() => window.location.href = "/appointment/show2.html")
                
            }
            
        })
    }
    else {
        alert("You are not logged in!!");
        window.location.href = "/home_page/login.html"
    }
})

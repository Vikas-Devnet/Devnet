import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"; 

const firebaseConfig = {
    apiKey: "AIzaSyDgLsO58vpxd0u-v5fLtZej8NL3o3DHIg8",
    authDomain: "devnet-51ad2.firebaseapp.com",
    projectId: "devnet-51ad2",
    storageBucket: "devnet-51ad2.firebasestorage.app",
    messagingSenderId: "723038217764",
    appId: "1:723038217764:web:b02002494054cf47bb5ab1",
    measurementId: "G-56VY8E8T6B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver(() => {
        const subscribeButton = document.getElementById('subscribeButton');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', subscribeFunction);
            observer.disconnect(); 
        }
    });

    observer.observe(document.getElementById('footer-container'), { childList: true, subtree: true });
});

async function subscribeFunction() {
    const emailInput = document.getElementById('emailInput');
    const messageBox = document.getElementById('messageBox');
    const subscribeButton = document.getElementById('subscribeButton');

    const email = emailInput.value.trim();

    messageBox.textContent = '';
    messageBox.style.display = 'none';

    if (!email) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "subscribers"));
        const emailExists = querySnapshot.docs.some(doc => doc.data().email === email);

        if (emailExists) {
            showMessage("This email is already subscribed.", "error");
            return;
        }

        await addDoc(collection(db, "subscribers"), {
            email: email,
            timestamp: serverTimestamp()
        });

        emailInput.value = '';
        showMessage("Thank you for subscribing!", "success");
    } catch (error) {
        console.error("Error adding document: ", error);
        showMessage("Failed to subscribe. Please try again.", "error");
    }
}

function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    messageBox.style.color = type === 'success' ? 'green' : 'red';
}



document.addEventListener('DOMContentLoaded', function () {
    emailjs.init("ufC5AOc_YjyoDmPr1");

    function showLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.remove('d-none');
    }

    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('d-none');
    }

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            showLoader();
            responseMessage.textContent ='';
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('mail')?.value.trim() || document.getElementById('email')?.value.trim();
            const phone = document.getElementById('mobile')?.value.trim() || document.getElementById('phone')?.value.trim();
            const subject = document.getElementById('subject')?.value.trim();
            const message = document.getElementById('message').value.trim();
            const responseMessage = document.getElementById('responseMessage');

            if (!name || !email || !phone || !subject || !message) {
                responseMessage.textContent = 'Please fill in all the details';
                responseMessage.style.color = 'red';
                hideLoader();
                return;
            }

            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    const userIP = data.ip;
                    console.log('User IP:', userIP);
                    emailjs.send("service_cklxvge", "template_i76vuyf", {
                        name: name,
                        email: email,
                        phone: phone,
                        subject: subject,
                        message: message,
                        ipaddress: userIP, 
                        reply_to: email
                    })
                    .then(() => {
                        responseMessage.textContent = 'Message sent successfully!';
                        responseMessage.style.color = 'green';
                        contactForm.reset();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        responseMessage.textContent = 'Failed to send the message. Please try again later.';
                        responseMessage.style.color = 'red';
                    })
                    .finally(() => {
                        hideLoader();
                    });
                })
                .catch(error => {
                    console.error('IP Fetch Error:', error);
                    responseMessage.textContent = 'Failed to verify .Please find the email address below';
                    responseMessage.style.color = 'red';
                    hideLoader();
                });
        });
    }
});

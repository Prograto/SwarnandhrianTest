

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('staffLoginForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('staffLoginForm').classList.add('hidden');
}

function showStaffLogin() {
    document.getElementById('staffLoginForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

const scriptUrl = 'https://script.google.com/macros/s/AKfycbzwEqotJwiDjwZTGBoXT9G5WUM6JwTwLjskV0NSutDtmkX-DmDijK8EC8EyS_bxK6bVHA/exec';

function studentLogin() {
    var regNo = document.getElementById("studentRegNo").value;
    var password = document.getElementById("studentPassword").value;

    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'login',
            regNo: regNo,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("loginMessage").innerHTML = data.error || data.success;
        if (data.success) {
            const studentId = data.regNo; 
            window.location.href = `student.html?student_id=${regNo}`; 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function register() {
    var regNo = document.getElementById("regNo").value;
    var name = document.getElementById("regName").value;
    var email = document.getElementById("regEmail").value;
    var phone = document.getElementById("regPhone").value;
    var password = document.getElementById("regPassword").value;
    var confirmPassword = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPassword) {
        document.getElementById("registerMessage").innerHTML = "Passwords do not match!";
        return;
    }

    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'register',
            regNo: regNo,
            name: name,
            email: email,
            phone: phone,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("registerMessage").innerHTML = data.error || data.success;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function staffLogin() {
    var email = document.getElementById("staffEmail").value;
    var password = document.getElementById("staffPassword").value;

    google.script.run.withSuccessHandler(function(response) {
        document.getElementById("staffLoginMessage").innerHTML = response;
    }).loginStaff(email, password);
}

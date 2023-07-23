function validateSignup() {
    const firstName = document.getElementsByName("firstName")[0];
    const lastName = document.getElementsByName("lastName")[0];
    const emailId = document.getElementsByName("emailId")[0];
    const mobile = document.getElementsByName("mobile")[0];
    const signupPassword = document.getElementsByName("signupPassword")[0];
    const confirmPassword = document.getElementsByName("confirmPassword")[0];

    if (firstName.value.trim() === "") {
        const firstNameLabel = document.getElementById("firstNameLabel")
        firstNameLabel.innerHTML = "first name Required"
        firstNameLabel.style.color = "red"
        firstName.focus();
        return false;
    }
    if (lastName.value.trim() === "") {
        const lastNameLabel = document.getElementById("lastNameLabel")
        lastNameLabel.innerHTML = "Last name Required"
        lastNameLabel.style.color = "red"
        lastName.focus();
        return false;
    }
    if (emailId.value.trim() === "") {
        const emailLabel = document.getElementById("emailLabel")
        emailLabel.innerHTML = "Email Id Required"
        emailLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailId.value)) {
        const emailIdLabel = document.getElementById("emailLabel")
        emailIdLabel.innerHTML = "Please enter a valid email address"
        emailIdLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    var mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile.value)) {
        const mobileLabel = document.getElementById("mobileLabel")
        mobileLabel.innerHTML = "Please enter a valid 10-digit mobile number."
        mobileLabel.style.color = "red"
        mobile.focus();
        return false;
    }
    if (signupPassword.value.length < 6) {
        const passowrdLabel = document.getElementById("passwordLabel")
        passowrdLabel.innerHTML = "Password should be at least 6 characters long."
        passowrdLabel.style.color = "red"
        signupPassword.focus();
        return false;
    }
    if(signupPassword.value !== confirmPassword.value){
        const confirmPasswordLabel = document.getElementById("confirmPasswordLabel")
        confirmPasswordLabel.innerHTML = "Password Doe's not match"
        confirmPasswordLabel.style.color = "red"
        confirmPassword.focus();
        return false;
    }
    return true;
}
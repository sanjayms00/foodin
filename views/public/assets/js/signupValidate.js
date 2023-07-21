//signupvalidation front end
function signupValidate() {
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  if (fname.value.trim() === "") {
    swal("oops!", "First Name Required!", "error");
    fname.focus();
    return false;
  }
  if (lname.value.trim() === "") {
    swal("oops!", "Last Name Required!", "error");
    lname.focus();
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    swal("oops!", "Email Id Required!", "error");
    emailInput.focus();
    return false;
  }
  const mobilePattern = /^\d{10}$/;
  if (!mobilePattern.test(mobile.value)) {
    swal("oops!", "Please enter a valid 10-digit mobile number!", "error");
    mobile.focus();
    return false;
  }
  if (password.value.length < 6) {
    swal("oops!", "Password should be at least 6 characters long!", "error");
    password.focus();
    return false;
  }
  if (confirmPassword.value.length < 6) {
    swal("oops!", "Password should be at least 6 characters long!", "error");
    confirmPassword.focus();
    return false;
  }
  if (password.value !== confirmPassword.value) {
    
    swal("oops!", "Password does not match!", "error");
    confirmPassword.focus();
    return false;
  }
  return true;
}

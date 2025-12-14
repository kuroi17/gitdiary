const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpButton = document.querySelector(".signupButton");

const inputs = [userName, email, password];

inputs.forEach(input => {
  input.addEventListener("input", () => {
    signUpButton.disabled =
      !userName.value ||
      !email.value ||
      !password.value;
  });
});

signUpButton.addEventListener("click", async (e) => {

  e.preventDefault();

  if (!userName.value  || !email.value || !password.value) {
    alert("Please fill in all fields.");
    return;
  }
  if (!email.value.includes("@")) {
    alert("Invalid Email!");
    return;
  }

  signUpButton.disabled = true;
  try {
    
    const response = await fetch("http://localhost/gitdiary/backend/signUp.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      })
    });

    if (response.status === 409) {
  alert("Account already exists. Please log in.");
  window.location.href = "../html/login.html";
  return;
}

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

    const result = await response.json();
    console.log("server response:", result);

    if (result.success) {
      alert("Registration successful! Please log in.");
      window.location.href = "../html/login.html";
    } else {
      alert("Registration failed: " + result.message);
    }
  } catch (error) {
    console.error("Error during registration: ", error);
    alert("An error occurred during registration.");
  }
  finally {
   signUpButton.disabled = false;
   }
});

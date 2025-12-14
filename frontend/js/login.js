// Select elements
const logInButton = document.querySelector(".loginButton");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Disable login button initially
logInButton.disabled = true;

// Validate input fields dynamically
[emailInput, passwordInput].forEach(input => {
  input.addEventListener("input", () => {
    logInButton.disabled = !emailInput.value.trim() || !passwordInput.value.trim();
  });
});

// Email format regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

logInButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validation
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return;
  }

  // Disable button to prevent multiple clicks
  logInButton.disabled = true;

  try {
    const response = await fetch("http://localhost/gitdiary/backend/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Server response:", result);

    if (result.success) {
      alert("Login successful!");
      window.location.href = "../html/index.html";
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login.");
  } finally {
    // Re-enable button after response
    logInButton.disabled = !emailInput.value || !passwordInput.value;
  }
});

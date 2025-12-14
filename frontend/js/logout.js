const logOutButton = document.querySelector(".logoutButton");

logOutButton.addEventListener("click", async () => {
  if (confirm("Are you sure you want to log out?")) {
    if (logOutButton) {
      logOutButton.disabled = true;

      try {
        const response = await fetch(
          "http://localhost/gitdiary/backend/logout.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log("Server response:", result);

        if (result.success) {
          alert("Logout successful!");
          window.location.href = "../html/login.html";
        } else {
          alert("Logout failed: " + result.message);
        }
      } catch (error) {
        console.error("Error during logout:", error);
        alert("An error occurred during logout. Please try again.");
      }
    }
  }
});

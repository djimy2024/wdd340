 document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("pswdBtn");
    const passwordInput = document.getElementById("password");

    toggleBtn.addEventListener("click", function () {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      toggleBtn.textContent = isPassword ? "Hide Password" : "Show Password";
    });
  });
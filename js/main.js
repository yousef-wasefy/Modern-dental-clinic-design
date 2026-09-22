const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list a");


menuToggle.addEventListener("click", function () {
    nav.classList.toggle("active");

    if (nav.classList.contains("active")) {
        menuToggle.textContent = "×";
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    } else {
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
});




const appointmentForm = document.querySelector("#appointment-form");
const appointmentDate = document.querySelector("#date");
const formStatus = document.querySelector("#form-status");
const submitButton = appointmentForm.querySelector(
    'button[type="submit"]'
);

// Use the browser's local date, not UTC
function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

appointmentDate.min = getLocalDate();

appointmentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    appointmentDate.min = getLocalDate();

    if (!appointmentForm.checkValidity()) {
        appointmentForm.reportValidity();
        return;
    }

    formStatus.textContent = "Sending your request...";
    submitButton.disabled = true;

    try {
        const response = await fetch(appointmentForm.action, {
            method: "POST",
            body: new FormData(appointmentForm),
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Submission failed");
        }

        formStatus.textContent =
            "Your appointment request has been sent. " +
            "We will contact you to confirm availability.";

        appointmentForm.reset();
        
    } catch (error) {
        formStatus.textContent =
            "Something went wrong. Please try again.";

        console.error(error);

    } finally {
        submitButton.disabled = false;
    }
});
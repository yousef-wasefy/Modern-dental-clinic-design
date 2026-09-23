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


// Appointment Form Handling

const appointmentForm = document.querySelector("#appointment-form");
const appointmentDate = document.querySelector("#date");
const formStatus = document.querySelector("#form-status");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#email");

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


// Phone validation
function validatePhone() {
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, "");

    if (phone && !/^\+?[0-9\s()-]+$/.test(phone)) {
        phoneInput.setCustomValidity(
            "Please enter a valid phone number."
        );
    } else if (phone && (digits.length < 10 || digits.length > 15)) {
        phoneInput.setCustomValidity(
            "Phone number must contain 10 to 15 digits."
        );
    } else {
        phoneInput.setCustomValidity("");
    }
}

phoneInput.addEventListener("input", validatePhone);

// Email validation
function validateEmail() {
    const email = emailInput.value.trim();

    if (!email) {
        emailInput.setCustomValidity("");
    } else if (email.includes(" ")) {
        emailInput.setCustomValidity(
            "Email address cannot contain spaces."
        );
    } else if (!email.includes("@")) {
        emailInput.setCustomValidity(
            "Email must include @ (e.g. name@example.com)."
        );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        emailInput.setCustomValidity(
            "Please enter a valid email domain (e.g. gmail.com)."
        );
    } else {
        emailInput.setCustomValidity("");
    }
}

emailInput.addEventListener("input", validateEmail);

// Hide success message when the user edits the form
function clearSuccessMessage() {
    if (formStatus.dataset.state === "success") {
        formStatus.textContent = "";
        formStatus.dataset.state = "";
    }
}

appointmentForm.addEventListener("input", clearSuccessMessage);
appointmentForm.addEventListener("change", clearSuccessMessage);


// Form submission
appointmentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    appointmentDate.min = getLocalDate();
    validatePhone();
    validateEmail();

    if (!appointmentForm.checkValidity()) {
        appointmentForm.reportValidity();
        return;
    }

    formStatus.dataset.state = "";
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
            // Form data rejected by the server
            if (response.status === 400 || response.status === 422) {
                formStatus.textContent =
                    "Please check your form details and try again.";
                return;
            }

            throw new Error("Submission failed");
        }

        formStatus.textContent =
            "Your appointment request has been sent. " +
            "We will contact you to confirm availability.";

        formStatus.dataset.state = "success";

        appointmentForm.reset();
        phoneInput.setCustomValidity("");
        emailInput.setCustomValidity("");

    } catch (error) {
        formStatus.textContent =
            "Something went wrong. Please try again.";

        console.error(error);

    } finally {
        submitButton.disabled = false;
    }
});
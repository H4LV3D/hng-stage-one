// Contact Form Validation and Submission Handler
(function () {
  "use strict";

  // Form elements
  const form = document.getElementById("contactForm");
  const nameInput = document.querySelector('[data-testid="test-contact-name"]');
  const emailInput = document.querySelector(
    '[data-testid="test-contact-email"]'
  );
  const subjectInput = document.querySelector(
    '[data-testid="test-contact-subject"]'
  );
  const messageInput = document.querySelector(
    '[data-testid="test-contact-message"]'
  );
  const submitButton = document.querySelector(
    '[data-testid="test-contact-submit"]'
  );
  const successMessage = document.getElementById("success-message");

  // Error message elements
  const errorElements = {
    name: document.querySelector('[data-testid="test-contact-error-name"]'),
    email: document.querySelector('[data-testid="test-contact-error-email"]'),
    subject: document.querySelector(
      '[data-testid="test-contact-error-subject"]'
    ),
    message: document.querySelector(
      '[data-testid="test-contact-error-message"]'
    ),
  };

  /**
   * Initialize the contact form
   */
  function init() {
    setupEventListeners();
    setupRealTimeValidation();
    logInitialization();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    form.addEventListener("submit", handleSubmit);

    // Add blur validation for better UX
    nameInput.addEventListener("blur", () => validateField("name"));
    emailInput.addEventListener("blur", () => validateField("email"));
    subjectInput.addEventListener("blur", () => validateField("subject"));
    messageInput.addEventListener("blur", () => validateField("message"));
  }

  /**
   * Setup real-time validation on input
   */
  function setupRealTimeValidation() {
    // Clear errors as user types (after initial blur)
    nameInput.addEventListener("input", () => {
      if (nameInput.classList.contains("error")) {
        validateField("name");
      }
    });

    emailInput.addEventListener("input", () => {
      if (emailInput.classList.contains("error")) {
        validateField("email");
      }
    });

    subjectInput.addEventListener("input", () => {
      if (subjectInput.classList.contains("error")) {
        validateField("subject");
      }
    });

    messageInput.addEventListener("input", () => {
      if (messageInput.classList.contains("error")) {
        validateField("message");
      }
    });
  }

  /**
   * Handle form submission
   */
  function handleSubmit(e) {
    e.preventDefault();

    // Clear previous success message
    hideSuccessMessage();

    // Validate all fields
    const isValid = validateAllFields();

    if (isValid) {
      // Show loading state
      setSubmitButtonState("loading");

      // Simulate API call with timeout
      setTimeout(() => {
        // Reset form
        form.reset();

        // Clear any remaining error states
        clearAllErrors();

        // Show success message
        showSuccessMessage();

        // Reset button state
        setSubmitButtonState("default");

        // Log success
        console.log("✅ Form submitted successfully!");
      }, 1000);
    } else {
      console.log("❌ Form validation failed");
      // Focus on first error field
      focusFirstErrorField();
    }
  }

  /**
   * Validate all fields
   */
  function validateAllFields() {
    const nameValid = validateField("name");
    const emailValid = validateField("email");
    const subjectValid = validateField("subject");
    const messageValid = validateField("message");

    return nameValid && emailValid && subjectValid && messageValid;
  }

  /**
   * Validate individual field
   */
  function validateField(fieldName) {
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        const name = nameInput.value.trim();
        if (!name) {
          isValid = false;
          errorMessage = "Full name is required";
        } else if (name.length < 2) {
          isValid = false;
          errorMessage = "Name must be at least 2 characters";
        }
        break;

      case "email":
        const email = emailInput.value.trim();
        if (!email) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!isValidEmail(email)) {
          isValid = false;
          errorMessage = "Please enter a valid email (e.g., name@example.com)";
        }
        break;

      case "subject":
        const subject = subjectInput.value.trim();
        if (!subject) {
          isValid = false;
          errorMessage = "Subject is required";
        } else if (subject.length < 3) {
          isValid = false;
          errorMessage = "Subject must be at least 3 characters";
        }
        break;

      case "message":
        const message = messageInput.value.trim();
        if (!message) {
          isValid = false;
          errorMessage = "Message is required";
        } else if (message.length < 10) {
          isValid = false;
          errorMessage = `Message must be at least 10 characters (${message.length}/10)`;
        }
        break;
    }

    // Update UI based on validation
    if (isValid) {
      clearError(fieldName);
    } else {
      showError(fieldName, errorMessage);
    }

    return isValid;
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    // RFC 5322 compliant email regex (simplified)
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Show error message for a field
   */
  function showError(fieldName, message) {
    const errorElement = errorElements[fieldName];
    const inputElement = getInputElement(fieldName);

    if (errorElement && inputElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      inputElement.classList.add("error");
      inputElement.setAttribute("aria-invalid", "true");
    }
  }

  /**
   * Clear error message for a field
   */
  function clearError(fieldName) {
    const errorElement = errorElements[fieldName];
    const inputElement = getInputElement(fieldName);

    if (errorElement && inputElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
      inputElement.classList.remove("error");
      inputElement.setAttribute("aria-invalid", "false");
    }
  }

  /**
   * Clear all errors
   */
  function clearAllErrors() {
    Object.keys(errorElements).forEach((fieldName) => {
      clearError(fieldName);
    });
  }

  /**
   * Get input element by field name
   */
  function getInputElement(fieldName) {
    switch (fieldName) {
      case "name":
        return nameInput;
      case "email":
        return emailInput;
      case "subject":
        return subjectInput;
      case "message":
        return messageInput;
      default:
        return null;
    }
  }

  /**
   * Focus on first error field
   */
  function focusFirstErrorField() {
    const firstErrorField =
      form.querySelector(".error") ||
      form.querySelector('[aria-invalid="true"]');
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }

  /**
   * Show success message
   */
  function showSuccessMessage() {
    successMessage.classList.remove("hidden");
    successMessage.setAttribute("tabindex", "-1");
    successMessage.focus();

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideSuccessMessage();
    }, 5000);
  }

  /**
   * Hide success message
   */
  function hideSuccessMessage() {
    successMessage.classList.add("hidden");
  }

  /**
   * Set submit button state
   */
  function setSubmitButtonState(state) {
    const buttonText = submitButton.querySelector(".button-text");

    switch (state) {
      case "loading":
        submitButton.disabled = true;
        submitButton.classList.add("loading");
        buttonText.textContent = "Sending...";
        break;
      case "default":
      default:
        submitButton.disabled = false;
        submitButton.classList.remove("loading");
        buttonText.textContent = "Send Message";
        break;
    }
  }

  /**
   * Log initialization for debugging
   */
  function logInitialization() {
    console.log("✅ Contact form initialized successfully");

    // Verify all required elements are present
    const requiredElements = [
      { name: "Form", element: form },
      { name: "Name Input", element: nameInput },
      { name: "Email Input", element: emailInput },
      { name: "Subject Input", element: subjectInput },
      { name: "Message Input", element: messageInput },
      { name: "Submit Button", element: submitButton },
    ];

    const missingElements = requiredElements.filter((item) => !item.element);

    if (missingElements.length > 0) {
      console.warn(
        "⚠️ Missing elements:",
        missingElements.map((item) => item.name)
      );
    } else {
      console.log("✅ All required form elements are present");
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose validation functions for testing
  window.contactForm = {
    validate: validateAllFields,
    validateField: validateField,
    isValidEmail: isValidEmail,
  };
})();

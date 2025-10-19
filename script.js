// Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(function () {
  "use strict";

  /**
   * Initialize the profile card when DOM is ready
   */
  function init() {
    updateTime();
    setupTimeUpdateInterval();
    setupAccessibilityFeatures();
    logInitialization();
  }

  /**
   * Update the time display with current timestamp in milliseconds
   */
  function updateTime() {
    const timeElement = document.querySelector(
      '[data-testid="test-user-time"]'
    );

    if (timeElement) {
      const currentTime = Date.now();
      timeElement.textContent = currentTime.toString();
      timeElement.setAttribute("datetime", new Date(currentTime).toISOString());
    }
  }

  /**
   * Setup interval to update time every second
   * This ensures the time stays current while the page is open
   */
  function setupTimeUpdateInterval() {
    // Update every 1000ms (1 second) to keep time reasonably current
    setInterval(updateTime, 1000);
  }

  /**
   * Setup additional accessibility features
   */
  function setupAccessibilityFeatures() {
    // Add keyboard navigation hint for screen readers
    const profileCard = document.querySelector(
      '[data-testid="test-profile-card"]'
    );
    if (profileCard) {
      profileCard.setAttribute("role", "article");
    }

    // Ensure all links have proper ARIA labels if text content might be unclear
    const socialLinks = document.querySelectorAll(
      '[data-testid^="test-user-social-"]'
    );
    socialLinks.forEach((link) => {
      if (!link.getAttribute("aria-label")) {
        const linkText = link.textContent.trim();
        link.setAttribute("aria-label", `Visit ${linkText} profile`);
      }
    });

    // Add live region for time updates (optional, for screen readers)
    const timeElement = document.querySelector(
      '[data-testid="test-user-time"]'
    );
    if (timeElement) {
      timeElement.setAttribute("aria-live", "polite");
      timeElement.setAttribute("aria-atomic", "true");
    }
  }

  /**
   * Optional: Add image upload functionality
   * This function can be called if you want to add an avatar upload feature
   */
  function setupAvatarUpload() {
    // This is a placeholder for potential avatar upload functionality
    // Can be extended to handle file uploads
    const avatarImg = document.querySelector(
      '[data-testid="test-user-avatar"]'
    );

    if (avatarImg) {
      // Ensure avatar has proper error handling
      avatarImg.addEventListener("error", function () {
        console.warn("Avatar image failed to load, using fallback");
        this.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
      });

      // Add loading indicator
      avatarImg.addEventListener("load", function () {
        this.style.opacity = "1";
      });
    }
  }

  /**
   * Log initialization for debugging
   */
  function logInitialization() {
    console.log("✅ Profile Card initialized successfully");
    console.log("📊 Current timestamp:", Date.now());

    // Verify all required test IDs are present
    const requiredTestIds = [
      "test-profile-card",
      "test-user-name",
      "test-user-bio",
      "test-user-time",
      "test-user-avatar",
      "test-user-social-links",
      "test-user-hobbies",
      "test-user-dislikes",
    ];

    const missingTestIds = requiredTestIds.filter(
      (id) => !document.querySelector(`[data-testid="${id}"]`)
    );

    if (missingTestIds.length > 0) {
      console.warn("⚠️ Missing test IDs:", missingTestIds);
    } else {
      console.log("✅ All required test IDs are present");
    }
  }

  /**
   * Add smooth scroll behavior for any internal links (future enhancement)
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  /**
   * Handle keyboard navigation for better accessibility
   */
  function setupKeyboardNavigation() {
    document.addEventListener("keydown", function (e) {
      // Add Escape key handler if needed for modals/overlays
      if (e.key === "Escape") {
        // Future: Close any open modals or overlays
      }
    });
  }

  /**
   * Performance observer for monitoring (optional)
   */
  function setupPerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              console.log("LCP:", entry.renderTime || entry.loadTime);
            }
          }
        });
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // PerformanceObserver not supported or errored
      }
    }
  }

  // Wait for DOM to be ready before initializing
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM is already ready
    init();
  }

  // Optional: Setup additional features
  setupAvatarUpload();
  setupKeyboardNavigation();

  // Expose update function for testing purposes
  window.profileCard = {
    updateTime: updateTime,
  };
})();

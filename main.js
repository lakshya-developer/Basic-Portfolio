// -------------------------------------------------------------
//                  MESSAGE BOX SYSTEM
// -------------------------------------------------------------
let messageBoxOverlay;
let messageBoxTitle;
let messageBoxMessage;
let messageBoxCloseBtn;

function setupMessageBox() {
  messageBoxOverlay = document.getElementById('messageBoxOverlay');
  messageBoxTitle = document.getElementById('messageBoxTitle');
  messageBoxMessage = document.getElementById('messageBoxMessage');
  messageBoxCloseBtn = document.getElementById('messageBoxCloseBtn');

  if (messageBoxCloseBtn) {
    messageBoxCloseBtn.addEventListener('click', hideMessageBox);

    messageBoxOverlay.addEventListener('click', function (event) {
      if (event.target === messageBoxOverlay) hideMessageBox();
    });
  }
}

function showMessageBox(title, message) {
  messageBoxTitle.textContent = title;
  messageBoxMessage.textContent = message;
  messageBoxOverlay.classList.add('visible');
}

function hideMessageBox() {
  messageBoxOverlay.classList.remove('visible');
}

// -------------------------------------------------------------
//                  GLOBAL ELEMENTS + NAV LOGIC
// -------------------------------------------------------------
const mainContent = document.getElementById("main-content");
const navLinks = document.querySelectorAll("header nav ul li a");

function setActiveNav(page) {
  navLinks.forEach(link => {
    link.classList.remove("nav-active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("nav-active");
    }
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    loadPage(page);
    setActiveNav(page);
  });
});

// Header title loads home
const siteTitle = document.querySelector(".site-title");
if (siteTitle) {
  siteTitle.addEventListener("click", function (e) {
    e.preventDefault();
    loadPage("main-content.html");
    setActiveNav("main-content.html");
  });
}

// -------------------------------------------------------------
//                  PROFILE IMAGE ENLARGEMENT
// -------------------------------------------------------------
function setupProfileImageEnlargement() {
  const image = document.getElementById("profileImage");
  if (image) {
    image.addEventListener("click", () => {
      image.classList.toggle("enlarged");
    });
  }
}

// -------------------------------------------------------------
//                     TYPING EFFECT
// -------------------------------------------------------------
function triggerTypingEffect() {
  const text =
    "Hi! I’m Lakshya Verma, a passionate Web Development student with hands-on experience in building interactive and functional websites. I specialize in Backend Development using the MERN stack and enjoy creating seamless, efficient, and user-focused web applications.";

  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  typingElement.textContent = "";
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < text.length) {
      typingElement.innerHTML =
        text.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
      charIndex++;
      setTimeout(typeWriter, 35);
    } else {
      typingElement.innerHTML = text;
    }
  }

  typeWriter();
}

// -------------------------------------------------------------
//                 CONTACT FORM HANDLER
// -------------------------------------------------------------
function attachContactFormHandler() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
      showMessageBox("Success!", "Message Sent! Thank you for contacting me.");
      form.reset();
    } else {
      showMessageBox("Error", "Please fill out all fields.");
    }
  });
}

// -------------------------------------------------------------
//              DYNAMIC PAGE LOADER (MOST IMPORTANT)
// -------------------------------------------------------------
async function loadPage(pageName) {
  try {
    mainContent.innerHTML =
      '<p style="text-align:center;color:#22D3EE;">Loading...</p>';

    const response = await fetch(`pages/${pageName}`);
    const html = await response.text();
    mainContent.innerHTML = html;

    // After content is loaded → attach required JS
    if (pageName === "main-content.html") {
      setupProfileImageEnlargement();
      triggerTypingEffect();

      // Setup Zoom Overlay AFTER CONTENT EXISTS
      const zoomOverlay = document.getElementById("zoomOverlay");
      const zoomedProfile = document.getElementById("zoomedProfile");
      const profileImage = document.getElementById("profileImage");

      if (zoomOverlay && zoomedProfile && profileImage) {
        profileImage.addEventListener("click", () => {
          zoomOverlay.classList.remove("hidden");
        });

        zoomOverlay.addEventListener("click", () => {
          zoomOverlay.classList.add("hidden");
        });
      }
    }

    if (pageName === "contact.html") {
      attachContactFormHandler();
    }
  } catch (err) {
    mainContent.innerHTML =
      `<p style="color:red;text-align:center;">Error loading page: ${err.message}</p>`;
  }
}

// -------------------------------------------------------------
//                 INITIAL PAGE LOAD
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  setupMessageBox();
  loadPage("main-content.html");
  setActiveNav("main-content.html");
});

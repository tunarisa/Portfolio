// =============================================================
// 1. MENU MOBILE (hamburger)
// =============================================================
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

navMenu.querySelectorAll("a").forEach((lien) => {
  lien.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


// =============================================================
// 2. LIEN ACTIF DANS LA NAV SELON LA SECTION VISIBLE (page d'accueil)
// =============================================================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

if (sections.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((lien) => {
            lien.classList.toggle("active", lien.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));
}


// =============================================================
// 3. PROJETS (ACCUEIL) — 3 blocs en profondeur, clic = passage au centre
// =============================================================
const projetsStage = document.getElementById("projets-stage");

if (projetsStage) {
  const cartesProjets = Array.from(projetsStage.children);
  let indexCentre = 0;

  /**
   * Place chaque carte en position "centre", "gauche" ou "droite"
   * selon l'index actuellement au centre (indexCentre).
   */
  function positionnerCartes() {
    const total = cartesProjets.length;
    const indexGauche = (indexCentre + total - 1) % total;
    const indexDroite = (indexCentre + 1) % total;

    cartesProjets.forEach((carte, i) => {
      carte.classList.remove("stage-center", "stage-left", "stage-right");
      if (i === indexCentre) carte.classList.add("stage-center");
      else if (i === indexGauche) carte.classList.add("stage-left");
      else if (i === indexDroite) carte.classList.add("stage-right");
    });
  }

  // Cliquer sur une carte (gauche ou droite) la fait passer au centre
  cartesProjets.forEach((carte, i) => {
    carte.addEventListener("click", () => {
      indexCentre = i;
      positionnerCartes();
    });
  });

  positionnerCartes();
}


// =============================================================
// 4. MODE JOUR / NUIT — mémorisé et partagé sur toutes les pages
// =============================================================
const themeToggle = document.getElementById("theme-toggle");

function appliquerTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

if (themeToggle) {
  // Au chargement, on reprend le thème choisi précédemment (par défaut : jour)
  appliquerTheme(localStorage.getItem("theme") || "light");

  themeToggle.addEventListener("click", () => {
    const themeActuel = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    appliquerTheme(themeActuel === "dark" ? "light" : "dark");
  });
}


// =============================================================
// 5. EFFET "BROUILLARD" — disparaît au niveau du footer
// =============================================================
const fog = document.querySelector(".fog-overlay");
const footer = document.querySelector(".site-footer");

if (fog && footer) {
  const fogObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        fog.style.opacity = entry.isIntersecting ? "0" : "1";
      });
    },
    { threshold: 0 }
  );

  fogObserver.observe(footer);
}


// =============================================================
// 6. VALIDATION DU FORMULAIRE DE CONTACT (page d'accueil uniquement)
// =============================================================
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = document.getElementById("nom");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    let estValide = true;

    document.querySelectorAll(".form-error-msg").forEach((el) => el.remove());
    document.querySelectorAll(".form-group").forEach((el) => el.classList.remove("error"));

    estValide = verifierChamp(nom, nom.value.trim().length > 1, "Merci d'indiquer ton nom.") && estValide;
    estValide = verifierChamp(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Adresse email invalide.") && estValide;
    estValide = verifierChamp(message, message.value.trim().length > 9, "Ton message doit faire au moins 10 caractères.") && estValide;

    if (!estValide) {
      formStatus.textContent = "Merci de corriger les champs en rouge.";
      formStatus.className = "error";
      return;
    }

    formStatus.textContent = "Message prêt à être envoyé ! (branchement email à venir)";
    formStatus.className = "success";
    form.reset();
  });
}

function verifierChamp(champ, condition, messageErreur) {
  if (condition) return true;

  const groupe = champ.closest(".form-group");
  groupe.classList.add("error");

  const erreur = document.createElement("p");
  erreur.className = "form-error-msg";
  erreur.textContent = messageErreur;
  groupe.appendChild(erreur);

  return false;
}
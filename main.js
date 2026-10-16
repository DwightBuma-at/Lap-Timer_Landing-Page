(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Set current year in footer
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Navigation menu toggle for mobile
  const navToggle = $("#navToggle");
  const nav = $("#navLinks");

  if (navToggle && nav) {
    const setNavState = (isOpen) => {
      nav.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");
      setNavState(!isOpen);
    });

    $$(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => {
        setNavState(false);
      })
    );

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setNavState(false);
      }
    });

    // Close mobile nav if resized beyond tablet width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && nav.classList.contains("open")) {
        setNavState(false);
      }
    });
  }

  // Active navigation link highlighting on scroll
  const sectionIds = ["overview", "features", "how-it-works", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const onScroll = () => {
    let current = "overview";
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= 135) {
        current = s.id;
      }
    });

    $$(".nav-links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Time format helper (HH:MM:SS)
  const pad = (n) => String(n).padStart(2, "0");
  const format = (s) =>
    `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

  // Dashboard preview elapsed timer tickers
  const durations = [5058, 2737, 8100, 1812];
  const started = Date.now();

  setInterval(() => {
    $$("[data-elapsed]").forEach((el) => {
      const index = Number(el.dataset.elapsed) - 1;
      if (durations[index] !== undefined) {
        el.textContent = format(
          durations[index] + Math.floor((Date.now() - started) / 1000)
        );
      }
    });
  }, 1000);

  // Room filtering and search functionality
  const applyFilters = () => {
    const activeFilterBtn = $(".filter.active");
    const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : "all";
    const searchInput = $("#roomSearch");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    $$(".room").forEach((r) => {
      const matchesType = filter === "all" || r.dataset.type === filter;
      const matchesSearch = (r.dataset.name || "")
        .toLowerCase()
        .includes(query);
      const isVisible = matchesType && matchesSearch;

      r.hidden = !isVisible;
      r.style.display = isVisible ? "" : "none";
    });
  };

  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    })
  );

  const roomSearchInput = $("#roomSearch");
  if (roomSearchInput) {
    roomSearchInput.addEventListener("input", applyFilters);
  }

  // Live Demo Modal Interactive State
  let demoSeconds = 0;
  let drinks = 0;
  let running = false;
  let previous = Date.now();

  const modal = $("#demoModal");
  const openDemoBtn = $("#openDemo");
  const closeDemoBtn = $("#closeDemo");
  const toggleTimerBtn = $("#toggleTimer");
  const addDrinkBtn = $("#addDrink");
  const resetDemoBtn = $("#resetDemo");
  const demoTimeEl = $("#demoTime");
  const demoTotalEl = $("#demoTotal");
  const orderCountEl = $("#orderCount");

  const currency = (n) =>
    "₱" +
    n.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  function renderDemo() {
    if (demoTimeEl) demoTimeEl.textContent = format(demoSeconds);
    if (demoTotalEl) {
      demoTotalEl.textContent = currency(
        (demoSeconds / 3600) * 120 + drinks * 75
      );
    }
    if (orderCountEl) {
      orderCountEl.textContent = `${drinks} drink${drinks === 1 ? "" : "s"} added`;
    }
    if (toggleTimerBtn) {
      toggleTimerBtn.textContent = running
        ? "Pause Timer"
        : demoSeconds
          ? "Resume Timer"
          : "Start Timer";
    }
  }

  setInterval(() => {
    const now = Date.now();
    if (running) {
      demoSeconds += Math.floor((now - previous) / 1000);
      renderDemo();
    }
    previous = now;
  }, 1000);

  function setModal(open) {
    if (!modal) return;
    modal.classList.toggle("open", open);
    modal.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      if (closeDemoBtn) closeDemoBtn.focus();
    } else {
      if (openDemoBtn) openDemoBtn.focus();
    }
  }

  function triggerDemoLightning() {
    const heroProduct = $(".hero-product");
    if (!heroProduct) return;
    heroProduct.classList.remove("lightning-active");
    // Force DOM reflow to retrigger animation
    void heroProduct.offsetWidth;
    heroProduct.classList.add("lightning-active");
    setTimeout(() => {
      heroProduct.classList.remove("lightning-active");
    }, 900);
  }

  if (openDemoBtn) {
    openDemoBtn.addEventListener("click", () => {
      triggerDemoLightning();
      // Optional smooth scroll into view if user wants to see the effect clearly
      const heroProduct = $(".hero-product");
      if (heroProduct && window.innerWidth <= 960) {
        heroProduct.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
  if (closeDemoBtn)
    closeDemoBtn.addEventListener("click", () => setModal(false));

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) setModal(false);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      setModal(false);
    }
  });

  if (toggleTimerBtn) {
    toggleTimerBtn.addEventListener("click", () => {
      running = !running;
      previous = Date.now();
      renderDemo();
    });
  }

  if (addDrinkBtn) {
    addDrinkBtn.addEventListener("click", () => {
      drinks++;
      renderDemo();
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener("click", () => {
      running = false;
      drinks = 0;
      demoSeconds = 0;
      renderDemo();
    });
  }

  renderDemo();

  // Contact form submission handler
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.reportValidity()) return;

      const val = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };

      const subject = `Timer System Demo Inquiry — ${val("venue")}`;
      const phoneVal = val("phone");
      const phoneLine = phoneVal ? `Phone: ${phoneVal}\n` : "";
      const body = `Hello LAP IT Solutions,\n\nI would like to request a Timer System demo.\n\nVenue Name: ${val("venue")}\nContact Person: ${val("person")}\nEmail: ${val("email")}\n${phoneLine}Venue Type: ${val("venueType")}\nNumber of Tables / Rooms: ${val("rooms")}\n\nPlease contact me to discuss a demonstration.\n`;

      window.location.href = `mailto:lapitsolutions09@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    });
  }

  // Feature card mobile tap-to-inspect modal support
  const featureCards = $$(".feature-card");
  if (featureCards.length) {
    featureCards.forEach((card) => {
      card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          const wasActive = card.classList.contains("active");
          featureCards.forEach((c) => c.classList.remove("active"));
          if (!wasActive) {
            card.classList.add("active");
          }
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".feature-card")) {
        featureCards.forEach((c) => c.classList.remove("active"));
      }
    });
  }

  // Step numbers mobile tap-to-inspect tooltip support
  const stepNumbers = $$(".step-number");
  if (stepNumbers.length) {
    stepNumbers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.stopPropagation();
          const wasActive = btn.classList.contains("active");
          stepNumbers.forEach((s) => s.classList.remove("active"));
          if (!wasActive) {
            btn.classList.add("active");
          }
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".step-number")) {
        stepNumbers.forEach((s) => s.classList.remove("active"));
      }
    });
  }

  // Real LAP IT Timer System Demo View Switching
  const realViews = $$(".real-view");
  const realPageTitle = $(".real-page-title");

  const viewTitles = {
    viewServices: "Sessions",
    viewPickleball: "Pickleball",
    viewBilliards: "Billiards",
    viewKaraoke: "Karaoke",
  };

  function switchRealView(targetViewId) {
    if (!realViews.length) return;
    realViews.forEach((view) => {
      if (view.id === targetViewId) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    if (realPageTitle && viewTitles[targetViewId]) {
      realPageTitle.textContent = viewTitles[targetViewId];
    }
  }

  // Handle "View <Service> rooms" button clicks
  $$("[data-target-view]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = btn.dataset.targetView;
      if (targetView) {
        switchRealView(targetView);
      }
    });
  });

  // Handle "< All services" back button clicks
  $$("[data-back-to]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const backTarget = btn.dataset.backTo || "viewServices";
      switchRealView(backTarget);
    });
  });

  // Live ticking timer for Pickleball 1 (starts at 00:33:17 = 1997 seconds)
  const pickleballTimerEl = $('[data-demo-timer="pickleball-1"]');
  if (pickleballTimerEl) {
    const basePickleballSec = 1997; // 33 mins 17 secs
    const timerStartedAt = Date.now();
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      pickleballTimerEl.textContent = format(basePickleballSec + elapsed);
    }, 1000);
  }

  // Helper to format current time like "06:15 PM"
  const formatTimeNow = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // Helper to update service overview pill counters (Available / In-Use)
  function updateServiceStat(viewId, inUseDelta) {
    const serviceMap = {
      viewPickleball: "pickleball",
      viewBilliards: "billiards",
      viewKaraoke: "karaoke",
    };
    const serviceName = serviceMap[viewId];
    if (!serviceName) return;

    const card = $(`.real-service-card[data-service="${serviceName}"]`);
    if (!card) return;

    const availPill = card.querySelector(".real-stat-pill.available .pill-val");
    const inUsePill = card.querySelector(".real-stat-pill.in-use .pill-val");

    if (availPill && inUsePill) {
      const currentAvail = Math.max(
        0,
        parseInt(availPill.textContent, 10) - inUseDelta
      );
      const currentInUse = Math.max(
        0,
        parseInt(inUsePill.textContent, 10) + inUseDelta
      );
      availPill.textContent = String(currentAvail);
      inUsePill.textContent = String(currentInUse);
    }
  }

  // Start Session on Room Cards
  function attachStartSessionHandlers() {
    $$(".real-room-card").forEach((card) => {
      const startBtn = card.querySelector(".real-start-btn");
      if (!startBtn || startBtn.dataset.bound) return;
      startBtn.dataset.bound = "true";

      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const roomTitleEl = card.querySelector(".real-room-title-wrap strong");
        const roomTitle = roomTitleEl ? roomTitleEl.textContent.trim() : "Room";
        const availRateEl = card.querySelector(".avail-rate");
        const rateText = availRateEl
          ? availRateEl.textContent.trim()
          : "₱100.00/hr";
        const rateNumMatch = rateText.match(/₱([\d.]+)/);
        const rateNum = rateNumMatch ? parseFloat(rateNumMatch[1]) : 100;

        // Transition card to Active In-Use state
        card.classList.remove("available");
        card.classList.add("active-in-use");

        // Update header: icon to spinning clock, badge to IN USE
        const titleWrap = card.querySelector(".real-room-title-wrap");
        if (titleWrap) {
          titleWrap.innerHTML = `
            <svg class="icon red-spin"><use href="#i-clock" /></svg>
            <strong>${roomTitle}</strong>
          `;
        }

        const statusEl = card.querySelector(".real-room-status");
        if (statusEl) {
          statusEl.className = "real-room-status in-use";
          statusEl.textContent = "IN USE";
        }

        const nowFormatted = formatTimeNow();

        // Replace room body with live timer block starting at 59 mins countdown
        const availBlock = card.querySelector(".real-room-avail-block");
        if (availBlock) {
          availBlock.className = "real-room-timer-block";
          availBlock.innerHTML = `
            <div class="real-live-timer">00:59:00</div>
            <span class="real-timer-rate">Current charge: ${rateText} (${rateText})</span>
            <div class="real-timer-specs">
              <div class="spec-col">
                <span class="spec-label">TIME STARTED</span>
                <strong class="spec-value">${nowFormatted}</strong>
              </div>
              <div class="spec-col">
                <span class="spec-label">HOURS AVAILED</span>
                <strong class="spec-value">1 hr</strong>
              </div>
            </div>
            <button class="real-cashier-btn">Proceed to Session Cashier</button>
          `;

          // Countdown timer from 59 minutes (3540 seconds) down to 00:00:00
          const timerEl = availBlock.querySelector(".real-live-timer");
          let remainingSeconds = 59 * 60; // 3540 seconds (00:59:00)
          const intervalId = setInterval(() => {
            if (remainingSeconds > 0) {
              remainingSeconds--;
              if (timerEl) {
                timerEl.textContent = format(remainingSeconds);
              }
            } else {
              clearInterval(intervalId);
            }
          }, 1000);

          // Update overview counter
          const parentView = card.closest(".real-view");
          if (parentView) {
            updateServiceStat(parentView.id, 1);
          }

          // Handle Cashier button (session completion)
          const cashierBtn = availBlock.querySelector(".real-cashier-btn");
          if (cashierBtn) {
            cashierBtn.addEventListener("click", () => {
              clearInterval(intervalId);
              // Revert back to Available
              card.classList.remove("active-in-use");
              card.classList.add("available");

              if (titleWrap) {
                titleWrap.innerHTML = `
                  <span class="status-circle green"></span>
                  <strong>${roomTitle}</strong>
                `;
              }
              if (statusEl) {
                statusEl.className = "real-room-status available";
                statusEl.textContent = "AVAILABLE";
              }

              availBlock.className = "real-room-avail-block";
              availBlock.innerHTML = `
                <svg class="icon rate-clock"><use href="#i-clock" /></svg>
                <span class="avail-rate">${rateText}</span>
                <button class="real-start-btn">▶ Start session</button>
              `;

              if (parentView) {
                updateServiceStat(parentView.id, -1);
              }
              attachStartSessionHandlers();
            });
          }
        }
      });
    });
  }

  attachStartSessionHandlers();
})();

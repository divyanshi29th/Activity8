// Activity 8: Responsive Layout, Hamburger Menu, Grid/List Toggle & Live Booking

let toastTimer;

const ticketPrices = {
    "RCB vs MI": { General: 800, Premium: 1500, VIP: 3000 },
    "CSK vs KKR": { General: 700, Premium: 1400, VIP: 2800 },
    "MI vs SRH": { General: 850, Premium: 1600, VIP: 3200 }
};

/**
 * Reusable toast notification helper.
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, duration);
}

/**
 * Smoothly scrolls to a target section by ID.
 */
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Hamburger menu controls
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    // Match schedule filter & grid/list toggle controls
    const teamFilter = document.getElementById("team-filter");
    const matchGrid = document.getElementById("match-grid");
    const matchCards = document.querySelectorAll(".match-card");
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");

    // Booking form & live summary controls
    const matchSelect = document.getElementById("match");
    const standSelect = document.getElementById("stand");
    const ticketsInput = document.getElementById("tickets");
    const bookingForm = document.querySelector("#booking-form");

    const summaryMatch = document.getElementById("summary-match");
    const summaryStand = document.getElementById("summary-stand");
    const summaryPrice = document.getElementById("summary-price");
    const summaryQuantity = document.getElementById("summary-quantity");
    const summaryTotal = document.getElementById("summary-total");

    const bookingsBody = document.getElementById("bookings-body");
    const emptyRow = document.getElementById("empty-bookings-row");
    let bookingCounter = 1001;

    // 1. Mobile Hamburger Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 2. Grid / List View Toggle
    if (gridViewBtn && listViewBtn && matchGrid) {
        gridViewBtn.addEventListener("click", function () {
            matchGrid.classList.remove("list-view");
            gridViewBtn.classList.add("active");
            listViewBtn.classList.remove("active");
            showToast("Switched to Grid View.");
        });

        listViewBtn.addEventListener("click", function () {
            matchGrid.classList.add("list-view");
            listViewBtn.classList.add("active");
            gridViewBtn.classList.remove("active");
            showToast("Switched to List View.");
        });
    }

    // 3. Filter Match Cards by Team
    if (teamFilter) {
        teamFilter.addEventListener("change", function () {
            const selectedTeam = teamFilter.value;

            matchCards.forEach(function (card) {
                const teams = card.getAttribute("data-teams") || "";
                card.style.display =
                    selectedTeam === "all" || teams.includes(selectedTeam) ? "" : "none";
            });

            showToast(
                selectedTeam === "all"
                    ? "Showing all IPL match cards."
                    : "Filtered matches for " + selectedTeam + "."
            );
        });
    }

    // 4. Live Booking Summary Calculation
    function updateBookingSummary(notify) {
        const selectedMatch = matchSelect.value;
        const selectedStand = standSelect.value;
        const parsedQty = parseInt(ticketsInput.value, 10);
        const quantity = Number.isNaN(parsedQty) || parsedQty < 1 ? 0 : parsedQty;

        const unitPrice =
            selectedMatch && selectedStand && ticketPrices[selectedMatch]
                ? ticketPrices[selectedMatch][selectedStand] || 0
                : 0;
        const totalAmount = unitPrice * quantity;

        summaryMatch.textContent = selectedMatch || "Not selected";
        summaryStand.textContent = selectedStand || "Not selected";
        summaryPrice.textContent = "₹" + unitPrice;
        summaryQuantity.textContent = quantity;
        summaryTotal.textContent = "₹" + totalAmount;

        if (notify) {
            if (selectedMatch && selectedStand && quantity > 0) {
                showToast(
                    "Summary updated: " +
                        selectedMatch +
                        " (" +
                        selectedStand +
                        " × " +
                        quantity +
                        ") — ₹" +
                        totalAmount
                );
            } else {
                showToast("Booking summary updated.");
            }
        }
    }

    [matchSelect, standSelect, ticketsInput].forEach(function (control) {
        control.addEventListener("change", function () {
            updateBookingSummary(true);
        });
    });

    // 5. Smooth Scroll from Match Cards & Hero Buttons
    document.querySelectorAll(".book-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedMatch = button.getAttribute("data-match");
            if (selectedMatch) {
                matchSelect.value = selectedMatch;
                updateBookingSummary(false);
            }
            scrollToSection("booking");
            showToast("Selected " + selectedMatch + ". Complete your booking below!");
        });
    });

    document.querySelectorAll(".nav-scroll").forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href").replace("#", "");
            if (targetId) {
                event.preventDefault();
                scrollToSection(targetId);
            }
        });
    });

    // 6. Booking Form Submit & Reset
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const selectedMatch = matchSelect.value;
            const selectedStand = standSelect.value;
            const quantity = parseInt(ticketsInput.value, 10) || 1;
            const unitPrice = ticketPrices[selectedMatch][selectedStand] || 0;
            const totalAmount = unitPrice * quantity;

            if (emptyRow && emptyRow.parentNode) {
                emptyRow.remove();
            }

            const newRow = document.createElement("tr");
            const values = [
                "IPL-" + bookingCounter++,
                selectedMatch,
                selectedStand,
                String(quantity),
                "₹" + totalAmount
            ];
            values.forEach(function (val) {
                const cell = document.createElement("td");
                cell.textContent = val;
                newRow.appendChild(cell);
            });
            bookingsBody.appendChild(newRow);

            showToast("Booking confirmed for " + name + "! Total: ₹" + totalAmount);
            bookingForm.reset();
            updateBookingSummary(false);
        });

        bookingForm.addEventListener("reset", function () {
            setTimeout(function () {
                updateBookingSummary(false);
                showToast("Booking form and summary reset.");
            }, 0);
        });
    }

    updateBookingSummary(false);
});

/* =========================================
   CONFIGURACIÓN
========================================= */

// Número de WhatsApp de Tacos Goliath
const WHATSAPP_NUMBER = "527226766140";


/* =========================================
   ELEMENTOS
========================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

const header = document.getElementById("header");

const orderBtn = document.getElementById("orderBtn");
const orderModal = document.getElementById("orderModal");
const modalClose = document.getElementById("modalClose");

const sendOrder = document.getElementById("sendOrder");

const totalElement = document.getElementById("total");

const floatingWa = document.getElementById("floatingWa");

const yearElement = document.getElementById("year");

const orderInputs = document.querySelectorAll(
    '#orderForm input[type="number"]'
);


/* =========================================
   AÑO AUTOMÁTICO
========================================= */

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   MENÚ MÓVIL
========================================= */

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    // Cerrar menú al seleccionar una opción
    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.textContent = "☰";

        });

    });

}


/* =========================================
   HEADER AL HACER SCROLL
========================================= */

window.addEventListener("scroll", () => {

    if (!header) {
        return;
    }

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* =========================================
   MODAL
========================================= */

function openModal() {

    if (!orderModal) {
        return;
    }

    orderModal.classList.add("active");

    orderModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeModal() {

    if (!orderModal) {
        return;
    }

    orderModal.classList.remove("active");

    orderModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


if (orderBtn) {
    orderBtn.addEventListener(
        "click",
        openModal
    );
}


if (modalClose) {
    modalClose.addEventListener(
        "click",
        closeModal
    );
}


/* =========================================
   CERRAR MODAL AL HACER CLICK AFUERA
========================================= */

if (orderModal) {

    orderModal.addEventListener(
        "click",
        event => {

            if (event.target === orderModal) {
                closeModal();
            }

        }
    );

}


/* =========================================
   CERRAR MODAL CON ESC
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModal();
        }

    }
);


/* =========================================
   CALCULAR TOTAL
========================================= */

function calculateTotal() {

    let total = 0;

    orderInputs.forEach(input => {

        const quantity = Math.max(
            0,
            parseInt(input.value, 10) || 0
        );

        const price = Number(
            input.dataset.price
        ) || 0;

        total += quantity * price;

    });

    if (totalElement) {

        totalElement.textContent =
            `$${total.toLocaleString("es-MX")}`;

    }

    return total;
}


/* =========================================
   EVENTOS DE LOS INPUTS
========================================= */

orderInputs.forEach(input => {

    input.addEventListener(
        "input",
        calculateTotal
    );

});


/* =========================================
   GENERAR PEDIDO
========================================= */

function getOrderItems() {

    const items = [];

    orderInputs.forEach(input => {

        const quantity = Math.max(
            0,
            parseInt(input.value, 10) || 0
        );

        const name = input.dataset.name;

        const price = Number(
            input.dataset.price
        ) || 0;

        if (quantity > 0) {

            items.push({
                name,
                quantity,
                price,
                subtotal: quantity * price
            });

        }

    });

    return items;
}


/* =========================================
   ENVIAR PEDIDO A WHATSAPP
========================================= */

if (sendOrder) {

    sendOrder.addEventListener(
        "click",
        () => {

            const items = getOrderItems();

            if (items.length === 0) {

                alert(
                    "Selecciona al menos un taco antes de enviar tu pedido. 🌮"
                );

                return;
            }


            const total = items.reduce(
                (sum, item) => {
                    return sum + item.subtotal;
                },
                0
            );


            let message =
                "🌮 *PEDIDO TACOS GOLIATH*%0A%0A";


            items.forEach(item => {

                message +=
                    `${item.quantity} x ${item.name} — $${item.subtotal}%0A`;

            });


            message +=
                `%0A🔥 *TOTAL: $${total}*%0A%0A`;

            message +=
                "¡Hola! Quiero realizar este pedido. 🙌";


            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =========================================
   WHATSAPP FLOTANTE
========================================= */

if (floatingWa) {

    const floatingMessage =
        "Hola, quiero información sobre los tacos de Tacos Goliath 🌮";

    floatingWa.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            floatingMessage
        )}`;

    floatingWa.target = "_blank";

    floatingWa.rel =
        "noopener noreferrer";

}


/* =========================================
   ANIMACIONES REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   EVITAR CANTIDADES NEGATIVAS
========================================= */

orderInputs.forEach(input => {

    input.addEventListener(
        "change",
        () => {

            if (
                input.value === "" ||
                Number(input.value) < 0
            ) {
                input.value = 0;
            }

            calculateTotal();

        }
    );

});


/* =========================================
   INICIALIZAR
========================================= */

calculateTotal();

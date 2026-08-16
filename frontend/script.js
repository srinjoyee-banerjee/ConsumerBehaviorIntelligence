// ============================================================
// CONSUMER BEHAVIOR INTELLIGENCE
// 2-PAGE ANALYTICS DASHBOARD
// ============================================================


// ============================================================
// CHART CONFIGURATION
// ============================================================

Chart.defaults.color = "#8b5364";
Chart.defaults.borderColor = "#f1dce3";

const charts = {};


// ============================================================
// COLORS
// ============================================================

const COLORS = {

    red: "#b51f3a",

    redDark: "#8f1630",

    rose: "#c94f6d",

    pink: "#e889a0",

    pinkLight: "#f7dce4",

    soft: "#f3c4d0",

    muted: "#a56b7a",

    text: "#633747",

    white: "#ffffff"

};


// ============================================================
// FORMATTERS
// ============================================================

function money(value) {

    const numberValue =
        Number(value) || 0;

    return "£" +
        numberValue.toLocaleString(
            "en-GB",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        );
}


function number(value) {

    return (
        Number(value) || 0
    ).toLocaleString("en-GB");
}


function percentage(value) {

    return (
        Number(value) || 0
    ).toFixed(2) + "%";

}


// ============================================================
// ELEMENT HELPER
// ============================================================

function exists(id) {

    return document.getElementById(id) !== null;

}


// ============================================================
// API
// ============================================================

async function getData(endpoint) {

    const response =
        await fetch(endpoint, {
            cache: "no-store"
        });

    if (!response.ok) {

        throw new Error(
            `${endpoint} returned ${response.status}`
        );

    }

    const data =
        await response.json();

    if (
        data &&
        !Array.isArray(data) &&
        data.error
    ) {

        throw new Error(
            data.error
        );

    }

    return data;

}


// ============================================================
// CHART OPTIONS
// ============================================================

const baseOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {
        duration: 800,
        easing: "easeOutQuart"
    },

    plugins: {

        legend: {
            display: false
        },

        tooltip: {

            backgroundColor: "#ffffff",

            titleColor: COLORS.redDark,

            bodyColor: COLORS.text,

            borderColor: COLORS.pinkLight,

            borderWidth: 1,

            padding: 12

        }

    }

};


// ============================================================
// PAGE NAVIGATION
// ============================================================

function setupNavigation() {

    const buttons =
        document.querySelectorAll(
            "[data-section]"
        );

    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.section;

                sections.forEach(section => {

                    section.classList.toggle(
                        "active",
                        section.id === target
                    );

                });

                buttons.forEach(item => {

                    item.classList.toggle(
                        "active",
                        item === button
                    );

                });

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });

}


// ============================================================
// ROLE
// ============================================================

function loadUserRole() {

    const role =
        localStorage.getItem(
            "cbiUserRole"
        );

    document
        .querySelectorAll(
            "#userRole"
        )
        .forEach(element => {

            element.textContent =
                role || "Analytics User";

        });

}


// ============================================================
// KPIs
// ============================================================

async function loadKPIs() {

    const data =
        await getData(
            "/api/kpis"
        );

    data.forEach(item => {

        const metric =
            String(
                item.Metric || ""
            ).trim();

        const value =
            item.Value;

        if (
            metric === "Total Revenue" &&
            exists("revenue")
        ) {

            document.getElementById(
                "revenue"
            ).textContent =
                money(value);

        }

        if (
            metric === "Total Orders" &&
            exists("orders")
        ) {

            document.getElementById(
                "orders"
            ).textContent =
                number(value);

        }

        if (
            metric === "Total Customers" &&
            exists("customers")
        ) {

            document.getElementById(
                "customers"
            ).textContent =
                number(value);

        }

        if (
            metric === "UK Revenue Share"
        ) {

            const valueFormatted =
                percentage(value);

            if (
                exists("uk-share")
            ) {

                document.getElementById(
                    "uk-share"
                ).textContent =
                    valueFormatted;

            }

        }

    });

}


// ============================================================
// MONTHLY REVENUE
// ============================================================

async function loadMonthly() {

    if (!exists("monthlyChart")) {
        return;
    }

    const data =
        await getData(
            "/api/monthly"
        );

    const labels =
        data.map(
            item => item.YearMonth
        );

    const values =
        data.map(
            item => Number(
                item.Revenue
            ) || 0
        );

    charts.monthly =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {

                type: "line",

                data: {

                    labels,

                    datasets: [{

                        label:
                            "Revenue",

                        data:
                            values,

                        borderColor:
                            COLORS.red,

                        backgroundColor:
                            "rgba(181,31,58,0.08)",

                        borderWidth:
                            3,

                        pointRadius:
                            3,

                        pointHoverRadius:
                            6,

                        pointBackgroundColor:
                            COLORS.red,

                        tension:
                            0.4,

                        fill:
                            true

                    }]

                },

                options: {

                    ...baseOptions,

                    scales: {

                        x: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    COLORS.muted
                            }

                        },

                        y: {

                            grid: {
                                color:
                                    "#f3e1e6"
                            },

                            ticks: {

                                color:
                                    COLORS.muted,

                                callback:
                                    value =>
                                        money(value)

                            }

                        }

                    },

                    plugins: {

                        ...baseOptions.plugins,

                        tooltip: {

                            ...baseOptions.plugins.tooltip,

                            callbacks: {

                                label:
                                    context =>
                                        money(
                                            context.raw
                                        )

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// COUNTRY REVENUE
// ============================================================

async function loadCountries() {

    if (!exists("countryChart")) {
        return;
    }

    const data =
        await getData(
            "/api/countries"
        );

    const top =
        [...data]
            .sort(
                (a, b) =>
                    Number(b.Revenue || 0) -
                    Number(a.Revenue || 0)
            )
            .slice(0, 10);

    charts.country =
        new Chart(
            document.getElementById(
                "countryChart"
            ),
            {

                type: "bar",

                data: {

                    labels:
                        top.map(
                            item =>
                                item.Country
                        ),

                    datasets: [{

                        data:
                            top.map(
                                item =>
                                    Number(
                                        item.Revenue
                                    ) || 0
                            ),

                        backgroundColor:
                            COLORS.red,

                        hoverBackgroundColor:
                            COLORS.redDark,

                        borderRadius:
                            7,

                        borderSkipped:
                            false

                    }]

                },

                options: {

                    ...baseOptions,

                    indexAxis:
                        "y",

                    scales: {

                        x: {

                            grid: {
                                color:
                                    "#f3e1e6"
                            },

                            ticks: {

                                color:
                                    COLORS.muted,

                                callback:
                                    value =>
                                        money(value)

                            }

                        },

                        y: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    COLORS.text
                            }

                        }

                    },

                    plugins: {

                        ...baseOptions.plugins,

                        tooltip: {

                            ...baseOptions.plugins.tooltip,

                            callbacks: {

                                label:
                                    context =>
                                        money(
                                            context.raw
                                        )

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// CUSTOMER SEGMENTS
// ============================================================

async function loadSegments() {

    const data =
        await getData(
            "/api/segments"
        );

    if (exists("segmentChart")) {

        charts.segment =
            new Chart(
                document.getElementById(
                    "segmentChart"
                ),
                {

                    type:
                        "doughnut",

                    data: {

                        labels:
                            data.map(
                                item =>
                                    item.Segment
                            ),

                        datasets: [{

                            data:
                                data.map(
                                    item =>
                                        Number(
                                            item.Customers
                                        ) || 0
                                ),

                            backgroundColor: [

                                COLORS.red,

                                COLORS.rose,

                                COLORS.pink,

                                COLORS.soft,

                                COLORS.muted

                            ],

                            borderColor:
                                COLORS.white,

                            borderWidth:
                                4

                        }]

                    },

                    options: {

                        ...baseOptions,

                        cutout:
                            "68%",

                        plugins: {

                            ...baseOptions.plugins,

                            legend: {

                                display:
                                    true,

                                position:
                                    "bottom",

                                labels: {

                                    color:
                                        COLORS.text,

                                    padding:
                                        16,

                                    usePointStyle:
                                        true

                                }

                            }

                        }

                    }

                }
            );

    }


    if (exists("segments")) {

        const container =
            document.getElementById(
                "segments"
            );

        container.innerHTML = "";

        data.forEach(
            (segment, index) => {

                const colors = [

                    COLORS.red,

                    COLORS.rose,

                    COLORS.pink,

                    COLORS.soft,

                    COLORS.muted

                ];

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "segment-item";

                div.innerHTML = `

                    <div class="segment-top">

                        <div class="segment-name">

                            <span
                                class="segment-dot"
                                style="background:${colors[index % colors.length]}"
                            ></span>

                            ${segment.Segment}

                        </div>

                        <span class="segment-count">

                            ${number(segment.Customers)}

                            customers

                        </span>

                    </div>

                    <div class="segment-meta">

                        <span>
                            Recency
                            ${Number(segment.Avg_Recency || 0).toFixed(1)}
                        </span>

                        <span>
                            Frequency
                            ${Number(segment.Avg_Frequency || 0).toFixed(1)}
                        </span>

                        <strong>
                            ${money(segment.Total_Revenue)}
                        </strong>

                    </div>

                `;

                container.appendChild(
                    div
                );

            }
        );

    }

}


// ============================================================
// PRODUCTS
// ============================================================

async function loadProducts() {

    if (!exists("productChart")) {
        return;
    }

    const data =
        await getData(
            "/api/products"
        );

    const top =
        [...data]
            .sort(
                (a, b) =>
                    Number(b.Revenue || 0) -
                    Number(a.Revenue || 0)
            )
            .slice(0, 10);

    charts.products =
        new Chart(
            document.getElementById(
                "productChart"
            ),
            {

                type:
                    "bar",

                data: {

                    labels:
                        top.map(
                            item =>
                                String(
                                    item.Description ||
                                    ""
                                ).substring(
                                    0,
                                    30
                                )
                        ),

                    datasets: [{

                        data:
                            top.map(
                                item =>
                                    Number(
                                        item.Revenue
                                    ) || 0
                            ),

                        backgroundColor:
                            COLORS.rose,

                        hoverBackgroundColor:
                            COLORS.red,

                        borderRadius:
                            7,

                        borderSkipped:
                            false

                    }]

                },

                options: {

                    ...baseOptions,

                    indexAxis:
                        "y",

                    scales: {

                        x: {

                            grid: {
                                color:
                                    "#f3e1e6"
                            },

                            ticks: {

                                color:
                                    COLORS.muted,

                                callback:
                                    value =>
                                        money(value)

                            }

                        },

                        y: {

                            grid: {
                                display: false
                            },

                            ticks: {

                                color:
                                    COLORS.text,

                                font: {
                                    size: 10
                                }

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// PRODUCT PAIRS
// ============================================================

async function loadPairs() {

    if (!exists("pairs")) {
        return;
    }

    const data =
        await getData(
            "/api/pairs"
        );

    const container =
        document.getElementById(
            "pairs"
        );

    container.innerHTML = "";

    data
        .slice(0, 12)
        .forEach(pair => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "pair-item";

            div.innerHTML = `

                <div class="pair-products">

                    <span>
                        ${pair.Product_A}
                    </span>

                    <b>+</b>

                    <span>
                        ${pair.Product_B}
                    </span>

                </div>

                <div class="pair-count">

                    ${number(
                        pair.CoPurchase_Count
                    )}

                    <small>
                        CO-PURCHASES
                    </small>

                </div>

            `;

            container.appendChild(
                div
            );

        });

}


// ============================================================
// DAY REVENUE
// ============================================================

async function loadDays() {

    if (!exists("dayChart")) {
        return;
    }

    const data =
        await getData(
            "/api/days"
        );

    charts.days =
        new Chart(
            document.getElementById(
                "dayChart"
            ),
            {

                type:
                    "bar",

                data: {

                    labels:
                        data.map(
                            item =>
                                item.DayOfWeek
                        ),

                    datasets: [{

                        data:
                            data.map(
                                item =>
                                    Number(
                                        item.Revenue
                                    ) || 0
                            ),

                        backgroundColor:
                            COLORS.pink,

                        hoverBackgroundColor:
                            COLORS.red,

                        borderRadius:
                            7

                    }]

                },

                options: {

                    ...baseOptions,

                    scales: {

                        x: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    COLORS.muted
                            }

                        },

                        y: {

                            grid: {
                                color:
                                    "#f3e1e6"
                            },

                            ticks: {

                                color:
                                    COLORS.muted,

                                callback:
                                    value =>
                                        money(value)

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// HOURLY REVENUE
// ============================================================

async function loadHours() {

    if (!exists("hourChart")) {
        return;
    }

    const data =
        await getData(
            "/api/hours"
        );

    charts.hours =
        new Chart(
            document.getElementById(
                "hourChart"
            ),
            {

                type:
                    "line",

                data: {

                    labels:
                        data.map(
                            item =>
                                `${item.Hour}:00`
                        ),

                    datasets: [{

                        data:
                            data.map(
                                item =>
                                    Number(
                                        item.Revenue
                                    ) || 0
                            ),

                        borderColor:
                            COLORS.red,

                        backgroundColor:
                            "rgba(181,31,58,0.08)",

                        borderWidth:
                            3,

                        pointRadius:
                            3,

                        pointHoverRadius:
                            6,

                        pointBackgroundColor:
                            COLORS.red,

                        tension:
                            0.4,

                        fill:
                            true

                    }]

                },

                options: {

                    ...baseOptions,

                    scales: {

                        x: {

                            grid: {
                                display: false
                            },

                            ticks: {
                                color:
                                    COLORS.muted
                            }

                        },

                        y: {

                            grid: {
                                color:
                                    "#f3e1e6"
                            },

                            ticks: {

                                color:
                                    COLORS.muted,

                                callback:
                                    value =>
                                        money(value)

                            }

                        }

                    }

                }

            }
        );

}


// ============================================================
// LOAD EVERYTHING
// ============================================================

async function initializeDashboard() {

    loadUserRole();

    setupNavigation();

    try {

        await Promise.all([

            loadKPIs(),

            loadMonthly(),

            loadCountries(),

            loadSegments(),

            loadProducts(),

            loadPairs(),

            loadDays(),

            loadHours()

        ]);

        console.log(
            "Consumer Behavior Intelligence loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showDataError(
            error.message
        );

    }

}


// ============================================================
// ERROR
// ============================================================

function showDataError(errorText) {

    const existing =
        document.querySelector(
            ".data-error"
        );

    if (existing) {
        existing.remove();
    }

    const error =
        document.createElement(
            "div"
        );

    error.className =
        "data-error";

    error.innerHTML = `

        <strong>
            Dashboard data could not be loaded.
        </strong>

        <span>
            ${errorText}
        </span>

        <small>
            Check /api/status to verify your CSV files.
        </small>

    `;

    document.body.prepend(
        error
    );

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);

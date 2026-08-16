```javascript
// ============================================================
// CONSUMER BEHAVIOR INTELLIGENCE
// 3-PAGE ANALYTICS DATA ENGINE
// ============================================================


// ============================================================
// CHART THEME
// ============================================================

Chart.defaults.color = "#8b5364";
Chart.defaults.borderColor = "#f1dce3";

const charts = {};


// ============================================================
// COLOR PALETTE
// ============================================================

const COLORS = {
    red: "#b51f3a",
    redDark: "#8f1630",
    pink: "#e889a0",
    pinkLight: "#f7dce4",
    rose: "#c94f6d",
    soft: "#f3c4d0",
    muted: "#a56b7a"
};


// ============================================================
// FORMATTERS
// ============================================================

function money(value) {

    return "£" + Number(value).toLocaleString(
        "en-GB",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );
}


function number(value) {

    return Number(value).toLocaleString("en-GB");
}


// ============================================================
// API HELPER
// ============================================================

async function getData(endpoint) {

    const response = await fetch(endpoint);

    if (!response.ok) {

        throw new Error(
            `API error: ${endpoint} (${response.status})`
        );

    }

    return await response.json();
}


// ============================================================
// SAFE ELEMENT CHECK
// ============================================================

function exists(id) {

    return document.getElementById(id) !== null;
}


// ============================================================
// CHART DEFAULTS
// ============================================================

const baseOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {
        duration: 900,
        easing: "easeOutQuart"
    },

    plugins: {

        legend: {
            display: false
        },

        tooltip: {

            backgroundColor: "#ffffff",

            titleColor: COLORS.redDark,

            bodyColor: "#633747",

            borderColor: COLORS.pinkLight,

            borderWidth: 1,

            padding: 12,

            displayColors: false

        }

    }

};


// ============================================================
// ROLE DISPLAY
// ============================================================

function loadUserRole() {

    const role =
        localStorage.getItem("cbiUserRole");

    document
        .querySelectorAll("#userRole")
        .forEach(element => {

            if (role) {
                element.textContent = role;
            }

        });

}


// ============================================================
// KPI DATA
// ============================================================

async function loadKPIs() {

    if (
        !exists("revenue") &&
        !exists("orders") &&
        !exists("customers") &&
        !exists("uk-share")
    ) {
        return;
    }


    const data = await getData("/api/kpis");


    data.forEach(item => {

        const metric = item.Metric;
        const value = item.Value;


        if (
            metric === "Total Revenue" &&
            exists("revenue")
        ) {

            document.getElementById(
                "revenue"
            ).textContent = money(value);

        }


        else if (
            metric === "Total Orders" &&
            exists("orders")
        ) {

            document.getElementById(
                "orders"
            ).textContent = number(value);

        }


        else if (
            metric === "Total Customers" &&
            exists("customers")
        ) {

            document.getElementById(
                "customers"
            ).textContent = number(value);

        }


        else if (
            metric === "UK Revenue Share"
        ) {

            const formatted =
                Number(value).toFixed(2) + "%";


            if (exists("uk-share")) {

                document.getElementById(
                    "uk-share"
                ).textContent = formatted;

            }


            if (exists("uk-share-insight")) {

                document.getElementById(
                    "uk-share-insight"
                ).textContent = formatted;

            }

        }

    });

}


// ============================================================
// MONTHLY REVENUE
// PAGE 2
// ============================================================

async function loadMonthly() {

    if (!exists("monthlyChart")) {
        return;
    }


    const data =
        await getData("/api/monthly");


    const labels =
        data.map(x => x.YearMonth);


    const values =
        data.map(x => Number(x.Revenue));


    const ctx =
        document.getElementById("monthlyChart");


    charts.monthly =
        new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderColor: COLORS.red,

                    backgroundColor:
                        "rgba(181,31,58,0.10)",

                    borderWidth: 3,

                    pointRadius: 3,

                    pointHoverRadius: 6,

                    pointBackgroundColor:
                        COLORS.red,

                    tension: 0.4,

                    fill: true

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
                            color: COLORS.muted
                        }

                    },

                    y: {

                        grid: {
                            color: "#f3e1e6"
                        },

                        ticks: {

                            color: COLORS.muted,

                            callback: value =>
                                "£" +
                                Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    }

                },


                plugins: {

                    ...baseOptions.plugins,

                    tooltip: {

                        ...baseOptions.plugins.tooltip,

                        callbacks: {

                            label: context =>
                                money(context.raw)

                        }

                    }

                }

            }

        });

}


// ============================================================
// COUNTRY REVENUE
// PAGE 2
// ============================================================

async function loadCountries() {

    if (!exists("countryChart")) {
        return;
    }


    const data =
        await getData("/api/countries");


    const top =
        data
            .sort(
                (a, b) =>
                    Number(b.Revenue) -
                    Number(a.Revenue)
            )
            .slice(0, 10);


    const labels =
        top.map(x => x.Country);


    const values =
        top.map(x => Number(x.Revenue));


    const ctx =
        document.getElementById("countryChart");


    charts.country =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    backgroundColor:
                        COLORS.red,

                    hoverBackgroundColor:
                        COLORS.redDark,

                    borderRadius: 8,

                    borderSkipped: false

                }]

            },


            options: {

                ...baseOptions,

                indexAxis: "y",

                scales: {

                    x: {

                        grid: {
                            color: "#f3e1e6"
                        },

                        ticks: {

                            color: COLORS.muted,

                            callback: value =>
                                "£" +
                                Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    },

                    y: {

                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#633747"
                        }

                    }

                },


                plugins: {

                    ...baseOptions.plugins,

                    tooltip: {

                        ...baseOptions.plugins.tooltip,

                        callbacks: {

                            label: context =>
                                money(context.raw)

                        }

                    }

                }

            }

        });

}


// ============================================================
// CUSTOMER SEGMENTS
// PAGE 3
// ============================================================

async function loadSegments() {

    if (
        !exists("segmentChart") &&
        !exists("segments")
    ) {
        return;
    }


    const data =
        await getData("/api/segments");


    // --------------------------------------------------------
    // CHART
    // --------------------------------------------------------

    if (exists("segmentChart")) {

        const labels =
            data.map(x => x.Segment);


        const customers =
            data.map(
                x => Number(x.Customers)
            );


        const ctx =
            document.getElementById(
                "segmentChart"
            );


        charts.segment =
            new Chart(ctx, {

                type: "doughnut",

                data: {

                    labels,

                    datasets: [{

                        data: customers,

                        backgroundColor: [

                            COLORS.red,

                            COLORS.rose,

                            COLORS.pink,

                            COLORS.soft,

                            COLORS.muted

                        ],

                        borderColor:
                            "#ffffff",

                        borderWidth: 4,

                        hoverOffset: 8

                    }]

                },


                options: {

                    ...baseOptions,

                    cutout: "68%",

                    plugins: {

                        ...baseOptions.plugins,

                        legend: {

                            display: true,

                            position: "bottom",

                            labels: {

                                color:
                                    "#633747",

                                padding: 18,

                                usePointStyle: true,

                                pointStyle:
                                    "circle"

                            }

                        }

                    }

                }

            });

    }


    // --------------------------------------------------------
    // SEGMENT LIST
    // --------------------------------------------------------

    if (exists("segments")) {

        const container =
            document.getElementById(
                "segments"
            );


        container.innerHTML = "";


        data.forEach(
            (segment, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "segment-item";


                div.innerHTML = `

                    <div class="segment-top">

                        <span class="segment-name">

                            <span class="segment-dot"
                                style="
                                    background:
                                    ${[
                                        COLORS.red,
                                        COLORS.rose,
                                        COLORS.pink,
                                        COLORS.soft,
                                        COLORS.muted
                                    ][index % 5]};
                                ">
                            </span>

                            ${segment.Segment}

                        </span>

                        <span class="segment-count">

                            ${number(
                                segment.Customers
                            )}

                            customers

                        </span>

                    </div>


                    <div class="segment-meta">

                        <span>
                            Recency
                            ${Number(
                                segment.Avg_Recency
                            ).toFixed(1)}
                        </span>

                        <span>
                            Frequency
                            ${Number(
                                segment.Avg_Frequency
                            ).toFixed(1)}
                        </span>

                        <strong>
                            ${money(
                                segment.Total_Revenue
                            )}
                        </strong>

                    </div>

                `;


                container.appendChild(div);

            }
        );

    }

}


// ============================================================
// TOP PRODUCTS
// PAGE 3
// ============================================================

async function loadProducts() {

    if (!exists("productChart")) {
        return;
    }


    const data =
        await getData("/api/products");


    const top =
        data
            .sort(
                (a, b) =>
                    Number(b.Revenue) -
                    Number(a.Revenue)
            )
            .slice(0, 10);


    const labels =
        top.map(
            x =>
                String(
                    x.Description
                ).substring(0, 30)
        );


    const values =
        top.map(
            x => Number(x.Revenue)
        );


    const ctx =
        document.getElementById(
            "productChart"
        );


    charts.products =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    backgroundColor:
                        COLORS.rose,

                    hoverBackgroundColor:
                        COLORS.red,

                    borderRadius: 7,

                    borderSkipped: false

                }]

            },


            options: {

                ...baseOptions,

                indexAxis: "y",

                scales: {

                    x: {

                        grid: {
                            color: "#f3e1e6"
                        },

                        ticks: {

                            color: COLORS.muted,

                            callback: value =>
                                "£" +
                                Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    },

                    y: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color: "#633747",

                            font: {
                                size: 10
                            }

                        }

                    }

                },


                plugins: {

                    ...baseOptions.plugins,

                    tooltip: {

                        ...baseOptions.plugins.tooltip,

                        callbacks: {

                            label: context =>
                                money(context.raw)

                        }

                    }

                }

            }

        });

}


// ============================================================
// PRODUCT PAIRS
// PAGE 3
// ============================================================

async function loadPairs() {

    if (!exists("pairs")) {
        return;
    }


    const data =
        await getData("/api/pairs");


    const container =
        document.getElementById("pairs");


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


            container.appendChild(div);

        });

}


// ============================================================
// DAY OF WEEK
// PAGE 3
// ============================================================

async function loadDays() {

    if (!exists("dayChart")) {
        return;
    }


    const data =
        await getData("/api/days");


    const labels =
        data.map(x => x.DayOfWeek);


    const values =
        data.map(
            x => Number(x.Revenue) || 0
        );


    const ctx =
        document.getElementById(
            "dayChart"
        );


    charts.days =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    backgroundColor:
                        COLORS.pink,

                    hoverBackgroundColor:
                        COLORS.red,

                    borderRadius: 8,

                    borderSkipped: false

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

                            callback: value =>
                                "£" +
                                Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    }

                },


                plugins: {

                    ...baseOptions.plugins,

                    tooltip: {

                        ...baseOptions.plugins.tooltip,

                        callbacks: {

                            label: context =>
                                money(context.raw)

                        }

                    }

                }

            }

        });

}


// ============================================================
// HOURLY BEHAVIOR
// PAGE 3
// ============================================================

async function loadHours() {

    if (!exists("hourChart")) {
        return;
    }


    const data =
        await getData("/api/hours");


    const labels =
        data.map(
            x => `${x.Hour}:00`
        );


    const values =
        data.map(
            x => Number(x.Revenue) || 0
        );


    const ctx =
        document.getElementById(
            "hourChart"
        );


    charts.hours =
        new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderColor:
                        COLORS.red,

                    backgroundColor:
                        "rgba(181,31,58,0.08)",

                    borderWidth: 3,

                    pointRadius: 3,

                    pointHoverRadius: 7,

                    pointBackgroundColor:
                        COLORS.red,

                    tension: 0.4,

                    fill: true

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

                            callback: value =>
                                "£" +
                                Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    }

                },


                plugins: {

                    ...baseOptions.plugins,

                    tooltip: {

                        ...baseOptions.plugins.tooltip,

                        callbacks: {

                            label: context =>
                                money(context.raw)

                        }

                    }

                }

            }

        });

}


// ============================================================
// PAGE DETECTION
// ============================================================

function detectPage() {

    if (exists("monthlyChart")) {
        return "overview";
    }

    if (
        exists("segmentChart") ||
        exists("productChart") ||
        exists("dayChart") ||
        exists("hourChart")
    ) {
        return "intelligence";
    }

    return "landing";
}


// ============================================================
// INITIALIZE
// ============================================================

async function initializeDashboard() {

    loadUserRole();


    const page =
        detectPage();


    try {

        // ----------------------------------------------------
        // PAGE 2
        // ----------------------------------------------------

        if (page === "overview") {

            await Promise.all([

                loadKPIs(),

                loadMonthly(),

                loadCountries()

            ]);

        }


        // ----------------------------------------------------
        // PAGE 3
        // ----------------------------------------------------

        else if (page === "intelligence") {

            await Promise.all([

                loadSegments(),

                loadProducts(),

                loadPairs(),

                loadDays(),

                loadHours()

            ]);

        }


        console.log(
            `CBI ${page} page loaded successfully.`
        );

    }


    catch (error) {

        console.error(
            "Consumer Behavior Intelligence error:",
            error
        );


        showDataError();

    }

}


// ============================================================
// ERROR STATE
// ============================================================

function showDataError() {

    const message =
        document.createElement("div");


    message.className =
        "data-error";


    message.innerHTML = `

        <strong>
            Unable to load analytics data.
        </strong>

        <span>
            Please check that the Flask API
            is running correctly.
        </span>

    `;


    document.body.appendChild(message);

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);
```

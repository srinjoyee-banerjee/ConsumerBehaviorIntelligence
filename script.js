
// ============================================================
// CONSUMER BEHAVIOR INTELLIGENCE
// DASHBOARD DATA ENGINE
// ============================================================

Chart.defaults.color = "#81939f";
Chart.defaults.borderColor = "#1b2d39";

let charts = {};


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
    return Number(value).toLocaleString(
        "en-GB"
    );
}


// ============================================================
// API HELPER
// ============================================================

async function getData(endpoint) {

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(
            `API error: ${endpoint}`
        );
    }

    return await response.json();
}


// ============================================================
// KPI DATA
// ============================================================

async function loadKPIs() {

    const data = await getData(
        "/api/kpis"
    );

    data.forEach(item => {

        const metric = item.Metric;
        const value = item.Value;

        if (metric === "Total Revenue") {

            document.getElementById(
                "revenue"
            ).textContent = money(value);

        }

        else if (metric === "Total Orders") {

            document.getElementById(
                "orders"
            ).textContent = number(value);

        }

        else if (metric === "Total Customers") {

            document.getElementById(
                "customers"
            ).textContent = number(value);

        }

        else if (metric === "UK Revenue Share") {

            document.getElementById(
                "uk-share"
            ).textContent =
                Number(value).toFixed(2) + "%";

        }

    });
}


// ============================================================
// MONTHLY REVENUE
// ============================================================

async function loadMonthly() {

    const data = await getData(
        "/api/monthly"
    );

    const labels = data.map(
        x => x.YearMonth
    );

    const values = data.map(
        x => Number(x.Revenue)
    );

    const ctx =
        document.getElementById(
            "monthlyChart"
        );

    charts.monthly = new Chart(
        ctx,
        {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: "Revenue",

                    data: values,

                    borderWidth: 2,

                    pointRadius: 3,

                    tension: 0.35,

                    fill: true,

                    backgroundColor:
                        "rgba(99, 211, 145, 0.08)",

                    borderColor:
                        "#63d391",

                    pointBackgroundColor:
                        "#63d391"
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return money(
                                    context.raw
                                );

                            }

                        }

                    }

                },

                scales: {

                    x: {
                        grid: {
                            display: false
                        }
                    },

                    y: {

                        grid: {
                            color: "#182a35"
                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return "£" +
                                        Number(value)
                                        .toLocaleString(
                                            "en-GB"
                                        );

                                }

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

    const data = await getData(
        "/api/countries"
    );

    const top = data
        .sort(
            (a, b) =>
                Number(b.Revenue) -
                Number(a.Revenue)
        )
        .slice(0, 10);

    const labels = top.map(
        x => x.Country
    );

    const values = top.map(
        x => Number(x.Revenue)
    );

    const ctx =
        document.getElementById(
            "countryChart"
        );

    charts.country = new Chart(
        ctx,
        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderRadius: 5,

                    backgroundColor:
                        "#4f7d91"

                }]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                context =>
                                    money(
                                        context.raw
                                    )

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            color: "#182a35"
                        },

                        ticks: {

                            callback:
                                value =>
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

    const data = await getData(
        "/api/segments"
    );

    const labels = data.map(
        x => x.Segment
    );

    const customers = data.map(
        x => Number(x.Customers)
    );

    const ctx =
        document.getElementById(
            "segmentChart"
        );

    charts.segment = new Chart(
        ctx,
        {
            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: customers,

                    backgroundColor: [
                        "#63d391",
                        "#4f7d91",
                        "#7f91a0",
                        "#405968"
                    ],

                    borderColor:
                        "#0d1a24",

                    borderWidth: 3

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            padding: 15,

                            usePointStyle: true,

                            font: {
                                size: 10
                            }

                        }

                    }

                }

            }

        }
    );


    // Segment list

    const container =
        document.getElementById(
            "segments"
        );

    container.innerHTML = "";

    data.forEach(segment => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "segment-item";

        div.innerHTML = `

            <div class="segment-top">

                <span class="segment-name">
                    ${segment.Segment}
                </span>

                <span class="segment-count">
                    ${number(segment.Customers)}
                    customers
                </span>

            </div>

            <div class="segment-meta">

                <span>
                    Avg Recency:
                    ${Number(
                        segment.Avg_Recency
                    ).toFixed(1)}
                </span>

                <span>
                    Avg Frequency:
                    ${Number(
                        segment.Avg_Frequency
                    ).toFixed(1)}
                </span>

                <span>
                    ${money(
                        segment.Total_Revenue
                    )}
                </span>

            </div>

        `;

        container.appendChild(div);

    });
}


// ============================================================
// TOP PRODUCTS
// ============================================================

async function loadProducts() {

    const data = await getData(
        "/api/products"
    );

    const top = data
        .sort(
            (a, b) =>
                Number(b.Revenue) -
                Number(a.Revenue)
        )
        .slice(0, 10);

    const labels = top.map(
        x =>
            String(x.Description)
                .substring(0, 30)
    );

    const values = top.map(
        x => Number(x.Revenue)
    );

    const ctx =
        document.getElementById(
            "productChart"
        );

    charts.products = new Chart(
        ctx,
        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderRadius: 5,

                    backgroundColor:
                        "#627f8d"

                }]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                context =>
                                    money(
                                        context.raw
                                    )

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            color: "#182a35"
                        },

                        ticks: {

                            callback:
                                value =>
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
                            font: {
                                size: 9
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

    const data = await getData(
        "/api/pairs"
    );

    const container =
        document.getElementById(
            "pairs"
        );

    container.innerHTML = "";

    data.slice(0, 15).forEach(
        pair => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "pair-item";

            div.innerHTML = `

                <div class="pair-products">

                    ${pair.Product_A}

                    <br>

                    +

                    <br>

                    ${pair.Product_B}

                </div>

                <div class="pair-count">

                    ${number(
                        pair.CoPurchase_Count
                    )}

                    CO-PURCHASES

                </div>

            `;

            container.appendChild(div);

        }
    );
}


// ============================================================
// DAY OF WEEK
// ============================================================

async function loadDays() {

    const data = await getData(
        "/api/days"
    );

    const labels = data.map(
        x => x.DayOfWeek
    );

    const values = data.map(
        x => Number(x.Revenue) || 0
    );

    const ctx =
        document.getElementById(
            "dayChart"
        );

    charts.days = new Chart(
        ctx,
        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderRadius: 5,

                    backgroundColor:
                        "#4f7d91"

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                context =>
                                    money(
                                        context.raw
                                    )

                        }

                    }

                },

                scales: {

                    x: {
                        grid: {
                            display: false
                        }
                    },

                    y: {

                        grid: {
                            color: "#182a35"
                        },

                        ticks: {

                            callback:
                                value =>
                                    "£" +
                                    Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    }

                }

            }

        }
    );
}


// ============================================================
// HOUR
// ============================================================

async function loadHours() {

    const data = await getData(
        "/api/hours"
    );

    const labels = data.map(
        x => `${x.Hour}:00`
    );

    const values = data.map(
        x => Number(x.Revenue)
    );

    const ctx =
        document.getElementById(
            "hourChart"
        );

    charts.hours = new Chart(
        ctx,
        {
            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Revenue",

                    data: values,

                    borderWidth: 2,

                    tension: 0.35,

                    pointRadius: 3,

                    borderColor:
                        "#63d391",

                    backgroundColor:
                        "rgba(99,211,145,0.08)",

                    fill: true

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                context =>
                                    money(
                                        context.raw
                                    )

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        }

                    },

                    y: {

                        grid: {
                            color: "#182a35"
                        },

                        ticks: {

                            callback:
                                value =>
                                    "£" +
                                    Number(value)
                                    .toLocaleString(
                                        "en-GB"
                                    )

                        }

                    }

                }

            }

        }
    );
}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

async function initializeDashboard() {

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
            "Consumer Behavior Intelligence loaded."
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);

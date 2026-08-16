# Consumer Behavior Intelligence

An end-to-end **Data Science & Analytics project** that analyzes customer purchasing behavior using the **UCI Online Retail dataset**, applies **RFM analysis and K-Means clustering** for customer segmentation, performs **market basket analysis**, and presents actionable business insights through an interactive dashboard and Flask web application.

## Objective

* Analyze customer purchasing patterns and revenue trends
* Clean and prepare real-world transactional data
* Perform exploratory data analysis (EDA)
* Calculate **Recency, Frequency, and Monetary (RFM)** metrics
* Segment customers using **K-Means clustering**
* Identify frequently purchased product combinations
* Generate actionable business insights
* Build an interactive analytics dashboard
* Deploy the project as a Flask web application

## Dataset

**Source:** UCI Online Retail Dataset

* **Rows:** 541,909
* **Columns:** 8
* **Countries:** 37
* **Customers:** 4,338
* **Products:** 3,665
* **Orders:** 18,532

The dataset contains transactional records including invoice number, product description, quantity, invoice date, unit price, customer ID, and country.

## Data Cleaning

The raw transactional data was processed before analysis:

* Removed cancelled transactions
* Removed missing customer IDs
* Removed missing product descriptions
* Removed invalid quantities
* Removed invalid unit prices
* Removed duplicate records
* Created revenue from quantity × unit price
* Extracted date, month, day, hour, and weekday features
* Prepared clean customer-level and transaction-level datasets

## Exploratory Data Analysis

The analysis covers:

* Revenue trends
* Monthly sales performance
* Daily sales performance
* Hourly purchasing behavior
* Country-wise revenue
* Product-level revenue
* Customer purchasing patterns
* Order volume and transaction trends

### Key Business Insights

* **Total Revenue:** £8,887,208.89
* **Total Orders:** 18,532
* **Customers:** 4,338
* **Products:** 3,665
* **Countries:** 37
* **UK Revenue Share:** 81.97%
* **Highest Revenue Month:** November 2011 — £1,156,205.61
* **Highest Revenue Day:** Thursday — £1,973,015.73
* **Highest Revenue Hour:** 12:00 — £1,373,695.39
* **Top Product:** PAPER CRAFT , LITTLE BIRDIE — £168,469.60

## Customer Segmentation

RFM analysis was performed using:

| Metric    | Meaning                           |
| --------- | --------------------------------- |
| Recency   | How recently a customer purchased |
| Frequency | How often a customer purchased    |
| Monetary  | How much a customer spent         |

K-Means clustering was then applied to identify distinct customer groups.

### Customer Segments

* **Champions:** 713 customers — £5,766,757.07 revenue
* **Loyal:** 1,166 customers — £2,100,873.02 revenue
* **New / Emerging:** 837 customers

These segments can support targeted marketing, retention campaigns, loyalty programs, and personalized offers.

## Market Basket Analysis

Association analysis was used to identify products that are frequently purchased together.

This can support:

* Product bundling
* Cross-selling
* Recommendation systems
* Store layout optimization
* Promotional campaigns

## Dashboard

The interactive dashboard provides a business-focused view of:

* Revenue KPIs
* Order and customer metrics
* Monthly revenue trends
* Country performance
* Product performance
* Customer segmentation
* RFM analysis
* Purchasing patterns
* Market basket insights

## Tech Stack

**Programming & Analysis**

* Python
* Pandas
* NumPy
* Scikit-learn

**Visualization**

* Matplotlib
* Seaborn
* Plotly

**Machine Learning**

* K-Means Clustering
* RFM Customer Segmentation
* Association Rule Mining

**Web Application**

* Flask
* HTML
* CSS
* JavaScript

**Development & Deployment**

* Google Colab
* GitHub
* Render

## Project Structure

```text
Consumer-Behavior-Intelligence/
│
├── app.py
├── README.md
├── requirements.txt
├── Procfile
│
├── data/
│   └── online_retail.csv
│
├── notebooks/
│   └── consumer_behavior_analysis.ipynb
│
├── models/
│   └── customer_segmentation_model.pkl
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
└── dashboard/
    └── dashboard files
```

## Project Workflow

```text
Raw Transaction Data
        ↓
Data Cleaning & Preprocessing
        ↓
Exploratory Data Analysis
        ↓
Revenue & Customer Analysis
        ↓
RFM Feature Engineering
        ↓
K-Means Customer Segmentation
        ↓
Market Basket Analysis
        ↓
Business Insights
        ↓
Interactive Dashboard
        ↓
Flask Web Application
        ↓
GitHub → Render Deployment
```

## Business Value

This project demonstrates how raw transactional data can be transformed into **actionable customer intelligence**.

The analysis can help businesses:

* Identify high-value customers
* Improve customer retention
* Design targeted marketing campaigns
* Discover cross-selling opportunities
* Understand revenue patterns
* Optimize product promotions
* Make data-driven business decisions

## Author

**Srinjoyee Bandyopadhyay**

Data Science | Machine Learning | Deep Learning | Geospatial Analytics

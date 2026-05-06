# 📦 ShipSense AI — Shipping Delay Predictor

ShipSense AI is a premium, full-stack machine learning application that predicts shipment delays using a Random Forest Classifier. It features a stunning glassmorphism UI, interactive analytics, and explainable AI insights.

![GitHub last commit](https://img.shields.io/github/last-commit/google/antigravity)
![Python Version](https://img.shields.io/badge/python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.1.1-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **Predictive Intelligence**: Uses a Random Forest model trained on 10,000+ records to predict "On Time" vs "Delayed" status.
- **Explainable AI (XAI)**: Visualizes the "Impact Score" of features (Sales, Region, Ship Mode) for every prediction.
- **Interactive Analytics**: Real-time charts showing global delay trends and shipping efficiency across different modes.
- **Premium UI/UX**: Modern dark-mode design with glassmorphism, backdrop blurs, and animated background orbs.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Prediction History**: Local tracking of recent predictions.

## 🛠️ Tech Stack

- **Backend**: Python, Flask, Scikit-Learn, Pandas, Joblib.
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (ES6+), Chart.js.
- **Deployment Ready**: Configured for Vercel, Render, or Heroku.

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/shipsense-ai.git
   cd shipsense-ai
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the UI**:
   Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

## 📁 Project Structure

- `app.py`: Flask backend API and model serving logic.
- `index.html`: Main frontend application page.
- `style.css`: Design system and glassmorphism styles.
- `script.js`: Frontend logic and chart integration.
- `shipping_delay_model.pkl`: The trained Random Forest model.
- `requirements.txt`: Python dependencies.

## 🌐 Deployment

This project is ready for deployment on platforms like **Render** or **Vercel**:

### For Render:
1. Connect your GitHub repo.
2. Select **Web Service**.
3. Use the following settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

---
Built with ❤️ by [Your Name]

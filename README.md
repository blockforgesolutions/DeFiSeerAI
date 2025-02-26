# DeFiSeerAI

This repository contains a trading bot built on the Internet Computer Protocol (ICP) that uses machine learning to predict price movements and generate trading signals for the ICP cryptocurrency.
Project Overview
The ICP AI Trading Bot consists of three main components:

TradingBot (main.mo): The core trading system that fetches real-time ICP price data, processes historical data, trains a simple neural network model, and generates trading signals.
Types (types.mo): Defines the data structures and types used throughout the application, including HTTP request/response types and cryptocurrency identifiers.
User Management (user.mo): Handles user authentication, registration, and profile management using Internet Identity.

Features

Real-time ICP price data fetching from CryptoCompare API
Historical price data analysis (24-hour and 30-day periods)
Simple machine learning model to predict price movements
Trading signal generation (BUY, SELL, HOLD) with confidence levels
Automated trading in 30-second intervals
User authentication and profile management
Performance tracking and reporting

Prerequisites

DFINITY Canister SDK
Internet Computer replica (local or mainnet)
Internet Identity setup for authentication

Getting Started

Clone the repository
Install dependencies
Deploy the canisters to the Internet Computer

bashCopydfx start --clean --background
dfx deploy
Usage
Starting the Trading Bot
motokoCopyawait TradingBot.startAutoTrading()
This will:

Load 24 hours of historical ICP price data
Initialize the model weights
Start automated trading at 30-second intervals

Checking Bot Status
motokoCopyawait TradingBot.checkBotStatus()
Getting Trading Signals
motokoCopyawait TradingBot.getSignal()
The signal will include:

Current ICP price in USDT
Trading recommendation (BUY, SELL, HOLD)
Confidence percentage

Stopping the Trading Bot
motokoCopyawait TradingBot.stopAutoTrading()
User Management
motokoCopy// Register a new user
await User.signUpWithInternetIdentity("username", null, principal)

// Get user information
await User.getUserInfo(principalId)

// Update user profile
await User.updateUser({ name = "new_name", avatar = "avatar_url" }, principal)
Technical Implementation
Machine Learning Model
The trading bot uses a simple neural network with:

Input features: price, volume, and 24-hour change percentage
Sigmoid activation function
Gradient descent for weight optimization
Binary classification (price up or down)

Data Normalization
The system normalizes trading data to improve model training:

Prices are used directly
Volume is scaled down by dividing by 10,000,000
24-hour change is converted to a decimal (divided by 100)

API Integration
The system integrates with CryptoCompare APIs:

Real-time price API: /data/price?fsym=ICP&tsyms=USDT
Historical daily data: /data/v2/histoday?fsym=ICP&tsym=USDT&limit=30
Historical hourly data: /data/v2/histohour?fsym=ICP&tsym=USDT&limit=24

Limitations

The machine learning model is intentionally simple and may not capture complex market patterns
HTTP outcalls require cycles for execution
Limited error handling for API failures
No persistent storage for trading history between canister upgrades

Future Improvements

Implement more sophisticated machine learning models
Add additional technical indicators (RSI, MACD, etc.)
Create a web frontend for easy interaction
Implement persistent storage for trading history
Add support for additional cryptocurrencies
Implement backtesting functionality
Add notifications for important trading signals

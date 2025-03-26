# ShineTime - Car Waxing Services App

A modern interactive web application for car waxing services. This app allows users to create profiles for a rewards program, book services, and make payments.

## Features

- **User Profiles**: Create an account and track your rewards
- **Rewards Program**: Earn 1 star for every dollar spent
- **Service Booking**: Book car waxing services with date and time selection
- **Online Payment**: Pay for services directly through the app
- **Tiered Services**: Choose from Basic, Premium, and Ultimate service tiers

## Rewards Program

The rewards program works as follows:
- Earn 1 star for every dollar spent
- Redeem stars for free services:
  - 50 stars: Free Basic Wash (Value: $25)
  - 100 stars: Free Basic Wax (Value: $50)
  - 200 stars: Free Premium Wax (Value: $90)
  - 300 stars: Free Ultimate Package (Value: $150)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB (simulated with in-memory data for this demo)
- Payment Processing: Stripe (simulated for this demo)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Demo Account

For testing purposes, you can use the following demo account:
- Email: demo@example.com
- Password: password123

## Future Enhancements

- Real database integration with MongoDB
- Actual payment processing with Stripe
- Admin dashboard for managing services and appointments
- Email notifications for booking confirmations
- Mobile app version

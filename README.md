# Ecommerce

Ecommerce is a full-featured e-commerce application built using Node.js and MongoDB. This application supports various functionalities such as user authentication, product management, wishlist, shopping cart, secure payment integration with Razorpay, order tracking, an OTP system for added security, and a comprehensive checkout page.

## Features

- **User Authentication**
  - Login using email and password
  - Google Authentication
  - OTP based login

- **Product Management**
  - Add, update, and delete products

- **Wishlist**
  - Add products to the wishlist

- **Shopping Cart**
  - Add and remove products from the cart
  - Adjust product quantity in the cart

- **Checkout Page**
  - Review cart items
  - Enter shipping information
  - Select payment method
  - Place orders securely

- **Secure Payments**
  - Razorpay integration for secure transactions

- **Order History**
  - Track order history and status

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js, Google OAuth, OTP system
- **Payment Gateway**: Razorpay

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (>=12.x)
- MongoDB (local or cloud instance)
- Razorpay Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/WebWithRathor/Ecommerce.git
   cd Ecommerce
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   OTP_SECRET=your_otp_secret
   ```

4. Start the application:
   ```bash
   npm start
   ```

The server should now be running on `http://localhost:3000`.

### Usage

- **Login and Authentication**
  - Register and login with email and password
  - Login with Google
  - OTP-based login for additional security

- **Product Management**
  - Admin users can add, update, or delete products

- **Wishlist**
  - Users can add products to their wishlist for future reference

- **Shopping Cart**
  - Users can add products to their cart, adjust quantities, and remove products

- **Checkout Page**
  - Users can review their cart items
  - Enter shipping information
  - Select a payment method
  - Place orders securely

- **Payments**
  - Users can make secure payments via Razorpay

- **Order History**
  - Users can view their order history and track the status of their orders

## Contributing

We welcome contributions to improve ShopiDev. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## Contact

For any inquiries or feedback, please reach out to us at [devrajrathor143@gmail.com].



# AttireAlley

AttireAlley is a full-stack e-commerce application built with Next.js, showcasing modern web development technologies and practices.

## Live Demo

The application is hosted on Vercel. You can access it here:
[AttireAlley on Vercel](https://attirealley.vercel.app/)

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Secure payment processing
- User profile management
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Daisy UI
- **Backend**: Next.js API routes
- **Database**: MongoDB Atlas
- **Authentication**: Passport.js, JWT, Cookies
- **Image Storage**: Firebase
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account
- Firebase account
- Stripe account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/attirealley.git
   cd attirealley
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FIREBASE_API_KEY=your_firebase_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing

To test the application, you can use the following credentials from the About page.

## Deployment

The application is set up for easy deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your main branch.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Hamid Abrar Mahir - hamid.mahir2597@yahoo.com

Project Link: [https://github.com/yourusername/attirealley](https://github.com/yourusername/attirealley)

Portfolio: {LINK} (May be under construction as of June 2024)

---

Thank you for checking out this project. It was created as a learning experience and to showcase my skills with Next.js and related technologies. I welcome the opportunity to discuss this project or potential job opportunities.

## Bugs and ToDO

Image only uploaded when submit button is pressed in Add new Product from Admin view

Only admins can access the APIs.

Account api
Account services
Account UI

- Get product from admin
- Update product from admin

Page does not fix navbar when token expirees

Product details don't show if no image is available

update address

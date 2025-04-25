# Startup Sierra Leone

![Screenshot 2025-04-25 232915](https://github.com/user-attachments/assets/a3655089-f389-4c93-88cb-f3fc415a702d)

## Project Title and Description

This project is a web application designed to showcase and support startups in Sierra Leone. It provides a platform for users to discover innovative startups, connect with entrepreneurs, and contribute to the growing startup ecosystem. The application includes features for browsing startups by category, submitting new startup listings, and leaving reviews.

![Screenshot 2025-04-25 232747](https://github.com/user-attachments/assets/2d0f21c4-33c9-4180-a79a-202d151fd4ac)

## Features and Functionality

*   **Startup Directory:** Browse a curated list of startups operating in Sierra Leone across various categories.
*   **Detailed Startup Profiles:** View comprehensive information about each startup, including their description, contact details, operating hours, and user reviews.
*   **Category-Based Filtering:** Filter startups based on their respective categories such as Tech, Fintech, Agritech, and more.  Access these categories directly using links like:
    *   [Tech Startups](/startups?category=tech)
    *   [Fintech Startups](/startups?category=fintech)
    *   [Agritech Startups](/startups?category=agritech)
*   **Search Functionality:** Quickly find startups using the search bar located on the homepage (`/`).
*   **Startup Submission:**  Submit a new startup listing to be included in the directory via the `/submit-startup` route.
*   **Admin Dashboard:** Manage startup listings, including editing existing entries accessible via `/submit-startup`.
*   **User Reviews:**  Submit reviews for listed startups and view existing reviews on the startup details page (`/startups/:id`).
*   **Featured Startups:**  Highlights featured startups on the homepage (`/`).
*   **About Page:**  Learn more about the Sierra Leone startup ecosystem and the goals of this platform via `/about`.
*   **Responsive Design:** The application is designed to be responsive and accessible on various devices.
*   **Interactive Maps**: View startup locations using map integration (planned feature).

## Technology Stack

*   **Frontend:**
    *   **React:**  A JavaScript library for building user interfaces.
    *   **TypeScript:**  A typed superset of JavaScript.
    *   **React Router:** For managing application routing (`react-router-dom`).
    *   **Tailwind CSS:**  A utility-first CSS framework for styling.
    *   **Sadcn UI:** For accessible UI components (e.g., `components/ui/*`).
    *   **Lucide React:** For icons (`lucide-react`)
      
*   **Backend:**
    *   **Firebase:** A NoSQL cloud database. (Firestore)
    *   **Firebase Storage:**  For storing images.
*   **Build Tool:**
    *   **Vite:** A build tool that aims to provide a faster and leaner development experience.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher.
*   **npm** or **Yarn:** Package managers for JavaScript.
*   **Firebase Account:** You'll need a Firebase project set up with Firestore and Firebase Storage enabled.

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Melo034/startup.git
    cd startup
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install
    ```

3.  **Configure Firebase:**

    *   Create a `.env` file in the root directory of the project.
    *   Add your Firebase configuration variables to the `.env` file.  You can find these in your Firebase project settings. For example:

    ```
    VITE_FIREBASE_API_KEY="YOUR_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_APP_ID"
    VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
    ```

    *   **Important:**  Never commit your `.env` file to your repository.  Make sure it is included in your `.gitignore` file.

4.  **Run the application:**

    ```bash
    npm run dev # or yarn dev
    ```

    This will start the development server, typically on `http://localhost:port_number`.

## Usage Guide

1.  **Access the Application:**

    *   Open your web browser and navigate to the address where the development server is running (e.g., `http://localhost:port_number`).

2.  **Homepage:**

    *   The homepage (`/`) displays a hero section, featured startups, and a list of categories.
    *   Use the search bar to find specific startups.
    *   Click on a category to view startups in that category.

3.  **Startup Listings Page:**

    *   The `/startups` route displays a list of all startups.
    *   Use the filters on the left-hand side to filter startups by category and minimum rating.
    *   Click on a startup card to view its details.

4.  **Startup Details Page:**

    *   The `/startups/:id` route displays detailed information about a specific startup.
    *   You can find the file responsible for rendering the details page at `src/Pages/StartUps/[id]/Startups.tsx`
    *   View contact information, operating hours, and user reviews.
    *   Submit your own review using the "Write a Review" tab.  Reviews are stored in Firestore under the `startups` collection.

5.  **Submitting a Startup:**

    *   Navigate to the `/submit-startup` route.
    *   The `AddStartUp.tsx` file manages the UI for adding a startup listing. It also contains the dashboard for managing existing listings.
    *   The `StartupForm.tsx` file contains the form used for both adding and editing startups.
    *   Fill out the form with the startup's information, including name, description, category, contact details, and operating hours.
    *   You can upload an image for the startup. The image will be stored in Firebase Storage under the `startupImages` folder and the URL is saved to Firestore.
    *   Click "Save" to submit the startup.  This will add the startup to the `startups` collection in Firestore.

6.  **Editing a Startup:**

    *   Navigate to the `/submit-startup` route to access the management dashboard.
    *   Click the "Edit" button to modify a startup's information. This opens the `EditStartUp.tsx` page using the `StartupForm.tsx` component

7.  **About Page:**

    *   The `/about` route provides information about the Sierra Leone startup ecosystem.


## License Information

This project does not currently have a license specified. All rights are reserved by the project owner.

## Contact/Support Information

For questions, bug reports, or feature requests, please open an issue on the GitHub repository:

[https://github.com/Melo034/startup/issues](https://github.com/Melo034/startup/issues)

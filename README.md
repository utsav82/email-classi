# Email Classifier Web Application

This project is a web application that allows users to log in using Google OAuth, fetch their last X emails from Gmail, and classify them into different categories using Gemini model. The application is built using Next.js for the frontend and backend API routes.

## Features

- **User Authentication**: Users can log in using Google OAuth.
- **Fetch Emails**: Fetch the user's emails from Gmail using the Gmail API.
- **Classify Emails**: Use Gemini to classify emails into important, promotional, social, marketing, spam, or general categories.
- **User Interface**: Simple UI to enter Gemini API key and number of emails to fetch, and to display classified emails.

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS, React
- **Backend**: Next.js API Routes
- **Authentication**: Google OAuth 2.0
- **APIs**: Gmail API, Gemini API

## Setup and Installation

### Prerequisites

- Node.js (>= 12.x)
- Google Cloud project with OAuth 2.0 credentials
- Gemini API key

### Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/utsav82/email-classi.git
    cd email-classi
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Configure environment variables**:

    Create a `.env` file in the root directory with the following content:

    ```env
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXTAUTH_SECRET=your-next-auth-secret
    ```

    Replace `your-google-client-id`, `your-google-client-secret`, and `your-next-auth-secret` with your actual credentials.

4. **Run the development server**:

    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### User Authentication

1. **Login with Google**:

    On the login page, click the "Login With Google" button to authenticate with your Google account.

### Fetch and Classify Emails

1. **Enter Gemini API Key**:

    After logging in, enter your Gemini API key in the input box provided and click "Set API Key".

2. **Fetch Emails**:

    Enter the number of emails to fetch in the input box and click "Fetch Emails".

3. **Classify Emails**:

    Click the "Classify Emails" button to classify the fetched emails into the predefined categories using Gemini.

## API Endpoints

### Classify Emails

- **Endpoint**: `/api/gemini`
- **Method**: POST
- **Request Body**:

    ```json
    {
      "apiKey": "your-gemini-api-key",
      "emails": [
        {
          "id": "1",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "subject": "Meeting Tomorrow",
          "text": "Hi, let's have a meeting tomorrow to discuss the project.",
          "labels": []
        },
        ...
      ]
    }
    ```

- **Response**:

    ```json
    [
      {
        "id": "1",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "subject": "Meeting Tomorrow",
        "text": "Hi, let's have a meeting tomorrow to discuss the project.",
        "labels": ["important"]
      },
      ...
    ]
    ```

## Components

### Login Page

Handles user authentication with Google OAuth.

### Email Fetch and Classify Component

Handles fetching emails from Gmail and classifying them using Gemini API.

### API Routes

#### Fetch Emails

Fetches emails from Gmail API.

#### Classify Emails

Classifies emails using Gemini API.

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/try-bibek-git/Mock-MCQ.git>
    ```
    (Replace `<your-repository-url>` with the actual URL of your repository. If you downloaded the project as a ZIP file, you can skip this step and unzip the file.)

2.  **Navigate to the project folder:**
    ```bash
    cd <project-folder-name>
    ```
    (Replace `<project-folder-name>` with the name of the directory where you cloned or unzipped the project.)

3.  **Install dependencies:**
    Make sure you have Node.js and npm installed. Then, run:
    ```bash
    npm i
    ```
    This command will install all the necessary project dependencies listed in `package.json`.

4.  **Run the development server:**
    To start the Next.js development server, use:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002` (as per your `package.json` dev script).

    Alternatively, to build and run the production version:
    ```bash
    npm run build
    npm run start
    ```
    This will build the application for production and then start the production server, usually on `http://localhost:3000`.

You will also need to set up a `.env` file with your Google AI API key if you are using Genkit with Google AI. Create a `.env` file in the root of your project and add your API key:
```
GOOGLE_API_KEY=YOUR_API_KEY_HERE
```

To run Genkit flows locally for development (e.g., for testing flows independently or using the Genkit developer UI):
```bash
npm run genkit:dev
```
Or, to watch for changes:
```bash
npm run genkit:watch
```
This will start the Genkit development server, usually on `http://localhost:4000`.

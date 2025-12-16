# SIMCAL - Schedule to Calendar Converter

Convert your lecture schedule text into calendar files (.ics) or directly add events to Google Calendar.

## Features

- 📥 Download schedule as .ics file
- 🔐 Google Calendar integration
- ➕ Automatically add all events to Google Calendar

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Calendar API (Optional)

To enable Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/google-calendar/callback` (for development)
7. Copy your Client ID and Client Secret

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar/callback
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_BASE_URL` and `GOOGLE_REDIRECT_URI` to your production domain.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Paste your lecture schedule text into the textarea
2. Choose one of the following options:
   - **Download .ics File**: Downloads a calendar file you can import into any calendar app
   - **Add to Google Calendar**: Connects to Google Calendar and automatically adds all events

## How It Works

The app parses your schedule text and extracts:
- Module names
- Class numbers
- Dates and times
- Classrooms
- Lecturers

Then converts them into calendar events that can be downloaded or added directly to Google Calendar.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

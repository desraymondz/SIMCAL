import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-calendar/callback`
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Generate the OAuth2 authorization URL
    const scopes = [
        'https://www.googleapis.com/auth/calendar.events',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent', // Force consent screen to get refresh token
    });

    res.redirect(authUrl);
}

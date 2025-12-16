import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { access_token } = req.body;

    // If access token is provided, try to revoke it
    if (access_token) {
        try {
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-calendar/callback`
            );

            oauth2Client.setCredentials({
                access_token: access_token,
            });

            // Revoke the token
            await oauth2Client.revokeCredentials();
        } catch (error) {
            // Even if revocation fails, we'll still clear local storage
            console.error('Error revoking token:', error);
        }
    }

    // Always return success - client will clear local storage
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}


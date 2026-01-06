import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-calendar/callback`
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code } = req.query;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Authorization code not provided' });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        
        // Store tokens in session/cookie (in production, use secure httpOnly cookies)
        // For now, we'll return them to the client to store temporarily
        // In production, you should store these server-side
        
        // Redirect to a page that can use the tokens
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                       (req.headers.host ? `http${req.headers['x-forwarded-proto'] === 'https' ? 's' : ''}://${req.headers.host}` : 'http://localhost:3000');
        const redirectUrl = new URL('/', baseUrl);
        redirectUrl.searchParams.set('google_auth', 'success');
        redirectUrl.searchParams.set('access_token', tokens.access_token || '');
        if (tokens.refresh_token) {
            redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);
        }
        
        res.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
}







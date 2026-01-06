import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { Module } from '../../../types/module-type';
import parse_input from '../../../utils/parse-input';
import modulesToGoogleCalendar from '../../../utils/modulesToGoogleCalendar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, access_token } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Schedule message is required' });
    }

    if (!access_token) {
        return res.status(401).json({ error: 'Google access token is required' });
    }

    try {
        // Parse the input
        const parsedInput: Module[] = parse_input(message);

        // Convert modules to Google Calendar events
        const events = modulesToGoogleCalendar(parsedInput);

        if (events.length === 0) {
            return res.status(400).json({ error: 'No valid events found in the schedule' });
        }

        // Set up OAuth2 client with the access token
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/google-calendar/callback`
        );

        oauth2Client.setCredentials({
            access_token: access_token,
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Add all events to Google Calendar
        const results = [];
        const errors = [];

        for (const event of events) {
            try {
                const response = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: event,
                });
                results.push({
                    summary: event.summary,
                    id: response.data.id,
                    htmlLink: response.data.htmlLink,
                });
            } catch (error: any) {
                errors.push({
                    summary: event.summary,
                    error: error.message || 'Unknown error',
                });
            }
        }

        res.status(200).json({
            success: true,
            added: results.length,
            failed: errors.length,
            events: results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error: any) {
        console.error('Error adding events to Google Calendar:', error);
        res.status(500).json({
            error: 'Failed to add events to Google Calendar',
            message: error.message,
        });
    }
}







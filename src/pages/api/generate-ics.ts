import { Module } from "../../types/module-type";
import parse_input from "../../utils/parse-input";
import modulesToICSFormat from "../../utils/modulesToICSFormat";

import type { NextApiRequest, NextApiResponse } from 'next'

export default function generate_ics(req: NextApiRequest, res: NextApiResponse) {
    
    // Incoming request
    const message: string = req.body.message;

    // Parse the input
    const parsedInput: Module[] = parse_input(message);

    // Convert modules to ics format string
    const icsString: string = modulesToICSFormat(parsedInput);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="MyLectureSchedule.ics"');
    res.status(200).send(icsString);
}
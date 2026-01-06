import { Module } from "../types/module-type";
import formatToICSDate from "./formatToICSDate";

// Convert array of Module objects to Google Calendar event format
export default function modulesToGoogleCalendar(modules: Module[]): any[] {
    const events: any[] = [];

    for (const module of modules) {
        for (const schedule of module.schedules) {
            try {
                const startDateTime = formatToICSDate(schedule.date, schedule.start_time);
                const endDateTime = formatToICSDate(schedule.date, schedule.end_time);

                // Convert ICS format (YYYYMMDDTHHmmss) to ISO 8601 format
                const startISO = convertICSToISO(startDateTime);
                const endISO = convertICSToISO(endDateTime);

                const event = {
                    summary: module.module_name,
                    description: `${module.class_number} - ${schedule.lecturer}`,
                    location: schedule.classroom,
                    start: {
                        dateTime: startISO,
                        timeZone: 'Asia/Singapore',
                    },
                    end: {
                        dateTime: endISO,
                        timeZone: 'Asia/Singapore',
                    },
                };

                events.push(event);
            } catch (error) {
                console.error(`Error processing schedule for ${module.module_name}:`, error);
                // Continue with other events even if one fails
            }
        }
    }

    return events;
}

// Convert ICS date format (YYYYMMDDTHHmmss) to ISO 8601 format
function convertICSToISO(icsDate: string): string {
    // Format: YYYYMMDDTHHmmss
    const year = icsDate.substring(0, 4);
    const month = icsDate.substring(4, 6);
    const day = icsDate.substring(6, 8);
    const hour = icsDate.substring(9, 11);
    const minute = icsDate.substring(11, 13);
    const second = icsDate.substring(13, 15);

    // Return ISO 8601 format: YYYY-MM-DDTHH:mm:ss
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}







import { Module } from "../types/module-type";
import formatToICSDate from "./formatToICSDate";

// Convert array of Module object to ICS format
export default function modulesToICSFormat(modules: Module[]): string {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";

    for (const module of modules) {
        for (const schedule of module.schedules) {
            const startDateTime = formatToICSDate(schedule.date, schedule.start_time);
            const endDateTime = formatToICSDate(schedule.date, schedule.end_time);

            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `SUMMARY:${module.module_name}\n`;
            icsContent += `DESCRIPTION:${module.class_number + " - " + schedule.lecturer}\n`;
            icsContent += `LOCATION:${schedule.classroom}\n`;
            icsContent += `DTSTART;TZID=Asia/Singapore:${startDateTime}\n`;
            icsContent += `DTEND;TZID=Asia/Singapore:${endDateTime}\n`;
            icsContent += `END:VEVENT\n`;
        }
    }

    icsContent += "END:VCALENDAR";
    
    return icsContent;
}
// Import types
import { Schedule } from "@/types/schedule-type";
import { Module } from "@/types/module-type";
import removeEmptyLines from "@/utils/removeEmptyLines";

// Converting input to an array of Module object
export default function parse_input(input: string): Module[] {
    // Ensure input is a string
    if (typeof input !== 'string') {
        input = String(input);
    }

    const clean_lines = removeEmptyLines(input);
    const lines = clean_lines.split('\n');
    
    const module_splitter = (line: string) =>
        line.includes("Status") && line.includes("Units") && line.includes("Grading");

    const holiday_splitter = (line: string) =>
        line.includes("Description") && line.includes("Date");

    // Function to check if a line is a class number (just digits)
    function isClassNumber(line: string): boolean {
        return /^\d+$/.test(line.trim());
    }

    // Function to check if a line looks like a time row (Day HH:MM - HH:MM)
    function isTimeRow(line: string): boolean {
        const parts = line.split(' ').filter(s => s.length > 0);
        if (parts.length < 4 || parts[2] !== '-') return false;
        const dayAbbrevs = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (!dayAbbrevs.includes(parts[0])) return false;
        return parts[1].includes(':') && parts[3].includes(':');
    }

    // Function to parse a single module
    function parse_one_module(start_i: number, end_i: number): Module {
        const module_name = lines[start_i];
        const class_number = lines[start_i + 7];

        const schedules: Schedule[] = [];
        let i = start_i + 9;
        
        while (i < end_i && i < lines.length) {
            // Check if we hit a new class number (skip it and the next 2 lines: Section, Component)
            if (isClassNumber(lines[i])) {
                i += 3; // Skip class number, section, and component
                continue;
            }

            // Validate that we have enough lines for a schedule entry
            if (i + 3 >= lines.length) {
                break;
            }

            // Check if current line is a valid time row
            if (!isTimeRow(lines[i])) {
                i += 1; // Move to next line
                continue;
            }

            const time_row = lines[i].split(' ').filter(s => s.length > 0);
            const day = time_row[0];
            const start_time = time_row[1];
            const end_time = time_row[3];
            
            const classroom = lines[i + 1] || '';
            const lecturer = lines[i + 2] || '';
            const dateLine = lines[i + 3] || '';
            const date = dateLine.slice(0, 10);

            // Validate date format
            if (!date || !date.includes('/')) {
                i += 1; // Move to next line if date is invalid
                continue;
            }

            const schedule: Schedule = {
                day,
                start_time,
                end_time,
                classroom,
                lecturer,
                date
            };

            schedules.push(schedule);
            i += 4; // Move to next schedule entry (time, classroom, lecturer, date)
        }

        const module = {
            module_name,
            class_number,
            schedules
        }
        return module;
    }

    let module_indexes: number[] = [];
    // Fix: use lines.length instead of input.length
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]){
            if (module_splitter(lines[i])) {
                module_indexes.push(i - 1)
            } else if (holiday_splitter(lines[i])) {
                // When we hit holidays section, stop looking for more modules
                // but still process the last module up to this point
                break;
            }
        }
    }

    const modules: Module[] = [];
    for (let i = 0; i < module_indexes.length; i++) {
        // For the last module, use lines.length as the end index if there's no next module
        const endIndex = i < module_indexes.length - 1 
            ? module_indexes[i + 1] - 1 
            : lines.length;
        modules.push(parse_one_module(module_indexes[i], endIndex));
    }

    return modules;
}
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
    const input_len = input.length;
    
    const module_splitter = (line: string) =>
        line.includes("Status") && line.includes("Units") && line.includes("Grading");

    const holiday_splitter = (line: string) =>
        line.includes("Description") && line.includes("Date");

    // Function to parse a single module
    function parse_one_module(start_i: number, end_i: number): Module {
        const module_name = lines[start_i];
        const class_number = lines[start_i + 7];

        const schedules: Schedule[] = [];
        for (let i = start_i + 9; i < end_i; i += 4) {
            // Validate that we have enough lines
            if (i + 3 >= lines.length) {
                break;
            }

            const time_row = lines[i].split(' ').filter(s => s.length > 0);
            
            // Validate time row format: should have at least day, start_time, "-", end_time
            if (time_row.length < 4 || time_row[2] !== '-') {
                continue; // Skip invalid entries
            }

            const day = time_row[0];
            const start_time = time_row[1];
            const end_time = time_row[3];
            
            // Validate that times exist and are in correct format
            if (!start_time || !end_time || !start_time.includes(':') || !end_time.includes(':')) {
                continue; // Skip invalid entries
            }
            
            const classroom = lines[i + 1] || '';
            const lecturer = lines[i + 2] || '';
            const dateLine = lines[i + 3] || '';
            const date = dateLine.slice(0, 10);

            // Validate date format
            if (!date || !date.includes('/')) {
                continue; // Skip invalid entries
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
        }

        const module = {
            module_name,
            class_number,
            schedules
        }
        return module;
    }

    let module_indexes: number[] = [];
    for (let i = 0; i < input_len; i++) {
        if (lines[i]){
            if (module_splitter(lines[i]) || holiday_splitter(lines[i])) {
                module_indexes.push(i - 1)
            }
        }
    }

    const modules: Module[] = [];
    for (let i = 0; i < module_indexes.length; i++) {
        modules.push(parse_one_module(module_indexes[i], module_indexes[i + 1] - 1));
    }

    return modules;
}
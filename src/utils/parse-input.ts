// Import types
import { Schedule } from "@/types/schedule-type";
import { Module } from "@/types/module-type";

// Converting input to an array of Module object
export default function parse_input(input: string): Module[] {
    // Ensure input is a string
    if (typeof input !== 'string') {
        input = String(input);
    }

    const lines = input.split('\n');
    const input_len = input.length;
    const module_splitter = 'Status	Units	Grading'

    // Function to parse a single module
    function parse_one_module(start_i: number, end_i: number): Module {
        const module_name = lines[start_i];
        const class_number = lines[start_i + 7];

        const schedules: Schedule[] = [];
        for (let i = start_i + 9; i < end_i; i += 7) {
            const time_row = lines[i].split(' ');
            const day = time_row[0];
            const start_time = time_row[1];
            const end_time = time_row[3];
            
            const classroom = lines[i + 1];
            const lecturer = lines[i + 2];
            const date = lines[i + 3].slice(0, 10);

            const schedule: Schedule = {
                day,
                start_time,
                end_time,
                classroom,
                lecturer,
                date,
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
        if (lines[i] === module_splitter) {
            module_indexes.push(i - 1)
        }
    }

    const modules: Module[] = [];
    for (let i = 0; i < module_indexes.length - 1; i++) {
        modules.push(parse_one_module(module_indexes[i], module_indexes[i + 1] - 1))
    }

    return modules;
}
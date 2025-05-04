import { Schedule } from "./schedule-type";

export interface Module {
    module_name: string;
    class_number: string;
    schedules: Schedule[];
}
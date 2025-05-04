// Import types
import { Schedule } from "@/types/schedule-type";
import { Module } from "@/types/module-type";

// Converting input to an array of Module object
export default function parse_input(input: string): Module[] {
    console.log("--Inside parse_input function--");
    console.log("parse_input Input type:", typeof input);
    
    // Ensure input is a string
    if (typeof input !== 'string') {
        input = String(input);
        console.log("parse_input Converted input type:", typeof input);
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
            const day = lines[i].slice(0, 2);
            const start_time = lines[i].slice(3, 8);
            const end_time = lines[i].slice(11, 16);
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
    modules.push(parse_one_module(module_indexes[module_indexes.length - 1], lines.length - 1))

    return modules;
}

/* FOR DEBUG
const example_input = `MICHELLE CHAN
2025 Quarter (Apr-Jun) > Undergraduate > University of Wollongong
CSCI 235 - Database Systems
Status	Units	Grading
Enrolled
6.00
Not Include in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1776
L01
Lecture
We 8:30AM - 11:30AM
HQ BLK D ARTS THEATRE
SIONGGO JAPIT
09/04/2025 - 09/04/2025
 
 	
 
Mo 3:30PM - 6:30PM
HQ BLK D ARTS THEATRE
SIONGGO JAPIT
14/04/2025 - 14/04/2025
 
 	
 
Th 8:30AM - 11:30AM
HQ BLK A LT A.1.17
SIONGGO JAPIT
17/04/2025 - 17/04/2025
 
 	
 
Sa 3:30PM - 6:30PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
19/04/2025 - 19/04/2025
 
 	
 
Mo 12:00PM - 3:00PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
21/04/2025 - 21/04/2025
 
 	
 
Tu 3:30PM - 6:30PM
HQ BLK D ARTS THEATRE
SIONGGO JAPIT
29/04/2025 - 29/04/2025
 
 	
 
Sa 12:00PM - 3:00PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
03/05/2025 - 03/05/2025
 
 	
 
We 3:30PM - 6:30PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
14/05/2025 - 14/05/2025
 
 	
 
Fr 3:30PM - 6:30PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
16/05/2025 - 16/05/2025
 
 	
 
We 3:30PM - 6:30PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
21/05/2025 - 21/05/2025
1777
T01F
Tutorial
We 3:30PM - 6:30PM
HQ BLK B LAB B.4.15
SIONGGO JAPIT
02/04/2025 - 02/04/2025
 
 	
 
Mo 3:30PM - 6:30PM
HQ BLK A LAB A.5.17A/A.5.17B
SIONGGO JAPIT
07/04/2025 - 07/04/2025
 
 	
 
We 3:30PM - 6:30PM
HQ BLK B LAB B.4.15
SIONGGO JAPIT
23/04/2025 - 23/04/2025
 
 	
 
Mo 3:30PM - 6:30PM
HQ BLK B LAB B.4.15
SIONGGO JAPIT
05/05/2025 - 05/05/2025
 
 	
 
Sa 8:30AM - 11:30AM
HQ BLK B LAB B.5.15
SIONGGO JAPIT
17/05/2025 - 17/05/2025
1829
W01
Practicum
Th 7:00PM - 10:00PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
27/03/2025 - 27/03/2025
 
 	
 
Fr 7:00PM - 10:00PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
28/03/2025 - 28/03/2025
 
 	
 
Mo 12:00PM - 3:00PM
HQ BLK D ARTS THEATRE
SIONGGO JAPIT
14/04/2025 - 14/04/2025
 
 	
 
Fr 3:30PM - 6:30PM
HQ BLK A LT A.1.17
SIONGGO JAPIT
09/05/2025 - 09/05/2025
CSIT 302 - Cybersecurity
Status	Units	Grading
Enrolled
6.00
Not Include in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1642
L01F
Lecture
Mo 12:00PM - 3:00PM
HQ BLK A LT A.1.17
ROY, PARTHA
07/04/2025 - 07/04/2025
 
 	
 
Tu 12:00PM - 3:00PM
HQ BLK A LT A.1.17
ROY, PARTHA
08/04/2025 - 08/04/2025
 
 	
 
We 12:00PM - 3:00PM
HQ BLK D ARTS THEATRE
ROY, PARTHA
09/04/2025 - 09/04/2025
 
 	
 
Th 12:00PM - 3:00PM
HQ BLK A LT A.1.17
ROY, PARTHA
10/04/2025 - 10/04/2025
 
 	
 
Fr 12:00PM - 3:00PM
HQ BLK D ARTS THEATRE
ROY, PARTHA
11/04/2025 - 11/04/2025
 
 	
 
Sa 8:30AM - 11:30AM
HQ BLK A LT A.1.09A
ROY, PARTHA
12/04/2025 - 12/04/2025
 
 	
 
Sa 12:00PM - 3:00PM
HQ BLK A LT A.1.09A
ROY, PARTHA
12/04/2025 - 12/04/2025
1757
T05F
Tutorial
We 12:00PM - 3:00PM
HQ BLK A LAB A.5.20A/A.5.20B
TAN KHENG TECK
23/04/2025 - 23/04/2025
 
 	
 
Fr 12:00PM - 3:00PM
HQ BLK B LAB B.4.15
TAN KHENG TECK
25/04/2025 - 25/04/2025
 
 	
 
Fr 12:00PM - 3:00PM
HQ BLK B LAB B.4.15
TAN KHENG TECK
02/05/2025 - 02/05/2025
 
 	
 
We 12:00PM - 3:00PM
HQ BLK A LAB A.5.20A/A.5.20B
TAN KHENG TECK
07/05/2025 - 07/05/2025
 
 	
 
Fr 12:00PM - 3:00PM
HQ BLK A LAB A.5.14/A.5.15
TAN KHENG TECK
09/05/2025 - 09/05/2025
 
 	
 
Th 12:00PM - 3:00PM
HQ BLK A LAB A.5.14/A.5.15
TAN KHENG TECK
15/05/2025 - 15/05/2025
 
 	
 
We 12:00PM - 3:00PM
HQ BLK A LAB A.5.20A/A.5.20B
TAN KHENG TECK
21/05/2025 - 21/05/2025
 
 	
 
Fr 12:00PM - 3:00PM
HQ BLK A LAB A.5.14/A.5.15
TAN KHENG TECK
23/05/2025 - 23/05/2025
Public Holidays
Description	Date
Good Friday
18/04/2025
Labour Day
01/05/2025
Vesak Day
12/05/2025
Hari Raya Haji
07/06/2025
Return to Personalised Timetable`

const example_input2 = `DESMOND
2025 Semester (Apr-Sep) > Undergraduate > University of London
CM 2025 - Computer Security
Status	Units	Grading
Enrolled
15.00
Not Included in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1045
L04B
Lecture
Mo 12:00 - 15:00
HQ BLK A LT A.4.05
Staff
14/04/2025 - 14/04/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.4.17
Staff
21/04/2025 - 21/04/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.5.01
Staff
28/04/2025 - 28/04/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.3.17
Staff
05/05/2025 - 05/05/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.4.17
Staff
26/05/2025 - 26/05/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK A LT A.1.09B
Staff
02/06/2025 - 02/06/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK A LT A.1.09B
Staff
09/06/2025 - 09/06/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.4.17
Staff
16/06/2025 - 16/06/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK A LT A.1.09B
Staff
23/06/2025 - 23/06/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.5.05
Staff
21/07/2025 - 21/07/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.5.05
Staff
04/08/2025 - 04/08/2025
 
 	
 
Mo 12:00 - 15:00
HQ BLK B LT B.5.05
Staff
18/08/2025 - 18/08/2025
CM 2035 - Algo & Data Structures II
Status	Units	Grading
Enrolled
15.00
Not Included in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1047
L04B
Lecture
Th 12:00 - 15:00
HQ BLK B LT B.4.03
Staff
10/04/2025 - 10/04/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.4.03
Staff
24/04/2025 - 24/04/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
08/05/2025 - 08/05/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
15/05/2025 - 15/05/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
29/05/2025 - 29/05/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
12/06/2025 - 12/06/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
19/06/2025 - 19/06/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
03/07/2025 - 03/07/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
10/07/2025 - 10/07/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
24/07/2025 - 24/07/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
07/08/2025 - 07/08/2025
 
 	
 
Th 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
21/08/2025 - 21/08/2025
CM 2040 - Databases, Netwks & the Web
Status	Units	Grading
Enrolled
15.00
Not Included in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1086
L04C
Lecture
Fr 12:00 - 15:00
HQ BLK A LT A.1.17
Staff
11/04/2025 - 11/04/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.4.17
Staff
25/04/2025 - 25/04/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK A LT A.1.09B
Staff
09/05/2025 - 09/05/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK A LT A.4.05
Staff
16/05/2025 - 16/05/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.4.17
Staff
30/05/2025 - 30/05/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK A LT A.1.09B
Staff
13/06/2025 - 13/06/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.17
Staff
20/06/2025 - 20/06/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
04/07/2025 - 04/07/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
11/07/2025 - 11/07/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
01/08/2025 - 01/08/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
08/08/2025 - 08/08/2025
 
 	
 
Fr 12:00 - 15:00
HQ BLK B LT B.3.16
Staff
15/08/2025 - 15/08/2025
CM 2045 - Prof Practice for Comp Sci
Status	Units	Grading
Enrolled
15.00
Not Included in GPA
Class Nbr	Section	Component	Days & Times	Room	Instructor	Start/End Date
1110
L04D
Lecture
We 12:00 - 15:00
HQ BLK A LT A.1.09A
Staff
09/04/2025 - 09/04/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.09A
Staff
23/04/2025 - 23/04/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.09A
Staff
07/05/2025 - 07/05/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.17
Staff
14/05/2025 - 14/05/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.09A
Staff
28/05/2025 - 28/05/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.17
Staff
11/06/2025 - 11/06/2025
 
 	
 
We 12:00 - 15:00
HQ BLK A LT A.1.17
Staff
18/06/2025 - 18/06/2025
 
 	
 
We 12:00 - 15:00
HQ BLK B LT B.3.03
Staff
02/07/2025 - 02/07/2025
 
 	
 
We 12:00 - 15:00
HQ BLK B LT B.3.03
Staff
09/07/2025 - 09/07/2025
 
 	
 
We 12:00 - 15:00
HQ BLK B LT B.3.03
Staff
23/07/2025 - 23/07/2025
 
 	
 
We 12:00 - 15:00
HQ BLK B LT B.3.03
Staff
06/08/2025 - 06/08/2025
 
 	
 
We 12:00 - 15:00
HQ BLK B LT B.3.03
Staff
20/08/2025 - 20/08/2025
Public Holidays
Description	Date
Good Friday
18/04/2025
Labour Day
01/05/2025
Vesak Day
12/05/2025
Hari Raya Haji
07/06/2025
SIM Shutdown
25/07/2025
National Day
09/08/2025
Return to Personalised Timetable`

console.log(parse_input(example_input2)[0])
*/
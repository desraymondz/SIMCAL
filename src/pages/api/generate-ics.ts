import { Module } from "../../types/module-type";
import { ResponseData } from "../../types/responseData-type";
import parse_input from "../../utils/parse-input";
import modulesToICSFormat from "../../utils/modulesToICSFormat";

import type { NextApiRequest, NextApiResponse } from 'next'

export default function generate_ics(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    
    // Incoming request
    const message: string = req.body.message;

    // Parse the input
    const parsedInput: Module[] = parse_input(message);
    console.log("after parse_input:", parsedInput);

    // Convert modules to ics format string
    const icsString: string = modulesToICSFormat(parsedInput);
    console.log("after modulesToICSFormat:", icsString);

    return res.status(200).json({ 
        // message: message,
        message: icsString,
    })
    
    // // Check the input type
    // console.log("generate_ics Input type:", typeof input);

    // // Ensure input is a string
    // if (typeof input !== 'string') {
    //     // Convert to string if it's not already a string
    //     input = String(input);
    //     console.log("generate_ics Converted input type:", typeof input);
    // }

    // const modules: Module[] = parse_input(input);

    // return modules;
}

const example_input: string = `MICHELLE CHAN
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
Return to Personalised Timetable`;

// Test the function with example input
// try {
//     const result = generate_ics(example_input);
//     console.log("generate_ics Successfully processed:", result);
// } catch (error) {
//     console.error("generate_ics Error processing input:", error);
// }
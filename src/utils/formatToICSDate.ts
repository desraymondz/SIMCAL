export default function formatToICSDate(date: string, time: string): string {
    // Validate inputs
    if (!time || !date) {
        throw new Error(`Invalid date or time: date="${date}", time="${time}"`);
    }

    // Extract the AM/PM part from the time string (if present)
    const timeTrimmed = time.trim();
    const meridian: string = timeTrimmed.length >= 2 ? timeTrimmed.slice(-2).toUpperCase() : "";
    
    let timePart: string;
    let hasMeridian = false;
    
    if (meridian === "AM" || meridian === "PM") {
        // Remove the AM/PM part from the time string
        timePart = timeTrimmed.slice(0, -2).trim();
        hasMeridian = true;
    } else {
        // If no AM/PM part is found, use the original time string (24-hour format)
        timePart = timeTrimmed;
    }
    
    // Split time into hour and minute
    const [hourStr, minuteStr] = timePart.split(":");
    if (!hourStr || !minuteStr) {
        throw new Error(`Invalid time format: "${time}"`);
    }
    
    let hour: number = parseInt(hourStr, 10);
    const minute: number = parseInt(minuteStr, 10);

    if (hasMeridian) {
        // Convert to 24-hour time
        if (meridian === "PM" && hour !== 12) {
            hour += 12;
        }
        
        if (meridian === "AM" && hour === 12) {
            hour = 0;
        }
    }

    // Parse the date
    if (!date || !date.includes("/")) {
        throw new Error(`Invalid date format: "${date}"`);
    }
    
    const [day, month, year] = date.split("/").map(Number);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error(`Invalid date values: "${date}"`);
    }

    // Format each part with leading zeros
    const yyyy = year.toString();
    const mm = month.toString().padStart(2, "0");
    const dd = day.toString().padStart(2, "0");
    const hh = hour.toString().padStart(2, "0");
    const min = minute.toString().padStart(2, "0");

    return yyyy + mm + dd + "T" + hh + min + "00";
}

export default function formatToICSDate(date: string, time: string): string {
    // Extract the AM/PM part from the time string
    const meridian: string = time.slice(-2).toUpperCase();
    
    // Remove the AM/PM part from the time string
    const timePart: string = time.slice(0, -2).trim();
    
    // Split time into hour and minute
    const [hourStr, minuteStr] = timePart.split(":");
    let hour: number = parseInt(hourStr, 10);
    const minute: number = parseInt(minuteStr, 10);

    // Convert to 24-hour time
    if (meridian.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
    }
    
    if (meridian.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
    }

    // Parse the date
    const [day, month, year] = date.split("/").map(Number);

    // Format each part with leading zeros
    const yyyy = year.toString();
    const mm = month.toString().padStart(2, "0");
    const dd = day.toString().padStart(2, "0");
    const hh = hour.toString().padStart(2, "0");
    const min = minute.toString().padStart(2, "0");

    return yyyy + mm + dd + "T" + hh + min + "00";
}

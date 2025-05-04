export default function formatToICSDate(date: string, time: string): string {
    // Convert to 24-hour time
    const [timePart, meridian] = time.match(/(\d{1,2}:\d{2})(AM|PM)/i)!.slice(1);
    let [hour, minute] = timePart.split(":").map(Number);

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

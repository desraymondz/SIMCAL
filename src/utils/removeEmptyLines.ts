export default function removeEmptyLines(text: string): string {
    const lines = text.split('\n');  // break the text into lines
    const filtered = lines.filter(line => line.trim() !== '');  // remove empty lines
    const result = filtered.join('\n');  // join back into string
    
    return result;
}
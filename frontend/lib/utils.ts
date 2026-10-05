import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates an array of Hex color codes
 * @param {number} count - Number of colors to generate
 * @param {number} saturation - Percent (0-100)
 * @param {number} lightness - Percent (0-100)
 */
const generateColorArray = (count:number, saturation = 70, lightness = 60) => {
  const colors = [];
  const goldenRatioConjugate = 0.618033988749895;
  let hue = Math.random(); // Start at a random point

  for (let i = 0; i < count; i++) {
    hue += goldenRatioConjugate;
    hue %= 1;
    
    // Convert HSL to Hex
    const color = hslToHex(hue * 360, saturation, lightness);
    colors.push(color);
  }

  return colors;
};

/**
 * Generates an array of unique Hex color codes.
 * * @param count - The number of colors to generate.
 * @param saturation - Percentage (0-100). Default 70 for vibrant colors.
 * @param lightness - Percentage (0-100). Default 60 for good text contrast.
 * @returns Array of hex strings (e.g., ["#64ed92", ...])
 */
export const generateThemePalette = (
  count: number, 
  saturation: number = 70, 
  lightness: number = 60
): string[] => {
  const colors: string[] = [];
  const goldenRatioConjugate = 0.618033988749895;
  let hue = Math.random(); // Random starting point

  for (let i = 0; i < count; i++) {
    hue += goldenRatioConjugate;
    hue %= 1; // Keep hue between 0 and 1
    
    colors.push(hslToHex(hue * 360, saturation, lightness));
  }

  return colors;
};

/**
 * Helper: Converts HSL color values to a Hex string.
 */
const hslToHex = (h: number, s: number, l: number): string => {
  const l_percent = l / 100;
  const a = (s * Math.min(l_percent, 1 - l_percent)) / 100;
  
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l_percent - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  
  return `#${f(0)}${f(8)}${f(4)}`;
};
// utils/numberHelpers.js
export function persianToEnglishDigits(str) {
    if (!str) return str;
  
    // Common Persian/Arabic digits
    const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  
    // Convert Persian digits
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianDigits[i], i).replace(arabicDigits[i], i);
    }
  
    return str;
  }
  
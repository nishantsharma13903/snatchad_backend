exports.cmToFeetInches = (cm) => {
    if (!cm || typeof cm !== "number") return "";

    const inchesTotal = cm / 2.54;  
    const feet = Math.floor(inchesTotal / 12);
    const inches = Math.round(inchesTotal % 12);

    return `${feet}'${inches}''`; // e.g. 160 cm → 5'3''
}
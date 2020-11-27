export function warn(text: string) {
    SpreadsheetApp.getUi().alert(`⚠️ \u00a0 Warning: ${text}`);
}

export function error(text: string) {
    SpreadsheetApp.getUi().alert(`❌ \u00a0 ERROR: ${text}`);
}

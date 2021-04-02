export const ACTION_OPEN_ALERT = "alert/open";
export const ACTION_CLOSE_ALERT = "alert/close";

export function openAlert(message) {
  return { type: ACTION_OPEN_ALERT, message };
}

export function closeAlert() {
  return { type: ACTION_CLOSE_ALERT };
}

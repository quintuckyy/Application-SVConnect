// Shared UI feedback: the loading spinner, the success dialog, and error messages.

export function showSpinner() {
  document.getElementById("spinner")?.classList.remove("hidden");
}

export function hideSpinner() {
  document.getElementById("spinner")?.classList.add("hidden");
}

export function showSuccess(message) {
  const successOverlay = document.getElementById("successOverlay");
  const successMessage = document.getElementById("successMessage");
  const closeSuccess = document.getElementById("closeSuccess");

  if (!successOverlay || !successMessage || !closeSuccess) {
    console.error("Success dialog elements not found in the page.");
    return;
  }

  successMessage.textContent = message;
  successOverlay.classList.remove("hidden");
  successOverlay.classList.add("flex");

  closeSuccess.onclick = () => {
    successOverlay.classList.add("hidden");
    successOverlay.classList.remove("flex");
  };
}

/**
 * Show an error message at the top of the screen for a few seconds.
 * Used when data can't be loaded or saved, instead of failing silently.
 */
export function showError(message) {
  let toast = document.getElementById("errorToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "errorToast";
    toast.setAttribute("role", "alert");
    toast.className =
      "fixed top-4 inset-x-4 z-[10001] mx-auto max-w-md rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-opacity";
    toast.addEventListener("click", () => toast.classList.add("hidden"));
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.add("hidden"), 6000);
}

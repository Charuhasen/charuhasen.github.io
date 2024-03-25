// Execute when the window is fully loaded
$(window).on("load", function () {
  // Check if preloader element exists
  if ($("#preloader").length) {
    // Fade out the preloader after a delay
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        // Remove the preloader once it's faded out
        $(this).remove();
      });

    // Fade in the countdown container after the preloader fades out
    $(".countdown-container").delay(1000).fadeIn("slow");
  }
});

const endDate = new Date("2026-01-19T00:00:00");

// Update the countdown every second
setInterval(updateCountdown, 1000);

function updateCountdown() {
  const now = new Date();
  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    document.getElementById("countdown").innerText = "Countdown Over";
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const countdownText = `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
  document.getElementById("countdown").innerText = countdownText;
}

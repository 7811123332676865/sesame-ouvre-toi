import { dayTickets } from "../store/storage.js";
import { getDayReport } from "../store/dayReport.js";
import { printDayReport } from "./receipt.js";

const dayTicketsSection = document.querySelector("#day-tickets");
const dayReportButton = document.querySelector("#day-report");

export function renderDayTickets() {
  dayTicketsSection.classList.toggle("is-hidden", dayTickets.length === 0);
}

export function initDayTickets() {
  dayReportButton.addEventListener("click", function () {
    printDayReport(getDayReport());
  });
}

import { formatPrice } from "../utils/format.js";

const printer = document.querySelector("#receipt-printer");
const receiptMeta = document.querySelector("#receipt-meta");
const receiptLines = document.querySelector("#receipt-lines");
const receiptSums = document.querySelector("#receipt-sums");
const receiptFooter = document.querySelector("#receipt-footer");
const closeButton = document.querySelector("#receipt-close");

let returnFocusTo = null;

function formatDate(date) {
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function createRow(tagName, label, value) {
  const row = document.createElement(tagName);

  const labelSpan = document.createElement("span");
  labelSpan.textContent = label;

  const valueSpan = document.createElement("span");
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  return row;
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function printPaper({ meta, lines, sums, total, footer }) {
  receiptMeta.textContent = meta;

  receiptLines.textContent = "";
  for (const line of lines) {
    receiptLines.append(createRow("li", line.label, line.value));
  }

  receiptSums.textContent = "";
  for (const sum of sums) {
    receiptSums.append(createRow("p", sum.label, sum.value));
  }

  const totalRow = createRow("p", total.label, total.value);
  totalRow.classList.add("receipt-total");
  receiptSums.append(totalRow);

  receiptFooter.textContent = footer;

  returnFocusTo = document.activeElement;
  printer.classList.remove("is-hidden");
  restartAnimation(printer, "is-printing");

  document.addEventListener("keydown", closeOnEscape);
  closeButton.focus();
}

function closeReceipt() {
  printer.classList.add("is-hidden");
  printer.classList.remove("is-printing");
  document.removeEventListener("keydown", closeOnEscape);
  if (returnFocusTo) {
    returnFocusTo.focus();
  }
}

function closeOnEscape(event) {
  if (event.key === "Escape") {
    closeReceipt();
  }
}

export function printReceipt(receipt) {
  let meta = "Ticket n° " + receipt.number;
  if (receipt.customer) {
    meta += " · " + receipt.customer;
  }

  printPaper({
    meta: meta + "\n" + formatDate(receipt.paidAt),
    lines: receipt.lines.map((line) => ({
      label: line.quantity + " × " + line.name,
      value: formatPrice(line.price * line.quantity),
    })),
    sums: [
      { label: "Sous-total", value: formatPrice(receipt.subtotal) },
      { label: "Remise", value: "− " + formatPrice(receipt.discount) },
    ],
    total: { label: "Total", value: formatPrice(receipt.total) },
    footer: "Merci et à bientôt !",
  });
}

export function printDayReport(report) {
  printPaper({
    meta: "Tickets du jour\n" + formatDate(report.printedAt),
    lines: report.tickets.map((ticket) => ({
      label: "N° " + ticket.number + (ticket.customer ? " · " + ticket.customer : ""),
      value: formatPrice(ticket.total),
    })),
    sums: [
      { label: "Tickets", value: String(report.count) },
      { label: "Ticket moyen", value: formatPrice(report.average) },
    ],
    total: { label: "Total du jour", value: formatPrice(report.total) },
    footer: "Bonne fin de journée !",
  });
}

export function initReceipt() {
  closeButton.addEventListener("click", closeReceipt);

  printer.addEventListener("click", function (event) {
    if (event.target === printer) {
      closeReceipt();
    }
  });
}

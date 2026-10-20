import { loadState, saveState } from "./store/storage.js";
import { initMenu, renderMenu } from "./ui/menu/menu.js";
import { initTicket, renderTicket } from "./ui/ticket/ticket.js";
import { initDayTickets, renderDayTickets } from "./ui/ticket/dayTickets.js";
import { initCustomerForm } from "./ui/ticket/customerForm.js";
import { initPromoForm } from "./ui/ticket/promoForm.js";
import { initCheckout } from "./ui/ticket/checkout.js";
import { initReceipt } from "./ui/receipt/receipt.js";
import { initAiForm } from "./ui/assistant/aiForm.js";

function refresh() {
  renderMenu();
  renderTicket();
  renderDayTickets();
  saveState();
}

loadState();

initMenu(refresh);
initTicket(refresh);
initCustomerForm(refresh);
initPromoForm(refresh);
initCheckout(refresh);
initReceipt();
initAiForm(refresh);
initDayTickets();

refresh();

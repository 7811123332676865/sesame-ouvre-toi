import { loadState, saveState } from "./store/storage.js";
import { initMenu, renderMenu } from "./ui/menu.js";
import { initTicket, renderTicket } from "./ui/ticket.js";
import { renderDayTickets } from "./ui/dayTickets.js";
import { initCustomerForm } from "./ui/customerForm.js";
import { initPromoForm } from "./ui/promoForm.js";
import { initCheckout } from "./ui/checkout.js";

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

refresh();

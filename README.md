# Billing Sheet Printer

Simple printable billing site for the shop.

## How to use

1. Open `index.html` in a browser.
2. Fill the bill details on the left side.
3. Start typing in a `Product` field to choose from the saved product list.
4. Add a new product once in the `Product Library` section if it is missing.
5. Choose `3`, `4`, or `5` slips per A4 page.
6. Click `Print / Save PDF`.

## Notes

- Data is saved in the browser with `localStorage`, so the form stays there when you reopen it on the same computer.
- Products in the Tadpatri, Korea, LD, baler twine, PP sutli, sutli, and takiya groups calculate `amount = weight x rate`, but `pcs` is still kept on the bill for those rows.
- Other products calculate `amount = pcs x rate`.
- Amount can still be changed manually for any row, and `GT` is calculated automatically from the row amounts.
- The `Product` column combines the old color, GSM, and size fields into one searchable name.
- The preview can be shown or hidden while editing, and a single slip is centered on the print page.

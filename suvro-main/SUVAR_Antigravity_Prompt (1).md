# SUVAR — Website Conversion Prompt for Antigravity

Copy this complete document into Antigravity with the existing website project open.

## Your task

Modify my existing ecommerce website into **SUVAR**, a car accessories store. Reference: https://shop.aviar.wearm3s.com/ . Work on the existing project and admin panel. Inspect the code first and implement the changes; do not stop after giving advice or a plan.

I will upload car accessories through my admin panel and sell them on the website. I must also be able to upload my own store logo from admin. Checkout will use **Cash on Delivery only**. Customer delivery details and ordered products must appear in my admin panel so I can contact the customer and arrange delivery.

Preserve the current design quality, responsive layout and working ecommerce features. Reuse the existing stack, database, authentication and admin structure. Do not rebuild the project unnecessarily. This is a straightforward car accessories shop; an advanced vehicle database or booking system is outside scope.

## 1. Inspect the project

- Identify the frontend, backend, database, product model, cart, checkout, admin routes and settings system.
- Read project instructions and use the existing conventions.
- Determine which requirements already work and extend them rather than creating duplicates.
- Preserve existing customer/order records. Remove clothing demo content from the public storefront; do not silently delete real data.
- If credentials or external services are missing, complete the local implementation and clearly identify the remaining configuration.

## 2. Store branding and logo upload

- Change the public store name to **SUVAR** across the header, footer, page titles, checkout, order confirmation, admin branding and metadata.
- Add or extend **Admin → Store Settings** with store name, logo upload, optional favicon upload, contact phone, WhatsApp number, email and address.
- Store the uploaded logo persistently through the existing media/storage system. It must remain after refresh, logout and server restart.
- Show a logo preview, replace option and remove option. Use the SUVAR text wordmark when no logo is uploaded.
- Support PNG, JPG and WebP logos, including transparent PNG. Validate actual image content and file size on the server; use a configurable sensible limit such as 2 MB.
- Keep logo proportions with object-fit: contain. Make the logo readable on desktop and mobile without stretching it.
- Apply saved branding consistently throughout the storefront. Do not hardcode separate logo paths in multiple components.

## 3. Replace clothing content

- Replace fashion banners, garment images, seasonal clothing copy and fashion icons with car accessories content.
- Suggested hero title: **Upgrade Your Everyday Drive.**
- Suggested supporting text: **Explore car accessories for comfort, convenience, and everyday care.**
- Primary button: **Shop Accessories**; link it to the product section or shop page.
- Remove clothing-specific size guides, fabric claims, fashion testimonials and unsupported demo review statistics.
- Do not invent warranties, certifications, customer reviews, sales numbers or delivery promises.
- Make homepage banner image, headline, supporting text and featured products editable from admin if a content management system already exists; otherwise add a simple homepage settings section.
- Hide empty sections gracefully until I add products. Do not leave clothing demo products visible.
- Replace footer content with SUVAR contact details, Shop, About, Contact, Delivery Information and Return Policy. Use editable, truthful policy content.

## 4. Product categories

Allow admin to add, edit, reorder and archive categories. Suggested initial categories:

- Interior Accessories
- Car Electronics
- Exterior Accessories
- Car Care
- Utility & Emergency

These are editable starting categories, not a fixed taxonomy. Category changes must reflect on the storefront. Do not create fake products to fill them.

## 5. Admin product management

Provide a functional product form with:

| Field | Requirement |
| --- | --- |
| Product name | Required |
| SKU | Unique; generate or enter manually |
| Category | Choose an admin-managed category |
| Brand | Optional |
| Regular price | BDT, validated numeric amount |
| Sale price | Optional; show a genuine discount only |
| Stock quantity | Non-negative integer |
| Main image and gallery | Persistent image uploads; reorder and replace images |
| Short description | Brief product summary |
| Full description | Features and use |
| Specifications | Editable key/value rows such as material, dimensions, voltage or connector |
| Compatibility | Universal / Specific vehicles / Not confirmed |
| Compatible vehicles | Optional text such as Toyota Corolla 2015–2020; no complex vehicle selector required |
| Installation instructions | Optional |
| Warranty information | Optional; show only when supplied |
| Status | Draft / Published / Archived |
| Featured | Toggle for homepage placement |

If existing variant support exists, adapt clothing size options into relevant accessory options such as color, type or connector. Track price and stock per purchasable variant. Do not add unnecessary variants to simple products.

Admin must be able to create, edit, publish and archive products. Allow permanent deletion only for unused products, with confirmation. Preserve references and snapshots for products already purchased.

## 6. Storefront shopping

- Show real uploaded products with image, name, BDT price, sale price when applicable and availability.
- Support category filtering, product search, price sorting and basic price filtering using actual catalog values.
- Product pages must show gallery, description, specifications, compatibility, optional installation/warranty information and Add to Cart.
- Display compatibility information without claiming verified fitment when it is unconfirmed.
- Disable purchase of unavailable items and prevent quantities above available stock.
- Keep cart quantity updates, item removal and totals functional on mobile.
- Preserve useful existing routes. Update clothing-specific labels throughout.

## 7. Cash on Delivery checkout — essential

**Cash on Delivery is the only payment method.** Remove or disable online payment options, payment gateway buttons and card fields from checkout. Do not ask for card details, bKash payment or advance payment.

Checkout fields:

- Full name — required.
- Mobile number — required; validate Bangladesh mobile format while accepting normalized +880/01 input.
- Alternative phone — optional.
- District — required.
- Area / upazila / thana — required.
- Full delivery address — required, including road/house details where applicable.
- Order note — optional.
- Email — optional, not required to place an order.

Use guest checkout. Do not force customers to create an account.

Show product subtotal, delivery charge and total before submission. Delivery charges must be configured from admin, for example separate Dhaka and outside-Dhaka zones; do not invent fixed fees. Require admin configuration before accepting live orders. Save the selected zone and fee on the order.

Clearly show **Cash on Delivery — pay when your order arrives.** Use **Place Order** as the submit button. After a successful order, show a unique order number, item summary, payable total and a message that SUVAR will contact the customer to confirm delivery. Preserve the cart if order submission fails; clear it only after successful persistence.

## 8. Customer order details in admin — essential

Every submitted order must be saved to the backend/database and visible immediately in **Admin → Orders**. Browser localStorage alone is not an order database.

Order list must show order number, date, customer name, phone, total, COD payment status and fulfillment status. Support searching by order number/name/phone and filtering by status/date.

Order detail must include:

- Customer full name, main phone and alternative phone.
- District, area and complete delivery address.
- Customer note and optional email.
- Ordered products with image, SKU, selected options, quantity and unit price.
- Subtotal, discount if applicable, delivery charge and payable total.
- Payment method: Cash on Delivery.
- Payment status: Unpaid / Collected.
- Fulfillment status and status history.
- Internal admin notes, separate from the customer's note.
- Optional courier name, tracking number and dispatch date.
- Copy address/phone buttons and a printable order summary.

Order flow: **New → Confirmed → Packed → Shipped → Delivered**, with **Cancelled** and **Failed Delivery** where appropriate. Payment collection must be recorded explicitly; order submission must never mark a COD order paid.

Keep an immutable order-item snapshot so changing or archiving a product does not change a past order's name, SKU or price. Reserve or deduct inventory atomically when an order is accepted using the existing stock model. Release or restore stock once on cancellation, and restock returned items only after inspection. Do not double-change stock when statuses are updated repeatedly.

## 9. Admin settings and access

Reuse existing admin authentication. Ensure only authorized staff can access customer addresses, phone numbers, orders and settings. Enforce permissions in the backend, not only by hiding links.

Required admin sections:

1. Dashboard: new orders, orders awaiting confirmation and low stock.
2. Products: add/edit/publish/archive products and images.
3. Categories: manage accessory categories.
4. Orders: customer details, items, totals, COD collection and fulfillment.
5. Store Settings: branding/logo, contact details, delivery fees and policy content.
6. Homepage Settings: banner and featured products.

Reuse existing coupon functionality if available; do not build a complex new promotions system as part of this task.

## 10. Reliability and security

- Calculate prices, discounts, stock and delivery fees on the server. Never trust browser-submitted totals.
- Validate customer fields and product/variant availability server-side.
- Prevent duplicate orders from repeated clicks or request retries. Disable the submit button while processing and implement backend idempotency.
- Handle concurrent purchases of the last available item without overselling.
- Protect admin routes and APIs; public visitors must not be able to list or read other customers' orders.
- Restrict uploaded files to approved image formats and safely render product content.
- Keep secrets server-side and avoid logging customer addresses/phone numbers unnecessarily.
- Use persistent database/media storage; do not present mock APIs as completed functionality.
- Apply schema migrations safely and document any new environment variables.

## 11. Acceptance checks

Verify the following with the running project:

- [ ] SUVAR branding appears consistently and no clothing demo content remains publicly visible.
- [ ] Admin uploads a logo; it appears on desktop/mobile and persists after restart.
- [ ] Admin creates a category and product with gallery, stock and compatibility text.
- [ ] Published product appears in the correct category; drafts do not appear publicly.
- [ ] Customer searches, views and adds the product to cart.
- [ ] Customer places a guest Cash on Delivery order without email or online payment.
- [ ] Delivery fee and payable total are correct.
- [ ] Admin sees the customer's complete delivery details and purchased items.
- [ ] New COD order is unpaid; admin can separately record collection and delivery status.
- [ ] Repeated submission does not create duplicate orders.
- [ ] Invalid quantities, altered browser prices and unavailable products are rejected.
- [ ] Cancellation restores/releases stock once.
- [ ] Editing a product does not alter an old order snapshot.
- [ ] Unauthorized users cannot access admin APIs or customer order details.
- [ ] Mobile homepage, product page, cart, checkout and admin forms remain usable.

## 12. Deliverables

Implement the changes in the existing project, including necessary database migrations and persistent backend functionality. Run appropriate build and functional checks. At the end, explain what changed, what was tested, how to access admin settings, how I upload my logo/products, and any configuration still needed. Provide a reviewable local/staging result; do not deploy publicly without my instruction.

Prioritize a working simple shop: **upload accessories → customer orders with COD → customer details appear in admin → I confirm and deliver the order.**

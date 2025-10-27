# Price Optimizer

## What is this project?

The **Price Optimizer** is a minimal financial utility designed for e-commerce and dropshipping. Its core function is to calculate the **Suggested Selling Price** required to achieve a **Target Profit Margin** after accounting for all fixed costs, variable expenses (shipping, marketing), and revenue-based fees (platform fees, payment fees, sales tax).

## How It Works

The calculation process in the Price Optimizer is based on **inverting the fee calculation**. Since many fees are applied as a percentage of the final price, the tool first determines the gross revenue needed to cover all costs plus the desired profit, and then solves for the price that yields that revenue *after* deducting all percentage-based fees and taxes.

### Input Fields

| Field | Restriction | Description |
| :--- | :--- | :--- |
| **Product Cost ($)** | Number >= 0 | The cost paid for the product itself (COGS). |
| **Shipping Cost ($)** | Number >= 0 | The cost to ship the product to the customer. |
| **Marketing Cost ($)** | Number >= 0 | The customer acquisition cost (CAC) per unit sold. |
| **Other Costs ($)** | Number >= 0 | Any additional fixed costs per unit (e.g., warehousing). |
| **Platform Fee (%)** | Number >= 0 | Rate charged by the marketplace or platform (e.g., Shopify, Amazon). |
| **Payment Fee (%)** | Number >= 0 | Rate charged by the payment processor (e.g., PayPal, Stripe). |
| **Other Fees (%)** | Number >= 0 | Any remaining fee rate applied to the sale price. |
| **Sales Tax (%)** | Number >= 0 | Tax rate applied to the sale price. |
| **Target Profit Margin (%)** | Number >= 0 | The desired margin rate on the price **before** all fees are deducted. |
| **Promotional Discount (%)** | Number >= 0 | The planned discount rate applied to the Suggested Price. |

---

## Calculation Logic

The calculation determines the `Suggested Price` first, then applies the discount to find the `Discounted Price` (real revenue), and finally calculates the `Net Profit` and `Net Margin` based on the real revenue.

### Key Formulas

| Formula | Description | Simple Notation |
| :--- | :--- | :--- |
| **Total Cost** | The sum of all fixed costs per unit. | `Total Cost = Product Cost + Shipping Cost + Marketing Cost + Other Costs` |
| **Suggested Price** | The calculation inverts the percentage fees to find the required price that guarantees the target profit margin before the promotional discount. | **Step A (Fees):** `Revenue Fraction = 1 - (Platform Fee + Payment Fee + Other Fees + Sales Tax)`<br>**Step B (Price):** `Suggested Price = (Total Cost * (1 + Target Margin)) / Revenue Fraction` |
| **Discounted Price** | The final selling price paid by the customer after the promotional discount is applied. | `Discounted Price = Suggested Price * (1 - Promotional Discount Rate)` |
| **Net Profit** | The actual net profit. It is the final revenue (Discounted Price) minus the Total Cost and the Total Fees which are calculated on the final revenue. | **Step A (Fees):** `Total Fees = Discounted Price * (Platform Fee + ... + Sales Tax)`<br>**Step B (Profit):** `Net Profit = Discounted Price - (Total Cost + Total Fees)` |
| **Net Margin** | The net margin percentage, based on net profit and final revenue (Discounted Price). | `Net Margin = (Net Profit / Discounted Price) * 100` |

---

## Output Fields

| Field | Description |
| :--- | :--- |
| **Suggested Price** | The price calculated to meet the profit target, before any promotional discount. |
| **Discounted Price** | The final selling price after the promotional discount is applied (real revenue). |
| **Net Profit** | The final dollar amount of profit after all costs, fees, and the discount are deducted from the final sale. |
| **Net Margin** | The final percentage margin calculated as Net Profit / Discounted Price. |

### Formatting Standards

* **Decimal Separator:** Use the **dot (`.`)** for decimal separation.
* **Currency Display:** The output uses the simple `$ 0.00` format.
* **Percentage Display:** The output uses the `0.00%` format.

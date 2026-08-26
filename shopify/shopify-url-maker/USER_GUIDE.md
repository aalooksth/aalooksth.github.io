# Shopify Admin Product Search URL Maker - User Guide

Author: **Alok Shrestha**  
Contact: [hello@aloks.com.np](mailto:hello@aloks.com.np)

---

## Overview

The **Shopify Admin Product Search URL Maker** is a lightweight, single-page web application designed to help Shopify store managers quickly construct, filter, share, and bookmark complex product list search URLs in Shopify Admin.

It supports:
- Multi-vendor filtering (`vendor:"Vendor 1,Vendor 2"`)
- Multi-status filtering (`status:"ACTIVE,DRAFT"`)
- Combined status and vendor search queries (`status:"ACTIVE" vendor:"Dash & Albert"`)
- Customizable store name and saved view ID (`savedViewId=819195150620`)
- Custom sorting order (`created_at desc`, `title asc`, etc.)
- Customizable visible columns list
- Theme switching (Light ☀️ / System 💻 / Dark 🌑)
- URL Hash State Persistence (stay on the same selection on page refresh)
- Copy to clipboard & open directly in Shopify
- Session activity logging with exportable `.log` file for troubleshooting

---

## How to Use

### 1. Store & View Configuration
1. **Store Name**: Enter your Shopify store subdomain or identifier (defaults to `rugsdoneright-store`).
2. **Saved View ID**: Enter your Shopify product saved view ID (defaults to `819195150620`). Leave empty if not applicable.

### 2. Multi-Vendor Selection
- **Searchable Multi-Select List**: Scroll or search through all 89 vendors using the interactive search bar (`🔍 Search 89 vendors...`). Check or uncheck vendors to add or remove them from active filters.
- **Active Filter Summary**: Currently selected vendors appear at the top as active pills with `×` remove buttons, accompanied by a **Clear All** shortcut button.
- **Bulk Actions**: Use **Select Filtered** to quickly select all vendors matching your search query, or **Deselect All** to reset vendor selection.
- **Custom Vendors**: Type any unlisted vendor name into the search bar and press **Enter** or click **+ Add** to add custom vendors. Multiple vendors can also be added at once using comma separation (e.g. `Vendor A, Vendor B`).
- Selected vendors are combined in the query as comma-separated values inside double quotes (`vendor:"Vendor1,Vendor2"`).

### 3. Multi-Status Selection
- Click on `ACTIVE`, `DRAFT`, or `ARCHIVED` status pills to select or deselect them.
- Multiple statuses can be active simultaneously (e.g., selecting both `ACTIVE` and `DRAFT` generates `status:"ACTIVE,DRAFT"`).

### 4. Sorting & Additional Search Terms
- **Sorting Order**: Select your preferred sorting option from the dropdown menu (e.g., `created_at desc` for newest products first).
- **Additional Query Terms**: Add any custom search terms or Shopify tag filters (e.g., `tag:"Sale"` or `product_type:"Rug"`).

### 5. Copying & Opening Generated URLs
- As you modify any selection, the live Shopify URL updates instantly in the generated URL display box.
- Click **📋 Copy URL** to copy the complete link to your clipboard.
- Click **↗️ Open in Shopify** to launch the filtered view directly in a new browser tab.

### 6. Theme Switching
- Click the theme toggle buttons in the top right header:
  - **Light ☀️**: Force light theme.
  - **System 💻**: Automatically match your device OS settings.
  - **Dark 🌑**: Force dark theme.

### 7. Refresh & Sharing
- The application automatically synchronizes all input states with the URL hash (`#...`). 
- Bookmark the page or reload the browser at any time to resume with your exact selections intact.

### 8. Viewing & Exporting Logs
- Click **📋 Logs** in the top right to view session activity.
- Click **💾 Download Log File (.log)** to save a file-based log for diagnostics.

---

## Example Generated URLs

1. **Multiple Vendors**:
   ```
   https://admin.shopify.com/store/rugsdoneright-store/products?savedViewId=819195150620&query=vendor%3A%22Annie+Selke+MW%2CAnnie+Selke+Sale%22&order=created_at+desc&selectedColumns=IMAGE%2CTITLE%2CSTATUS%2CINVENTORY%2CCATEGORY%2CSALES_CHANNEL_COUNT%2CCATALOGS%2CPRODUCT_TYPE%2CVENDOR
   ```

2. **Status + Single Vendor**:
   ```
   https://admin.shopify.com/store/rugsdoneright-store/products?savedViewId=819195150620&query=status%3A%22ACTIVE%22+vendor%3A%22Dash+%26+Albert%22&order=created_at+desc&selectedColumns=IMAGE%2CTITLE%2CSTATUS%2CINVENTORY%2CCATEGORY%2CSALES_CHANNEL_COUNT%2CCATALOGS%2CPRODUCT_TYPE%2CVENDOR
   ```

---

## Technical Architecture

- **Frontend**: Pure HTML5, CSS3 (CSS Custom Properties & Flexbox/Grid), ES6 JavaScript.
- **Dependencies**: 0 external dependencies (No bloated frameworks or heavy libraries).
- **SEO & AEO**: Includes OpenGraph tags, meta description, and Schema.org `WebApplication` structured data.
- **Accessibility**: Semantic HTML elements, ARIA attributes, keyboard input support, contrast ratio compliance.
- **Print Optimization**: Includes `@media print` rules for printing clean reference sheets.

---

For further questions or assistance, contact **Alok Shrestha** at [hello@aloks.com.np](mailto:hello@aloks.com.np).

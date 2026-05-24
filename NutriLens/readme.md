# NutriLens

> **Google Summer of Code 2026** - Open Food Facts Project #P5 Prototype  
> A browser extension that brings Open Food Facts data directly to your grocery shopping experience.

---

## Overview

**NutriLens** is a browser extension that overlays nutritional information from [Open Food Facts](https://world.openfoodfacts.org/) onto e-commerce grocery websites. It helps users make informed purchasing decisions by displaying:

- **Nutri-Score** ratings (nutritional quality)
- **NOVA classification** (food processing levels)
- **Eco-Score** (environmental impact)
- **Personalized preference matching** (coming soon)

Currently supports **metro.ca** and **walmart.ca** with an extensible adapter system for adding more retailers.

---

## NutriLens V2

### Demo Video
<video src="https://github.com/user-attachments/assets/7ad6ec70-93c8-4b30-a790-5b849be32cd4" controls></video>

### Product View
![Product View](../demos/images/nutrilensv2-product-view.png)

### Product List View
![Product List View](../demos/images/nutrilensv2-list-view.png)

### Popup View
![Popup](../demos/images/nutrilensv2-popup-view.png)

## NutriLens V1

### Demo Video
<video src="https://github.com/user-attachments/assets/e5682225-0012-478c-bfcb-2ab23899a765" controls></video>

### List Banner Loading
![List Banner Loading](../demos/images/list-banner-loading.png)

### List Banner Not Found
![List Banner Not Found](../demos/images/list-banner-not-found.png)

### List Banner Results
![List Banner Results](../demos/images/list-banner-results.png)

### List Banner Search Warning
![List Banner Search Warning](../demos/images/list-banner-search-warning.png)

### Product Banner Not Found
![Product Banner Not Found](../demos/images/product-banner-not-found.png)

### Product Banner Search Warning 1
![Product Banner Search Warning 1](../demos/images/product-banner-search-warning-1.png)

### Product Banner Search Warning 2
![Product Banner Search Warning 2](../demos/images/product-banner-search-warning-2.png)

### Popup Window UI 1
![Popup Window](../demos/images/pop-up-ui-1.png)

### Popup Window UI 2
![Popup Window](../demos/images/pop-up-ui-2.png)

## NutriLens V0

### Demo Video
<video src="https://github.com/user-attachments/assets/1a849b7c-144e-4396-98fe-7c887590a4be" controls></video>

---

## Features

### Product Details View
- Latest Nutri-Score, NOVA, and Eco-Score display
- Nutrient-level visual bars (fat, salt, sugar, saturated fat)
- Product search confidence, preference score, and more details
- Link to Open Food Facts product page

### Product List View Badges
- Compact clickable badges on product grid/list views
- Quick visual indicators for nutritional quality and preference scores

### Multi-Language Support
- English (EN)
- French (FR)
- Easily extensible i18n system

### Settings Panel
- Language selection
- Feature toggles
- Preference management

### Smart Data Handling
- Caching for performance
- Graceful handling of missing products
- Real-time settings sync across tabs
- Intersection Observer for lazy loading
- Mutation Observer for DOM changes
- and many more...






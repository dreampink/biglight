# Biglight Technical Challenge – Landing Page Generator (Prototype)

This prototype demonstrates an efficient workflow for updating George at ASDA landing pages using structured content from a Google Sheet.
It automates the process of converting a simple, non-technical content brief (maintained by Account Managers) into reusable, modular HTML/CSS that can be previewed locally for QA before uploading to Salesforce.
The focus is on maintainability, repeatability, and clarity.

# How It Works
1. Structured Input via Google Sheets
Account Managers fill in a shared Google Sheet with page content.
The sheet contains three tabs:

Page - overall page metadata
Modules - section definitions (e.g. hero, grid, promo strip)
Items - images, text, CTAs for each block

Images can be real URLs (e.g. from the ASDA CDN) or placeholders such as
https://picsum.photos/600/400.

2. Automated Build
The Node.js script fetches data directly from Google Sheets using the Google Sheets API.
Data is normalised and validated against a registry of reusable module templates (Handlebars).
The system then renders a complete HTML page and writes it to public/index.html.

3. Local Preview for QA
Developers can view the output in a browser (via a local server) to verify layout, content, and responsiveness before uploading the HTML/CSS into Salesforce.

# Tech Stack
Node.js -scripting and automation
Handlebars - templating for reusable modules
Google Sheets API - structured data source
dotenv - environment variable management
Live Server - local preview
SCSS/CSS - simple responsive styling

# Getting Started

 # Prerequisites
- Node.js 18+
- Google Cloud project with Sheets API enabled
- A Service Account with access to your Sheet


The Service Account’s JSON key saved locally as:

 ./.secrets/sa.json (in the root folder)
 
 # Google Cloud Setup
   1. Visit Google Cloud Console.
   2. Enable the Google Sheets API.
   3. Create a Service Account under IAM & Admin → Service Accounts.
   4. Go to the Keys tab → Add key → Create new key → JSON.
      Save it to your project as:  ./.secrets/sa.json
   5. In your Google Sheet → Share → Add the Service Account email (Viewer access).

  # Environment Setup 
  Create a .env file in the project root:
  GOOGLE_APPLICATION_CREDENTIALS=./.secrets/sa.json
  SHEET_ID=[Actual Google Sheet ID]

  # Install and Run
  npm install
  npm run build
  npm run dev

  Then open http://localhost:5173 ( You;ll see a live preview of the generated HTML landing page)

  # Example Workflow 
  1) Account Managers update content in the shared Google sheet.
  2) Develops run: npm run build
  3) Scripts fetches the latest content, validates structure, and builds index.html
  4) QA team checks the local preview (mobile + desktop)
  5) Once approved, the HTML/CSS is uploaded to Salesforce

  # Time Spent
  5.5 hours total
  - 2 hours planning and structuring workflow
  - 2.5 hours implementation and testing
  - 30 mins documentating and polishing 

  # Use of AI Tools
  - ChatGPT (GPT-5) - used for code review, documentation drafting, and iterative troubleshooting
  
  - GitHub Copilot - used in VS Code during development for minor code completions and inline suggestions (e.g. boilerplate, repetitive syntax).
  Copilot helped speed up routine typing but was not used to generate major logic or architecture.
  Together, these tools supported efficiency and clarity, but the underlying workflow, structure, and decisions were designed and implemented independently.

  # Next Steps (If Extended)
  If developed further, this prototype could include:
  A small web UI for Account Managers to drag-and-drop CSVs or preview Sheet data.
  Built-in validation UI (e.g. highlight missing alt text or CTA URLs).
  Automatic deployment to Salesforce staging via API.
  Visual module picker (preview thumbnails for each module).
  Unit tests for content validation.


  # Notes
  Placeholder images use https://picsum.photos for demonstration.
  Focus is on showing content → template → rendered HTML flow, not design fidelity.
  The repo intentionally avoids CMS-level complexity to stay lightweight and maintainable.

  # Potential Google Sheets Data to use
  # Page
  | section_id      | sort_order | title     | active
| :---        |    :----:   |          ---: |       ---:
| home-hero-2025-10-04     | 1      | Hero  | TRUE
| home-grid-2025-10-04  |2       | Product Grid     |TRUE
| home-promo-2025-10-04 | 3| Promo Strip | TRUE
| home-promo-2025-10-05 | 4 | Promo Strip | TRUE

# Modules
  
  | section_id      | module_id | module_type    | variant | active
| :---        |    :----:   |          ---: |       ---:    |    ---:
| home-hero-2025-10-04  | hero-01      | Hero  | default | TRUE
| home-grid-2025-10-04  |grid-01       | grid     |two-up | TRUE
| home-promo-2025-10-04 | strip-01| Promo Strip |default | TRUE
| home-promo-2025-10-05 | strip-02 | Promo Strip | default | TRUE

# items
  
  
| module_id | item_order | desktop_image                                                    | mobile_image                                                   | alt_text     | headline             | subhead         | cta_text   | cta_url        | legal_copy |
| --------- | ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------- | ------------ | -------------------- | --------------- | ---------- | -------------- | ---------- |
| hero-01   | 1          | [https://picsum.photos/1440/510](https://picsum.photos/1440/510) | [https://picsum.photos/768/510](https://picsum.photos/768/510) | Autumn edit  | Autumn Collection    |                 | Shop Women | /womens/autumn |            |
| grid-01   | 1          | [https://picsum.photos/720/720](https://picsum.photos/720/720)   | [https://picsum.photos/360/360](https://picsum.photos/360/360) | Kids Jumpers | Kids Jumpers         |                 | Shop Kids  | /kids/jumpers  |            |
| grid-01   | 2          | [https://picsum.photos/720/720](https://picsum.photos/720/720)   | [https://picsum.photos/360/360](https://picsum.photos/360/360) | Men’s Coats  | Men’s Coats          |                 | Shop Men   | /mens/coats    |            |
| strip-01  | 1          |        |  | Promo banner | Free Click & Collect | Orders over £25 | Learn more | /delivery      | T&Cs apply |
| strip-02 | 1 | |  | Tester | Tester | | TEST | TEST| TESTER

* Please make sure the tabs in the google sheet are exactly 'Page', 'Modules", "Items"
    <img width="678" height="582" alt="Screenshot 2025-10-05 at 13 33 41" src="https://github.com/user-attachments/assets/776ec2ea-75c3-4d1e-84d5-17be64de04d4" />

1) Open a new Google Sheet and create three tabs named Page, Modules, Items.
2) Copy the demo tables above into the matching tabs (or use your own).
3) Share the sheet with your service account email (Viewer) from Google Cloud API.

Set your .env:

GOOGLE_APPLICATION_CREDENTIALS=./.secrets/sa.json

SHEET_ID=<your-sheet-id>
(When you open your sheet in the browser, look at the URL, Copy just that string (between /d/ and /edit)
and paste it into your .env file)


Run:
npm run build
npm run dev
Open http://localhost:5173 to preview.

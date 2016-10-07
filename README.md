# ga-screen-res

Display a cumulative frequency graph of screen widths, based on exported Google Analytics visitor data.

A rough and ready script from the mySociety design team.

## Downloading a suitable CSV from Google Analytics

* Open your site’s Google Analytics report page
* Set a sensible date range
* Select `Audience > Technology > Browser & OS` from the sidebar
* Set the `Primary Dimension:` to `Screen Resolution`
* Set `Show rows:` (under the bottom right corner of the table) to `5000`
* Make sure the table is sorted by `Sessions`, descending
* Select `Export > CSV` from the grey toolbar below the “Browser & OS” page title

## Visualising your data in ga-screen-res

* Clone this repo somewhere on your machine
* Compile the Sass styles: `sass --watch sass:css`
* Open `index.html` in your web browser
* Drag and drop your Google Analytics CSV onto the well at the top of `index.html`

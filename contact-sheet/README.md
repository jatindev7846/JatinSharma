# Contact form -> Google Sheet (downloadable as Excel)

1. Create a new Google Sheet (any name).
2. Extensions > Apps Script. Delete the sample code and paste in `Code.gs`. Save.
3. Deploy > New deployment > type "Web app".
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click Deploy and authorize when asked. Copy the Web app URL (ends in `/exec`).
4. In your hosting dashboard set the environment variable
   `VITE_CONTACT_ENDPOINT` to that URL, then redeploy the site.
5. Send a test message from the site. A "Messages" tab fills with
   Date, Name, Email, Message.
6. To get Excel: File > Download > Microsoft Excel (.xlsx).

If you edit the script later, use Deploy > Manage deployments > Edit > New version
so the same URL keeps working.

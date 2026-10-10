# School website and database viewer

This local website has a school homepage, a site settings page, and a SQL Server records viewer. It uses the installed `sqlcmd` command-line client and Node.js built-ins, so it does not need npm packages.

## Visit the published school website

<a href="https://binodsarki-design.github.io/Alex/" target="_blank" rel="noopener noreferrer">Open Brilliant Star English School ↗</a>

## Start the website

1. Make sure the SQL script `school_operations_database.sql` has already been run and created `school_operations_db`.
2. Open PowerShell in this folder.
3. Set the SQL Server connection values for your installation (examples below), then run `node server.js`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Preview on a phone on the same Wi-Fi

The default server binding is local to this computer. To temporarily allow another device on your Wi-Fi to preview it, stop the server, then start it with:

```powershell
$env:SCHOOL_HOST = '0.0.0.0'
node server.js
```

Find this computer's IPv4 address with `ipconfig` (look under the active Wi-Fi adapter), then open `http://<IPv4-address>:3000` on your phone. Both devices must use the same Wi-Fi. If Windows Firewall prompts, allow access on private networks. The site editor and database viewer are available to devices that can reach the server, so turn off network preview with Ctrl+C when finished; leaving `SCHOOL_HOST` unset keeps the server local-only.

## Website pages

- `/` — school homepage with contact details, notices, school photo, and contact form.
- `/admin` — edit school information, upload the school photo, publish/remove notices, and read contact messages.
- `/database` — browse and search database tables, and export the current table page to CSV.

Homepage content is saved in `school_site_data.json` in this folder. Messages submitted using the contact form are saved separately in `data/contact_messages.json` and shown in `/admin` under **Contact messages**; the form does not send email. On startup, any older messages still inside `school_site_data.json` are moved to the separate file.

### Windows authentication (recommended)

```powershell
$env:SCHOOL_SQL_SERVER = 'localhost'
node server.js
```

If your SQL Server is a named instance, set its name, for example:

```powershell
$env:SCHOOL_SQL_SERVER = '.\SQLEXPRESS'
node server.js
```

### SQL Server username and password

```powershell
$env:SCHOOL_SQL_SERVER = 'localhost'
$env:SCHOOL_SQL_USER = 'your_sql_login'
$env:SCHOOL_SQL_PASSWORD = 'your_password'
node server.js
```

Set `SQLCMD_PATH` if `sqlcmd` is not on PATH, for example:

```powershell
$env:SQLCMD_PATH = 'C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\SQLCMD.EXE'
```

If your local SQL Server uses a self-signed certificate and sqlcmd reports a certificate error, set `$env:SCHOOL_SQL_TRUST_CERT = '1'` for that session.

The website can also display the earlier `school_db` database by setting `$env:SCHOOL_SQL_DATABASE = 'school_db'` before starting the server. The default is `school_operations_db`.

## Share a read-only homepage preview

Set `$env:SCHOOL_PUBLIC_PREVIEW = '1'` before starting the server. In that mode the editor, contact-message inbox, contact submission, and database viewer are unavailable; only the public homepage is served. To create a temporary public link, keep this server running locally and run `cloudflared tunnel --url http://localhost:3000` in a second PowerShell window. Share the HTTPS `trycloudflare.com` URL printed by the tunnel. Keep the computer awake while sharing; stopping the tunnel ends the link. Quick Tunnels are for previews, not permanent school hosting.

## What it shows

- A school homepage with editable details, notices, photo, and contact form.
- A site settings page for updating homepage content and reviewing contact messages.
- A dashboard with table and record totals.
- Every `dbo` table discovered in the selected database.
- Paginated, searchable table records.
- CSV export for the records on the current page.

The server is intended for local use. Keep it on `localhost`; it has no user login or access-control layer.

## Secure hosted database portal

The local SQL Server viewer above is for this computer only. To host a private, sign-in-protected database viewer, use the separate [`secure-portal`](secure-portal/README.md) folder. It is designed for Azure App Service plus Azure SQL Database and uses managed identity with read-only SQL permissions. Do not publish database exports, real student data, or credentials to GitHub. Azure hosting may incur charges; review the Azure price estimate before creating resources.

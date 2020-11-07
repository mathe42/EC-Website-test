const dsgvoTN = require('remark')().use(require('remark-html')).processSync('\n' + require('fs').readFileSync('./content/datenschutz/teilnehmer.md').replace(/\n\s*#/, '\n##')).toString()
const footer = require('remark')().use(require('remark-html')).processSync('\n' + require('fs').readFileSync('./content/datenschutz/kontakt.md').replace(/\n\s*#/, '\n##')).toString()

const erlaubnisse = [
  "klettern",
  "bootfahren",
  "fahrrad",
  "sichEntfernen",
  "fahrgemeinschaften",
  "datenschutz",
  "freizeitLeitung",
  "tnBedingungen",
]

function longText(data: any, key: string) {
  if (!data[key]) return ''

  return `<h3>${key[0].toUpperCase() + key.slice(1)}</h3><p>${data[key]}</p>`
}

export async function createMailContentTN(data: any, token: string): Promise<string> {
  return require('inline-css')(`
    <html lang="de">
    <head>
      <style>
        h1 {
          color: #92c355;
          font-size: 24pt;
        }
        h2 {
          color: #92c355;
          font-size: 20pt;
        }
        p {
          font-size: 12pt;
        }
        h3 {
          color: #92c355;
          font-size: 16pt;
        }
        b {}
        i {}
        a {
          color: #92c355;
        }
        div {}
        table {}
        tr {}
        td {
          font-size: 12pt;
        }
        .btn {}
        .btn a {
          background-color: #92c355;
          border-radius: 25px;
          color: #282925;
          width: 250px;
          padding: 20px;
          height: 25px;
          font-size: 17pt;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          transform: translate(-50%, 0);
          margin-left: 150px;
          margin-left: calc(50% - 0px);
          white-space: nowrap;
        }

        body {
          background-color: #eee;
          margin: 0;
          padding: 0;
        }

        .main {
          margin-right: auto;
          margin-left: auto;
          max-width: 100%;
          background: #fff;
          padding: 5px 20px;
          margin-bottom: 0;
        }
        .footer {
          background: #fff;
          margin: 0 20px;
          padding: 5px 20px;
          text-align: center;
          border-radius: 20px 20px 0 0;
        }

        .footer table {
          margin: 0 auto;
        }

        .footer td {
          text-align: right;
          padding: 0 6px;
        }

        .footer td + td {
          text-align: center;
          margin-left: 10px;
        }
      </style>
      <style>
        @media (min-width: 1200px) {
          .main {
              max-width: 1140px !important;
          }
        }
        @media (min-width: 992px) {
          .main {
              max-width: 960px !important;
          }
        }
        @media (min-width: 768px) {
          .main {
              max-width: 720px !important;
          }
        }
        @media (min-width: 576px) {
          .main {
              max-width: 540px !important;
          }
        }
      </style>
    </head>
    <body>
    <div class="main">
    <h1>Deine Anmeldung beim EC-Nordbund!</h1>
    <p>
      <b>Hallo ${data.vorname} ${data.nachname},</b><br><br>
      danke für deine Anmeldung!
    </p>
    ${!data.alter ? `<p>Du hast nicht das richtige Alter um an dieser Veranstaltung Teilzunehmen! Du kannst dich trotzdem anmelden musst aber damit rechnen, dass deine Anmeldung im nachhinein noch abgelehnt wird!</p>` : ``}
    <p>
      Um deine Anmeldung zu bestätigen überprüfe deine Daten, lese bitte die Datenschutzhinweise und klicke dann
      auf Anmeldung bestätigen.
    </p>
    <p>Sollte es einen Fehler in deinen Daten geben melde dich bitte <b>erneut</b> an.</p>
    <div class="btn">
        <a href="https://www.ec-nordbund.de/anmeldung/token/${token}">Anmeldung bestätigen</a>
    </div>
    <p>Der Button geht bei dir nicht? Gebe den Bestätigungscode <i>${token}</i> auf 
      <a href="https://www.ec-nordbund.de/anmeldung/token">https://www.ec-nordbund.de/anmeldung/token</a> 
      ein.</p>
    <p style="font-size: 10pt; color: #444;">Du hast dich nicht bei uns angemeldet? Dann ignoriere einfach diese E-Mail. Sämtlich Daten werden automatisch nach 24h gelöscht.</p>
    <hr>
    <div>
      <h1>Deine Daten</h1>
      <h2>Persönliche Daten</h2>
      <p>${data.geschlecht === 'm' ? 'Herr' : 'Frau'} ${data.vorname} ${data.nachname} geb. am ${data.gebDat.split('-').reverse().join('.')}</p>
      <h2>Kontakt Daten</h2>
      <p>
        <b>Mail:</b> ${data.email}<br>
        <b>Tel:</b>  ${data.telefon}<br>
        <br>
        <b>Adresse:</b><br>
        ${data.strasse}<br>
        ${data.plz} ${data.ort}
      </p>
      <h2>Sonstige Daten</h2>
      ${(data.vegetarisch === null || data.vegetarisch === undefined) ? '' : `<p>${data.vegetarisch ? 'Vegetarische Verpflegung ausgewählt.' : '<b>Keine</b> vegetarische Verpflegung ausgewählt.'}</p>`}
      ${longText(data, 'lebensmittelallergien')}
      ${longText(data, 'bemerkungen')}
      ${longText(data, 'gesundheit')}
      <h2>Erlaubnisse Daten</h2>
      <table>
        ${(data.schwimmen !== undefined && data.schwimmen !== null && `
          <tr>
            <td>Schwimmen</td>
            <td>${['Nicht Erlaubt', 'Erlaubt, Nichtschwimmer', 'Erlaubt, Mittelmäßiger Schwimmer', 'Erlaubt, Guter Schwimmer'][data.schwimmen]}</td>
          </tr>
        `) || ''}
        ${Object.entries(data).filter(v => erlaubnisse.includes(v[0])).map(([key, val]) => `
            <tr>
              <td>${key[0].toUpperCase() + key.slice(1)}</td>
              <td>${val ? 'Ja' : 'Nein'}</td>
            </tr>
          `).join('')
    }
      </table>
      ${Object.keys(data.extra).length !== 0 ? `
        <h2>Extra Daten</h2>
        <p>Folgende besondere Daten wurden uns übermittelt:</p>
        <code>${JSON.stringify(data.extra, null, 4)}</code>
      ` : ''}
    </div>
    <hr>
    <div>
      <h1>Datenschutz</h1>
      ${dsgvoTN}
    </div>
    <!-- <div>
      <h1>Rohdaten</h1>
      <p>Dies sind alle Daten die uns übermittelt wurden (angezeigt im JSON-Format):</p>
      <code>${JSON.stringify(data, null, 2)}</code>
    </div> -->
    </div>
    <div class="footer">
      ${footer}
    </div>
    </body>
    </html>
  `, { url: 'https://www.ec-nordbund.de/', removeStyleTags: false })
}
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const OUTPUT = path.join(__dirname, 'entreflow-apps-script-deploy.gs');

const files = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

const sections = files.map(name => {
  const content = fs.readFileSync(path.join(PUBLIC, name), 'utf8');
  return `/* === ${name} === */\nfunction serve_${name.replace(/[^a-zA-Z0-9]/g, '_').replace(/\./g, '_').replace(/-/g, '_')}(){\n  return ContentService.createTextOutput(\`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)\n    .setMimeType(ContentService.MimeType.HTML);\n}\n`;
}).join('\n\n');

const script = `/**
 * EntreFlow — Frontend Delivery via Apps Script
 * Déploie : site complet servi depuis Sheets
 */
${sections}

function doGet(e) {
  const path = (e.parameter.path || '').replace(/^\//, '');
  if (!path) return serve_entreflow_dashboard_html();
  const map = {
    entreflow_dashboard_html: 'entreflow-dashboard.html',
    entreflow_auth_html: 'entreflow-auth.html',
    entreflow_login_html: 'entreflow-login.html',
    entreflow_landing_html: 'entreflow-landing.html',
    entreflow_quotes_html: 'entreflow-quotes.html',
    entreflow_quote_new_html: 'entreflow-quote-new.html',
    setup_block_html: 'setup_block.html',
    test_google_html: 'test-google.html',
  };
  const fn = 'serve_' + (map[path] || '');
  if (typeof window[fn] === 'function') return window[fn]();
  return ContentService.createTextOutput('Not found').setMimeType(ContentService.MimeType.TEXT);
}
`;

fs.writeFileSync(OUTPUT, script);
console.log('Deploy script written to', OUTPUT);

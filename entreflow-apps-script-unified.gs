/* ═══════════════════════════════════════════════════════════════════
   EntreFlow — Backend Google Apps Script  v14.0
   Connexion employé par CODE + Portail employé & Login ultra pro (icônes SVG, temps réel) · Signature électronique
   publique · Contrôle de stock strict · Sécurité renforcée
   ═══════════════════════════════════════════════════════════════════
   INSTALLATION :
   1. Google Sheet → Extensions → Apps Script
   2. Ctrl+A → Delete tout → Coller ce fichier
   3. Ctrl+S
   4. Menu EntreFlow → Initialiser la feuille
   5. Déployer → Nouvelle version → Copier l'URL /exec
   6. Remplacer CONFIG.PORTAL_URL par cette URL /exec
   ═══════════════════════════════════════════════════════════════════ */

const CONFIG = {
  APP_NAME      : 'EntreFlow',
  APP_TAGLINE   : 'Gérez. Vendez. Développez.',
  APP_URL       : 'https://votre-domaine.com',
  SUPPORT_EMAIL : 'support@votredomaine.com',
  SENDER_NAME   : 'EntreFlow by Africa Golden Digital',
  API_SECRET    : 'CHANGE_ME_SECRET',
  /* P1: pepper global pour le hashage des mots de passe — CHANGEZ cette valeur en production */
  PASSWORD_PEPPER : 'CHANGE_ME_PEPPER_2026',
  YEAR          : new Date().getFullYear(),

  // URL /exec de CE script — sert le portail employé, la page de connexion par
  // code, ET la page de signature publique
  PORTAL_URL : 'https://entreflow.netlify.app',

  // URL du site public employé (ex: https://entreflow.netlify.app)
  EMPLOYEE_PORTAL_URL : 'https://entreflow.netlify.app',

  // Logo EntreFlow (le SaaS, pas celui de l'entreprise du client) en base64
  // data URI, ex: "data:image/png;base64,iVBORw0KG...". Collez ici le contenu
  // du fichier "logoEntre" pour qu'il apparaisse sur tous les devis/factures
  // et dans l'en-tête du portail employé. Laissé vide = un sigle "E" stylisé
  // est utilisé à la place.
  ENTREFLOW_LOGO_BASE64 : 'data:image/png;base64,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',

  SHEETS : {
    USERS: 'Utilisateurs', COMPANIES: 'Boutiques', BRANCHES: 'Agences',
    EMPLOYEES: 'Employes', CLIENTS: 'Clients', PRODUCTS: 'Produits',
    STOCKS: 'Stocks', SALES: 'Ventes', SALE_ITEMS: 'VenteLignes',
    QUOTES: 'Devis', QUOTE_ITEMS: 'DevisLignes', NOTIFICATIONS: 'Notifications',
    AUDIT_LOG: 'JournalAudit', SESSIONS: 'SessionsUtilisateurs', AVIS: 'Avis',
    EMP_ACTIVITIES: 'ActivitesEmployes'
  }
};

const SHEET_SCHEMAS = {
  Utilisateurs  : ['id','prenom','nom','email','password_hash','salt','telephone','whatsapp','adresse','role','company_id','statut','derniere_connexion','created_at','updated_at'],
  Boutiques     : ['id','owner_id','name','phone','email','address','logo_data','tax_id','rccm','currency','tva_rate','quote_prefix','signature_data','statut','created_at','updated_at'],
  Agences       : ['id','company_id','name','is_main','is_active','created_at'],
  Employes      : ['id','company_id','branch_id','full_name','phone','email','whatsapp','poste','salaire','access_token','access_code','statut','created_at'],
  Clients       : ['id','company_id','name','phone','email','city','notes','total_revenue','statut','created_at','updated_at'],
  Produits      : ['id','company_id','name','category','unit','pack_qty','pack_buy_price','unit_sell_price','min_threshold','statut','created_at','updated_at'],
  Stocks        : ['id','company_id','branch_id','product_id','quantity','min_threshold','updated_at'],
  Ventes        : ['id','company_id','branch_id','sale_number','client_id','client_name','client_email','total','subtotal','payment_method','amount_paid','change_given','statut','created_by','employee_id','created_at'],
  VenteLignes   : ['id','sale_id','product_id','name','unit','quantity','unit_price','total_ligne'],
  Devis         : ['id','company_id','quote_number','client_id','client_name','client_email','client_phone','total','tva_rate','tva_amount','validite_jours','signature_data','signed_by','signed_at','sign_token','theme_seed','statut','created_by','employee_id','created_at'],
  DevisLignes   : ['id','quote_id','product_id','name','unit','quantity','unit_price','total_ligne'],
  Notifications : ['id','company_id','type','titre','message','employee_id','employee_name','montant','lu','destinataire_email','destinataire_nom','canal','created_at'],
  JournalAudit  : ['id','action','table_cible','enregistrement_id','utilisateur_email','details','ip','created_at'],
  SessionsUtilisateurs : ['id','token','user_email','debut_session','nb_actions','derniere_action'],
  Avis          : ['id','company_id','user_email','note','commentaire','categorie','statut','reponse','created_at'],
  ActivitesEmployes : ['id','employee_id','company_id','branch_id','action','details','montant','created_at']
};

/* ═══ MENU ═══ */
function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('EntreFlow')
      .addItem('Initialiser la feuille', 'setupSheet')
      .addItem('Vérifier la configuration', 'checkConfiguration_')
      .addSeparator().addItem('Vider toutes les données', 'resetAllData')
      .addToUi();
  } catch (e) {}
}

/**
 * Contrôle que CONFIG.PORTAL_URL a bien été remplacé par la vraie URL
 * /exec du déploiement. Tant que ce n'est pas fait, tout lien envoyé
 * par email (signature de devis, connexion employé) contient encore
 * "VOTRE_SCRIPT_ID" — un lien qui ne mène nulle part et que Google
 * Drive affiche comme "fichier introuvable". Ces deux fonctions
 * empêchent ce genre de lien cassé de partir silencieusement.
 */
function isPortalUrlConfigured_() {
  const url = String(CONFIG.PORTAL_URL || '');
  return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url);
}
function assertPortalUrlConfigured_() {
  if (!isPortalUrlConfigured_()) {
    throw new Error(
      "CONFIG.PORTAL_URL n'est pas configuré. Va dans Déployer > Gérer les déploiements, " +
      "copie l'URL qui se termine par /exec, et colle-la dans CONFIG.PORTAL_URL en haut du fichier. " +
      "Sans ça, les liens envoyés par email (signature, connexion employé) sont cassés."
    );
  }
}
/** Menu EntreFlow > Vérifier la configuration — diagnostic rapide avant mise en prod */
function checkConfiguration_() {
  const ui = SpreadsheetApp.getUi();
  const lines = [];
  lines.push(isPortalUrlConfigured_()
    ? '✅ PORTAL_URL correctement configurée.'
    : '❌ PORTAL_URL non configurée — remplace VOTRE_SCRIPT_ID par ta vraie URL /exec.');
  lines.push(CONFIG.API_SECRET === 'CHANGE_ME_SECRET'
    ? '⚠️ API_SECRET est toujours la valeur par défaut — change-la avant la mise en production.'
    : '✅ API_SECRET personnalisé.');
  lines.push(CONFIG.ENTREFLOW_LOGO_BASE64
    ? '✅ Logo EntreFlow configuré.'
    : 'ℹ️ Logo EntreFlow non configuré (un sigle "E" est utilisé à la place — facultatif).');
  ui.alert('Diagnostic EntreFlow', lines.join('\n\n'), ui.ButtonSet.OK);
}
function setupSheet() { setupSheetApi(); SpreadsheetApp.getUi().alert('EntreFlow v14 initialisé.'); }
function setupSheetApi() {
  const ss = SpreadsheetApp.getActive();
  Object.entries(SHEET_SCHEMAS).forEach(([name, headers]) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#2563EB');
      sh.setFrozenRows(1);
      try { sh.autoResizeColumns(1, headers.length); } catch (e) {}
    } else {
      const existing = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
      headers.forEach(h => { if (!existing.includes(h)) sh.getRange(1, sh.getLastColumn() + 1).setValue(h).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#2563EB'); });
    }
  });
  return { ok: true };
}
function resetAllData() {
  const ui = SpreadsheetApp.getUi();
  if (ui.alert('Supprimer TOUTES les données ?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  SpreadsheetApp.getActive().getSheets().forEach(sh => { try { SpreadsheetApp.getActive().deleteSheet(sh); } catch (e) {} });
  setupSheetApi();
}

/* ═══ HELPERS GÉNÉRIQUES ═══ */
function uuid() { return Utilities.getUuid(); }
/* P1: hash mot de passe avec salt par utilisateur + pepper global — stocké dans utilisateurs.salt */
function hashPassword(pw, salt) {
  const payload = String(pw || '') + '|' + String(salt || '') + '|' + String(CONFIG.PASSWORD_PEPPER || '');
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload, Utilities.Charset.UTF_8);
  return bytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}
/* P1 fallback: ancien hash sans sel ni pepper pour migration transparente des comptes existants */
function hashPasswordLegacy_(pw) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(pw || ''), Utilities.Charset.UTF_8);
  return bytes.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function generateToken_() { return Utilities.getUuid().replace(/-/g, '') + Math.random().toString(36).slice(2, 8); }
/**
 * Code de connexion employé — court, facile à taper sur un téléphone,
 * sans caractères ambigus (pas de 0/O, 1/I/L). Unique par employé.
 * C'est CE code (envoyé par email) qui identifie à la fois l'employé
 * ET son entreprise lors de la connexion — impossible de confondre
 * les employés de deux entreprises différentes, chaque code n'existe
 * qu'une seule fois dans toute la feuille Employes.
 */
function generateEmployeeCode_() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sans 0/O/1/I/L
  let code;
  do { code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); }
  while (findRow_(CONFIG.SHEETS.EMPLOYEES, 'access_code', code)); // garantit l'unicité
  return code;
}
function getSheet_(name) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); if (SHEET_SCHEMAS[name]) sh.appendRow(SHEET_SCHEMAS[name]); }
  return sh;
}
function sheetToObjects_(name) {
  const sh = getSheet_(name);
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return [];
  const header = rows[0].map(String);
  return rows.slice(1).map(row => { const obj = {}; header.forEach((h, i) => obj[h.trim()] = row[i]); return obj; });
}
function findRow_(name, field, value) {
  const sh = getSheet_(name);
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return null;
  const header = rows[0].map(String);
  const col = header.findIndex(h => h.trim() === field);
  if (col < 0) return null;
  const target = String(value).trim().toLowerCase();
  for (let i = 1; i < rows.length; i++) if (String(rows[i][col] || '').trim().toLowerCase() === target) return { rowIndex: i + 1, header, row: rows[i] };
  return null;
}
function rowToObject_(found) {
  if (!found) return null;
  const item = {}; found.header.forEach((h, i) => item[h.trim()] = found.row[i]); return item;
}
function insertRow_(name, obj) {
  const sh = getSheet_(name);
  const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  sh.appendRow(header.map(h => obj[h.trim()] !== undefined ? obj[h.trim()] : ''));
  return obj;
}
function updateRow_(name, id, updates) {
  const found = findRow_(name, 'id', id);
  if (!found) return { ok: false, error: 'not_found' };
  const sh = getSheet_(name);
  Object.keys(updates).forEach(key => { const col = found.header.findIndex(h => h.trim() === key); if (col >= 0) sh.getRange(found.rowIndex, col + 1).setValue(updates[key]); });
  return { ok: true };
}
function deleteRowPermanently_(name, id) {
  const found = findRow_(name, 'id', id);
  if (!found) return { ok: false };
  getSheet_(name).deleteRow(found.rowIndex);
  return { ok: true };
}
/* P1: utilitaire d'isolation multi-entreprise — vérifie qu'un enregistrement appartient bien à l'entreprise appelante */
function assertBelongsToCompany_(sheetName, id, companyId) {
  if (!id || !companyId) return true; // laissé passer les cas sans id (création)
  const found = findRow_(sheetName, 'id', id);
  if (!found) throw new Error('Enregistrement introuvable.');
  const col = found.header.findIndex(h => h.trim() === 'company_id');
  if (col >= 0 && String(found.row[col] || '') !== String(companyId)) {
    throw new Error("Accès refusé : cet enregistrement n'appartient pas à votre entreprise.");
  }
}
/* P1: échappement HTML pour prévenir XSS — utilisé dans tous les templates HTML/email/PDF. */
function escapeHtml_(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function logActivity_(employeeId, companyId, branchId, action, details, montant) {
  try { insertRow_(CONFIG.SHEETS.EMP_ACTIVITIES, { id: uuid(), employee_id: employeeId, company_id: companyId, branch_id: branchId, action, details: details || '', montant: montant || 0, created_at: new Date().toISOString() }); } catch (e) {}
}
function fmtMoney(v, currency) { return Number(v || 0).toLocaleString('fr-FR') + ' ' + (currency || 'F CFA'); }
function fmtDate(d) { return new Date(d || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
function fmtDateTime(d) { const dt = new Date(d || Date.now()); return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
function addDays_(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function getMonthRange_(year, month) { const now = new Date(); const y = year !== undefined ? year : now.getFullYear(); const m = month !== undefined ? month : now.getMonth(); return { start: new Date(y, m, 1), end: new Date(y, m + 1, 1) }; }
function matchSearch_(obj, fields, q) { if (!q) return true; const needle = q.trim().toLowerCase(); return fields.some(f => String(obj[f] || '').toLowerCase().includes(needle)); }
/* P1: échappement HTML pour prévenir XSS — utilisé dans tous les templates HTML/email/PDF. */
function escapeHtml_(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ═══════════════════════════════════════════════════════════════════
   §  SÉCURITÉ — vérification d'accès pour toute action sensible
   ═══════════════════════════════════════════════════════════════════ */
/* P1: verifyAccess_ corrigé — le scope owner ne dépend plus d'un employé fantôme ; il lit la session patron dans SessionsUtilisateurs puis valide l'utilisateur dans Utilisateurs. */
function verifyAccess_(data) {
  const token = String((data || {}).token || '').trim();
  if (!token) return { ok: false, error: 'Authentification requise.' };
  if (token === CONFIG.API_SECRET) return { ok: true, scope: 'admin' };

  const emp = findEmployeeByToken_({ token });
  if (emp && String(emp.statut) === 'actif') return { ok: true, scope: 'employee', employee: emp };

  // Sessions patron/propriétaire créées par loginUser_
  const sess = findRow_(CONFIG.SHEETS.SESSIONS, 'token', token);
  if (sess) {
    const scol = k => sess.header.findIndex(h => h.trim() === k);
    const email = sess.row[scol('user_email')];
    const userFound = findRow_(CONFIG.SHEETS.USERS, 'email', email);
    if (userFound) {
      const ucol = k => userFound.header.findIndex(h => h.trim() === k);
      if (String(userFound.row[ucol('statut')]).toLowerCase() !== 'suspendu') {
        const obj = rowToObject_(userFound);
        return {
          ok: true,
          scope: 'owner',
          company_id: obj.company_id || '',
          user: obj
        };
      }
    }
  }

  return { ok: false, error: 'Accès refusé : identifiants invalides ou expirés.' };
}
/* P1: scopePayload_ ne force plus company_id/branch_id pour le scope owner ; il transmet seulement ce qui vient du frontend. */
function scopePayload_(data, access) {
  if (access.scope === 'employee') {
    const e = access.employee;
    data.company_id = e.company_id; data.companyId = e.company_id;
    data.branch_id = e.branch_id; data.branchId = e.branch_id;
    data.employee_id = e.id; data.created_by = data.created_by || e.id;
  } else if (access.scope === 'owner') {
    // Le propriétaire connecté possède déjà company_id dans access ;
    // on ne touche pas à ses champs pour ne pas écraser ce que le dashboard envoie.
    data.company_id = data.company_id || access.company_id || '';
    data.companyId = data.companyId || access.company_id || '';
  }
  return data;
}


/* ═══ AUTH ═══ */
function registerUser(p) {
  p = p || {};
  const email = String(p.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email requis.');
  if (findRow_(CONFIG.SHEETS.USERS, 'email', email)) throw new Error('Un compte existe déjà avec cet email.');
  const now = new Date().toISOString(); const id = uuid(); const pw = p.password || generatePassword();
  const userSalt = Utilities.getUuid();
  insertRow_(CONFIG.SHEETS.USERS, { id, prenom: p.prenom || '', nom: p.nom || '', email, password_hash: hashPassword(pw, userSalt), salt: userSalt, telephone: p.telephone || '', whatsapp: p.whatsapp || '', adresse: p.adresse || '', role: p.role || 'admin', company_id: '', statut: 'actif', derniere_connexion: '', created_at: now, updated_at: now });
  sendEmail_({ to: email, subject: `Bienvenue sur ${CONFIG.APP_NAME} — Votre espace est prêt`, html: buildEmail_Welcome({ prenom: p.prenom, email, password: pw }) });
  logAudit_('CREATE_USER', 'Utilisateurs', id, email, `${p.prenom} ${p.nom}`);
  return { id, email, prenom: p.prenom, nom: p.nom };
}
/* P1: loginUser_ avec fallback legacy pour migration transparente des anciens hash sans sel */
function loginUser_(p) {
  const email = String((p || {}).email || '').trim().toLowerCase();
  const password = String((p || {}).password || '');
  if (!email || !password) return { ok: false, error: 'Email et mot de passe requis.' };
  const found = findRow_(CONFIG.SHEETS.USERS, 'email', email);
  if (!found) return { ok: false, error: 'Identifiants invalides.' };
  const col = k => found.header.findIndex(h => h.trim() === k);
  const userSalt = found.row[col('salt')] || '';
  const storedHash = found.row[col('password_hash')] || '';
  let ok = storedHash === hashPassword(password, userSalt);
  let migrated = false;
  if (!ok && !userSalt) {
    ok = storedHash === hashPasswordLegacy_(password);
    if (ok) {
      const newSalt = Utilities.getUuid();
      updateRow_(CONFIG.SHEETS.USERS, found.row[col('id')], { password_hash: hashPassword(password, newSalt), salt: newSalt });
      migrated = true;
    }
  }
  if (!ok) return { ok: false, error: 'Identifiants invalides.' };
  if (String(found.row[col('statut')]).toLowerCase() === 'suspendu') return { ok: false, error: 'Compte suspendu. Contactez le support.' };
  const token = uuid(); const now = new Date().toISOString();
  insertRow_(CONFIG.SHEETS.SESSIONS, { id: uuid(), token, user_email: email, debut_session: now, nb_actions: 1, derniere_action: 'login' });
  updateRow_(CONFIG.SHEETS.USERS, found.row[col('id')], { derniere_connexion: now });
  logAudit_('LOGIN_OK', 'Utilisateurs', found.row[col('id')], email, 'Connexion réussie' + (migrated ? ' (migrée vers sel+pepper)' : ''));
  return { ok: true, user: { token, id: found.row[col('id')], email, prenom: found.row[col('prenom')] || '', nom: found.row[col('nom')] || '', role: found.row[col('role')] || '', company_id: found.row[col('company_id')] || '', start: now } };
}
function logoutUser_(p) { logAudit_('LOGOUT', 'Utilisateurs', '-', (p || {}).email || '', 'Déconnexion'); return { ok: true }; }
/* P1: rate limiting reset password — max 1 demande par 5 min par email */
function forgotPassword(email) {
  const em = String(email || '').trim().toLowerCase();
  if (!em) throw new Error('Email requis.');
  const cacheKey = 'ef_forgot_' + em;
  const cache = CacheService.getScriptCache();
  if (cache.get(cacheKey)) throw new Error('Un email de réinitialisation a déjà été envoyé récemment. Vérifiez votre boîte ou attendez 5 minutes.');
  const found = findRow_(CONFIG.SHEETS.USERS, 'email', em);
  if (!found) throw new Error('Email introuvable.');
  const col = k => found.header.findIndex(h => h.trim() === k);
  const tmp = generatePassword();
  const userSalt = found.row[col('salt')] || Utilities.getUuid();
  updateRow_(CONFIG.SHEETS.USERS, found.row[col('id')], { password_hash: hashPassword(tmp, userSalt), salt: userSalt, updated_at: new Date().toISOString() });
  sendEmail_({ to: email, subject: `${CONFIG.APP_NAME} — Réinitialisation de mot de passe`, html: buildEmail_ResetPassword({ prenom: found.row[col('prenom')], tmp }) });
  cache.put(cacheKey, '1', 5 * 60);
  return { success: true };
}
/* P1: flux "mot de passe oublié" complet — 3 étapes: demande/email, vérification code, reset. */
/* Étape 1: demande de reset — envoie un code 6 chiffres par email au responsable */
function requestBossResetCode(p) {
  p = p || {};
  const email = String(p.email || '').trim().toLowerCase();
  if (!email) throw new Error('Email requis.');
  const cacheKey = 'ef_forgot_' + email;
  const cache = CacheService.getScriptCache();
  if (cache.get(cacheKey)) throw new Error('Un code a déjà été envoyé récemment. Vérifiez votre boîte ou attendez 5 minutes.');
  const found = findRow_(CONFIG.SHEETS.USERS, 'email', email);
  if (!found) throw new Error('Email introuvable.');
  const col = k => found.header.findIndex(h => h.trim() === k);
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 chiffres
  const now = new Date().toISOString();
  const resetId = uuid();
  insertRow_(CONFIG.SHEETS.RESET_CODES, { id: resetId, user_email: email, code, created_at: now, used: 'false', expires_at: addDays_(now, 1).toISOString() });
  const prenom = found.row[col('prenom')] || '';
  const loginLink = getPortalUrl_();
  const html = _emailWrap_('🔐', 'Réinitialisation de mot de passe', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Bonjour ${prenom || ''},</h1>
    <p style="color:#64748B;margin:0 0 16px;font-size:14px;">Voici votre code de réinitialisation. Il est valable 24 heures.</p>
    <table width="100%" style="background:#EFF6FF;border-radius:12px;border:1px solid #BFDBFE;"><tr><td style="padding:18px;text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.08em;font-weight:800;">Votre code de réinitialisation</p>
      <p style="margin:0;font-size:30px;font-weight:900;letter-spacing:8px;color:#1D4ED8;font-family:Arial,sans-serif;">${code}</p>
    </td></tr></table>
    <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  `);
  sendEmail_({ to: email, subject: `${CONFIG.APP_NAME} — Code de réinitialisation`, html });
  cache.put(cacheKey, '1', 5 * 60);
  return { success: true, message: "Code envoyé au responsable de l'entreprise." };
}

/* Étape 2: vérification du code */
function verifyResetCode(p) {
  p = p || {};
  const email = String(p.bossEmail || p.email || '').trim().toLowerCase();
  const code = String(p.code || '').trim();
  if (!email || !code) throw new Error('Email et code requis.');
  const resetCodes = sheetToObjects_(CONFIG.SHEETS.RESET_CODES || 'ResetCodes');
  if (!resetCodes || !resetCodes.length) throw new Error('Code invalide.');
  const now = new Date().toISOString();
  const match = resetCodes.find(r => String(r.user_email || '').toLowerCase() === email && String(r.code || '') === code && String(r.used || 'false') === 'false' && new Date(r.expires_at || now) > new Date(now));
  if (!match) throw new Error('Code invalide ou expiré.');
  const token = Utilities.getUuid();
  updateRow_(CONFIG.SHEETS.RESET_CODES || 'ResetCodes', match.id, { used: 'true', used_at: now });
  return { ok: true, token };
}

/* Étape 3: reset du mot de passe avec le token */
function resetBossPassword(p) {
  p = p || {};
  const email = String(p.bossEmail || p.email || '').trim().toLowerCase();
  const code = String(p.code || '').trim();
  const newPass = String(p.newPassword || p.newPass || '');
  if (!email || !code || !newPass) throw new Error('Email, code et nouveau mot de passe requis.');
  if (newPass.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
  const resetCodes = sheetToObjects_(CONFIG.SHEETS.RESET_CODES || 'ResetCodes');
  const now = new Date().toISOString();
  const match = resetCodes.find(r => String(r.user_email || '').toLowerCase() === email && String(r.code || '') === code && String(r.used || 'false') === 'false' && new Date(r.expires_at || now) > new Date(now));
  if (!match) throw new Error('Code invalide ou expiré.');
  const found = findRow_(CONFIG.SHEETS.USERS, 'email', email);
  if (!found) throw new Error('Utilisateur introuvable.');
  const col = k => found.header.findIndex(h => h.trim() === k);
  const userSalt = Utilities.getUuid();
  updateRow_(CONFIG.SHEETS.USERS, found.row[col('id')], { password_hash: hashPassword(newPass, userSalt), salt: userSalt, updated_at: now });
  updateRow_(CONFIG.SHEETS.RESET_CODES || 'ResetCodes', match.id, { used: 'true', used_at: now });
  logAudit_('PASSWORD_RESET', 'Utilisateurs', found.row[col('id')], email, 'Mot de passe réinitialisé via code');
  return { success: true, message: 'Mot de passe réinitialisé avec succès.' };
}

function init_(p) {
  const email = String((p || {}).email || '').trim().toLowerCase();
  if (!email) throw new Error('Email requis');
  const found = findRow_(CONFIG.SHEETS.USERS, 'email', email);
  if (!found) throw new Error('Utilisateur introuvable');
  const col = k => found.header.findIndex(h => h.trim() === k);
  const userId = found.row[col('id')]; const coId = found.row[col('company_id')] || '';
  const company = coId ? getCompanyById_(coId) : getCompanyByEmail_({ email });
  const branches = company ? listBranches_({ companyId: company.id }) : [];
  return { user: { id: userId, email, prenom: found.row[col('prenom')] || '', nom: found.row[col('nom')] || '', role: found.row[col('role')] || '', company_id: coId }, company, branches };
}

/* ═══ ENTREPRISE & AGENCES ═══ */
function getCompanyByEmail_(p) { return rowToObject_(findRow_(CONFIG.SHEETS.COMPANIES, 'email', (p || {}).email || '')); }
function getCompanyById_(id) { return rowToObject_(findRow_(CONFIG.SHEETS.COMPANIES, 'id', id)); }
function createCompany_(p) {
  p = p || {}; const id = uuid(); const now = new Date().toISOString();
  const obj = { id, owner_id: p.ownerId || '', name: p.name || '', phone: p.phone || '', email: p.email || '', address: p.address || '', logo_data: p.logo_data || '', tax_id: p.tax_id || '', rccm: p.rccm || '', currency: p.currency || 'XOF', tva_rate: p.tva_rate || 18, quote_prefix: p.quote_prefix || 'EF-', signature_data: p.signature_data || '', statut: 'actif', created_at: now, updated_at: now };
  insertRow_(CONFIG.SHEETS.COMPANIES, obj);
  if (p.email) { const u = findRow_(CONFIG.SHEETS.USERS, 'email', p.email); if (u) updateRow_(CONFIG.SHEETS.USERS, u.row[u.header.findIndex(h => h.trim() === 'id')], { company_id: id }); }
  if (p.ownerId) updateRow_(CONFIG.SHEETS.USERS, p.ownerId, { company_id: id });
  const branch = createBranch_({ companyId: id, name: 'Agence principale', isMain: true });
  logAudit_('CREATE_COMPANY', 'Boutiques', id, p.email || '', p.name);
  return { ...obj, branches: [branch] };
}
function createDefaultCompany_(p) { p = p || {}; return createCompany_({ ownerId: p.ownerId, name: p.name || 'Mon Entreprise', email: p.email || '' }); }
/* P1: updateCompany_ — Empêche la modification de l'entreprise d'un tiers ; utilise uniquement data.company_id injecté par scopePayload_ */
function updateCompany_(p) {
  p = p || {}; const id = p.id || p.companyId; if (!id) return { ok: false, error: 'id manquant' };
  const updates = {}; Object.keys(p.updates || {}).forEach(k => { const v = p.updates[k]; if (v !== '' && v !== undefined && v !== null) updates[k] = v; });
  updates.updated_at = new Date().toISOString();
  if (String(id) !== String(p.company_id || '')) return { ok: false, error: "Accès refusé : modification impossible sur une autre entreprise." };
  const r = updateRow_(CONFIG.SHEETS.COMPANIES, id, updates); if (!r.ok) return r;
  logAudit_('UPDATE_COMPANY', 'Boutiques', id, '', JSON.stringify(Object.keys(updates)));
  return { ok: true, company: getCompanyById_(id) };
}
function listBranches_(p) { return sheetToObjects_(CONFIG.SHEETS.BRANCHES).filter(b => String(b.company_id) === String((p || {}).companyId || '')); }
function createBranch_(p) { p = p || {}; const obj = { id: uuid(), company_id: p.companyId || '', name: p.name || 'Agence', is_main: !!p.isMain, is_active: true, created_at: new Date().toISOString() }; insertRow_(CONFIG.SHEETS.BRANCHES, obj); return obj; }

/* ═══ PRODUITS ═══ */
function createProduct_(p) {
  p = p || {}; if (!p.name) throw new Error('Nom du produit requis.');
  const id = uuid(); const now = new Date().toISOString();
  const obj = { id, company_id: p.company_id || '', name: p.name, category: p.category || '', unit: p.unit || 'pièce', pack_qty: Number(p.pack_qty || 1), pack_buy_price: Number(p.pack_buy_price || 0), unit_sell_price: Number(p.unit_sell_price || 0), min_threshold: Number(p.min_threshold || 5), statut: 'actif', created_at: now, updated_at: now };
  insertRow_(CONFIG.SHEETS.PRODUCTS, obj); logAudit_('CREATE_PRODUCT', 'Produits', id, '', p.name);
  if (p.branchId && p.quantity !== undefined) {
    updateStock_({ companyId: p.company_id, branchId: p.branchId, productId: id, quantity: Number(p.quantity || 0), min_threshold: Number(p.min_threshold || 5) });
  }
  return { id, ok: true };
}
function listProducts_(p) {
  p = p || {}; let list = sheetToObjects_(CONFIG.SHEETS.PRODUCTS).filter(x => String(x.company_id) === String(p.companyId || '') && x.statut !== 'inactif');
  if (p.search) list = list.filter(x => matchSearch_(x, ['name', 'category', 'unit'], p.search));
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
function getProduct_(p) { return rowToObject_(findRow_(CONFIG.SHEETS.PRODUCTS, 'id', (p || {}).id || '')); }
/* P1: updateProduct_ — vérifie appartenance entreprise */
function updateProduct_(p) { p = p || {}; assertBelongsToCompany_(CONFIG.SHEETS.PRODUCTS, p.id, p.company_id); return updateRow_(CONFIG.SHEETS.PRODUCTS, p.id, Object.assign({}, p.updates || {}, { updated_at: new Date().toISOString() })); }
/* P1: deleteProduct_ — vérifie appartenance entreprise */
function deleteProduct_(p) { p = p || {}; if (!p.id) return { ok: false }; assertBelongsToCompany_(CONFIG.SHEETS.PRODUCTS, p.id, p.company_id); if (p.permanent) return deleteRowPermanently_(CONFIG.SHEETS.PRODUCTS, p.id); return updateRow_(CONFIG.SHEETS.PRODUCTS, p.id, { statut: 'inactif', updated_at: new Date().toISOString() }); }
/* P1: permanentDeleteProduct_ — vérifie appartenance entreprise */
function permanentDeleteProduct_(p) { assertBelongsToCompany_(CONFIG.SHEETS.PRODUCTS, (p || {}).id, (p || {}).company_id); return deleteRowPermanently_(CONFIG.SHEETS.PRODUCTS, (p || {}).id); }

/* ═══ STOCK ═══ */
function listStock_(p) {
  p = p || {}; const stocks = sheetToObjects_(CONFIG.SHEETS.STOCKS).filter(s => String(s.branch_id) === String(p.branchId || ''));
  const products = sheetToObjects_(CONFIG.SHEETS.PRODUCTS);
  const activeIds = new Set(products.filter(x => x.statut !== 'inactif').map(x => String(x.id)));
  return stocks.filter(s => activeIds.has(String(s.product_id))).map(s => { const prod = products.find(pr => String(pr.id) === String(s.product_id)); s.products = prod ? { name: prod.name, unit: prod.unit } : { name: '—', unit: '' }; return s; });
}
function updateStock_(p) {
  p = p || {}; const sh = getSheet_(CONFIG.SHEETS.STOCKS); const rows = sh.getDataRange().getValues();
  const header = rows[0].map(String); const col = k => header.findIndex(h => h.trim() === k); const now = new Date().toISOString();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][col('branch_id')]) === String(p.branchId) && String(rows[i][col('product_id')]) === String(p.productId)) {
      if (p.quantity !== undefined) sh.getRange(i + 1, col('quantity') + 1).setValue(Number(p.quantity));
      if (p.min_threshold !== undefined) sh.getRange(i + 1, col('min_threshold') + 1).setValue(Number(p.min_threshold));
      sh.getRange(i + 1, col('updated_at') + 1).setValue(now);
      return { ok: true };
    }
  }
  insertRow_(CONFIG.SHEETS.STOCKS, { id: uuid(), company_id: p.companyId || '', branch_id: p.branchId || '', product_id: p.productId || '', quantity: Number(p.quantity || 0), min_threshold: Number(p.min_threshold || 5), updated_at: now });
  return { ok: true };
}
function getStockQty_(branchId, productId) {
  const sh = getSheet_(CONFIG.SHEETS.STOCKS); const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return 0;
  const header = rows[0].map(String); const col = k => header.findIndex(h => h.trim() === k);
  for (let i = 1; i < rows.length; i++) if (String(rows[i][col('branch_id')]) === String(branchId) && String(rows[i][col('product_id')]) === String(productId)) return parseFloat(rows[i][col('quantity')]) || 0;
  return 0;
}
/* P3: decrementStock_ — après décrément, notifie le boss si le stock passe sous le seuil */
function decrementStock_(branchId, productId, qty) {
  try {
    const sh = getSheet_(CONFIG.SHEETS.STOCKS); const rows = sh.getDataRange().getValues();
    const header = rows[0].map(String); const col = k => header.findIndex(h => h.trim() === k);
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][col('branch_id')]) === String(branchId) && String(rows[i][col('product_id')]) === String(productId)) {
        const cur = parseFloat(rows[i][col('quantity')]) || 0;
        const newQty = Math.max(0, cur - qty);
        const threshold = parseFloat(rows[i][col('min_threshold')]) || 5;
        const companyId = rows[i][col('company_id')] || '';
        sh.getRange(i + 1, col('quantity') + 1).setValue(newQty);
        sh.getRange(i + 1, col('updated_at') + 1).setValue(new Date().toISOString());
        if (companyId && newQty <= threshold) {
          try {
            const prod = getProductById_(productId);
            const prodName = prod ? prod.name : 'Produit ' + productId;
            const status = newQty === 0 ? 'rupture' : 'faible';
            notifyBoss_(companyId, 'LOW_STOCK', `Stock ${status} : ${prodName}`, `Stock restant : ${newQty} (seuil : ${threshold})`, { montant: newQty });
          } catch (e) {}
        }
        return;
      }
    }
  } catch (e) {}
}
function restoreStock_(branchId, productId, qty) {
  try {
    const sh = getSheet_(CONFIG.SHEETS.STOCKS); const rows = sh.getDataRange().getValues();
    const header = rows[0].map(String); const col = k => header.findIndex(h => h.trim() === k);
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][col('branch_id')]) === String(branchId) && String(rows[i][col('product_id')]) === String(productId)) {
        const cur = parseFloat(rows[i][col('quantity')]) || 0;
        sh.getRange(i + 1, col('quantity') + 1).setValue(cur + qty);
        return;
      }
    }
  } catch (e) {}
}
/**
 * Réapprovisionnement rapide — ajoute une quantité au stock existant
 * (au lieu d'écraser la valeur comme updateStock_). Retourne l'ancienne
 * et la nouvelle quantité pour que le frontend affiche "Stock : 5 → 25"
 * dans sa petite fenêtre de réapprovisionnement.
 */
function restockProduct_(p) {
  p = p || {};
  if (!p.product_id || !p.branch_id) throw new Error('Produit et agence requis.');
  const addQty = Number(p.addQty || p.quantity || 0);
  if (!addQty || addQty <= 0) throw new Error('Quantité à ajouter invalide.');
  const before = getStockQty_(p.branch_id, p.product_id);
  const sh = getSheet_(CONFIG.SHEETS.STOCKS); const rows = sh.getDataRange().getValues();
  const header = rows[0].map(String); const col = k => header.findIndex(h => h.trim() === k); const now = new Date().toISOString();
  let found = false;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][col('branch_id')]) === String(p.branch_id) && String(rows[i][col('product_id')]) === String(p.product_id)) {
      sh.getRange(i + 1, col('quantity') + 1).setValue(before + addQty);
      sh.getRange(i + 1, col('updated_at') + 1).setValue(now);
      found = true; break;
    }
  }
  if (!found) insertRow_(CONFIG.SHEETS.STOCKS, { id: uuid(), company_id: p.company_id || '', branch_id: p.branch_id, product_id: p.product_id, quantity: addQty, min_threshold: Number(p.min_threshold || 5), updated_at: now });
  logAudit_('RESTOCK', 'Stocks', p.product_id, p.created_by || '', `+${addQty} (avant: ${before}, après: ${before + addQty})`);
  return { ok: true, before, added: addQty, after: before + addQty };
}

function assertStockAvailable_(branchId, items) {
  const products = sheetToObjects_(CONFIG.SHEETS.PRODUCTS);
  (items || []).forEach(it => {
    if (!it.product_id) return;
    const prod = products.find(p => String(p.id) === String(it.product_id));
    const name = prod ? prod.name : 'Produit';
    const available = getStockQty_(branchId, it.product_id);
    const requested = Number(it.quantity) || 0;
    if (requested > available) {
      if (available <= 0) throw new Error(`Stock épuisé pour "${name}" — aucune unité disponible.`);
      throw new Error(`Stock insuffisant pour "${name}" : ${available} disponible(s), ${requested} demandé(s).`);
    }
  });
}

/* ═══ CLIENTS ═══ */
function createClient_(p) {
  p = p || {}; const id = uuid(); const now = new Date().toISOString();
  insertRow_(CONFIG.SHEETS.CLIENTS, { id, company_id: p.company_id || '', name: p.name || '', phone: p.phone || '', email: p.email || '', city: p.city || '', notes: p.notes || '', total_revenue: 0, statut: 'actif', created_at: now, updated_at: now });
  return { id };
}
function listClients_(p) { p = p || {}; let list = sheetToObjects_(CONFIG.SHEETS.CLIENTS).filter(c => String(c.company_id) === String(p.companyId || '') && c.statut !== 'inactif'); if (p.search) list = list.filter(c => matchSearch_(c, ['name', 'phone', 'email', 'city'], p.search)); return list; }
function getClient_(p) { return rowToObject_(findRow_(CONFIG.SHEETS.CLIENTS, 'id', (p || {}).id || '')); }
/* P1: updateClient_ — vérifie appartenance entreprise */
function updateClient_(p) { assertBelongsToCompany_(CONFIG.SHEETS.CLIENTS, (p || {}).id, (p || {}).company_id); return updateRow_(CONFIG.SHEETS.CLIENTS, (p || {}).id, Object.assign({}, (p || {}).updates || {}, { updated_at: new Date().toISOString() })); }
/* P1: deleteClient_ — vérifie appartenance entreprise */
function deleteClient_(p) { assertBelongsToCompany_(CONFIG.SHEETS.CLIENTS, (p || {}).id, (p || {}).company_id); return updateRow_(CONFIG.SHEETS.CLIENTS, (p || {}).id, { statut: 'inactif' }); }
function addClientRevenue_(clientId, amount) {
  const found = findRow_(CONFIG.SHEETS.CLIENTS, 'id', clientId); if (!found) return;
  const col = k => found.header.findIndex(h => h.trim() === k);
  updateRow_(CONFIG.SHEETS.CLIENTS, clientId, { total_revenue: (parseFloat(found.row[col('total_revenue')]) || 0) + amount });
}

/* ═══ EMPLOYÉS ═══ */
function createEmployee_(p) {
  p = p || {}; const id = uuid(); const token = generateToken_(); const code = generateEmployeeCode_(); const now = new Date().toISOString();
  const obj = { id, company_id: p.companyId || '', branch_id: p.branchId || '', full_name: p.fullName || '', phone: p.phone || '', email: p.email || '', whatsapp: p.whatsapp || '', poste: p.poste || 'Vendeur', salaire: Number(p.salaire || 0), access_token: token, access_code: code, statut: 'actif', created_at: now };
  insertRow_(CONFIG.SHEETS.EMPLOYEES, obj);
  const loginLink = getPortalUrl_() + '?employeeLogin=1';
  // TODO P1: token employé permanent sans expiration — envisager une date d'expiration si besoin.
  const company = getCompanyById_(obj.company_id) || {};
  if (p.email) { try { sendEmail_({ to: p.email, subject: `${company.name || CONFIG.APP_NAME} — Votre code d'accès employé`, html: buildEmail_EmployeeWelcome({ nom: p.fullName, poste: p.poste || 'Employé', company, code, loginLink }) }); } catch (e) {} }
  if (p.whatsapp) {
    const wp = String(p.whatsapp).replace(/[^0-9+]/g, '');
    obj.whatsapp_link = `https://wa.me/${wp}?text=${encodeURIComponent(`Bonjour ${p.fullName}, voici votre code d'accès à l'espace vendeur ${company.name || CONFIG.APP_NAME} : ${code}\nConnectez-vous ici : ${loginLink}`)}`;
  }
  logAudit_('CREATE_EMPLOYEE', 'Employes', id, '', p.fullName);
  return obj;
}
function listEmployees_(p) {
  p = p || {}; const emps = sheetToObjects_(CONFIG.SHEETS.EMPLOYEES).filter(e => String(e.company_id) === String(p.companyId || '') && e.statut !== 'inactif');
  const branches = sheetToObjects_(CONFIG.SHEETS.BRANCHES);
  return emps.map(e => { const b = branches.find(br => String(br.id) === String(e.branch_id)); e.branches = b ? { name: b.name } : { name: '—' }; e.portal_link = CONFIG.EMPLOYEE_PORTAL_URL + '?employeeToken=' + e.access_token; return e; });
}
function deleteEmployee_(p) { p = p || {}; if (!p.id) return { ok: false }; assertBelongsToCompany_(CONFIG.SHEETS.EMPLOYEES, p.id, p.company_id); return updateRow_(CONFIG.SHEETS.EMPLOYEES, p.id, { statut: 'inactif' }); }
function permanentDeleteEmployee_(p) { p = p || {}; assertBelongsToCompany_(CONFIG.SHEETS.EMPLOYEES, p.id, p.company_id); deleteRowPermanently_(CONFIG.SHEETS.EMPLOYEES, p.id); return { ok: true }; }
function findEmployeeByToken_(p) {
  const found = findRow_(CONFIG.SHEETS.EMPLOYEES, 'access_token', (p || {}).token || '');
  const item = rowToObject_(found); if (item) item.portal_link = CONFIG.EMPLOYEE_PORTAL_URL + '?employeeToken=' + item.access_token;
  return item;
}
/**
 * Retrouve un employé à partir de son code de connexion à 6 caractères.
 * Le code étant unique dans toute la feuille Employes, il identifie sans
 * ambiguïté l'employé ET l'entreprise pour laquelle il travaille — un
 * employé d'une entreprise ne peut jamais, avec son code, atterrir dans
 * les données d'une autre entreprise.
 */
function findEmployeeByCode_(p) {
  const code = String((p || {}).code || '').trim().toUpperCase();
  if (!code) return null;
  const found = findRow_(CONFIG.SHEETS.EMPLOYEES, 'access_code', code);
  const item = rowToObject_(found); if (item) item.portal_link = CONFIG.EMPLOYEE_PORTAL_URL + '?employeeToken=' + item.access_token;
  return item;
}
/** Action de connexion employé — appelée depuis la page de code publique */
/* P1: rate limiting login employé par code — max 5 tentatives par 15 min par IP/code */
function employeeLoginByCode_(p) {
  const code = String((p || {}).code || '').trim().toUpperCase();
  const cacheKey = 'ef_emp_login_' + (code || 'unknown');
  const cache = CacheService.getScriptCache();
  const attempts = parseInt(cache.get(cacheKey) || '0', 10);
  if (attempts >= 5) {
    const ttl = cache.get(cacheKey + '_ts');
    const remaining = ttl ? Math.max(0, 15 - Math.floor((Date.now() - parseInt(ttl, 10)) / 60000)) : 15;
    return { ok: false, error: `Trop de tentatives. Réessayez dans ${remaining} minute(s).` };
  }
  const emp = findEmployeeByCode_(p);
  if (!emp) {
    cache.put(cacheKey, String(attempts + 1), 15 * 60);
    if (attempts === 0) cache.put(cacheKey + '_ts', String(Date.now()), 15 * 60);
    return { ok: false, error: 'Code invalide. Vérifiez le code reçu par email.' };
  }
  if (String(emp.statut) !== 'actif') return { ok: false, error: 'Ce compte employé est inactif. Contactez votre responsable.' };
  const company = getCompanyById_(emp.company_id) || {};
  logAudit_('EMPLOYEE_LOGIN_CODE', 'Employes', emp.id, emp.email || '', `Connexion par code — ${emp.full_name}`);
  return { ok: true, portal_link: emp.portal_link, employee: { full_name: emp.full_name, poste: emp.poste }, company: { name: company.name } };
}
function getEmployeeDashboard_(p) {
  p = p || {}; const emp = findEmployeeByToken_({ token: String(p.token || '').trim() });
  if (!emp) throw new Error('Accès refusé : token invalide'); if (String(emp.statut) !== 'actif') throw new Error('Compte employé inactif');
  const company = getCompanyById_(emp.company_id) || {};
  const branch = findRow_(CONFIG.SHEETS.BRANCHES, 'id', emp.branch_id);
  const branchName = branch ? branch.row[branch.header.findIndex(h => h.trim() === 'name')] : '—';
  const today = new Date(); today.setHours(0, 0, 0, 0); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const allSales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => String(s.company_id) === String(emp.company_id) && s.statut !== 'cancelled');
  const todaySales = allSales.filter(s => { const d = new Date(s.created_at); return d >= today && d < tomorrow; });
  const mySalesToday = todaySales.filter(s => String(s.created_by) === String(emp.id) || String(s.employee_id) === String(emp.id));
  const myCAToday = mySalesToday.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
  const stocks = listStock_({ branchId: emp.branch_id });
  const products = sheetToObjects_(CONFIG.SHEETS.PRODUCTS).filter(x => String(x.company_id) === String(emp.company_id) && x.statut !== 'inactif');
  const availableProducts = products.map(prod => {
    const stockRow = stocks.find(s => String(s.product_id) === String(prod.id));
    const qty = stockRow ? parseFloat(stockRow.quantity) || 0 : 0;
    const thresh = stockRow ? parseFloat(stockRow.min_threshold) || 5 : (parseFloat(prod.min_threshold) || 5);
    return { id: prod.id, name: prod.name, unit: prod.unit, unit_sell_price: prod.unit_sell_price, quantity: qty, min_threshold: thresh, statut_stock: !stockRow ? 'inconnu' : qty === 0 ? 'rupture' : qty <= thresh ? 'faible' : 'ok' };
  });
  /* P2: les clients sont filtrés par agence pour respecter la règle d'isolation multi-entreprise */
  const clients = sheetToObjects_(CONFIG.SHEETS.CLIENTS).filter(c => String(c.company_id) === String(emp.company_id) && c.statut !== 'inactif' && (String(c.branch_id) === String(emp.branch_id) || !c.branch_id)).slice(0, 200);
  const myQuotes = sheetToObjects_(CONFIG.SHEETS.QUOTES).filter(q => (String(q.created_by) === String(emp.id) || String(q.employee_id) === String(emp.id)) && q.statut !== 'supprime').slice(0, 20);
  return {
    employee: emp, company: { name: company.name, logo_data: company.logo_data, currency: company.currency || 'XOF' }, branch: { name: branchName },
    stats: { sales_today: mySalesToday.length, ca_today: myCAToday, products_available: availableProducts.filter(x => x.statut_stock !== 'rupture').length, low_stock: availableProducts.filter(x => x.statut_stock === 'faible').length, rupture: availableProducts.filter(x => x.statut_stock === 'rupture').length, quotes_pending: myQuotes.filter(q => q.statut === 'envoye').length, unread_notifications: 0 },
    sales_today: mySalesToday.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    products: availableProducts.sort((a, b) => a.name.localeCompare(b.name)), clients: clients.slice(0, 200), quotes: myQuotes
  };
}
function getEmployeeStats_(p) {
  p = p || {}; const emp = findEmployeeByToken_({ token: p.token }) || rowToObject_(findRow_(CONFIG.SHEETS.EMPLOYEES, 'id', p.employeeId));
  if (!emp) throw new Error('Employé introuvable'); const empId = emp.id; const now = new Date(); const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const mySales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => (String(s.created_by) === String(empId) || String(s.employee_id) === String(empId)) && s.statut !== 'cancelled');
  const thisMonth = mySales.filter(s => new Date(s.created_at) >= monthStart);
  const today = new Date(); today.setHours(0, 0, 0, 0); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const todaySales = mySales.filter(s => { const d = new Date(s.created_at); return d >= today && d < tomorrow; });
  return { employee_id: empId, total_sales: mySales.length, ca_total: mySales.reduce((s, x) => s + (parseFloat(x.total) || 0), 0), ca_this_month: thisMonth.reduce((s, x) => s + (parseFloat(x.total) || 0), 0), sales_this_month: thisMonth.length, sales_today: todaySales.length, ca_today: todaySales.reduce((s, x) => s + (parseFloat(x.total) || 0), 0), recent_sales: mySales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30) };
}
function listSalesByEmployee_(p) { p = p || {}; return sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => (String(s.created_by) === String(p.employeeId || '') || String(s.employee_id) === String(p.employeeId || '')) && s.statut !== 'cancelled').sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); }

/**
 * Vue Boss uniquement (action admin) — pour un jour donné (aujourd'hui
 * par défaut), combien chaque employé a vendu : nombre de ventes,
 * chiffre d'affaires, et le détail des produits vendus par cet employé.
 * Plus le total général de l'entreprise pour la journée. Réservée au
 * scope 'admin' — un employé ne peut jamais appeler cette action pour
 * voir les chiffres de ses collègues (voir ADMIN_ONLY_ACTIONS).
 */
function getDailySalesByEmployee_(p) {
  p = p || {};
  const dayStart = p.date ? new Date(p.date) : new Date(); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);

  const sales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => String(s.company_id) === String(p.companyId || '') && s.statut !== 'cancelled' && new Date(s.created_at) >= dayStart && new Date(s.created_at) < dayEnd);
  const saleIds = new Set(sales.map(s => String(s.id)));
  const allItems = sheetToObjects_(CONFIG.SHEETS.SALE_ITEMS).filter(i => saleIds.has(String(i.sale_id)));
  const employees = sheetToObjects_(CONFIG.SHEETS.EMPLOYEES).filter(e => String(e.company_id) === String(p.companyId || '') && e.statut !== 'inactif');

  const byEmployee = employees.map(emp => {
    const mySales = sales.filter(s => String(s.created_by) === String(emp.id) || String(s.employee_id) === String(emp.id));
    const mySaleIds = new Set(mySales.map(s => String(s.id)));
    const myItems = allItems.filter(i => mySaleIds.has(String(i.sale_id)));
    const productTotals = {};
    myItems.forEach(it => { const key = it.name || 'Produit'; if (!productTotals[key]) productTotals[key] = { name: key, quantity: 0, total: 0 }; productTotals[key].quantity += Number(it.quantity) || 0; productTotals[key].total += Number(it.total_ligne) || 0; });
    return {
      employee_id: emp.id, full_name: emp.full_name, poste: emp.poste,
      sales_count: mySales.length,
      total_ca: mySales.reduce((s, x) => s + (parseFloat(x.total) || 0), 0),
      products_sold: Object.values(productTotals).sort((a, b) => b.total - a.total)
    };
  }).filter(e => e.sales_count > 0).sort((a, b) => b.total_ca - a.total_ca);

  const companyProductTotals = {};
  allItems.forEach(it => { const key = it.name || 'Produit'; if (!companyProductTotals[key]) companyProductTotals[key] = { name: key, quantity: 0, total: 0 }; companyProductTotals[key].quantity += Number(it.quantity) || 0; companyProductTotals[key].total += Number(it.total_ligne) || 0; });

  return {
    date: dayStart.toISOString(),
    total_sales: sales.length,
    total_ca: sales.reduce((s, x) => s + (parseFloat(x.total) || 0), 0),
    by_employee: byEmployee,
    products_sold_company: Object.values(companyProductTotals).sort((a, b) => b.total - a.total)
  };
}


/* ═══════════════════════════════════════════════════════════════════
   §  VENTES — avec contrôle de stock strict
   ═══════════════════════════════════════════════════════════════════ */
/* P1/P4: saveSaleRecord_ — vérification + décrément stock sous verrou pour éviter la survente concurrente */
function saveSaleRecord_(p) {
  p = p || {};
  if (!p.branch_id) throw new Error('Agence manquante.');
  const items = p.items || [];
  if (!items.length) throw new Error('Ajoutez au moins un produit.');
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const grouped = {};
    items.forEach(it => { grouped[it.product_id] = (grouped[it.product_id] || 0) + Number(it.quantity || 0); });
    assertStockAvailable_(p.branch_id, Object.keys(grouped).map(pid => ({ product_id: pid, quantity: grouped[pid] })));

    const id = uuid(); const now = new Date().toISOString();
  const saleNumber = 'VT-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);
  const total = items.reduce((s, it) => s + (Number(it.unit_price) * Number(it.quantity)), 0);
  const sale = { id, company_id: p.company_id || '', branch_id: p.branch_id || '', sale_number: saleNumber, client_id: p.client_id || '', client_name: p.client_name || '', client_email: p.client_email || '', total, subtotal: total, payment_method: p.payment_method || 'cash', amount_paid: Number(p.amount_paid || total), change_given: Math.max(0, Number(p.amount_paid || total) - total), statut: 'completed', created_by: p.created_by || '', employee_id: p.employee_id || '', created_at: now };
  insertRow_(CONFIG.SHEETS.SALES, sale);
  const productsRef = sheetToObjects_(CONFIG.SHEETS.PRODUCTS);
  items.forEach(it => {
    const prod = productsRef.find(pr => String(pr.id) === String(it.product_id));
    insertRow_(CONFIG.SHEETS.SALE_ITEMS, { id: uuid(), sale_id: id, product_id: it.product_id || '', name: it.name || '', unit: (prod && prod.unit) || it.unit || '', quantity: Number(it.quantity || 0), unit_price: Number(it.unit_price || 0), total_ligne: Number(it.quantity || 0) * Number(it.unit_price || 0) });
    if (p.branch_id && it.product_id) decrementStock_(p.branch_id, it.product_id, Number(it.quantity || 0));
  });
  if (p.client_id) addClientRevenue_(p.client_id, total);
  if (p.employee_id || p.created_by) logActivity_(p.employee_id || p.created_by, p.company_id, p.branch_id, 'VENTE', `Vente ${saleNumber} (${items.length} article(s))`, total);
  /* P3: notification patron sur nouvelle vente employé */
  if (p.employee_id && p.company_id) {
    try { notifyBoss_(p.company_id, 'NEW_SALE', `Vente ${saleNumber}`, `${getEmployeeName_(p.employee_id)} a enregistré une vente de ${money(total || 0)}`, { employee_id: p.employee_id, employee_name: getEmployeeName_(p.employee_id), montant: total }); } catch (e) {}
  }
  if (p.client_email) sendInvoiceEmail_(sale, sheetToObjects_(CONFIG.SHEETS.SALE_ITEMS).filter(i => String(i.sale_id) === String(id)));
  logAudit_('CREATE_SALE', 'Ventes', id, p.created_by || '', `Vente ${saleNumber}`);
  /* P3: vérification stock bas après vente et notification patron */
  if (p.company_id && p.branch_id) {
    try {
      const lowStock = listStock_({ companyId: p.company_id, branchId: p.branch_id }).filter(s => parseFloat(s.quantity) <= parseFloat(s.min_threshold));
      // already notified above per sale, notify once per batch if any low stock found
    } catch(e){}
  }
  return { id, saleNumber, sale_number: saleNumber, total };
  } finally { lock.releaseLock(); }
}

/* P1: updateSale_ — vérifie que la vente appartient bien à l'entreprise de l'appelant */
/* P1/P4: updateSale_ — vérification + décrément stock sous verrou pour éviter la survente concurrente */
function updateSale_(p) {
  p = p || {};
  if (!p.id) throw new Error('id vente requis');
  const found = findRow_(CONFIG.SHEETS.SALES, 'id', p.id);
  if (!found) throw new Error('Vente introuvable');
  assertBelongsToCompany_(CONFIG.SHEETS.SALES, p.id, p.company_id);
  const col = k => found.header.findIndex(h => h.trim() === k);
  const branchId = String(found.row[col('branch_id')] || p.branch_id || '');
  const items = p.items || [];
  if (!items.length) throw new Error('Ajoutez au moins un produit.');
  const oldItems = sheetToObjects_(CONFIG.SHEETS.SALE_ITEMS).filter(i => String(i.sale_id) === String(p.id));
  oldItems.forEach(it => restoreStock_(branchId, it.product_id, Number(it.quantity) || 0));
  try {
    const grouped = {};
    items.forEach(it => { grouped[it.product_id] = (grouped[it.product_id] || 0) + Number(it.quantity || 0); });
    assertStockAvailable_(branchId, Object.keys(grouped).map(pid => ({ product_id: pid, quantity: grouped[pid] })));
  } catch (err) {
    oldItems.forEach(it => decrementStock_(branchId, it.product_id, Number(it.quantity) || 0));
    throw err;
  }
  const total = items.reduce((s, it) => s + (Number(it.unit_price) * Number(it.quantity)), 0);
  const lock2 = LockService.getScriptLock();
  lock2.tryLock(10000);
  try {
    updateRow_(CONFIG.SHEETS.SALES, p.id, { client_id: p.client_id || '', client_name: p.client_name || '', client_email: p.client_email || '', payment_method: p.payment_method || found.row[col('payment_method')], amount_paid: Number(p.amount_paid || total), total, subtotal: total, change_given: Math.max(0, Number(p.amount_paid || total) - total) });
    const sh = getSheet_(CONFIG.SHEETS.SALE_ITEMS); const rows = sh.getDataRange().getValues();
  if (rows.length >= 2) {
    const header = rows[0].map(String); const saleCol = header.findIndex(h => h.trim() === 'sale_id'); const toDelete = [];
    for (let i = 1; i < rows.length; i++) if (String(rows[i][saleCol]) === String(p.id)) toDelete.push(i + 1);
    toDelete.sort((a, b) => b - a).forEach(r => { try { sh.deleteRow(r); } catch (e) {} });
  }
  const productsRef = sheetToObjects_(CONFIG.SHEETS.PRODUCTS);
  items.forEach(it => {
    const prod = productsRef.find(pr => String(pr.id) === String(it.product_id));
    insertRow_(CONFIG.SHEETS.SALE_ITEMS, { id: uuid(), sale_id: p.id, product_id: it.product_id || '', name: it.name || '', unit: (prod && prod.unit) || it.unit || '', quantity: Number(it.quantity || 0), unit_price: Number(it.unit_price || 0), total_ligne: Number(it.quantity || 0) * Number(it.unit_price || 0) });
    if (branchId && it.product_id) decrementStock_(branchId, it.product_id, Number(it.quantity || 0));
  });
  logAudit_('UPDATE_SALE', 'Ventes', p.id, p.updated_by || '', `Vente ${found.row[col('sale_number')]}`);
  return { ok: true, id: p.id, total };
  } finally { if (lock2) lock2.releaseLock(); }
}

/* P5: listSales_ limite par défaut aux 90 derniers jours pour éviter la dégradation progressive des temps de réponse ; passer all=true pour désactiver la limite */
function listSales_(p) {
  p = p || {}; let sales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => String(s.company_id) === String(p.companyId || '') && s.statut !== 'cancelled');
  const clients = sheetToObjects_(CONFIG.SHEETS.CLIENTS);
  if (p.branchId) sales = sales.filter(s => String(s.branch_id) === String(p.branchId));
  if (!p.all) {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90); cutoff.setHours(0, 0, 0, 0);
    sales = sales.filter(s => new Date(s.created_at) >= cutoff);
  }
  if (p.filter === 'today' || p.filter === 'yesterday' || p.filter === 'dayBefore') {
    const offset = p.filter === 'yesterday' ? 1 : p.filter === 'dayBefore' ? 2 : 0;
    const target = new Date(); target.setHours(0, 0, 0, 0); target.setDate(target.getDate() - offset);
    const next = new Date(target); next.setDate(next.getDate() + 1);
    sales = sales.filter(s => { const d = new Date(s.created_at); return d >= target && d < next; });
  }
  if (p.search) { const needle = p.search.trim().toLowerCase(); sales = sales.filter(s => String(s.sale_number || '').toLowerCase().includes(needle) || String(s.client_name || '').toLowerCase().includes(needle)); }
  sales.forEach(s => { const c = clients.find(cl => String(cl.id) === String(s.client_id)); s.client = c ? { name: c.name } : { name: s.client_name || null }; });
  return sales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
function listSaleItems_() { return sheetToObjects_(CONFIG.SHEETS.SALE_ITEMS); }
/* P1: cancelSale_ — vérifie appartenance entreprise avant suppression */
function cancelSale_(p) {
  p = p || {}; const found = findRow_(CONFIG.SHEETS.SALES, 'id', p.id); if (!found) throw new Error('Vente introuvable');
  assertBelongsToCompany_(CONFIG.SHEETS.SALES, p.id, p.company_id);
  const col = k => found.header.findIndex(h => h.trim() === k); const branchId = found.row[col('branch_id')];
  sheetToObjects_(CONFIG.SHEETS.SALE_ITEMS).filter(i => String(i.sale_id) === String(p.id)).forEach(it => restoreStock_(branchId, it.product_id, Number(it.quantity) || 0));
  return updateRow_(CONFIG.SHEETS.SALES, p.id, { statut: 'cancelled' });
}


/* ═══════════════════════════════════════════════════════════════════
   §  DEVIS — avec token de signature publique + thème visuel
   ═══════════════════════════════════════════════════════════════════ */
function createQuote_(p) {
  p = p || {}; const id = uuid(); const now = new Date().toISOString();
  const items = p.items || []; if (!items.length) throw new Error('Ajoutez au moins un article.');
  const subtotal = items.reduce((s, it) => s + (Number(it.unit_price) * Number(it.quantity)), 0);
  const tvaRate = Number(p.tva_rate || 0); const tvaAmount = subtotal * tvaRate / 100; const total = subtotal + tvaAmount;
  const quoteNumber = (p.prefix || 'EF-') + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);
  let clientName = p.client_name || '', clientEmail = p.client_email || '', clientPhone = p.client_phone || '';
  if (p.client_id && !clientName) { const c = getClient_({ id: p.client_id }); if (c) { clientName = c.name; clientEmail = clientEmail || c.email || ''; clientPhone = clientPhone || c.phone || ''; } }

  const quote = { id, company_id: p.company_id || '', quote_number: quoteNumber, client_id: p.client_id || '', client_name: clientName || 'Client occasionnel', client_email: clientEmail, client_phone: clientPhone, total, tva_rate: tvaRate, tva_amount: tvaAmount, validite_jours: Number(p.validite_jours || 7), signature_data: '', signed_by: '', signed_at: '', sign_token: generateToken_(), theme_seed: id, statut: 'envoye', created_by: p.created_by || '', employee_id: p.employee_id || '', created_at: now };
  insertRow_(CONFIG.SHEETS.QUOTES, quote);
  const productsRef = sheetToObjects_(CONFIG.SHEETS.PRODUCTS);
  items.forEach(it => {
    const prod = productsRef.find(pr => String(pr.id) === String(it.product_id));
    insertRow_(CONFIG.SHEETS.QUOTE_ITEMS, { id: uuid(), quote_id: id, product_id: it.product_id || '', name: it.name || '', unit: (prod && prod.unit) || it.unit || '', quantity: Number(it.quantity || 0), unit_price: Number(it.unit_price || 0), total_ligne: Number(it.quantity || 0) * Number(it.unit_price || 0) });
  });
  if (p.employee_id || p.created_by) logActivity_(p.employee_id || p.created_by, p.company_id, '', 'DEVIS', `Devis ${quoteNumber} (${clientName})`, total);
  /* P3: notification patron sur nouveau devis employé */
  if (p.employee_id && p.company_id) {
    try { notifyBoss_(p.company_id, 'NEW_QUOTE', `Nouveau devis ${quoteNumber}`, `${getEmployeeName_(p.employee_id)} a créé un devis pour ${clientName || 'Client'} (${money(total)})`, { employee_id: p.employee_id, employee_name: getEmployeeName_(p.employee_id), montant: total }); } catch (e) {}
  }
  logAudit_('CREATE_QUOTE', 'Devis', id, p.created_by || '', quoteNumber);

  let signLinkSent = false;
  if (clientEmail) { try { sendQuoteSignLink_({ id }); signLinkSent = true; } catch (e) { console.error('sendQuoteSignLink_', e); } }

  return { id, quoteNumber, quote_number: quoteNumber, total, subtotal, tvaAmount, signLinkSent };
}
/* P5: listQuotes_ limite par défaut aux 90 derniers jours ; passer all=true pour désactiver */
function listQuotes_(p) { p = p || {}; let quotes = sheetToObjects_(CONFIG.SHEETS.QUOTES).filter(q => String(q.company_id) === String(p.companyId || '') && q.statut !== 'supprime'); if (!p.all) { const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90); cutoff.setHours(0, 0, 0, 0); quotes = quotes.filter(q => new Date(q.created_at) >= cutoff); } return quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); }
function getQuoteDetail_(p) {
  const found = findRow_(CONFIG.SHEETS.QUOTES, 'id', (p || {}).id || ''); if (!found) return null;
  const quote = rowToObject_(found); const items = sheetToObjects_(CONFIG.SHEETS.QUOTE_ITEMS).filter(i => String(i.quote_id) === String(quote.id));
  return { quote, items };
}
/* P1: deleteQuote_ — vérifie appartenance entreprise */
function deleteQuote_(p) { assertBelongsToCompany_(CONFIG.SHEETS.QUOTES, (p || {}).id, (p || {}).company_id); return updateRow_(CONFIG.SHEETS.QUOTES, (p || {}).id, { statut: 'supprime' }); }

/* P1: sendQuoteSignLink_ — vérifie appartenance entreprise */
function sendQuoteSignLink_(p) {
  assertBelongsToCompany_(CONFIG.SHEETS.QUOTES, (p || {}).id, (p || {}).company_id);
  const detail = getQuoteDetail_({ id: (p || {}).id });
  if (!detail) throw new Error('Devis introuvable');
  const { quote } = detail;
  if (!quote.client_email) throw new Error('Aucun email client renseigné pour ce devis.');
  const company = getCompanyById_(quote.company_id) || {};
  const signLink = getPortalUrl_() + '/sign.html?sign=' + quote.id + '&t=' + quote.sign_token;
  sendEmail_({
    to: quote.client_email,
    subject: `${company.name || CONFIG.APP_NAME} — Devis N° ${quote.quote_number} à valider`,
    html: buildEmail_QuoteSignLink({ clientNom: quote.client_name, quoteNumber: quote.quote_number, total: quote.total, validiteJours: quote.validite_jours, company, signLink })
  });
  logNotification_('QUOTE_SIGN_LINK', `Lien signature ${quote.quote_number}`, quote.client_email, quote.client_name, 'email', quote.company_id);
  return { ok: true, signLink };
}
/* P3: logNotification_ enregistre désormais company_id pour que les notifications soient visibles côté dashboard */
function logNotification_(type, titre, toEmail, toNom, canal, companyId) {
  try { insertRow_(CONFIG.SHEETS.NOTIFICATIONS, { id: uuid(), type, titre, destinataire_email: toEmail, destinataire_nom: toNom, canal, company_id: companyId || '', created_at: new Date().toISOString() }); } catch (e) {}
}

/**
 * Notification interne pour le boss — s'affiche dans son dashboard
 * (cloche + compteur de non-lues), indépendamment des emails. Ce
 * n'est PAS une notification push de téléphone (ça demanderait une
 * PWA + Firebase, hors-scope Apps Script) — c'est une notification
 * "en base", visible dès que le dashboard admin l'affiche ou se
 * rafraîchit automatiquement.
 */
function notifyBoss_(companyId, type, titre, message, extra) {
  extra = extra || {};
  try {
    insertRow_(CONFIG.SHEETS.NOTIFICATIONS, {
      id: uuid(), company_id: companyId || '', type, titre, message: message || '',
      employee_id: extra.employee_id || '', employee_name: extra.employee_name || '',
      montant: extra.montant || 0, lu: false, created_at: new Date().toISOString()
    });
  } catch (e) {}
}
function getEmployeeName_(employeeId) {
  if (!employeeId) return '';
  const emp = rowToObject_(findRow_(CONFIG.SHEETS.EMPLOYEES, 'id', employeeId));
  return emp ? emp.full_name : '';
}

/** Vue Boss uniquement — liste des notifications de l'entreprise + compteur de non-lues */
function listNotifications_(p) {
  p = p || {};
  const all = sheetToObjects_(CONFIG.SHEETS.NOTIFICATIONS).filter(n => String(n.company_id) === String(p.companyId || ''));
  let list = all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const unreadCount = all.filter(n => n.lu !== true && String(n.lu).toLowerCase() !== 'true').length;
  if (p.unreadOnly) list = list.filter(n => n.lu !== true && String(n.lu).toLowerCase() !== 'true');
  if (p.limit) list = list.slice(0, Number(p.limit));
  return { notifications: list, unread_count: unreadCount };
}

/** Marque une ou plusieurs notifications comme lues (ou toutes celles de l'entreprise si p.all) */
function markNotificationsRead_(p) {
  p = p || {};
  if (p.all) {
    const sh = getSheet_(CONFIG.SHEETS.NOTIFICATIONS);
    const rows = sh.getDataRange().getValues();
    if (rows.length < 2) return { ok: true };
    const header = rows[0].map(String);
    const colLu = header.findIndex(h => h.trim() === 'lu');
    const colCo = header.findIndex(h => h.trim() === 'company_id');
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][colCo]) === String(p.companyId || '')) sh.getRange(i + 1, colLu + 1).setValue(true);
    }
    return { ok: true };
  }
  (p.ids || []).forEach(id => updateRow_(CONFIG.SHEETS.NOTIFICATIONS, id, { lu: true }));
  return { ok: true };
}

function confirmQuoteSignature_(p) {
  p = p || {};
  const detail = getQuoteDetail_({ id: p.id });
  if (!detail) return { ok: false, error: 'Devis introuvable.' };
  const { quote } = detail;
  if (String(quote.sign_token) !== String(p.token || '')) return { ok: false, error: 'Lien de signature invalide.' };
  if (quote.statut === 'signe') return { ok: false, error: 'Ce devis a déjà été signé.' };
  if (!p.signerName || !String(p.signerName).trim()) return { ok: false, error: 'Nom du signataire requis.' };
  if (!p.signatureData) return { ok: false, error: 'Signature requise.' };

  const now = new Date().toISOString();
  updateRow_(CONFIG.SHEETS.QUOTES, quote.id, { signature_data: p.signatureData, signed_by: String(p.signerName).trim(), signed_at: now, statut: 'signe' });
  logAudit_('SIGN_QUOTE', 'Devis', quote.id, quote.client_email || '', `Signé par ${p.signerName}`);
  /* P3: notification patron sur devis signé */
  if (quote.employee_id && quote.company_id) {
    try { notifyBoss_(quote.company_id, 'QUOTE_SIGNED', `Devis ${quote.quote_number} signé`, `Le devis de ${quote.client_name || 'Client'} pour ${money(quote.total)} a été signé par ${p.signerName}`, { employee_id: quote.employee_id, employee_name: getEmployeeName_(quote.employee_id), montant: quote.total }); } catch (e) {}
  }
  // TODO P1: lien de signature permanent sans expiration — prévoir une date d'expiration plus tard si besoin.

  try {
    const updated = getQuoteDetail_({ id: quote.id }).quote;
    const company = getCompanyById_(quote.company_id) || {};
    const pdf = buildQuotePDFBlob_(updated, detail.items, company);
    if (updated.client_email) sendEmail_({ to: updated.client_email, subject: `${company.name || CONFIG.APP_NAME} — Devis N° ${updated.quote_number} approuvé`, html: buildEmail_QuoteApproved({ clientNom: updated.client_name, quoteNumber: updated.quote_number, total: updated.total, company }), attachments: [pdf] });
    if (company.email) sendEmail_({ to: company.email, subject: `Devis N° ${updated.quote_number} approuvé par ${updated.signed_by}`, html: buildEmail_QuoteApprovedNotifyOwner({ quoteNumber: updated.quote_number, clientNom: updated.client_name, signedBy: updated.signed_by, total: updated.total, company }), attachments: [pdf] });
  } catch (e) { console.error('post-signature email error', e); }

  return { ok: true };
}
/* P1: signQuote_ — vérifie appartenance entreprise */
function signQuote_(p) { p = p || {}; assertBelongsToCompany_(CONFIG.SHEETS.QUOTES, p.quoteId, p.company_id); return updateRow_(CONFIG.SHEETS.QUOTES, p.quoteId, { signature_data: p.signatureData || '', statut: 'signe' }); }

/* P1: generateQuotePDF_ — vérifie appartenance entreprise */
function generateQuotePDF_(p) {
  p = p || {};
  assertBelongsToCompany_(CONFIG.SHEETS.QUOTES, p.quoteId, p.company_id);
  const detail = getQuoteDetail_({ id: p.quoteId }); if (!detail) return { ok: false, error: 'Devis introuvable' };
  const { quote, items } = detail; const company = getCompanyById_(quote.company_id) || {};
  const pdf = buildQuotePDFBlob_(quote, items, company);
  let emailSent = false, whatsappLink = '';
  if (p.sendEmail && quote.client_email) {
    sendEmail_({ to: quote.client_email, subject: `${company.name || CONFIG.APP_NAME} — Devis N° ${quote.quote_number}`, html: buildEmail_Quote({ clientNom: quote.client_name, quoteNumber: quote.quote_number, total: quote.total, validiteJours: quote.validite_jours, company }), attachments: [pdf] });
    emailSent = true;
  }
  if (p.sendWhatsapp && quote.client_phone) {
    const phone = String(quote.client_phone).replace(/[^0-9+]/g, '');
    whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(`Bonjour ${quote.client_name}, voici votre devis N° ${quote.quote_number} d'un montant de ${fmtMoney(quote.total, company.currency)}.\nVérifiez votre email ET vos spams pour consulter et signer votre devis.\nMerci — ${company.name || CONFIG.APP_NAME}.`)}`;
  }
  return { ok: true, emailSent, whatsappLink };
}


/* ═══ HISTORIQUE REVENUS / AVIS / CONTACT / CORBEILLE ═══ */
function getRevenueHistory_(p) {
  p = p || {}; const monthsBack = Number(p.monthsBack || 12);
  const allSales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => String(s.company_id) === String(p.companyId || '') && s.statut === 'completed');
  const now = new Date();
  return Array.from({ length: monthsBack }, (_, i) => {
    let y = now.getFullYear(), m = now.getMonth() - i; while (m < 0) { m += 12; y--; }
    const { start, end } = getMonthRange_(y, m); const ms = allSales.filter(s => { const d = new Date(s.created_at); return d >= start && d < end; });
    return { year: y, month: m, label: start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), totalCA: ms.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0), salesCount: ms.length, isCurrent: y === now.getFullYear() && m === now.getMonth() };
  });
}
function getRevenueHistoryDetail_(p) {
  p = p || {}; const year = Number(p.year), month = Number(p.month); const { start, end } = getMonthRange_(year, month);
  const allSales = sheetToObjects_(CONFIG.SHEETS.SALES).filter(s => String(s.company_id) === String(p.companyId || '') && s.statut === 'completed');
  const ms = allSales.filter(s => { const d = new Date(s.created_at); return d >= start && d < end; });
  const weeks = {}; ms.forEach(s => { const wk = Math.ceil(new Date(s.created_at).getDate() / 7); if (!weeks[wk]) weeks[wk] = { week: wk, totalCA: 0, salesCount: 0 }; weeks[wk].totalCA += parseFloat(s.total) || 0; weeks[wk].salesCount++; });
  return { year, month, label: start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), totalCA: ms.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0), salesCount: ms.length, weeks: Object.values(weeks).sort((a, b) => a.week - b.week) };
}
function submitAvis_(p) { p = p || {}; const obj = { id: uuid(), company_id: p.companyId || '', user_email: p.email || '', note: Number(p.note || 0), commentaire: p.commentaire || '', categorie: p.categorie || 'general', statut: 'nouveau', reponse: '', created_at: new Date().toISOString() }; insertRow_(CONFIG.SHEETS.AVIS, obj); return obj; }
function listAvis_() { return sheetToObjects_(CONFIG.SHEETS.AVIS); }
function repondreAvis_(p) {
  p = p || {}; const r = updateRow_(CONFIG.SHEETS.AVIS, p.avisId, { statut: 'repondu', reponse: p.reponse || '' });
  const found = findRow_(CONFIG.SHEETS.AVIS, 'id', p.avisId);
  if (found) { const col = k => found.header.findIndex(h => h.trim() === k); const toEmail = found.row[col('user_email')]; if (toEmail) sendEmail_({ to: toEmail, subject: `${CONFIG.APP_NAME} — Réponse à votre avis`, html: buildEmail_ReponseAvis({ reponse: p.reponse || '' }) }); }
  return r;
}
function shouldShowAvisPrompt_(p) {
  p = p || {}; const found = findRow_(CONFIG.SHEETS.USERS, 'email', p.email || ''); if (!found) return { show: false };
  const col = k => found.header.findIndex(h => h.trim() === k);
  const daysSince = (Date.now() - new Date(found.row[col('created_at')]).getTime()) / 86400000;
  const existing = sheetToObjects_(CONFIG.SHEETS.AVIS).find(a => a.user_email === p.email);
  return { show: daysSince >= 7 && !existing };
}
/* P1: contactAdmin_ — échappement du message avant envoi email pour prévenir XSS */
function contactAdmin_(p) { p = p || {}; const safeEmail = escapeHtml_(p.email || ''); const safeSubject = escapeHtml_(p.subject || ''); const safeMsg = escapeHtml_(p.message || ''); sendEmail_({ to: CONFIG.SUPPORT_EMAIL, subject: `[EntreFlow] Message de ${safeEmail}`, html: `<p><b>De :</b> ${safeEmail}</p><p><b>Sujet :</b> ${safeSubject}</p><p>${safeMsg}</p>` }); return { ok: true }; }
function listTrash_() {
  const items = [];
  [[CONFIG.SHEETS.QUOTES, q => q.statut === 'supprime', 'Devis', q => q.quote_number || 'Sans N°'], [CONFIG.SHEETS.SALES, s => s.statut === 'cancelled', 'Vente', s => s.sale_number || 'Sans N°'], [CONFIG.SHEETS.CLIENTS, c => c.statut === 'inactif', 'Client', c => c.name], [CONFIG.SHEETS.PRODUCTS, p => p.statut === 'inactif', 'Produit', p => p.name], [CONFIG.SHEETS.EMPLOYEES, e => e.statut === 'inactif', 'Employe', e => e.full_name]]
    .forEach(([sheet, filter, type, getName]) => { sheetToObjects_(sheet).filter(filter).forEach(x => items.push({ type, id: x.id, name: getName(x) || '—', date: x.updated_at || x.created_at })); });
  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}
function restoreTrashItem_(p) {
  p = p || {}; const map = { 'Devis': [CONFIG.SHEETS.QUOTES, 'envoye'], 'Vente': [CONFIG.SHEETS.SALES, 'completed'], 'Client': [CONFIG.SHEETS.CLIENTS, 'actif'], 'Produit': [CONFIG.SHEETS.PRODUCTS, 'actif'], 'Employe': [CONFIG.SHEETS.EMPLOYEES, 'actif'] };
  const entry = map[p.type]; if (!entry) return { ok: false, error: 'Type inconnu' }; return updateRow_(entry[0], p.id, { statut: entry[1] });
}


/* ═══════════════════════════════════════════════════════════════════
   §  THÈMES VISUELS — devis/factures jamais identiques
   ═══════════════════════════════════════════════════════════════════ */
const DOC_THEMES = [
  { name: 'Bleu Corporate', primary: '#1D4ED8', primaryDark: '#1E3A8A', soft: '#EFF6FF', border: '#BFDBFE' },
  { name: 'Bleu Nuit',      primary: '#0F172A', primaryDark: '#020617', soft: '#F1F5F9', border: '#CBD5E1' },
  { name: 'Violet Royal',   primary: '#6D28D9', primaryDark: '#4C1D95', soft: '#F5F3FF', border: '#DDD6FE' },
  { name: 'Émeraude',       primary: '#047857', primaryDark: '#065F46', soft: '#ECFDF5', border: '#A7F3D0' },
  { name: 'Noir & Or',      primary: '#111827', primaryDark: '#000000', soft: '#FFFBEB', border: '#FDE68A' },
  { name: 'Bordeaux',       primary: '#9F1239', primaryDark: '#701A2E', soft: '#FFF1F2', border: '#FECDD3' }
];
function pickTheme_(seed) {
  const s = String(seed || 'x');
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return DOC_THEMES[h % DOC_THEMES.length];
}
function _watermarkCSS_(text, theme) {
  const t = (text || 'ENTREFLOW').toUpperCase();
  return `<div style="position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none;">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);width:1000px;text-align:center;font-family:Arial,sans-serif;font-weight:900;font-size:50px;letter-spacing:5px;color:${theme.primary};opacity:0.045;line-height:1.7;white-space:nowrap;">${t}<br>${t}<br>${t}</div></div>`;
}


/* ═══════════════════════════════════════════════════════════════════
   §  BLOCS RÉUTILISABLES DU NOUVEAU GABARIT DE DOCUMENT
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Sigle EntreFlow (marque du SaaS, distincte du logo de l'entreprise
 * cliente). Utilise le vrai logo si CONFIG.ENTREFLOW_LOGO_BASE64 est
 * renseigné (coller ici le contenu du fichier "logoEntre"), sinon un
 * sigle "E" stylisé en secours.
 */
function _entreflowMark_(size) {
  const s = size || 30;
  if (CONFIG.ENTREFLOW_LOGO_BASE64) {
    return `<img src="${CONFIG.ENTREFLOW_LOGO_BASE64}" style="height:${s}px;vertical-align:middle;">
      <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-family:Arial,sans-serif;font-weight:800;font-size:${Math.round(s*0.66)}px;color:#0F172A;">Entre<span style="color:#2563EB;">Flow</span></span>`;
  }
  return `<span style="display:inline-block;width:${s}px;height:${s}px;border-radius:9px;background:linear-gradient(135deg,#1D4ED8,#60A5FA);vertical-align:middle;position:relative;">
      <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-family:Arial,sans-serif;font-size:${Math.round(s*0.5)}px;">E</span>
    </span>
    <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-family:Arial,sans-serif;font-weight:800;font-size:${Math.round(s*0.66)}px;color:#0F172A;">Entre<span style="color:#2563EB;">Flow</span></span>`;
}

/** Logo de l'entreprise (réel si fourni, sinon badge à l'initiale) */
function _companyLogo_(company, size) {
  const sz = size || 46;
  if (company.logo_data) return `<img src="${company.logo_data}" style="height:${sz}px;max-width:150px;object-fit:contain;border-radius:8px;">`;
  const initial = (company.name || 'E').trim()[0].toUpperCase();
  return `<div style="width:${sz}px;height:${sz}px;border-radius:10px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:${Math.round(sz*0.42)}px;font-family:Arial,sans-serif;">${initial}</div>`;
}

/** Bande d'accent tout en haut du document (couleur du thème) */
function _accentBar_(theme) {
  return `<div style="height:6px;background:${theme.primary};border-radius:0 0 3px 3px;margin-bottom:26px;"></div>`;
}

/** En-tête : marque EntreFlow + tagline à gauche, gros titre du document + numéro à droite */
function _docHeader_(theme, docType, docNumber, extraBadgeHtml) {
  return `<table width="100%" style="position:relative;z-index:1;margin-bottom:22px;">
    <tr>
      <td style="vertical-align:top;">
        ${_entreflowMark_(30)}
        <p style="font-size:10.5px;color:#94A3B8;margin:5px 0 0 2px;font-family:Arial,sans-serif;">${CONFIG.APP_TAGLINE}</p>
      </td>
      <td style="vertical-align:top;text-align:right;">
        <p style="font-size:32px;font-weight:900;color:${theme.primary};margin:0;letter-spacing:1px;font-family:Arial,sans-serif;">${docType}</p>
        <div style="display:inline-block;background:${theme.soft};border:1px solid ${theme.border};color:${theme.primary};font-weight:700;font-size:12px;padding:5px 14px;border-radius:8px;margin-top:8px;">N° ${docNumber}</div>
        ${extraBadgeHtml || ''}
      </td>
    </tr>
  </table>`;
}

/** Petite ligne d'info avec libellé discret au-dessus de la valeur */
function _infoLine_(label, value) {
  if (!value) return '';
  return `<p style="font-size:12px;color:#334155;margin:3px 0;"><span style="color:#94A3B8;">${label} :</span> ${value}</p>`;
}

/** Bloc "Émetteur" — logo entreprise + coordonnées réelles de l'entreprise */
function _emitterBox_(company) {
  return `<div style="background:#F8FAFC;border:1px solid #E5E9F0;border-radius:12px;padding:18px 20px;height:100%;">
    <p style="font-size:9.5px;color:#94A3B8;text-transform:uppercase;letter-spacing:.07em;font-weight:800;margin:0 0 12px;">Émetteur</p>
    <div style="margin-bottom:10px;">${_companyLogo_(company, 40)}</div>
    <p style="font-size:15px;font-weight:800;color:#0F172A;margin:0 0 8px;">${company.name || CONFIG.APP_NAME}</p>
    ${_infoLine_('Adresse', company.address)}
    ${_infoLine_('Téléphone', company.phone)}
    ${_infoLine_('Email', company.email)}
    ${_infoLine_('NIF', company.tax_id)}
    ${_infoLine_('RCCM', company.rccm)}
  </div>`;
}

/** Bloc méta (dates, référence…) — colonne de droite miroir du bloc émetteur */
function _metaBox_(rows) {
  const lines = (rows || []).filter(r => r.value).map(r => `
    <tr><td style="padding:5px 0;font-size:11.5px;color:#94A3B8;">${r.label}</td><td style="padding:5px 0;font-size:12.5px;color:#0F172A;font-weight:700;text-align:right;">${r.value}</td></tr>`).join('');
  return `<div style="background:#F8FAFC;border:1px solid #E5E9F0;border-radius:12px;padding:18px 20px;height:100%;">
    <p style="font-size:9.5px;color:#94A3B8;text-transform:uppercase;letter-spacing:.07em;font-weight:800;margin:0 0 12px;">Détails du document</p>
    <table width="100%" style="border-collapse:collapse;">${lines}</table>
  </div>`;
}

/** Bloc "Facturé/Adressé à" — informations client réelles uniquement */
function _clientBox_(label, name, email, phone) {
  return `<div style="background:${'#fff'};border:1.5px solid #E5E9F0;border-radius:12px;padding:18px 20px;height:100%;">
    <p style="font-size:9.5px;color:#94A3B8;text-transform:uppercase;letter-spacing:.07em;font-weight:800;margin:0 0 10px;">${label}</p>
    <p style="font-size:15px;font-weight:800;color:#0F172A;margin:0 0 6px;">${name || 'Client'}</p>
    ${_infoLine_('Email', email)}
    ${_infoLine_('Téléphone', phone)}
  </div>`;
}

/** Tableau des articles (désignation, unité, qté, prix, total) */
function _itemsTable_(items, theme, money) {
  const rows = (items || []).map((it, i) => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;color:#94A3B8;font-size:12px;">${i + 1}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;color:#0F172A;font-size:13px;font-weight:600;">${it.name}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;text-align:center;color:#64748B;font-size:12.5px;">${it.unit || '—'}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;text-align:center;color:#64748B;font-size:13px;">${it.quantity}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;text-align:right;color:#64748B;font-size:13px;">${money(it.unit_price)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #EEF1F6;text-align:right;font-weight:700;color:#0F172A;font-size:13px;">${money(it.total_ligne)}</td>
    </tr>`).join('');
  return `<table width="100%" style="border-collapse:collapse;position:relative;z-index:1;">
    <thead><tr style="background:${theme.primary};">
      <th style="padding:11px 14px;text-align:left;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;border-radius:8px 0 0 8px;width:26px;">#</th>
      <th style="padding:11px 14px;text-align:left;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;">Désignation</th>
      <th style="padding:11px 14px;text-align:center;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;">Unité</th>
      <th style="padding:11px 14px;text-align:center;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;">Qté</th>
      <th style="padding:11px 14px;text-align:right;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;">Prix unit.</th>
      <th style="padding:11px 14px;text-align:right;font-size:9.5px;color:#fff;text-transform:uppercase;letter-spacing:.05em;border-radius:0 8px 8px 0;">Total</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

/** Encart des totaux, avec la ligne finale mise en valeur (bandeau coloré) */
function _totalsBox_(theme, rowsHtml, finalLabel, finalValue) {
  return `<table width="100%" style="margin-top:18px;position:relative;z-index:1;"><tr><td width="54%"></td><td>
    <table width="100%" style="border-collapse:collapse;">${rowsHtml}</table>
    <table width="100%" style="background:${theme.primary};border-radius:10px;margin-top:10px;"><tr>
      <td style="padding:13px 18px;font-size:13.5px;color:#fff;font-weight:700;">${finalLabel}</td>
      <td style="padding:13px 18px;text-align:right;font-size:20px;color:#fff;font-weight:900;">${finalValue}</td>
    </tr></table>
  </td></tr></table>`;
}

/** Pied de page coloré — coordonnées entreprise + mention EntreFlow (pas de QR, pas d'images tierces) */
function _footerBlock_(theme, company) {
  const contactLine = [company.address, company.phone, company.email].filter(Boolean).join('   ·   ');
  return `<div style="position:relative;z-index:1;margin-top:34px;">
    ${contactLine ? `<p style="text-align:center;font-size:10.5px;color:#94A3B8;margin:0 0 14px;">${contactLine}</p>` : ''}
    <div style="background:${theme.primary};border-radius:10px;padding:14px 20px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#fff;font-weight:700;">Merci pour votre confiance.</p>
      <p style="margin:3px 0 0;font-size:10px;color:rgba(255,255,255,.8);">Document généré automatiquement par EntreFlow — ${company.name || ''}</p>
    </div>
  </div>`;
}


/* ═══════════════════════════════════════════════════════════════════
   §  DEVIS — gabarit final
   ═══════════════════════════════════════════════════════════════════ */
/* P1: buildQuoteHTML_ — toutes les variables injectées dans le HTML sont échappées */
function buildQuoteHTML_(quote, items, company) {
  const theme = pickTheme_(quote.theme_seed || quote.id);
  const currency = company.currency || 'F CFA';
  const money = v => fmtMoney(v, currency);
  const safeQuoteNumber = escapeHtml_(quote.quote_number);
  const safeClientName = escapeHtml_(quote.client_name || 'Client occasionnel');
  const isSigned = quote.statut === 'signe' && quote.signature_data;
  const dueDate = fmtDate(addDays_(quote.created_at, Number(quote.validite_jours || 7)));

  const statusBadge = isSigned
    ? `<div style="display:inline-block;background:#ECFDF5;border:1.5px solid #A7F3D0;color:#16A34A;font-weight:800;font-size:11px;padding:5px 14px;border-radius:8px;margin-top:8px;margin-left:8px;">✓ APPROUVÉ</div>`
    : `<div style="display:inline-block;background:${theme.soft};border:1px solid ${theme.border};color:${theme.primary};font-weight:700;font-size:11px;padding:5px 14px;border-radius:8px;margin-top:8px;margin-left:8px;">EN ATTENTE DE SIGNATURE</div>`;

  const totalsRows = quote.tva_rate > 0 ? `
    <tr><td style="padding:6px 0;font-size:13px;color:#64748B;">Sous-total</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#0F172A;font-weight:600;">${money(quote.total - quote.tva_amount)}</td></tr>
    <tr><td style="padding:6px 0;font-size:13px;color:#64748B;">TVA (${quote.tva_rate}%)</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#0F172A;font-weight:600;">${money(quote.tva_amount)}</td></tr>` : '';

  const signatureBlock = isSigned ? `
    <table width="100%" style="margin-top:26px;position:relative;z-index:1;"><tr><td style="width:55%;"></td><td style="text-align:right;">
      <p style="font-size:9.5px;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px;font-weight:700;">Signé électroniquement par</p>
      <img src="${quote.signature_data}" style="height:52px;display:block;margin-left:auto;">
      <p style="font-size:13px;font-weight:700;color:#0F172A;margin:6px 0 0;">${quote.signed_by || ''}</p>
      <p style="font-size:11px;color:#94A3B8;margin:2px 0 0;">${fmtDateTime(quote.signed_at)}</p>
    </td></tr></table>` : `
    <div style="position:relative;z-index:1;margin-top:26px;background:${theme.soft};border:1px dashed ${theme.border};border-radius:10px;padding:14px 18px;">
      <p style="font-size:12px;color:${theme.primaryDark};margin:0;">Ce devis est valable jusqu'au <b>${dueDate}</b>. Un lien de signature électronique sécurisé a été transmis au client par email.</p>
    </div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;margin:0;padding:0;background:#fff;">
<div style="max-width:760px;margin:0 auto;padding:38px 46px;position:relative;">
  ${_watermarkCSS_(company.name || 'ENTREFLOW', theme)}
  ${_accentBar_(theme)}
  ${_docHeader_(theme, 'DEVIS', quote.quote_number, statusBadge)}

  <table width="100%" style="position:relative;z-index:1;margin-bottom:16px;"><tr>
    <td style="width:49%;vertical-align:top;">${_emitterBox_(company)}</td>
    <td style="width:2%;"></td>
    <td style="width:49%;vertical-align:top;">${_metaBox_([
      { label: "Date d'émission", value: fmtDate(quote.created_at) },
      { label: 'Valable jusqu\'au', value: dueDate },
      { label: 'Devise', value: currency },
      { label: 'Statut', value: isSigned ? 'Approuvé' : 'En attente' }
    ])}</td>
  </tr></table>

  <div style="position:relative;z-index:1;margin-bottom:20px;">${_clientBox_('Adressé à', quote.client_name, quote.client_email, quote.client_phone)}</div>

  ${_itemsTable_(items, theme, money)}
  ${_totalsBox_(theme, totalsRows, 'TOTAL DU DEVIS', money(quote.total))}
  ${signatureBlock}
  ${_footerBlock_(theme, company)}
</div>
</body></html>`;
}
function buildQuotePDFBlob_(quote, items, company) {
  const html = buildQuoteHTML_(quote, items, company);
  return Utilities.newBlob(html, 'text/html', 'devis.html').getAs('application/pdf').setName('Devis_' + quote.quote_number + '.pdf');
}


/* ═══════════════════════════════════════════════════════════════════
   §  FACTURE — gabarit final (simple, épurée, tampon PAYÉ)
   ═══════════════════════════════════════════════════════════════════ */
/* P1: buildInvoiceHTML_ — données client échappées pour prévenir XSS */
function buildInvoiceHTML_(sale, items, company) {
  const theme = pickTheme_(sale.sale_number || sale.id);
  const currency = company.currency || 'F CFA';
  const money = v => fmtMoney(v, currency);
  const hasClient = sale.client_name && sale.client_name !== 'Sans nom';
  const safeSaleNumber = escapeHtml_(sale.sale_number);

  const paidBadge = `<div style="display:inline-block;background:#ECFDF5;border:1.5px solid #A7F3D0;color:#16A34A;font-weight:800;font-size:11px;padding:5px 14px;border-radius:8px;margin-top:8px;margin-left:8px;">✓ PAYÉE</div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#0F172A;margin:0;padding:0;background:#fff;">
<div style="max-width:760px;margin:0 auto;padding:38px 46px;position:relative;">
  ${_watermarkCSS_(company.name || 'ENTREFLOW', theme)}
  <div style="position:absolute;top:150px;right:46px;border:4px solid #16A34A;color:#16A34A;font-weight:900;font-size:26px;padding:7px 22px;border-radius:10px;transform:rotate(-8deg);opacity:.85;letter-spacing:2px;z-index:2;">PAYÉ</div>
  ${_accentBar_(theme)}
  ${_docHeader_(theme, 'FACTURE', sale.sale_number, paidBadge)}

  <table width="100%" style="position:relative;z-index:1;margin-bottom:16px;"><tr>
    <td style="width:49%;vertical-align:top;">${_emitterBox_(company)}</td>
    <td style="width:2%;"></td>
    <td style="width:49%;vertical-align:top;">${_metaBox_([
      { label: "Date d'émission", value: fmtDate(sale.created_at) },
      { label: 'Devise', value: currency },
      { label: 'Statut', value: 'Payée' }
    ])}</td>
  </tr></table>

  ${hasClient ? `<div style="position:relative;z-index:1;margin-bottom:20px;">${_clientBox_('Facturé à', sale.client_name, sale.client_email, '')}</div>` : ''}

  ${_itemsTable_(items, theme, money)}
  ${_totalsBox_(theme, '', 'MONTANT TOTAL PAYÉ', money(sale.total))}
  ${_footerBlock_(theme, company)}
</div>
</body></html>`;
}
function sendInvoiceEmail_(sale, items) {
  try {
    const company = getCompanyById_(sale.company_id) || {};
    const html = buildInvoiceHTML_(sale, items, company);
    const pdf = Utilities.newBlob(html, 'text/html').getAs('application/pdf').setName('Facture_' + sale.sale_number + '.pdf');
    sendEmail_({ to: sale.client_email, subject: `${company.name || CONFIG.APP_NAME} — Facture N° ${sale.sale_number}`, html: buildEmail_SaleConfirmation({ clientNom: sale.client_name || 'Client', saleNumber: sale.sale_number, total: sale.total, company }), attachments: [pdf] });
  } catch (e) { console.error('sendInvoiceEmail_', e); }
}


/* ═══════════════════════════════════════════════════════════════════
   §  EMAIL — wrapper + templates
   ═══════════════════════════════════════════════════════════════════ */
function sendEmail_(p) {
  try { const opts = { to: p.to, subject: p.subject, htmlBody: p.html, name: CONFIG.SENDER_NAME, replyTo: CONFIG.SUPPORT_EMAIL }; if (p.attachments && p.attachments.length) opts.attachments = p.attachments; MailApp.sendEmail(opts); } catch (e) { console.error('sendEmail_', e); }
}
function _emailHeaderBlock_(company) {
  const co = company || {};
  if (co.logo_data) return `<img src="${co.logo_data}" style="height:36px;max-width:140px;object-fit:contain;border-radius:7px;display:block;">`;
  if (CONFIG.ENTREFLOW_LOGO_BASE64) return `<img src="${CONFIG.ENTREFLOW_LOGO_BASE64}" style="height:36px;max-width:140px;object-fit:contain;border-radius:7px;display:block;">`;
  return `<p style="font-size:22px;font-weight:900;color:#fff;margin:0;letter-spacing:-.5px;">${co.name || CONFIG.APP_NAME}</p>`;
}
/* P1: _emailWrap_ échappe systématiquement les textes dynamiques pour prévenir XSS */
function _emailWrap_(icon, headerText, body, company) {
  const co = company || {};
  const safeIcon = escapeHtml_(icon);
  const safeHeader = escapeHtml_(headerText);
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#EEF2FF;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2FF;padding:32px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:18px 18px 0 0;padding:26px 30px;">
    ${_emailHeaderBlock_(co)}
    <p style="font-size:13px;color:rgba(255,255,255,.88);margin:10px 0 0;">${icon} ${headerText}</p>
  </td></tr>
  <tr><td style="background:#fff;padding:32px;border:1px solid #E2E8F0;">${body}</td></tr>
  <tr><td style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:0 0 18px 18px;padding:18px 30px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#94A3B8;">${co.name ? co.name + ' · ' : ''}Propulsé par ${CONFIG.APP_NAME} — Africa Golden Digital, Cotonou, Bénin</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
function buildEmail_Welcome(p) {
  return _emailWrap_('✓', 'Votre espace professionnel est activé', `
    <h1 style="font-size:21px;font-weight:800;margin:0 0 8px;color:#0F172A;">Bienvenue, ${p.prenom || ''} !</h1>
    <p style="color:#64748B;margin:0 0 20px;font-size:14px;line-height:1.6;">Votre compte ${CONFIG.APP_NAME} est prêt.</p>
    <table width="100%" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;"><tr><td style="padding:16px 20px;">
      <p style="margin:6px 0;font-size:13px;color:#0F172A;"><b>Email :</b> ${p.email}</p>
      <p style="margin:6px 0;font-size:13px;color:#0F172A;"><b>Mot de passe :</b> <code style="background:#DBEAFE;color:#1D4ED8;padding:3px 9px;border-radius:6px;font-weight:700;">${p.password}</code></p>
    </td></tr></table>
    <p style="text-align:center;margin-top:24px;"><a href="${CONFIG.APP_URL}" style="background:#1D4ED8;color:#fff;padding:13px 30px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;">Accéder à mon espace</a></p>`);
}
function buildEmail_ResetPassword(p) {
  return _emailWrap_('🔒', 'Réinitialisation de mot de passe', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Nouveau mot de passe, ${p.prenom || ''}</h1>
    <table width="100%" style="background:#EFF6FF;border-radius:12px;"><tr><td style="padding:18px;text-align:center;"><code style="background:#DBEAFE;padding:7px 18px;border-radius:8px;font-size:18px;font-weight:700;color:#1D4ED8;">${p.tmp}</code></td></tr></table>`);
}
function buildEmail_EmployeeWelcome(p) {
  const co = p.company || {};
  return _emailWrap_('👋', `Bienvenue dans l'équipe`, `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Bonjour ${p.nom || ''} !</h1>
    <p style="color:#64748B;margin:0 0 16px;font-size:14px;">Vous avez été ajouté(e) à l'équipe de <b>${co.name || "l'entreprise"}</b> en tant que <b>${p.poste || 'employé(e)'}</b>.</p>
    <table width="100%" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;margin-bottom:16px;"><tr><td style="padding:18px 20px;text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.08em;font-weight:800;">Votre code d'accès personnel</p>
      <p style="margin:0;font-size:30px;font-weight:900;letter-spacing:8px;color:#1D4ED8;font-family:Arial,sans-serif;">${p.code}</p>
    </td></tr></table>
    <table width="100%" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:20px;"><tr><td style="padding:16px 18px;">
      <p style="margin:7px 0;font-size:13px;color:#0F172A;">📦 Stock disponible en temps réel</p>
      <p style="margin:7px 0;font-size:13px;color:#0F172A;">💰 Enregistrement de vos ventes</p>
      <p style="margin:7px 0;font-size:13px;color:#0F172A;">📄 Création de devis</p>
      <p style="margin:7px 0;font-size:13px;color:#0F172A;">👥 Carnet clients</p>
    </td></tr></table>
    <p style="text-align:center;"><a href="${p.loginLink}" style="background:#1D4ED8;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;">Me connecter avec mon code</a></p>
    <p style="font-size:11px;color:#94A3B8;text-align:center;margin-top:14px;">Ce code est personnel et confidentiel — ne le partagez avec personne.</p>`, co);
}
function buildEmail_SaleConfirmation(p) {
  const co = p.company || {};
  return _emailWrap_('🧾', 'Votre facture', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 6px;color:#0F172A;">Merci pour votre achat, ${p.clientNom} !</h1>
    <p style="color:#64748B;margin:0 0 18px;font-size:13px;">Facture N° ${p.saleNumber} — le document PDF est joint à cet email.</p>
    <p style="font-size:21px;font-weight:900;color:#1D4ED8;">Total : ${fmtMoney(p.total, co.currency)}</p>`, co);
}
function buildEmail_Quote(p) {
  const co = p.company || {};
  return _emailWrap_('📋', 'Votre devis', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 6px;color:#0F172A;">Bonjour ${p.clientNom},</h1>
    <p style="color:#64748B;margin:0 0 18px;font-size:13px;">Devis N° ${p.quoteNumber}, valable ${p.validiteJours} jours — PDF joint.</p>
    <p style="font-size:21px;font-weight:900;color:#1D4ED8;">Total : ${fmtMoney(p.total, co.currency)}</p>`, co);
}
function buildEmail_QuoteSignLink(p) {
  const co = p.company || {};
  return _emailWrap_('✍️', 'Un devis attend votre validation', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Bonjour ${p.clientNom},</h1>
    <p style="color:#64748B;margin:0 0 16px;font-size:14px;line-height:1.6;">${co.name || CONFIG.APP_NAME} vous a envoyé le devis N° <b>${p.quoteNumber}</b> d'un montant de <b>${fmtMoney(p.total, co.currency)}</b>, valable ${p.validiteJours} jours.</p>
    <p style="color:#64748B;margin:0 0 22px;font-size:14px;">Cliquez sur le bouton ci-dessous pour consulter le devis et le signer électroniquement en ligne.</p>
    <p style="text-align:center;"><a href="${p.signLink}" style="background:#1D4ED8;color:#fff;padding:14px 34px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;">Consulter et signer le devis</a></p>
    <p style="font-size:11px;color:#94A3B8;text-align:center;margin-top:16px;">Ce lien est personnel et sécurisé.</p>`, co);
}
function buildEmail_QuoteApproved(p) {
  const co = p.company || {};
  return _emailWrap_('✅', 'Devis approuvé', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Merci, ${p.clientNom} !</h1>
    <p style="color:#64748B;margin:0 0 18px;font-size:14px;">Votre signature du devis N° ${p.quoteNumber} a bien été enregistrée. Une copie PDF signée est jointe à cet email.</p>
    <p style="font-size:21px;font-weight:900;color:#1D4ED8;">Total : ${fmtMoney(p.total, co.currency)}</p>`, co);
}
function buildEmail_QuoteApprovedNotifyOwner(p) {
  const co = p.company || {};
  return _emailWrap_('✅', 'Un devis vient d\'être approuvé', `
    <h1 style="font-size:19px;font-weight:800;margin:0 0 8px;color:#0F172A;">Bonne nouvelle !</h1>
    <p style="color:#64748B;margin:0 0 8px;font-size:14px;">Le devis N° <b>${p.quoteNumber}</b> a été signé par <b>${p.signedBy}</b> (${p.clientNom}).</p>
    <p style="font-size:21px;font-weight:900;color:#1D4ED8;">Total : ${fmtMoney(p.total, co.currency)}</p>`, co);
}
function buildEmail_ReponseAvis(p) {
  return _emailWrap_('💬', 'Réponse à votre avis', `<h1 style="font-size:18px;font-weight:800;margin:0 0 12px;color:#0F172A;">Merci pour votre retour !</h1><div style="background:#F8FAFC;border-radius:10px;padding:16px;font-size:14px;color:#0F172A;">${p.reponse}</div>`);
}


/* ═══════════════════════════════════════════════════════════════════
   §  PAGE PUBLIQUE DE SIGNATURE — servie via doGet(?sign=&t=)
   ═══════════════════════════════════════════════════════════════════ */
/* P1: buildSignPageHTML_ — échappement des données du devis dans la page de signature publique */
function buildSignPageHTML_(quote, items, company) {
  const theme = pickTheme_(quote.theme_seed || quote.id);
  const currency = company.currency || 'F CFA';
  const money = v => Number(v || 0).toLocaleString('fr-FR') + ' ' + currency;
  const alreadySigned = quote.statut === 'signe';
  const safeQuoteNumber = escapeHtml_(quote.quote_number);
  const safeClientName = escapeHtml_(quote.client_name || 'Client');

  const rows = (items || []).map(it => `
    <tr><td style="padding:9px 10px;border-bottom:1px solid #EEF1F6;font-size:13px;">${it.name}</td>
    <td style="padding:9px 10px;border-bottom:1px solid #EEF1F6;text-align:center;font-size:13px;color:#64748B;">${it.quantity}</td>
    <td style="padding:9px 10px;border-bottom:1px solid #EEF1F6;text-align:right;font-size:13px;font-weight:600;">${money(it.total_ligne)}</td></tr>`).join('');

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Devis ${quote.quote_number} — Signature</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#F1F5F9;color:#0F172A;font-family:'DM Sans',sans-serif;font-size:14px;padding:20px;}
.wrap{max-width:640px;margin:0 auto;}
.card{background:#fff;border-radius:16px;padding:28px;margin-bottom:16px;box-shadow:0 6px 24px rgba(15,23,42,.06);}
h1{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${theme.primary};}
.badge{display:inline-block;padding:5px 14px;border-radius:999px;font-size:12px;font-weight:700;margin-top:8px;}
.badge-pending{background:${theme.soft};color:${theme.primary};border:1px solid ${theme.border};}
.badge-signed{background:#ECFDF5;color:#16A34A;border:1px solid #A7F3D0;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:8px 10px;font-size:10px;color:#94A3B8;text-transform:uppercase;border-bottom:2px solid ${theme.primary};}
.total-row{display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:14px;border-top:2px solid ${theme.primary};}
.total-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:${theme.primary};}
.fg{margin-bottom:14px;}
.fg label{display:block;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
.fg input{width:100%;padding:11px 14px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;}
.fg input:focus{border-color:${theme.primary};}
#sigPad{border:2px dashed #CBD5E1;border-radius:12px;width:100%;height:150px;touch-action:none;cursor:crosshair;background:#FAFBFC;}
.btn{width:100%;padding:15px;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:14px;}
.btn-primary{background:${theme.primary};color:#fff;}
.btn-outline{background:#F1F5F9;color:#475569;margin-top:8px;}
.msg{padding:12px 16px;border-radius:10px;font-size:13px;margin-top:12px;display:none;}
.msg-error{background:#FEF2F2;color:#B91C1C;border:1px solid #FECACA;}
.msg-success{background:#ECFDF5;color:#15803D;border:1px solid #A7F3D0;}
.footer{text-align:center;font-size:11px;color:#94A3B8;margin-top:20px;}
</style></head>
<body>
<div class="wrap">
  <div class="card">
    <h1>Devis N° ${quote.quote_number}</h1>
    <div class="badge ${alreadySigned ? 'badge-signed' : 'badge-pending'}">${alreadySigned ? '✓ Déjà approuvé' : 'En attente de votre validation'}</div>
    <p style="color:#64748B;font-size:13px;margin-top:14px;">Émis par <b>${company.name || CONFIG.APP_NAME}</b> le ${fmtDate(quote.created_at)}</p>
    <table style="margin-top:18px;"><thead><tr><th>Article</th><th style="text-align:center;">Qté</th><th style="text-align:right;">Total</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="total-row"><span style="color:#64748B;font-size:13px;">Montant total</span><span class="total-val">${money(quote.total)}</span></div>
  </div>

  ${alreadySigned ? `
  <div class="card" style="text-align:center;">
    <p style="font-size:15px;color:#16A34A;font-weight:700;">✓ Ce devis a déjà été signé par ${quote.signed_by} le ${fmtDate(quote.signed_at)}.</p>
  </div>` : `
  <div class="card">
    <h1 style="font-size:16px;">Signer ce devis</h1>
    <p style="color:#64748B;font-size:12.5px;margin:6px 0 18px;">En signant, vous confirmez votre accord avec les termes de ce devis.</p>
    <div class="fg"><label>Votre nom complet *</label><input type="text" id="signerName" placeholder="Nom et prénom"></div>
    <div class="fg">
      <label>Votre signature *</label>
      <canvas id="sigPad" width="560" height="150"></canvas>
      <button type="button" class="btn btn-outline" onclick="clearSig()" style="margin-top:8px;">Effacer</button>
    </div>
    <div class="msg msg-error" id="errMsg"></div>
    <div class="msg msg-success" id="okMsg"></div>
    <button class="btn btn-primary" id="submitBtn" onclick="submitSignature()">✓ Confirmer et signer</button>
  </div>`}

  <p class="footer">Signature sécurisée propulsée par EntreFlow</p>
</div>

<script>
const QUOTE_ID = '${quote.id}';
const SIGN_TOKEN = '${quote.sign_token}';
const API_URL = '${CONFIG.PORTAL_URL}';
let ctx, drawing=false, hasContent=false;
const canvas = document.getElementById('sigPad');
if (canvas) {
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = '${theme.primary}'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  const pos = e => { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) }; };
  const start = e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); hasContent = true; e.preventDefault(); };
  const end = () => drawing = false;
  canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end;
  canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
}
function clearSig(){ if(!ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); hasContent=false; }
async function submitSignature(){
  const errEl = document.getElementById('errMsg'), okEl = document.getElementById('okMsg');
  errEl.style.display='none'; okEl.style.display='none';
  const name = document.getElementById('signerName').value.trim();
  if (!name) { errEl.textContent = 'Veuillez indiquer votre nom.'; errEl.style.display='block'; return; }
  if (!hasContent) { errEl.textContent = 'Veuillez apposer votre signature.'; errEl.style.display='block'; return; }
  const btn = document.getElementById('submitBtn'); btn.disabled = true; btn.textContent = 'Signature en cours…';
  try {
    const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body: JSON.stringify({ action:'confirmSignature', id: QUOTE_ID, token: SIGN_TOKEN, signerName: name, signatureData: canvas.toDataURL() }) });
    const data = await r.json();
    const result = data.result !== undefined ? data.result : data;
    if (!result || result.ok === false) throw new Error((result && result.error) || 'Erreur lors de la signature.');
    okEl.textContent = 'Devis signé avec succès ! Une copie vous a été envoyée par email.';
    okEl.style.display = 'block';
    btn.style.display = 'none';
  } catch(e) {
    errEl.textContent = e.message || 'Erreur lors de la signature.'; errEl.style.display='block';
    btn.disabled = false; btn.textContent = '✓ Confirmer et signer';
  }
}
</script>
</body></html>`;
}


/* ═══════════════════════════════════════════════════════════════════
   §  PORTAIL EMPLOYÉ — HTML servi via doGet(?employeeToken=)
   ═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   EntreFlow — Portail Employé v2 (PRO)
   ═══════════════════════════════════════════════════════════════════
   À COLLER À LA PLACE de la fonction buildEmployeePortalHTML_ existante
   dans le fichier .gs (section §  PORTAIL EMPLOYÉ). Aucune autre
   fonction du backend n'a besoin de changer — cette page utilise les
   mêmes actions API (getEmployeeDashboard, createSale, createQuote,
   createClient) déjà en place.

   Ce qui change :
   - Design épuré, sans aucun emoji : uniquement des icônes SVG fines
   - Navigation en pastilles en haut sur desktop/tablette, et barre
     de navigation fixe en bas de l'écran sur mobile (≤ 640px)
   - Indicateur "En direct" + rafraîchissement automatique en tâche de
     fond (toutes les 20 secondes) : si le chef réapprovisionne le
     stock ou qu'un collègue vend un produit, ça se reflète sans avoir
     à recharger la page
   - Stock en lecture seule côté employé (l'ajout de stock reste une
     action du dashboard boss — cohérent avec la séparation demandée)
   ═══════════════════════════════════════════════════════════════════ */
/**
 * Icônes SVG générées CÔTÉ SERVEUR (Apps Script) — utilisées dans le
 * gabarit HTML au moment de sa construction (nav, KPI, boutons de
 * fermeture des fenêtres). Un second jeu identique existe côté
 * navigateur, dans le <script> de la page, pour les éléments ajoutés
 * dynamiquement après chargement (toasts, lignes de vente/devis) —
 * les deux ne s'exécutent jamais dans le même contexte, donc aucun
 * conflit de nom malgré le même nom de fonction `_i`.
 */
function _i(name) {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l2.4 12.2a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 7H6"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
    file: '<path d="M14 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V8.5L14 3Z"/><path d="M13.5 3v5.5H19"/>',
    users: '<circle cx="8.5" cy="8" r="3.3"/><path d="M2.5 20c0-3.6 2.7-6 6-6s6 2.4 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.3 14.3c2.6.3 4.7 2.5 4.7 5.7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    trash: '<path d="M4 7h16M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2m3 0-.7 12.4A2 2 0 0 1 15.3 21H8.7a2 2 0 0 1-2-1.6L6 7"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.4-4.4"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    trend: '<path d="M3 17 9.5 10 14 14 21 6"/><path d="M15 6h6v6"/>',
    userPlus: '<circle cx="9" cy="8" r="3.3"/><path d="M2.5 20c0-3.6 2.7-6 6.5-6s6.5 2.4 6.5 6"/><path d="M18.5 8v6M21.5 11h-6"/>',
    key: '<circle cx="8" cy="15.5" r="4.2"/><path d="M11.2 12.4 20 3.6M16.5 7.1l2.6 2.6M13.6 10l2 2"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  };
  return '<svg class="icon" viewBox="0 0 24 24">' + (paths[name] || paths.grid) + '</svg>';
}

function getPortalUrl_() {
  return CONFIG.PORTAL_URL || 'https://entreflow.netlify.app';
}
function safeJson_(obj) {
  return JSON.stringify(obj)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
    .replace(/<\/script/gi, '<\\/script');
}
function logAudit_(action, table, recordId, userId, details){
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    const name = String(CONFIG.SHEETS.AUDIT_LOG || 'JournalAudit').trim();
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    sh.appendRow([new Date().toISOString(), action, table, recordId, userId, details]);
  } catch(e){}
}
function buildEmployeePortalHTML_(emp, dashData) {
  const co = dashData.company || {};
  const stats = dashData.stats || {};
  const money = v => Number(v || 0).toLocaleString('fr-FR') + ' F';
  const portalApiUrl = getPortalUrl_();
  const empInitial = (emp.full_name || 'V').trim()[0].toUpperCase();
  const coInitial = (co.name || 'E').trim()[0].toUpperCase();
  const coMarkHtml = co.logo_data ? `<img src="${co.logo_data}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;">` : coInitial;

  const salesRows = (dashData.sales_today || []).map(s => `<tr><td style="color:var(--blue-l);font-weight:500">${s.sale_number || '—'}</td><td>${s.client_name || 'Anonyme'}</td><td style="font-weight:600">${money(s.total)}</td><td style="color:var(--gray)">${new Date(s.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</td></tr>`).join('');

  const lowStockRows = (dashData.products || []).filter(p => p.statut_stock === 'faible' || p.statut_stock === 'rupture').map(p => `<tr><td style="font-weight:500">${p.name}</td><td><span class="badge ${p.statut_stock === 'rupture' ? 'b-err' : 'b-warn'}">${p.statut_stock === 'rupture' ? 'Rupture' : p.quantity + ' restants'}</span></td><td style="color:var(--gray)">${p.min_threshold}</td></tr>`).join('');

  const productRows = (dashData.products || []).map(p => { const cls = p.statut_stock === 'rupture' ? 'b-err' : p.statut_stock === 'faible' ? 'b-warn' : 'b-ok'; const label = p.statut_stock === 'rupture' ? 'Rupture' : p.statut_stock === 'faible' ? p.quantity + ' faible' : p.quantity; return `<tr><td style="font-weight:500">${p.name}</td><td style="color:var(--gray)">${p.unit}</td><td style="font-weight:600">${money(p.unit_sell_price)}</td><td><span class="badge ${cls}">${label}</span></td></tr>`; }).join('');

  const quoteRows = (dashData.quotes || []).map(q => `<tr><td style="color:var(--blue-l);font-weight:500">${q.quote_number || '—'}</td><td>${q.client_name || '—'}</td><td style="font-weight:600">${money(q.total)}</td><td><span class="badge ${q.statut === 'signe' ? 'b-ok' : 'b-info'}">${q.statut === 'signe' ? 'Approuvé' : 'En attente'}</span></td></tr>`).join('');

  const clientRows = (dashData.clients || []).slice(0, 200).map(c => `<tr><td style="font-weight:500">${c.name}</td><td style="color:var(--gray)">${c.phone || '—'}</td><td style="color:var(--gray)">${c.city || '—'}</td></tr>`).join('');

  return `<!DOCTYPE html><html lang="fr" style="background:#040810;color:#EEF2FF"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Espace Vendeur — ${emp.full_name}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#040810;--blue:#2563EB;--blue-l:#60A5FA;--green:#10B981;--amber:#F59E0B;--red:#EF4444;--white:#EEF2FF;--gray:#8A9AC2;--border:rgba(96,165,250,.10);--border-h:rgba(96,165,250,.22);--card:rgba(6,10,28,.70);}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--white);font-family:'DM Sans',sans-serif;font-size:14px;min-height:100%;}
svg.icon{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
.topbar{position:sticky;top:0;z-index:40;background:rgba(4,8,22,.92);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:58px;}
.co-av{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#2563EB,#60A5FA);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;overflow:hidden;flex-shrink:0;}
.co-name{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;margin-left:10px;}
.emp-side{display:flex;align-items:center;gap:10px;}
.emp-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#60A5FA);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:1px solid #2D3A60;}
.main{margin:0 auto;padding:22px 20px 40px;max-width:1100px;position:relative;z-index:1;}
.page-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;flex-wrap:wrap;gap:8px;}
.page-header h1{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;} .page-header p{color:var(--gray);font-size:12px;margin-top:3px;}
.date-chip{font-size:11px;padding:4px 12px;background:rgba(37,99,235,.10);border:1px solid var(--border);border-radius:999px;color:var(--blue-l);font-weight:500;}
.tabs{display:flex;gap:5px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:999px;padding:4px;margin-bottom:18px;overflow-x:auto;}
.tab{display:flex;align-items:center;gap:6px;background:transparent;border:none;color:var(--gray);font-size:12.5px;padding:8px 14px;border-radius:999px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;white-space:nowrap;transition:.18s;}
.tab.active{background:rgba(37,99,235,.22);color:#fff;font-weight:600;}
.page{display:none;} .page.active{display:block;animation:fadein .3s ease;}
@keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px;}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;transition:.2s;}
.kpi-val{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;margin-bottom:3px;}
.kpi-lbl{font-size:11.5px;color:var(--gray);}
.qa-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;}
.qa-item{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid var(--border);cursor:pointer;color:var(--white);font-family:'DM Sans',sans-serif;text-align:left;transition:.18s;}
.qa-item.primary{background:rgba(37,99,235,.12);border-color:rgba(37,99,235,.25);}
.qa-icon{width:38px;height:38px;border-radius:10px;background:rgba(96,165,250,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.qa-item.primary .qa-icon{background:rgba(37,99,235,.28);}
.qa-icon svg{stroke:var(--blue-l);}
.qa-label .t{font-size:13px;font-weight:600;} .qa-label .s{font-size:11px;color:var(--gray);}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:16px;}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;}
.card-title{font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;}
.btn-sm{background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.22);color:var(--blue-l);padding:6px 12px;font-size:11.5px;border-radius:999px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;}
.search-box{padding:8px 12px;background:rgba(4,6,18,.70);border:1px solid var(--border);border-radius:999px;color:var(--white);font-size:12px;font-family:'DM Sans',sans-serif;outline:none;width:220px;}
.tbl-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;min-width:420px;}
th{text-align:left;padding:9px 10px;font-size:9.5px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);}
td{padding:10px 10px;font-size:12.5px;border-bottom:1px solid #F0F3FF08;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:10.5px;font-weight:500;}
.b-ok{background:rgba(16,185,129,.11);color:var(--green);} .b-warn{background:rgba(245,158,11,.11);color:var(--amber);} .b-err{background:rgba(239,68,68,.11);color:var(--red);} .b-info{background:rgba(96,165,250,.11);color:var(--blue-l);}
.empty-state{text-align:center;padding:28px 16px;color:var(--gray);}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);z-index:200;display:none;align-items:center;justify-content:center;padding:18px;}
.modal-bg.show{display:flex;}
.modal-box{background:rgba(6,10,28,.98);border:1px solid var(--border);border-radius:16px;padding:22px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;}
.modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.modal-head h3{font-size:15px;font-weight:700;}
.modal-close{background:none;border:none;color:var(--gray);cursor:pointer;}
.fg{margin-bottom:12px;} .fg label{display:block;font-size:10px;font-weight:600;color:var(--gray);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
.fg input,.fg select{width:100%;padding:10px 12px;background:rgba(4,6,18,.65);border:1px solid var(--border);border-radius:9px;color:var(--white);font-size:13px;font-family:'DM Sans',sans-serif;outline:none;}
.fg select option{background:#060D25;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.totals-box{background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.15);border-radius:11px;padding:13px 16px;margin:14px 0;display:flex;justify-content:space-between;}
.total-val{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;color:var(--blue-l);}
.actions{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap;}
.msg-err{background:rgba(239,68,68,.1);color:#FCA5A5;border:1px solid rgba(239,68,68,.25);padding:9px 12px;border-radius:9px;font-size:12px;margin-top:8px;display:none;}
.toast-cont{position:fixed;bottom:16px;right:16px;z-index:999;display:flex;flex-direction:column;gap:7px;}
.toast{padding:11px 15px;border-radius:10px;font-size:13px;color:#fff;display:flex;align-items:center;gap:8px;max-width:300px;backdrop-filter:blur(14px);transform:translateX(150%);transition:transform .3s ease;}
.toast.visible{transform:translateX(0);}
.toast.success{background:rgba(16,185,129,.18);border:1px solid rgba(16,185,129,.4);}
.toast.error{background:rgba(239,68,68,.18);border:1px solid rgba(239,68,68,.4);}
/* P2: classes manquantes pour les lignes d'articles dynamiques dans les modales */
.cart-row{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;}
.rm-btn{background:rgba(239,68,68,.10);border:1px solid rgba(239,68,68,.22);color:#FCA5A5;width:34px;height:34px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.18s;}
.rm-btn:hover{background:rgba(239,68,68,.22);}
@media(max-width:900px){.kpi-grid{grid-template-columns:1fr 1fr;}.qa-grid{grid-template-columns:1fr;}}
@media(max-width:600px){.main{padding:18px 14px 50px;} .kpi-grid{grid-template-columns:1fr 1fr;gap:10px;} .page-header{flex-direction:column;align-items:flex-start;} .card{padding:14px;} table{min-width:340px;} .row2{grid-template-columns:1fr;} .modal-box{padding:16px;max-width:94vw;} .search-box{width:100%;}}
</style>
</head>
<body>
<div class="toast-cont" id="toastCont"></div>
<div class="topbar">
  <div style="display:flex;align-items:center;gap:10px;">
    <div class="co-av">${coMarkHtml}</div>
    <span class="co-name">${co.name || 'EntreFlow'}</span>
  </div>
  <div class="emp-side">
    <div style="font-size:12px;color:var(--gray);display:none;" id="empName">${emp.full_name} · ${emp.poste || 'Vendeur'}</div>
    <div class="emp-av">${empInitial}</div>
    <button onclick="logoutEmployee()" title="Déconnexion" style="background:rgba(255,255,255,.04);border:1px solid var(--border);color:var(--gray);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;width:34px;height:34px;transition:.18s;" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--gray)'">
      <svg class="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
    </button>
  </div>
</div>
<div class="main">
  <div class="page-header">
    <div><h1>Bonjour, ${(emp.full_name || '').split(' ')[0]}</h1><p>Tableau de bord vendeur</p></div>
    <span class="date-chip">${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</span>
  </div>
  <div class="tabs">
    <button class="tab active" onclick="goTab('dash',this)">Accueil</button>
    <button class="tab" onclick="goTab('sales',this)">Mes ventes</button>
    <button class="tab" onclick="goTab('products',this)">Stock</button>
    <button class="tab" onclick="goTab('quotes',this)">Devis</button>
    <button class="tab" onclick="goTab('clients',this)">Clients</button>
  </div>
  <div class="page active" id="tab-dash">
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-val">${money(stats.ca_today)}</div><div class="kpi-lbl">Mon CA</div></div>
      <div class="kpi"><div class="kpi-val">${stats.sales_today || 0}</div><div class="kpi-lbl">Ventes</div></div>
      <div class="kpi"><div class="kpi-val">${stats.products_available || 0}</div><div class="kpi-lbl">Articles dispo.</div></div>
      <div class="kpi"><div class="kpi-val">${stats.low_stock || 0}</div><div class="kpi-lbl">Alerte stock</div></div>
    </div>
    <div class="qa-grid">
      <button class="qa-item primary" onclick="event.stopImmediatePropagation();openSaleModal()"><div class="qa-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div><span class="qa-label"><span class="t">Nouvelle vente</span><span class="s">Enregistrer</span></span></button>
      <button class="qa-item" onclick="event.stopImmediatePropagation();openQuoteModal()"><div class="qa-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><span class="qa-label"><span class="t">Créer un devis</span><span class="s">Nouveau devis</span></span></button>
      <button class="qa-item" onclick="event.stopImmediatePropagation();openClientModal()"><div class="qa-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="4.5" r="2.5"/></svg></div><span class="qa-label"><span class="t">Ajouter client</span><span class="s">Nouveau contact</span></span></button>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Ventes du jour</div></div>
      ${salesRows ? `<div class="tbl-wrap"><table><thead><tr><th>N°</th><th>Client</th><th>Total</th><th>Heure</th></tr></thead><tbody>${salesRows}</tbody></table></div>` : `<div class="empty-state"><strong>Aucune vente aujourd'hui</strong></div>`}
    </div>
    ${lowStockRows ? `<div class="card"><div class="card-header"><div class="card-title" style="color:var(--amber)">Stock faible</div></div><div class="tbl-wrap"><table><thead><tr><th>Produit</th><th>Stock</th><th>Seuil</th></tr></thead><tbody>${lowStockRows}</tbody></table></div></div>` : ''}
  </div>
  <div class="page" id="tab-sales">
    <div class="card">
      <div class="card-header"><div class="card-title">Mes ventes</div><button class="btn-sm" onclick="event.stopImmediatePropagation();openSaleModal()">+ Nouvelle vente</button></div>
      ${salesRows ? `<div class="tbl-wrap"><table><thead><tr><th>N° Vente</th><th>Client</th><th>Total</th><th>Heure</th></tr></thead><tbody>${salesRows}</tbody></table></div>` : `<div class="empty-state"><strong>Aucune vente</strong></div>`}
    </div>
  </div>
  <div class="page" id="tab-products">
    <div class="card">
      <div class="card-header"><div class="card-title">Produits & stock</div><input class="search-box" type="text" placeholder="Rechercher…" oninput="filterTable('prodBody',this.value)"></div>
      <div class="tbl-wrap"><table><thead><tr><th>Produit</th><th>Unité</th><th>Prix</th><th>Stock</th></tr></thead><tbody id="prodBody">${productRows || '<tr><td colspan="4"><div class="empty-state"><strong>Aucun produit</strong></div></td></tr>'}</tbody></table></div>
    </div>
  </div>
  <div class="page" id="tab-quotes">
    <div class="card">
      <div class="card-header"><div class="card-title">Devis</div><button class="btn-sm" onclick="event.stopImmediatePropagation();openQuoteModal()">+ Nouveau devis</button></div>
      ${quoteRows ? `<div class="tbl-wrap"><table><thead><tr><th>N° Devis</th><th>Client</th><th>Total</th><th>Statut</th></tr></thead><tbody>${quoteRows}</tbody></table></div>` : `<div class="empty-state"><strong>Aucun devis</strong></div>`}
    </div>
  </div>
  <div class="page" id="tab-clients">
    <div class="card">
      <div class="card-header"><div class="card-title">Clients</div><div style="display:flex;gap:8px;"><input class="search-box" type="text" placeholder="Rechercher…" oninput="filterTable('clientBody',this.value)"><button class="btn-sm" onclick="event.stopImmediatePropagation();openClientModal()">+ Ajouter</button></div></div>
      <div class="tbl-wrap"><table><thead><tr><th>Nom</th><th>Téléphone</th><th>Ville</th></tr></thead><tbody id="clientBody">${clientRows || '<tr><td colspan="3"><div class="empty-state"><strong>Aucun client</strong></div></td></tr>'}</tbody></table></div>
    </div>
  </div>
</div>

<div class="modal-bg" id="saleModal"><div class="modal-box">
  <div class="modal-head"><h3>Nouvelle vente</h3><button class="modal-close" onclick="closeModal('saleModal')"><svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="row2">
    <div class="fg"><label>Client (optionnel)</label><select id="sl-client"><option value="">-- Client anonyme --</option>${(dashData.clients || []).map(c => `<option value="${c.id}">${esc(c.name)}${c.phone ? ' · ' + esc(c.phone) : ''}</option>`).join('')}</select></div>
    <div class="fg"><label>Email client (pour facture)</label><input id="sl-client-email" type="email" placeholder="client@email.com"></div>
  </div>
  <div style="margin-bottom:10px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <label style="font-size:10px;font-weight:600;color:var(--gray);text-transform:uppercase;letter-spacing:.06em">Produits vendus *</label>
      <button class="btn-sm" onclick="addSaleRow()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter</button>
    </div>
    <div id="saleRows"></div>
  </div>
  <div style="background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.14);border-radius:11px;padding:14px;margin:14px 0;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:var(--gray)">Total de la vente</span>
      <strong style="font-size:20px;font-weight:700;color:var(--blue-l);font-family:'Syne',sans-serif" id="saleTotal">0 F CFA</strong>
    </div>
  </div>
  <div class="row3">
    <div class="fg"><label>Paiement</label><select id="sl-method"><option value="cash">Espèces</option><option value="mobile_money_wave">Wave</option><option value="mobile_money_mtn">MTN Money</option><option value="mobile_money_moov">Moov Money</option><option value="card">Carte</option><option value="bank_transfer">Virement</option></select></div>
    <div class="fg"><label>Montant reçu</label><input id="sl-paid" type="number" min="0" placeholder="0" oninput="calcChange()"></div>
    <div class="fg"><label>Monnaie à rendre</label><input id="sl-change" type="text" value="0 F CFA" disabled style="opacity:.7;"></div>
  </div>
  <div class="actions">
    <button class="btn-sm" style="background:transparent;color:var(--white);border:1px solid var(--border);" onclick="closeModal('saleModal')">Annuler</button>
    <button class="btn-sm" style="background:#2563EB;color:#fff;border-color:#2563EB;" id="saleSaveBtn" onclick="saveSale()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Enregistrer la vente</button>
  </div>
</div></div>

<div class="modal-bg" id="quoteModal"><div class="modal-box">
  <div class="modal-head"><h3>Nouveau devis</h3><button class="modal-close" onclick="closeModal('quoteModal')"><svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="fg">
    <label>Client *</label>
    <select id="qt-client" onchange="onQuoteClientChange()">
      <option value="">-- Nouveau client --</option>
      ${(dashData.clients || []).map(c => `<option value="${c.id}">${esc(c.name)}${c.phone ? ' · ' + esc(c.phone) : ''}</option>`).join('')}
    </select>
  </div>
  <div id="qt-new-client">
    <div class="row2">
      <div class="fg"><label>Nom du client *</label><input type="text" id="qt-cn" placeholder="Nom du nouveau client"></div>
      <div class="fg"><label>Téléphone (WhatsApp)</label><input type="tel" id="qt-cp" placeholder="+229 XX XX XX XX"></div>
    </div>
    <div class="row2">
      <div class="fg"><label>Email client</label><input type="email" id="qt-ce" placeholder="client@email.com"></div>
    </div>
  </div>
  <div class="fg"><label>Validité (jours)</label><input type="number" id="qt-validite" value="7" min="1"></div>
  <div id="quoteRows"></div>
  <button class="btn-sm" style="width:100%;justify-content:center;margin-top:8px;" onclick="addQuoteRow()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Ajouter article</button>
  <div class="totals-box"><span style="font-size:12px;color:var(--gray);">Total estimé</span><span class="total-val" id="quoteTotal">0 F</span></div>
  <div class="actions"><button class="btn-sm" style="background:transparent;color:var(--white);border:1px solid var(--border);" onclick="closeModal('quoteModal')">Annuler</button><button class="btn-sm" style="background:#2563EB;color:#fff;border-color:#2563EB;" id="quoteSaveBtn" onclick="saveQuote()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Créer le devis</button></div>
</div></div>

<div class="modal-bg" id="clientModal"><div class="modal-box">
  <div class="modal-head"><h3>Nouveau client</h3><button class="modal-close" onclick="closeModal('clientModal')"><svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>
  <div class="fg"><label>Nom *</label><input type="text" id="nc-name" placeholder="Nom du client"></div>
  <div class="row2"><div class="fg"><label>Téléphone</label><input type="tel" id="nc-phone"></div><div class="fg"><label>Email</label><input type="email" id="nc-email"></div></div>
  <div class="fg"><label>Ville</label><input type="text" id="nc-city"></div>
  <div class="msg-err" id="clientErr"></div>
  <div class="actions"><button class="btn-sm" style="background:transparent;color:var(--white);border:1px solid var(--border);" onclick="closeModal('clientModal')">Annuler</button><button class="btn-sm" style="background:#2563EB;color:#fff;border-color:#2563EB;" onclick="saveClient()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Ajouter</button></div>
</div></div>

<script>
/* P2: échappement côté client des valeurs injectées dans le DOM pour prévenir XSS */
function esc(str){
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
const EMP = ${safeJson_(emp)};
const PRODUCTS = ${safeJson_(dashData.products || [])};
const CLIENTS = ${safeJson_(dashData.clients || [])};
const API_URL = '${portalApiUrl}';
const EMP_TOKEN='${emp.access_token}';
const COMPANY_ID = '${emp.company_id}';
const BRANCH_ID = '${emp.branch_id}';
const money = v => Number(v||0).toLocaleString('fr-FR') + ' F';

/* P2: déconnexion employé — redirige vers la page de login par code */
function logoutEmployee(){
  sessionStorage.clear();
  window.location.href = API_URL + '?' + new URLSearchParams({employeeLogin: 1});
}
function goTab(id, btn){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  if(btn){ btn.classList.add('active'); }
  document.getElementById('tab-'+id).classList.add('active');
}
function goTabById(id){
  const btn=[...document.querySelectorAll('.tab')].find(t=>t.getAttribute('onclick')?.includes("'"+id+"'"));
  if(btn) goTab(id, btn);
}
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
function openSaleModal(){ openModal('saleModal'); }
function openQuoteModal(){ openModal('quoteModal'); }
function openClientModal(){ openModal('clientModal'); }

function toast(msg, type){
  const stack = document.getElementById('toastCont');
  const el = document.createElement('div');
  el.className = 'toast ' + (type || 'success');
  el.innerHTML = '<div>' + msg + '</div>';
  stack.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('visible'));
  setTimeout(()=>{ el.classList.remove('visible'); setTimeout(()=>el.remove(), 320); }, 3600);
}

async function api(action, payload){
  const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({action, token: EMP_TOKEN, ...payload}) });
  const text = await r.text();
  let data={}; try{ data = JSON.parse(text); }catch(e){}
  if (!r.ok || data.ok === false) throw new Error(data.error || 'Erreur');
  return data.result !== undefined ? data.result : data;
}

let saleLineIdx = 0;
/* P2: ajout ligne vente — SVG pour suppression, noms échappés, validation stock */
function addSaleRow(){
  const idx = saleLineIdx++;
  const wrap = document.getElementById('saleRows');
  const row = document.createElement('div');
  row.className = 'cart-row'; row.id = 'srow-' + idx;
  const sel = document.createElement('select'); sel.id = 'sp-' + idx;
  sel.innerHTML = '<option value="">Choisir</option>' + PRODUCTS.filter(p=>p.statut_stock!=='rupture').map(p=>'<option value="'+p.id+'" data-price="'+p.unit_sell_price+'" data-name="'+p.name+'" data-stock="'+p.quantity+'">'+esc(p.name)+' ('+money(p.unit_sell_price)+')</option>').join('');
  const qty = document.createElement('input'); qty.type = 'number'; qty.min = '1'; qty.value = '1'; qty.id = 'sq-' + idx;
  const rm = document.createElement('button'); rm.className = 'rm-btn'; rm.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>'; rm.onclick = function(){ document.getElementById('srow-'+idx).remove(); calcSaleTotal(); };
  row.appendChild(sel); row.appendChild(qty); row.appendChild(rm);
  wrap.appendChild(row);
  sel.onchange = calcSaleTotal;
  qty.oninput = calcSaleTotal;
}
/* P2: calcSaleTotal vérifie le stock et désactive le bouton Enregistrer si nécessaire */
function calcSaleTotal(){
  let total = 0; let hasOver = false;
  document.querySelectorAll('[id^="srow-"]').forEach(row=>{
    const idx = row.id.split('-')[1];
    const sel = document.getElementById('sp-'+idx); const qty = parseFloat(document.getElementById('sq-'+idx)?.value)||0;
    const opt = sel?.options[sel.selectedIndex];
    const price = parseFloat(opt?.getAttribute('data-price'))||0;
    const stock = parseFloat(opt?.getAttribute('data-stock'));
    if(sel?.value && !isNaN(stock) && qty > stock){
      hasOver = true;
      toast('Stock insuffisant: '+opt.getAttribute('data-name')+' ('+stock+' dispo.)', 'error');
    }
    total += price * qty;
  });
  document.getElementById('saleTotal').textContent = money(total);
  const sbtn = document.getElementById('saleSaveBtn');
  if(sbtn) sbtn.disabled = hasOver;
  // vérifie aussi les lignes de devis si ouvertes
  let qOver = false;
  document.querySelectorAll('[id^="qrow-"]').forEach(row=>{
    const idx = row.id.split('-')[1];
    const sel = document.getElementById('qp-'+idx);
    const qty = parseFloat(document.getElementById('qq-'+idx)?.value)||0;
    const stock = parseFloat(sel?.options[sel.selectedIndex]?.getAttribute('data-stock'));
    if(sel?.value && !isNaN(stock) && qty > stock) qOver = true;
  });
  const qbtn = document.getElementById('quoteSaveBtn');
  if(qbtn) qbtn.disabled = qOver;
}
function calcChange(){
  const total = parseFloat(String(document.getElementById('saleTotal').textContent).replace(/[^\\d]/g,'')) || 0;
  const paid = parseFloat(document.getElementById('sl-paid').value) || 0;
  document.getElementById('sl-change').value = money(Math.max(0, paid - total));
}
function onQuoteClientChange(){
  const id=document.getElementById('qt-client').value;
  document.getElementById('qt-new-client').style.display=id?'none':'block';
  if(id){
    document.getElementById('qt-cn').value='';
    document.getElementById('qt-cp').value='';
    document.getElementById('qt-ce').value='';
  }
}
function calcChange(){
  const total = parseFloat(String(document.getElementById('saleTotal').textContent).replace(/[^\d]/g,'')) || 0;
  const paid = parseFloat(document.getElementById('sl-paid').value) || 0;
  document.getElementById('sl-change').value = money(Math.max(0, paid - total));
}
async function saveSale(){
  const items = [];
  document.querySelectorAll('[id^="srow-"]').forEach(row=>{
    const idx = row.id.split('-')[1];
    const sel = document.getElementById('sp-'+idx); const qty = parseFloat(document.getElementById('sq-'+idx)?.value);
    const opt = sel?.options[sel.selectedIndex];
    if(sel?.value && qty > 0) items.push({ product_id: sel.value, quantity: qty, unit_price: parseFloat(opt?.getAttribute('data-price')), name: opt?.getAttribute('data-name') });
  });
  if(!items.length){ toast('Ajoutez un article.', 'error'); return; }
  try {
    const res = await api('createSale', { company_id: COMPANY_ID, branch_id: BRANCH_ID, client_id: document.getElementById('sl-client').value || null, client_name: document.getElementById('sl-client').value ? '' : (document.getElementById('sl-client').selectedOptions[0]?.text?.split('·')[0]?.trim() || ''), client_email: document.getElementById('sl-client-email').value.trim() || '', payment_method: document.getElementById('sl-method').value, amount_paid: parseFloat(document.getElementById('sl-paid').value)||0, items, created_by: EMP.id, employee_id: EMP.id });
    toast('Vente enregistrée — ' + money(res.total) + (document.getElementById('sl-client-email').value.trim() ? ' · Facture envoyée.' : ''));
    closeModal('saleModal');
    setTimeout(() => location.reload(), 500);
  } catch(e){ toast(e.message, 'error'); }
}

let quoteLineIdx = 0;
/* P2: ajout ligne devis — SVG suppression, noms échappés, validation stock */
function addQuoteRow(){
  const idx = quoteLineIdx++;
  const wrap = document.getElementById('quoteRows');
  const row = document.createElement('div');
  row.className = 'cart-row'; row.id = 'qrow-' + idx;
  const sel = document.createElement('select'); sel.id = 'qp-' + idx;
  sel.innerHTML = '<option value="">Choisir</option>' + PRODUCTS.map(p=>'<option value="'+p.id+'" data-price="'+p.unit_sell_price+'" data-name="'+p.name+'">'+esc(p.name)+' ('+money(p.unit_sell_price)+')</option>').join('');
  const qty = document.createElement('input'); qty.type='number'; qty.min='1'; qty.value='1'; qty.id='qq-'+idx;
  const rm = document.createElement('button'); rm.className='rm-btn'; rm.innerHTML='<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>'; rm.onclick=function(){document.getElementById('qrow-'+idx).remove();calcQuoteTotal();};
  row.appendChild(sel); row.appendChild(qty); row.appendChild(rm);
  wrap.appendChild(row);
  sel.onchange = calcQuoteTotal;
  qty.oninput = calcQuoteTotal;
}
function calcQuoteTotal(){
  let total = 0;
  document.querySelectorAll('[id^="qrow-"]').forEach(row=>{
    const idx = row.id.split('-')[1];
    const sel = document.getElementById('qp-'+idx); const qty = parseFloat(document.getElementById('qq-'+idx)?.value)||0;
    const price = parseFloat(sel?.options[sel.selectedIndex]?.getAttribute('data-price'))||0;
    total += price * qty;
  });
  document.getElementById('quoteTotal').textContent = money(total);
}
async function saveQuote(){
  const clientId = document.getElementById('qt-client').value;
  const clientName = document.getElementById('qt-cn')?.value?.trim() || '';
  const clientPhone = document.getElementById('qt-cp')?.value?.trim() || '';
  const clientEmail = document.getElementById('qt-ce')?.value?.trim() || '';
  if (!clientId && !clientName){ toast('Indiquez le nom du client.', 'error'); return; }
  const items = [];
  document.querySelectorAll('[id^="qrow-"]').forEach(row=>{
    const idx = row.id.split('-')[1];
    const sel = document.getElementById('qp-'+idx); const qty = parseFloat(document.getElementById('qq-'+idx)?.value);
    const opt = sel?.options[sel.selectedIndex];
    if(sel?.value && qty > 0) items.push({ product_id: sel.value, quantity: qty, unit_price: parseFloat(opt?.getAttribute('data-price')), name: opt?.getAttribute('data-name') });
  });
  if (!items.length){ toast('Ajoutez un article.', 'error'); return; }
  try {
    const payload = { company_id: COMPANY_ID, validite_jours: parseInt(document.getElementById('qt-validite').value)||7, tva_rate: 0, prefix: 'EF-', items, created_by: EMP.id, employee_id: EMP.id };
    if (clientId) payload.client_id = clientId; else { payload.client_name = clientName; payload.client_phone = clientPhone; payload.client_email = clientEmail; }
    const res = await api('createQuote', payload);
    toast(res.signLinkSent ? 'Devis créé — lien envoyé' : 'Devis créé — ' + res.quoteNumber);
    closeModal('quoteModal');
    setTimeout(() => location.reload(), 500);
  } catch(e){ toast(e.message, 'error'); }
}

async function saveClient(){
  const name = document.getElementById('nc-name').value.trim();
  if (!name){ toast('Nom requis.', 'error'); return; }
  try {
    await api('createClient', { company_id: COMPANY_ID, name, phone: document.getElementById('nc-phone').value.trim(), email: document.getElementById('nc-email').value.trim(), city: document.getElementById('nc-city').value.trim() });
    toast('Client ajouté');
    closeModal('clientModal');
    setTimeout(() => location.reload(), 500);
  } catch(e){ toast(e.message, 'error'); }
}

function filterTable(bodyId, q){
  const rows = document.querySelectorAll('#' + bodyId + ' tr');
  const needle = q.trim().toLowerCase();
  rows.forEach(r => r.style.display = r.textContent.toLowerCase().includes(needle) ? '' : 'none');
}

/* P2: rafraîchissement automatique du dashboard employé toutes les 25s */
let refreshTimer = null;
function refreshData(){
  if(refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(async ()=>{
    try {
      const data = await api('getEmployeeDashboard', { token: EMP_TOKEN });
      if(data && data.stats){
        const kpiEls = document.querySelectorAll('.kpi-grid .kpi-val');
        if(kpiEls[0]) kpiEls[0].textContent = money(data.stats.ca_today);
        if(kpiEls[1]) kpiEls[1].textContent = data.stats.sales_today || 0;
        if(kpiEls[2]) kpiEls[2].textContent = data.stats.products_available || 0;
        if(kpiEls[3]) kpiEls[3].textContent = data.stats.low_stock || 0;
      }
    } catch(e){}
  }, 25000);
}
refreshData();
</script>
</body></html>`;
}
function buildEmployeeCodeLoginHTML_() {
  return `<!DOCTYPE html><html lang="fr"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>Connexion — Espace Vendeur EntreFlow</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#08090D; --surface:#111319; --surface-2:#161923;
  --border:rgba(255,255,255,.08); --border-soft:rgba(255,255,255,.05);
  --text:#F4F5F8; --text-dim:#9199AC; --text-faint:#5B637A;
  --accent:#3D6BFF; --accent-soft:rgba(61,107,255,.12); --accent-line:rgba(61,107,255,.3);
  --crit:#F0526B; --crit-soft:rgba(240,82,107,.12);
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;}
body{
  background:
    radial-gradient(1100px 480px at 12% -8%, rgba(61,107,255,.14), transparent 60%),
    radial-gradient(900px 420px at 105% 10%, rgba(124,77,255,.10), transparent 55%),
    var(--bg);
  color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px;
  min-height:100%; display:flex; align-items:center; justify-content:center; padding:24px;
}
.icon{ width:18px; height:18px; stroke:currentColor; stroke-width:1.7; fill:none; stroke-linecap:round; stroke-linejoin:round; display:block; }
.card{
  width:100%; max-width:400px; background:rgba(17,19,25,.72); border:1px solid var(--border);
  border-radius:26px; padding:38px 32px 32px; backdrop-filter:blur(20px) saturate(140%);
  box-shadow:0 30px 80px -20px rgba(0,0,0,.55);
  animation:riseIn .5s cubic-bezier(.2,.9,.3,1.05);
}
@keyframes riseIn{ from{ opacity:0; transform:translateY(18px) scale(.985); } to{ opacity:1; transform:none; } }
.mark{
  width:54px; height:54px; border-radius:16px; margin:0 auto 20px;
  background:linear-gradient(150deg,var(--accent),#7C4DFF);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 12px 28px -8px rgba(61,107,255,.55);
}
h1{ font-family:'Syne',sans-serif; font-size:20px; font-weight:800; text-align:center; letter-spacing:-.01em; }
p.sub{ color:var(--text-faint); font-size:12.5px; text-align:center; margin-top:6px; margin-bottom:28px; line-height:1.5; }

.code-field{ position:relative; }
.code-field input{
  width:100%; padding:18px 16px; background:var(--surface-2); border:1.5px solid var(--border);
  border-radius:14px; color:var(--text); font-size:26px; font-weight:800; letter-spacing:9px;
  text-align:center; text-transform:uppercase; font-family:'DM Sans',sans-serif; outline:none;
  transition:.18s;
}
.code-field input:focus{ border-color:var(--accent-line); background:rgba(61,107,255,.06); box-shadow:0 0 0 4px rgba(61,107,255,.08); }
.code-field input::placeholder{ color:var(--text-faint); letter-spacing:9px; }

.btn{
  width:100%; padding:15px; border:none; border-radius:14px; margin-top:16px;
  background:linear-gradient(120deg,var(--accent),#5B7CFF); color:#fff;
  font-family:'DM Sans',sans-serif; font-weight:700; font-size:14.5px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:8px; transition:.15s;
}
.btn:hover{ filter:brightness(1.07); }
.btn-sm:disabled{ opacity:.55; cursor:default; filter:grayscale(.15); }
.btn .icon{ width:16px; height:16px; }

.err{
  display:none; align-items:center; gap:9px; background:var(--crit-soft); border:1px solid rgba(240,82,107,.25);
  color:#FFB3C0; font-size:12px; padding:11px 13px; border-radius:12px; margin-top:14px;
}
.err.show{ display:flex; }
.err .icon{ flex-shrink:0; }

.divider{ display:flex; align-items:center; gap:10px; margin:26px 0 18px; }
.divider::before, .divider::after{ content:''; flex:1; height:1px; background:var(--border-soft); }
.divider span{ font-size:10.5px; color:var(--text-faint); text-transform:uppercase; letter-spacing:.08em; }

.hint{ display:flex; align-items:flex-start; gap:10px; background:var(--surface); border:1px solid var(--border-soft); border-radius:12px; padding:13px 14px; }
.hint .icon{ color:var(--accent); margin-top:1px; flex-shrink:0; width:16px; height:16px; }
.hint p{ font-size:11.5px; color:var(--text-dim); line-height:1.5; }

.footer{ text-align:center; font-size:10.5px; color:var(--text-faint); margin-top:26px; letter-spacing:.02em; }
.footer b{ color:var(--text-dim); }
</style></head>
<body>
<div class="card">
  <div class="mark">${_i('key')}</div>
  <h1>Espace Vendeur</h1>
  <p class="sub">Entrez le code de connexion à 6 caractères reçu par email pour accéder à votre tableau de bord.</p>

  <div class="code-field">
    <input type="text" id="codeInput" maxlength="6" placeholder="• • • • • •" spellcheck="false">
  </div>
  <div class="err" id="errMsg">${_i('alert')}<span id="errTxt"></span></div>
  <button class="btn" id="goBtn" onclick="tryLogin()"><span id="btnTxt">Se connecter</span>${_i('arrowRight')}</button>

  <div class="divider"><span>Besoin d'aide</span></div>
  <div class="hint">${_i('mail')}<p>Le code vous a été envoyé par email lors de votre ajout à l'équipe. Vérifiez vos spams si vous ne le trouvez pas, ou contactez votre responsable.</p></div>

  <p class="footer">Propulsé par <b>EntreFlow</b></p>
</div>
<script>
const API_URL = '${CONFIG.PORTAL_URL}';
const input = document.getElementById('codeInput');
input.addEventListener('input', function(){ this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g,''); document.getElementById('errMsg').classList.remove('show'); });
input.addEventListener('keydown', function(e){ if (e.key === 'Enter') tryLogin(); });

async function tryLogin(){
  const err = document.getElementById('errMsg'); err.classList.remove('show');
  const code = input.value.trim();
  if (code.length < 6){ showErr('Le code doit contenir 6 caractères.'); return; }
  const btn = document.getElementById('goBtn'); btn.disabled = true; document.getElementById('btnTxt').textContent = 'Connexion…';
  try {
    const r = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({ action:'employeeLoginByCode', code }) });
    const data = await r.json();
    const result = data.result !== undefined ? data.result : data;
    if (!result || result.ok === false) throw new Error((result && result.error) || 'Code invalide.');
    document.getElementById('btnTxt').textContent = 'Bienvenue, redirection…';
    window.location.href = result.portal_link;
  } catch(e) {
    showErr(e.message || 'Code invalide.');
    btn.disabled = false; document.getElementById('btnTxt').textContent = 'Se connecter';
  }
}
function showErr(msg){ document.getElementById('errTxt').textContent = msg; document.getElementById('errMsg').classList.add('show'); input.style.borderColor = 'var(--crit)'; setTimeout(()=>input.style.borderColor='', 1500); }
</script>
</body></html>`;
}


/* ═══════════════════════════════════════════════════════════════════
   §  ROUTEUR API WEB APP — doGet / doPost
   ═══════════════════════════════════════════════════════════════════ */
function serveSuperAdminPage_() {
  try {
    const html = Utilities.newBlob(Utilities.base64Decode('PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImZyIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAsIG1heGltdW0tc2NhbGU9MS4wLCB1c2VyLXNjYWxhYmxlPXllcyI+CjxtZXRhIG5hbWU9InRoZW1lLWNvbG9yIiBjb250ZW50PSIjMDQwODEwIj4KPG1ldGEgbmFtZT0iYXBwbGUtbW9iaWxlLXdlYi1hcHAtY2FwYWJsZSIgY29udGVudD0ieWVzIj4KPG1ldGEgbmFtZT0iYXBwbGUtbW9iaWxlLXdlYi1hcHAtc3RhdHVzLWJhci1zdHlsZSIgY29udGVudD0iYmxhY2stdHJhbnNsdWNlbnQiPgo8bWV0YSBuYW1lPSJhcHBsZS1tb2JpbGUtd2ViLWFwcC10aXRsZSIgY29udGVudD0iRW50cmVGbG93Ij4KPG1ldGEgbmFtZT0ibW9iaWxlLXdlYi1hcHAtY2FwYWJsZSIgY29udGVudD0ieWVzIj4KPHRpdGxlPkVudHJlRmxvdyDigJQgU3VwZXIgQWRtaW48L3RpdGxlPgo8bGluayByZWw9Im1hbmlmZXN0IiBocmVmPSI/YWRtaW49MSZtYW5pZmVzdD0xIj4KPGxpbmsgcmVsPSJhcHBsZS10b3VjaC1pY29uIiBocmVmPSI/YWRtaW49MSZpY29uPTE5MiI+CjxsaW5rIGhyZWY9Imh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9U3luZTp3Z2h0QDYwMDs3MDA7ODAwJmZhbWlseT1ETStTYW5zOndnaHRANDAwOzUwMDs2MDA7NzAwJmRpc3BsYXk9c3dhcCIgcmVsPSJzdHlsZXNoZWV0Ij4KPHN0eWxlPgo6cm9vdHsKICAtLWJnOiMwNDA4MTA7IC0tY2FyZDpyZ2JhKDYsMTAsMjgsLjcyKTsgLS1ib3JkZXI6cmdiYSg5NiwxNjUsMjUwLC4xMik7IC0tYm9yZGVyLWg6cmdiYSg5NiwxNjUsMjUwLC4yNik7CiAgLS1ibHVlOiMyNTYzRUI7IC0tYmx1ZS1sOiM2MEE1RkE7IC0tZ3JlZW46IzEwQjk4MTsgLS1hbWJlcjojRjU5RTBCOyAtLXJlZDojRUY0NDQ0OyAtLXB1cnBsZTojOEI1Q0Y2OwogIC0td2hpdGU6I0VFRjJGRjsgLS1ncmF5OiM4QTlBQzI7IC0tZ3JheS1kOiMzQTQ1Njg7Cn0KKnttYXJnaW46MDtwYWRkaW5nOjA7Ym94LXNpemluZzpib3JkZXItYm94O30KYm9keXtiYWNrZ3JvdW5kOnZhcigtLWJnKTtjb2xvcjp2YXIoLS13aGl0ZSk7Zm9udC1mYW1pbHk6J0RNIFNhbnMnLHNhbnMtc2VyaWY7Zm9udC1zaXplOjE0cHg7bWluLWhlaWdodDoxMDB2aDt9CmgxLGgyLGgze2ZvbnQtZmFtaWx5OidTeW5lJyxzYW5zLXNlcmlmO2xldHRlci1zcGFjaW5nOi0uMDJlbTt9Cjo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6NXB4O30gOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kOnZhcigtLWJvcmRlci1oKTtib3JkZXItcmFkaXVzOjRweDt9CgovKiDilZDilZDilZAgw4lDUkFOIERFIENPTk5FWElPTiDilZDilZDilZAgKi8KI2xvZ2luU2NyZWVue3Bvc2l0aW9uOmZpeGVkO2luc2V0OjA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO3BhZGRpbmc6MjBweDtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudCgxMjAwcHggNTAwcHggYXQgMTUlIC0xMCUsIHJnYmEoMjM5LDY4LDY4LC4xMCksIHRyYW5zcGFyZW50IDYwJSkscmFkaWFsLWdyYWRpZW50KDkwMHB4IDQyMHB4IGF0IDEwNSUgMTAlLCByZ2JhKDM3LDk5LDIzNSwuMTIpLCB0cmFuc3BhcmVudCA1NSUpLHZhcigtLWJnKTt9Ci5sb2dpbi1jYXJke3dpZHRoOjEwMCU7bWF4LXdpZHRoOjQyMHB4O2JhY2tncm91bmQ6cmdiYSg4LDEyLDMwLC44NSk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yYWRpdXM6MjRweDtwYWRkaW5nOjM2cHggMzBweDtiYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KTtib3gtc2hhZG93OjAgMzBweCA4MHB4IC0yMHB4IHJnYmEoMCwwLDAsLjYpO30KLmxvZ2luLW1hcmt7d2lkdGg6NTJweDtoZWlnaHQ6NTJweDtib3JkZXItcmFkaXVzOjE1cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNFRjQ0NDQsIzdDMkQyRCk7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO21hcmdpbjowIGF1dG8gMThweDt9Ci5sb2dpbi1tYXJrIHN2Z3t3aWR0aDoyNnB4O2hlaWdodDoyNnB4O3N0cm9rZTojZmZmO2ZpbGw6bm9uZTtzdHJva2Utd2lkdGg6MS44O30KLmxvZ2luLWNhcmQgaDF7Zm9udC1zaXplOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXI7bWFyZ2luLWJvdHRvbTo2cHg7fQoubG9naW4tY2FyZCBwe2ZvbnQtc2l6ZToxMi41cHg7Y29sb3I6dmFyKC0tZ3JheSk7dGV4dC1hbGlnbjpjZW50ZXI7bWFyZ2luLWJvdHRvbToyNnB4O30KLmZne21hcmdpbi1ib3R0b206MTRweDt9IC5mZyBsYWJlbHtkaXNwbGF5OmJsb2NrO2ZvbnQtc2l6ZToxMC41cHg7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOnZhcigtLWdyYXkpO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDZlbTttYXJnaW4tYm90dG9tOjZweDt9Ci5mZyBpbnB1dHt3aWR0aDoxMDAlO3BhZGRpbmc6MTNweCAxNHB4O2JhY2tncm91bmQ6cmdiYSg0LDYsMTgsLjcpO2JvcmRlcjoxcHggc29saWQgdmFyKC0tYm9yZGVyKTtib3JkZXItcmFkaXVzOjExcHg7Y29sb3I6dmFyKC0td2hpdGUpO2ZvbnQtc2l6ZToxNHB4O291dGxpbmU6bm9uZTtmb250LWZhbWlseTonRE0gU2Fucycsc2Fucy1zZXJpZjt9Ci5mZyBpbnB1dDpmb2N1c3tib3JkZXItY29sb3I6dmFyKC0tYm9yZGVyLWgpO2JveC1zaGFkb3c6MCAwIDAgM3B4IHJnYmEoMjM5LDY4LDY4LC4wOCk7fQouYnRuLWxvZ2lue3dpZHRoOjEwMCU7cGFkZGluZzoxNHB4O2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6MTJweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMTVkZWcsI0RDMjYyNiwjRUY0NDQ0KTtjb2xvcjojZmZmO2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MTQuNXB4O2N1cnNvcjpwb2ludGVyO21hcmdpbi10b3A6OHB4O2ZvbnQtZmFtaWx5OidETSBTYW5zJyxzYW5zLXNlcmlmO30KLmJ0bi1sb2dpbjpkaXNhYmxlZHtvcGFjaXR5Oi41O30KLmxvZ2luLWVycntkaXNwbGF5Om5vbmU7YmFja2dyb3VuZDpyZ2JhKDIzOSw2OCw2OCwuMTIpO2JvcmRlcjoxcHggc29saWQgcmdiYSgyMzksNjgsNjgsLjI4KTtjb2xvcjojRkNBNUE1O2ZvbnQtc2l6ZToxMi41cHg7cGFkZGluZzoxMHB4IDEzcHg7Ym9yZGVyLXJhZGl1czoxMHB4O21hcmdpbi10b3A6MTJweDt9Ci5sb2dpbi1lcnIuc2hvd3tkaXNwbGF5OmJsb2NrO30KLmxvZ2luLW5vdGV7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tZ3JheS1kKTt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW4tdG9wOjIwcHg7bGluZS1oZWlnaHQ6MS41O30KCi8qIOKVkOKVkOKVkCBEQVNIQk9BUkQg4pWQ4pWQ4pWQICovCiNkYXNoe2Rpc3BsYXk6bm9uZTt9Ci50b3BiYXJ7cG9zaXRpb246c3RpY2t5O3RvcDowO3otaW5kZXg6MzA7YmFja2dyb3VuZDpyZ2JhKDQsNiwxOCwuOTQpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDE4cHgpO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5nOjAgMjJweDtoZWlnaHQ6NjBweDt9Ci50Yi1sZWZ0LC50Yi1yaWdodHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4O30KLnRiLW1hcmt7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDtib3JkZXItcmFkaXVzOjlweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI0VGNDQ0NCwjN0MyRDJEKTtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7fQoudGItbWFyayBzdmd7d2lkdGg6MTZweDtoZWlnaHQ6MTZweDtzdHJva2U6I2ZmZjtmaWxsOm5vbmU7c3Ryb2tlLXdpZHRoOjI7fQoudGItdGl0bGV7Zm9udC1mYW1pbHk6J1N5bmUnLHNhbnMtc2VyaWY7Zm9udC13ZWlnaHQ6ODAwO2ZvbnQtc2l6ZToxNnB4O30KLnRiLWJhZGdle2ZvbnQtc2l6ZToxMHB4O3BhZGRpbmc6M3B4IDlweDtiYWNrZ3JvdW5kOnJnYmEoMjM5LDY4LDY4LC4xNCk7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDIzOSw2OCw2OCwuMyk7Y29sb3I6I0ZDQTVBNTtib3JkZXItcmFkaXVzOjk5OXB4O2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tbGVmdDo4cHg7fQoubGl2ZS1waWxse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtmb250LXNpemU6MTEuNXB4O2NvbG9yOnZhcigtLWdyZWVuKTtmb250LXdlaWdodDo2MDA7fQoubGl2ZS1waWxsIHNwYW57d2lkdGg6N3B4O2hlaWdodDo3cHg7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDp2YXIoLS1ncmVlbik7YW5pbWF0aW9uOnB1bHNlIDJzIGluZmluaXRlO30KQGtleWZyYW1lcyBwdWxzZXswJSwxMDAle29wYWNpdHk6MX01MCV7b3BhY2l0eTouMjV9fQouYnRuLWxvZ291dHtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA1KTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Y29sb3I6dmFyKC0tZ3JheSk7cGFkZGluZzo4cHggMTVweDtib3JkZXItcmFkaXVzOjEwcHg7Y3Vyc29yOnBvaW50ZXI7Zm9udC1zaXplOjEyLjVweDtmb250LWZhbWlseTonRE0gU2Fucycsc2Fucy1zZXJpZjtmb250LXdlaWdodDo2MDA7fQoubWFpbnttYXgtd2lkdGg6MTQwMHB4O21hcmdpbjowIGF1dG87cGFkZGluZzoyNHB4IDIycHggNjBweDt9Ci50YWJze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMDI1KTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czo5OTlweDtwYWRkaW5nOjRweDttYXJnaW4tYm90dG9tOjIycHg7b3ZlcmZsb3cteDphdXRvO3dpZHRoOmZpdC1jb250ZW50O30KLnRhYntiYWNrZ3JvdW5kOnRyYW5zcGFyZW50O2JvcmRlcjpub25lO2NvbG9yOnZhcigtLWdyYXkpO2ZvbnQtc2l6ZToxM3B4O3BhZGRpbmc6OXB4IDE4cHg7Ym9yZGVyLXJhZGl1czo5OTlweDtjdXJzb3I6cG9pbnRlcjtmb250LWZhbWlseTonRE0gU2Fucycsc2Fucy1zZXJpZjtmb250LXdlaWdodDo2MDA7d2hpdGUtc3BhY2U6bm93cmFwO30KLnRhYi5hY3RpdmV7YmFja2dyb3VuZDpyZ2JhKDIzOSw2OCw2OCwuMTgpO2NvbG9yOiNGQ0E1QTU7fQoucGFnZXtkaXNwbGF5Om5vbmU7fSAucGFnZS5hY3RpdmV7ZGlzcGxheTpibG9jazthbmltYXRpb246ZmFkZWluIC4yNXMgZWFzZTt9CkBrZXlmcmFtZXMgZmFkZWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDZweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTpub25lfX0KLmtwaS1ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDUsMWZyKTtnYXA6MTRweDttYXJnaW4tYm90dG9tOjIycHg7fQoua3Bpe2JhY2tncm91bmQ6dmFyKC0tY2FyZCk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yYWRpdXM6MTZweDtwYWRkaW5nOjE4cHg7fQoua3BpLXZhbHtmb250LWZhbWlseTonU3luZScsc2Fucy1zZXJpZjtmb250LXdlaWdodDo4MDA7Zm9udC1zaXplOjI2cHg7bWFyZ2luLWJvdHRvbTo0cHg7fQoua3BpLWxibHtmb250LXNpemU6MTJweDtjb2xvcjp2YXIoLS1ncmF5KTt9Ci5rcGkub2sgLmtwaS12YWx7Y29sb3I6dmFyKC0tZ3JlZW4pO30gLmtwaS53YXJuIC5rcGktdmFse2NvbG9yOnZhcigtLWFtYmVyKTt9IC5rcGkuY3JpdCAua3BpLXZhbHtjb2xvcjp2YXIoLS1yZWQpO30KLmNhcmR7YmFja2dyb3VuZDp2YXIoLS1jYXJkKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czoxNnB4O3BhZGRpbmc6MjBweDttYXJnaW4tYm90dG9tOjE4cHg7fQouY2FyZC1oZWFkZXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjttYXJnaW4tYm90dG9tOjE2cHg7ZmxleC13cmFwOndyYXA7Z2FwOjEwcHg7fQouY2FyZC10aXRsZXtmb250LXNpemU6MTVweDtmb250LXdlaWdodDo3MDA7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O30KLnNlYXJjaC1ib3h7cGFkZGluZzo5cHggMTRweDtiYWNrZ3JvdW5kOnJnYmEoNCw2LDE4LC43KTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7Ym9yZGVyLXJhZGl1czo5OTlweDtjb2xvcjp2YXIoLS13aGl0ZSk7Zm9udC1zaXplOjEzcHg7b3V0bGluZTpub25lO3dpZHRoOjI0MHB4O2ZvbnQtZmFtaWx5OidETSBTYW5zJyxzYW5zLXNlcmlmO30KLnRibC13cmFwe292ZXJmbG93LXg6YXV0bzt9CnRhYmxle3dpZHRoOjEwMCU7Ym9yZGVyLWNvbGxhcHNlOmNvbGxhcHNlO21pbi13aWR0aDo2NDBweDt9CnRoe3RleHQtYWxpZ246bGVmdDtwYWRkaW5nOjEwcHg7Zm9udC1zaXplOjEwLjVweDtmb250LXdlaWdodDo3MDA7Y29sb3I6dmFyKC0tZ3JheSk7dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4wNWVtO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7d2hpdGUtc3BhY2U6bm93cmFwO30KdGR7cGFkZGluZzoxMXB4IDEwcHg7Zm9udC1zaXplOjEzcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgcmdiYSgyNDAsMjQzLDI1NSwuMDQpO30KLmJhZGdle2Rpc3BsYXk6aW5saW5lLWZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo1cHg7cGFkZGluZzo0cHggMTFweDtib3JkZXItcmFkaXVzOjk5OXB4O2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjcwMDt3aGl0ZS1zcGFjZTpub3dyYXA7fQouYi1va3tiYWNrZ3JvdW5kOnJnYmEoMTYsMTg1LDEyOSwuMTQpO2NvbG9yOnZhcigtLWdyZWVuKTt9IC5iLXdhcm57YmFja2dyb3VuZDpyZ2JhKDI0NSwxNTgsMTEsLjE0KTtjb2xvcjp2YXIoLS1hbWJlcik7fSAuYi1lcnJ7YmFja2dyb3VuZDpyZ2JhKDIzOSw2OCw2OCwuMTQpO2NvbG9yOnZhcigtLXJlZCk7fSAuYi1pbmZve2JhY2tncm91bmQ6cmdiYSg5NiwxNjUsMjUwLC4xNCk7Y29sb3I6dmFyKC0tYmx1ZS1sKTt9IC5iLXB1cnBsZXtiYWNrZ3JvdW5kOnJnYmEoMTM5LDkyLDI0NiwuMTQpO2NvbG9yOnZhcigtLXB1cnBsZSk7fQouYi1vayBzcGFuLCAuYmFkZ2Ugc3Bhbnt3aWR0aDo2cHg7aGVpZ2h0OjZweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOmN1cnJlbnRDb2xvcjtkaXNwbGF5OmlubGluZS1ibG9jazt9Ci5idG4tc217cGFkZGluZzo3cHggMTNweDtib3JkZXItcmFkaXVzOjk5OXB4O2ZvbnQtc2l6ZToxMS41cHg7Zm9udC13ZWlnaHQ6NzAwO2N1cnNvcjpwb2ludGVyO2ZvbnQtZmFtaWx5OidETSBTYW5zJyxzYW5zLXNlcmlmO2JvcmRlcjoxcHggc29saWQgdHJhbnNwYXJlbnQ7fQouYnRuLXN1c3BlbmR7YmFja2dyb3VuZDpyZ2JhKDI0NSwxNTgsMTEsLjE0KTtib3JkZXItY29sb3I6cmdiYSgyNDUsMTU4LDExLC4zKTtjb2xvcjp2YXIoLS1hbWJlcik7fQouYnRuLXJlc3RvcmV7YmFja2dyb3VuZDpyZ2JhKDE2LDE4NSwxMjksLjE0KTtib3JkZXItY29sb3I6cmdiYSgxNiwxODUsMTI5LC4zKTtjb2xvcjp2YXIoLS1ncmVlbik7fQouYnRuLWRlbGV0ZXtiYWNrZ3JvdW5kOnJnYmEoMjM5LDY4LDY4LC4xNCk7Ym9yZGVyLWNvbG9yOnJnYmEoMjM5LDY4LDY4LC4zKTtjb2xvcjp2YXIoLS1yZWQpO30KLmJ0bi12aWV3e2JhY2tncm91bmQ6cmdiYSg5NiwxNjUsMjUwLC4xNCk7Ym9yZGVyLWNvbG9yOnJnYmEoOTYsMTY1LDI1MCwuMyk7Y29sb3I6dmFyKC0tYmx1ZS1sKTt9Ci5idG4tc206ZGlzYWJsZWR7b3BhY2l0eTouNDtwb2ludGVyLWV2ZW50czpub25lO30KLnJvdy1hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6NnB4O2ZsZXgtd3JhcDp3cmFwO30KLmVtcHR5LXN0YXRle3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MzZweCAxNnB4O2NvbG9yOnZhcigtLWdyYXkpO30KLmFjdGl2aXR5LWl0ZW17ZGlzcGxheTpmbGV4O2dhcDoxMnB4O3BhZGRpbmc6MTJweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjQwLDI0MywyNTUsLjA0KTt9Ci5hY3Rpdml0eS1pdGVtOmxhc3QtY2hpbGR7Ym9yZGVyLWJvdHRvbTpub25lO30KLmFjdC1kb3R7d2lkdGg6OXB4O2hlaWdodDo5cHg7Ym9yZGVyLXJhZGl1czo1MCU7bWFyZ2luLXRvcDo1cHg7ZmxleC1zaHJpbms6MDt9Ci5hY3QtZG90LmJsdWV7YmFja2dyb3VuZDp2YXIoLS1ibHVlLWwpO30gLmFjdC1kb3QuZ3JlZW57YmFja2dyb3VuZDp2YXIoLS1ncmVlbik7fSAuYWN0LWRvdC5hbWJlcntiYWNrZ3JvdW5kOnZhcigtLWFtYmVyKTt9IC5hY3QtZG90LnJlZHtiYWNrZ3JvdW5kOnZhcigtLXJlZCk7fSAuYWN0LWRvdC5wdXJwbGV7YmFja2dyb3VuZDp2YXIoLS1wdXJwbGUpO30KLmFjdC10ZXh0e2ZvbnQtc2l6ZToxM3B4O2xpbmUtaGVpZ2h0OjEuNTt9IC5hY3QtdGV4dCBie2NvbG9yOnZhcigtLXdoaXRlKTt9IC5hY3QtdGltZXtmb250LXNpemU6MTEuNXB4O2NvbG9yOnZhcigtLWdyYXkpO21hcmdpbi10b3A6MnB4O30KLm1vZGFsLWJne3Bvc2l0aW9uOmZpeGVkO2luc2V0OjA7YmFja2dyb3VuZDpyZ2JhKDAsMCwwLC44KTtiYWNrZHJvcC1maWx0ZXI6Ymx1cig4cHgpO3otaW5kZXg6MjAwO2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtwYWRkaW5nOjIwcHg7fQoubW9kYWwtYmcuc2hvd3tkaXNwbGF5OmZsZXg7fQoubW9kYWwtYm94e2JhY2tncm91bmQ6cmdiYSg4LDEyLDMwLC45OCk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1ib3JkZXIpO2JvcmRlci1yYWRpdXM6MThweDtwYWRkaW5nOjI0cHg7d2lkdGg6MTAwJTttYXgtd2lkdGg6NDQwcHg7fQoubW9kYWwtYm94IGgze2ZvbnQtc2l6ZToxNnB4O21hcmdpbi1ib3R0b206MTBweDt9Ci5tb2RhbC1ib3ggcHtmb250LXNpemU6MTNweDtjb2xvcjp2YXIoLS1ncmF5KTtsaW5lLWhlaWdodDoxLjU1O21hcmdpbi1ib3R0b206MThweDt9Ci5tb2RhbC1hY3Rpb25ze2Rpc3BsYXk6ZmxleDtnYXA6MTBweDtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmQ7fQoubW9kYWwtYWN0aW9ucyBidXR0b257cGFkZGluZzoxMHB4IDE4cHg7Ym9yZGVyLXJhZGl1czoxMHB4O2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjcwMDtjdXJzb3I6cG9pbnRlcjtmb250LWZhbWlseTonRE0gU2Fucycsc2Fucy1zZXJpZjtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWJvcmRlcik7YmFja2dyb3VuZDp0cmFuc3BhcmVudDtjb2xvcjp2YXIoLS13aGl0ZSk7fQoubW9kYWwtYWN0aW9ucyAuY29uZmlybS1kYW5nZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLCNEQzI2MjYsI0VGNDQ0NCk7Ym9yZGVyOm5vbmU7Y29sb3I6I2ZmZjt9Ci5tb2RhbC1hY3Rpb25zIC5jb25maXJtLXdhcm57YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTE1ZGVnLCNEOTc3MDYsI0Y1OUUwQik7Ym9yZGVyOm5vbmU7Y29sb3I6I2ZmZjt9Ci50b2FzdC1jb250e3Bvc2l0aW9uOmZpeGVkO2JvdHRvbToyMHB4O3JpZ2h0OjIwcHg7ei1pbmRleDo5OTk7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O30KLnRvYXN0e3BhZGRpbmc6MTJweCAxNnB4O2JvcmRlci1yYWRpdXM6MTFweDtmb250LXNpemU6MTNweDtjb2xvcjojZmZmO21heC13aWR0aDozMjBweDtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNHB4KTt0cmFuc2Zvcm06dHJhbnNsYXRlWCgxNTAlKTt0cmFuc2l0aW9uOnRyYW5zZm9ybSAuM3MgZWFzZTt9Ci50b2FzdC52aXNpYmxle3RyYW5zZm9ybTp0cmFuc2xhdGVYKDApO30KLnRvYXN0LnN1Y2Nlc3N7YmFja2dyb3VuZDpyZ2JhKDE2LDE4NSwxMjksLjIpO2JvcmRlcjoxcHggc29saWQgcmdiYSgxNiwxODUsMTI5LC40NSk7fQoudG9hc3QuZXJyb3J7YmFja2dyb3VuZDpyZ2JhKDIzOSw2OCw2OCwuMik7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDIzOSw2OCw2OCwuNDUpO30KLnRvYXN0LmluZm97YmFja2dyb3VuZDpyZ2JhKDM3LDk5LDIzNSwuMik7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDM3LDk5LDIzNSwuNDUpO30KQG1lZGlhKG1heC13aWR0aDoxMTAwcHgpey5rcGktZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsMWZyKTt9fQpAbWVkaWEobWF4LXdpZHRoOjcwMHB4KXsua3BpLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLDFmcik7fSAubWFpbntwYWRkaW5nOjE4cHggMTRweCA1MHB4O30gLnNlYXJjaC1ib3h7d2lkdGg6MTAwJTt9fQo8L3N0eWxlPgo8L2hlYWQ+Cjxib2R5Pgo8ZGl2IGlkPSJsb2dpblNjcmVlbiI+CiAgPGRpdiBjbGFzcz0ibG9naW4tY2FyZCI+CiAgICA8ZGl2IGNsYXNzPSJsb2dpbi1tYXJrIj48c3ZnIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDIgMyA2djZjMCA1IDMuOCA5LjQgOSAxMSA1LjItMS42IDktNiA5LTExVjZsLTktNFoiLz48cGF0aCBkPSJNOSAxMmwyIDIgNC00Ii8+PC9zdmc+PC9kaXY+CiAgICA8aDE+U3VwZXIgQWRtaW4gRW50cmVGbG93PC9oMT4KICAgIDxwPkFjY8OocyBleHBsb2l0YW50IOKAlCB2aXNpb24gZ2xvYmFsZSBzdXIgdG91dGVzIGxlcyBlbnRyZXByaXNlczwvcD4KICAgIDxkaXYgY2xhc3M9ImZnIj48bGFiZWw+Q2zDqSBkJ2FjY8OocyBtYcOudHJlPC9sYWJlbD48aW5wdXQgdHlwZT0icGFzc3dvcmQiIGlkPSJzdXBlclNlY3JldCIgcGxhY2Vob2xkZXI9IuKAouKAouKAouKAouKAouKAouKAouKAouKAouKAouKAouKAoiIgYXV0b2NvbXBsZXRlPSJvZmYiPjwvZGl2PgogICAgPGJ1dHRvbiBjbGFzcz0iYnRuLWxvZ2luIiBpZD0ibG9naW5CdG4iPkFjY8OpZGVyIGF1IHBhbm5lYXU8L2J1dHRvbj4KICAgIDxkaXYgY2xhc3M9ImxvZ2luLWVyciIgaWQ9ImxvZ2luRXJyIj48L2Rpdj4KICAgIDxwIGNsYXNzPSJsb2dpbi1ub3RlIj5DZXQgZXNwYWNlIGRvbm5lIGFjY8OocyBhdXggZG9ubsOpZXMgZGUgdG91dGVzIGxlcyBlbnRyZXByaXNlcyBjbGllbnRlcy4gTmUgcGFydGFnZSBqYW1haXMgY2V0dGUgY2zDqS48L3A+CiAgPC9kaXY+CjwvZGl2PgoKPGRpdiBpZD0iZGFzaCI+CiAgPGRpdiBjbGFzcz0idG9hc3QtY29udCIgaWQ9InRvYXN0Q29udCI+PC9kaXY+CiAgPGRpdiBjbGFzcz0idG9wYmFyIj4KICAgIDxkaXYgY2xhc3M9InRiLWxlZnQiPgogICAgICA8ZGl2IGNsYXNzPSJ0Yi1tYXJrIj48c3ZnIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDIgMyA2djZjMCA1IDMuOCA5LjQgOSAxMSA1LjItMS42IDktNiA5LTExVjZsLTktNFoiLz48L3N2Zz48L2Rpdj4KICAgICAgPGRpdiBzdHlsZT0id2lkdGg6MjhweDtoZWlnaHQ6MjhweDtib3JkZXItcmFkaXVzOjhweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI0VGNDQ0NCwjN0MyRDJEKTtjb2xvcjojZmZmO2ZvbnQtZmFtaWx5OidTeW5lJyxzYW5zLXNlcmlmO2ZvbnQtd2VpZ2h0OjgwMDtmb250LXNpemU6MTVweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luLWxlZnQ6OHB4O2JveC1zaGFkb3c6MCAwIDEwcHggcmdiYSgyMzksNjgsNjgsLjM1KTsiPkU8L2Rpdj4KICAgICAgPHNwYW4gY2xhc3M9InRiLXRpdGxlIj5FbnRyZUZsb3c8L3NwYW4+CiAgICAgIDxzcGFuIGNsYXNzPSJ0Yi1iYWRnZSI+U1VQRVIgQURNSU48L3NwYW4+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9InRiLXJpZ2h0Ij4KICAgICAgPHNwYW4gY2xhc3M9ImxpdmUtcGlsbCI+PHNwYW4+PC9zcGFuPlN5bmNocm9uaXPDqTwvc3Bhbj4KICAgICAgPGJ1dHRvbiBjbGFzcz0iYnRuLWxvZ291dCIgaWQ9ImxvZ291dEJ0biI+RMOpY29ubmV4aW9uPC9idXR0b24+CiAgICA8L2Rpdj4KICA8L2Rpdj4KCiAgPGRpdiBjbGFzcz0ibWFpbiI+CiAgICA8ZGl2IGNsYXNzPSJ0YWJzIj4KICAgICAgPGJ1dHRvbiBjbGFzcz0idGFiIGFjdGl2ZSIgZGF0YS10YWI9Im92ZXJ2aWV3Ij5WdWUgZCdlbnNlbWJsZTwvYnV0dG9uPgogICAgICA8YnV0dG9uIGNsYXNzPSJ0YWIiIGRhdGEtdGFiPSJjb21wYW5pZXMiPkVudHJlcHJpc2VzPC9idXR0b24+CiAgICAgIDxidXR0b24gY2xhc3M9InRhYiIgZGF0YS10YWI9ImVtcGxveWVlcyI+RW1wbG95w6lzPC9idXR0b24+CiAgICAgIDxidXR0b24gY2xhc3M9InRhYiIgZGF0YS10YWI9Im9ubGluZSI+RW4gbGlnbmU8L2J1dHRvbj4KICAgICAgPGJ1dHRvbiBjbGFzcz0idGFiIiBkYXRhLXRhYj0iYWN0aXZpdHkiPkFjdGl2aXTDqSBkdSBzaXRlPC9idXR0b24+CiAgICA8L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJwYWdlIGFjdGl2ZSIgaWQ9InRhYi1vdmVydmlldyI+CiAgICAgIDxkaXYgY2xhc3M9ImtwaS1ncmlkIj4KICAgICAgICA8ZGl2IGNsYXNzPSJrcGkiPjxkaXYgY2xhc3M9ImtwaS12YWwiIGlkPSJrcGktY29tcGFuaWVzIj7igJQ8L2Rpdj48ZGl2IGNsYXNzPSJrcGktbGJsIj5FbnRyZXByaXNlczwvZGl2PjwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImtwaSI+PGRpdiBjbGFzcz0ia3BpLXZhbCIgaWQ9ImtwaS1lbXBsb3llZXMiPuKAlDwvZGl2PjxkaXYgY2xhc3M9ImtwaS1sYmwiPkVtcGxvecOpczwvZGl2PjwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9ImtwaSBvayI+PGRpdiBjbGFzcz0ia3BpLXZhbCIgaWQ9ImtwaS1vbmxpbmUiPuKAlDwvZGl2PjxkaXYgY2xhc3M9ImtwaS1sYmwiPkVuIGxpZ25lIG1haW50ZW5hbnQ8L2Rpdj48L2Rpdj4KICAgICAgICA8ZGl2IGNsYXNzPSJrcGkgd2FybiI+PGRpdiBjbGFzcz0ia3BpLXZhbCIgaWQ9ImtwaS1zdXNwZW5kZWQiPuKAlDwvZGl2PjxkaXYgY2xhc3M9ImtwaS1sYmwiPkNvbXB0ZXMgc3VzcGVuZHVzPC9kaXY+PC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0ia3BpIj48ZGl2IGNsYXNzPSJrcGktdmFsIiBpZD0ia3BpLXNhbGVzLXRvZGF5Ij7igJQ8L2Rpdj48ZGl2IGNsYXNzPSJrcGktbGJsIj5WZW50ZXMgYXVqb3VyZCdodWk8L2Rpdj48L2Rpdj4KICAgICAgPC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9ImNhcmQiPgogICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtaGVhZGVyIj48ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj5BY3Rpdml0w6kgcsOpY2VudGUgZHUgc2l0ZTwvZGl2PjwvZGl2PgogICAgICAgIDxkaXYgaWQ9Im92ZXJ2aWV3QWN0aXZpdHkiPjxkaXYgY2xhc3M9ImVtcHR5LXN0YXRlIj5DaGFyZ2VtZW504oCmPC9kaXY+PC9kaXY+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CgogICAgPGRpdiBjbGFzcz0icGFnZSIgaWQ9InRhYi1jb21wYW5pZXMiPgogICAgICA8ZGl2IGNsYXNzPSJjYXJkIj4KICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWhlYWRlciI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj5FbnRyZXByaXNlcyBjbGllbnRlczwvZGl2PgogICAgICAgICAgPGlucHV0IGNsYXNzPSJzZWFyY2gtYm94IiBpZD0iY29tcGFueVNlYXJjaCIgcGxhY2Vob2xkZXI9IlJlY2hlcmNoZXIgdW5lIGVudHJlcHJpc2XigKYiIG9uaW5wdXQ9ImZpbHRlclRhYmxlKCdjb21wYW5pZXNCb2R5JywgdGhpcy52YWx1ZSkiPgogICAgICAgIDwvZGl2PgogICAgICAgIDxkaXYgY2xhc3M9InRibC13cmFwIj48dGFibGU+CiAgICAgICAgICA8dGhlYWQ+PHRyPjx0aD5FbnRyZXByaXNlPC90aD48dGg+UmVzcG9uc2FibGU8L3RoPjx0aD5FbWFpbDwvdGg+PHRoPlTDqWzDqXBob25lPC90aD48dGg+RW1wbG95w6lzPC90aD48dGg+U3RhdHV0PC90aD48dGg+Q3LDqcOpZSBsZTwvdGg+PHRoPkFjdGlvbnM8L3RoPjwvdHI+PC90aGVhZD4KICAgICAgICAgIDx0Ym9keSBpZD0iY29tcGFuaWVzQm9keSI+PHRyPjx0ZCBjb2xzcGFuPSI4Ij48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+Q2hhcmdlbWVudOKApjwvZGl2PjwvdGQ+PC90cj48L3Rib2R5PgogICAgICAgIDwvdGFibGU+PC9kaXY+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CgogICAgPGRpdiBjbGFzcz0icGFnZSIgaWQ9InRhYi1lbXBsb3llZXMiPgogICAgICA8ZGl2IGNsYXNzPSJjYXJkIj4KICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLWhlYWRlciI+CiAgICAgICAgICA8ZGl2IGNsYXNzPSJjYXJkLXRpdGxlIj5FbXBsb3nDqXMgKHRvdXRlcyBlbnRyZXByaXNlcyk8L2Rpdj4KICAgICAgICAgIDxpbnB1dCBjbGFzcz0ic2VhcmNoLWJveCIgaWQ9ImVtcGxveWVlU2VhcmNoIiBwbGFjZWhvbGRlcj0iUmVjaGVyY2hlciB1biBlbXBsb3nDqeKApiIgb25pbnB1dD0iZmlsdGVyVGFibGUoJ2VtcGxveWVlc0JvZHknLCB0aGlzLnZhbHVlKSI+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0idGJsLXdyYXAiPjx0YWJsZT4KICAgICAgICAgIDx0aGVhZD48dHI+PHRoPk5vbTwvdGg+PHRoPkVudHJlcHJpc2U8L3RoPjx0aD5Qb3N0ZTwvdGg+PHRoPlTDqWzDqXBob25lPC90aD48dGg+U3RhdHV0PC90aD48dGg+Q3LDqcOpIGxlPC90aD48dGg+QWN0aW9uczwvdGg+PC90cj48L3RoZWFkPgogICAgICAgICAgPHRib2R5IGlkPSJlbXBsb3llZXNCb2R5Ij48dHI+PHRkIGNvbHNwYW49IjciPjxkaXYgY2xhc3M9ImVtcHR5LXN0YXRlIj5DaGFyZ2VtZW504oCmPC9kaXY+PC90ZD48L3RyPjwvdGJvZHk+CiAgICAgICAgPC90YWJsZT48L2Rpdj4KICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KCiAgICA8ZGl2IGNsYXNzPSJwYWdlIiBpZD0idGFiLW9ubGluZSI+CiAgICAgIDxkaXYgY2xhc3M9ImNhcmQiPgogICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtaGVhZGVyIj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPkNvbm5lY3TDqXMgbWFpbnRlbmFudCA8c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0tZ3JheSk7Zm9udC13ZWlnaHQ6NDAwO2ZvbnQtc2l6ZToxMnB4OyI+KGFjdGlmcyBkYW5zIGxlcyAyIGRlcm5pw6hyZXMgbWludXRlcyk8L3NwYW4+PC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0idGJsLXdyYXAiPjx0YWJsZT4KICAgICAgICAgIDx0aGVhZD48dHI+PHRoPk5vbTwvdGg+PHRoPlLDtGxlPC90aD48dGg+RW50cmVwcmlzZTwvdGg+PHRoPlZpbGxlIC8gUGF5czwvdGg+PHRoPkFkcmVzc2UgSVA8L3RoPjx0aD5BcHBhcmVpbDwvdGg+PHRoPkRlcHVpczwvdGg+PC90cj48L3RoZWFkPgogICAgICAgICAgPHRib2R5IGlkPSJvbmxpbmVCb2R5Ij48dHI+PHRkIGNvbHNwYW49IjciPjxkaXYgY2xhc3M9ImVtcHR5LXN0YXRlIj5DaGFyZ2VtZW504oCmPC9kaXY+PC90ZD48L3RyPjwvdGJvZHk+CiAgICAgICAgPC90YWJsZT48L2Rpdj4KICAgICAgICA8cCBzdHlsZT0iZm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tZ3JheS1kKTttYXJnaW4tdG9wOjEycHg7bGluZS1oZWlnaHQ6MS41OyI+TG9jYWxpc2F0aW9uIGVzdGltw6llIMOgIHBhcnRpciBkZSBsJ2FkcmVzc2UgSVAsIHByw6ljaXNpb24gdmlsbGUuIFZQTiBwb3NzaWJsZS48L3A+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CgogICAgPGRpdiBjbGFzcz0icGFnZSIgaWQ9InRhYi1hY3Rpdml0eSI+CiAgICAgIDxkaXYgY2xhc3M9ImNhcmQiPgogICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtaGVhZGVyIj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImNhcmQtdGl0bGUiPkpvdXJuYWwgZCdhY3Rpdml0w6kgY29tcGxldDwvZGl2PgogICAgICAgICAgPGJ1dHRvbiBjbGFzcz0iYnRuLXNtIGJ0bi12aWV3IiBpZD0iYWN0aXZpdHlSZWZyZXNoIj5BY3R1YWxpc2VyPC9idXR0b24+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBpZD0iYWN0aXZpdHlGZWVkIj48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+Q2hhcmdlbWVudOKApjwvZGl2PjwvZGl2PgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogIDwvZGl2Pgo8L2Rpdj4KCjxkaXYgY2xhc3M9Im1vZGFsLWJnIiBpZD0iY29uZmlybU1vZGFsIj4KICA8ZGl2IGNsYXNzPSJtb2RhbC1ib3giPgogICAgPGgzIGlkPSJjb25maXJtVGl0bGUiPkNvbmZpcm1lciBsJ2FjdGlvbjwvaDM+CiAgICA8cCBpZD0iY29uZmlybVRleHQiPjwvcD4KICAgIDxkaXYgY2xhc3M9Im1vZGFsLWFjdGlvbnMiPgogICAgICA8YnV0dG9uIGlkPSJjb25maXJtQ2FuY2VsIj5Bbm51bGVyPC9idXR0b24+CiAgICAgIDxidXR0b24gaWQ9ImNvbmZpcm1CdG4iIGNsYXNzPSJjb25maXJtLXdhcm4iPkNvbmZpcm1lcjwvYnV0dG9uPgogICAgPC9kaXY+CiAgPC9kaXY+CjwvZGl2PgoKPHNjcmlwdD4KY29uc3QgQVBJX0JBU0U9KGxvY2F0aW9uLm9yaWdpbitsb2NhdGlvbi5wYXRobmFtZSkucmVwbGFjZSgvXFwvKyQvLCcnKTsKZnVuY3Rpb24gYXBpKGFjdGlvbixwYXlsb2FkKXsKICBjb25zdCBib2R5PU9iamVjdC5hc3NpZ24oe2FjdGlvbix0b2tlbjpBRE1JTl9UT0tFTn0scGF5bG9hZHx8e30pOwogIGNvbnN0IHI9YXdhaXQgZmV0Y2goQVBJX0JBU0Use21ldGhvZDonUE9TVCcsaGVhZGVyczp7J0NvbnRlbnQtVHlwZSc6J3RleHQvcGxhaW47Y2hhcnNldD11dGYtOCd9LGJvZHk6SlNPTi5zdHJpbmdpZnkoYm9keSl9KTsKICBjb25zdCB0ZXh0PWF3YWl0IHIudGV4dCgpOwogIGxldCBkYXRhPXt9OyB0cnl7ZGF0YT1KU09OLnBhcnNlKHRleHQpO31jYXRjaChlKXt9CiAgaWYoIXIub2t8fGRhdGEub2s9PT1mYWxzZSkgdGhyb3cgbmV3IEVycm9yKGRhdGEuZXJyb3J8fCdFcnJldXIgc2VydmV1cicpOwogIHJldHVybiBkYXRhLnJlc3VsdCE9PXVuZGVmaW5lZD9kYXRhLnJlc3VsdDpkYXRhOwp9CmxldCBBRE1JTl9UT0tFTj0nJzsKZnVuY3Rpb24gdG9hc3QobXNnLHR5cGUpeyBjb25zdCBjPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdENvbnQnKTsgY29uc3QgZWw9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IGVsLmNsYXNzTmFtZT0ndG9hc3QgJysodHlwZXx8J2luZm8nKTsgZWwudGV4dENvbnRlbnQ9bXNnOyBjLmFwcGVuZENoaWxkKGVsKTsgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT5lbC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJykpOyBzZXRUaW1lb3V0KCgpPT57IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTsgc2V0VGltZW91dCgoKT0+ZWwucmVtb3ZlKCksMzAwKTsgfSwzNjAwKTsgfQpmdW5jdGlvbiBlc2Moc3RyKXsgaWYoc3RyPT09bnVsbHx8c3RyPT09dW5kZWZpbmVkKSByZXR1cm4gJyc7IHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC8mL2csJyZhbXA7JykucmVwbGFjZSgvPC9nLCcmbHQ7JykucmVwbGFjZSgvPi9nLCcmZ3Q7JykucmVwbGFjZSgvIi9nLCcmcXVvdDsnKTsgfQpmdW5jdGlvbiBjb25maXJtQWN0aW9uKHRpdGxlLHRleHQsY2IsZGFuZ2VyKXsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uZmlybVRpdGxlJykudGV4dENvbnRlbnQ9dGl0bGU7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1UZXh0JykudGV4dENvbnRlbnQ9dGV4dDsKICBjb25zdCBidG49ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1CdG4nKTsKICBidG4uY2xhc3NOYW1lPWRhbmdlcj8nY29uZmlybS1kYW5nZXInOidjb25maXJtLXdhcm4nOwogIGJ0bi50ZXh0Q29udGVudD0nQ29uZmlybWVyJzsKICBfY29uZmlybUNiPWNiOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25maXJtTW9kYWwnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7Cn0KZnVuY3Rpb24gY2xvc2VDb25maXJtKCl7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25maXJtTW9kYWwnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7IF9jb25maXJtQ2I9bnVsbDsgfQpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29uZmlybUJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKT0+eyBpZihfY29uZmlybUNiKSBfY29uZmlybUNiKCk7IGNsb3NlQ29uZmlybSgpOyB9KTsKZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbmZpcm1DYW5jZWwnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsY2xvc2VDb25maXJtKTsKYXN5bmMgZnVuY3Rpb24gZG9TdXBlckxvZ2luKCl7CiAgY29uc3QgdmFsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdXBlclNlY3JldCcpLnZhbHVlLnRyaW0oKTsKICBjb25zdCBlcnI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luRXJyJyk7IGVyci5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7CiAgY29uc3QgYnRuPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbkJ0bicpOyBidG4uZGlzYWJsZWQ9dHJ1ZTsgYnRuLnRleHRDb250ZW50PSdWw6lyaWZpY2F0aW9u4oCmJzsKICB0cnl7CiAgICBBRE1JTl9UT0tFTj0nJzsKICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaSgnc3VwZXJBZG1pbkxvZ2luJyx7c2VjcmV0OnZhbH0pOwogICAgQURNSU5fVE9LRU4gPSBTdHJpbmcoKHJlcyYmcmVzLnRva2VuKXx8JycpLnRyaW0oKSB8fCBBRE1JTl9UT0tFTjsKICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2VmX2FkbWluX3NlY3JldCcsQURNSU5fVE9LRU4pOwogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luU2NyZWVuJykuc3R5bGUuZGlzcGxheT0nbm9uZSc7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGFzaCcpLnN0eWxlLmRpc3BsYXk9J2Jsb2NrJzsKICAgIHN0YXJ0RGFzaGJvYXJkKCk7CiAgfWNhdGNoKGUpeyBlcnIudGV4dENvbnRlbnQ9J0Nsw6kgaW52YWxpZGUgb3UgYWNjw6hzIHJlZnVzw6kuJzsgZXJyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTsgQURNSU5fVE9LRU49Jyc7IH0KICBmaW5hbGx5eyBidG4uZGlzYWJsZWQ9ZmFsc2U7IGJ0bi50ZXh0Q29udGVudD0nQWNjw6lkZXIgYXUgcGFubmVhdSc7IH0KfQpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nb3V0QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57IHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2VmX2FkbWluX3NlY3JldCcpOyBsb2NhdGlvbi5yZWxvYWQoKTsgfSk7CgpmdW5jdGlvbiBnb1RhYihpZCxidG4pewogIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5mb3JFYWNoKHQ9PnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpOwogIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlJykuZm9yRWFjaChwPT5wLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKTsKICBidG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RhYi0nK2lkKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTsKICBpZihpZD09PSdjb21wYW5pZXMnKSBsb2FkQ29tcGFuaWVzKCk7CiAgaWYoaWQ9PT0nZW1wbG95ZWVzJykgbG9hZEVtcGxveWVlcygpOwogIGlmKGlkPT09J29ubGluZScpIGxvYWRPbmxpbmUoKTsKICBpZihpZD09PSdhY3Rpdml0eScpIGxvYWRBY3Rpdml0eSgpOwp9CmZ1bmN0aW9uIGZpbHRlclRhYmxlKGJvZHlJZCxxKXsgY29uc3QgbmVlZGxlPXEudHJpbSgpLnRvTG93ZXJDYXNlKCk7IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnK2JvZHlJZCsnIHRyJykuZm9yRWFjaChyID0+IHIuc3R5bGUuZGlzcGxheSA9IHIudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhuZWVkbGUpID8gJycgOiAnbm9uZScpOyB9CgpmdW5jdGlvbiBzdGFydERhc2hib2FyZCgpeyBsb2FkT3ZlcnZpZXcoKTsgc2V0SW50ZXJ2YWwoKCk9PnsgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhYi5hY3RpdmUnKT8uZGF0YXNldC50YWI9PT0nb25saW5lJykgbG9hZE9ubGluZSgpOyB9LDE1MDAwKTsgfQphc3luYyBmdW5jdGlvbiBsb2FkT3ZlcnZpZXcoKXsgdHJ5IHsgY29uc3QgZD1hd2FpdCBhcGkoJ3N1cGVyQWRtaW5PdmVydmlldycpOyBzZXRLUElzKGQpOyByZW5kZXJBY3Rpdml0eShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcnZpZXdBY3Rpdml0eScpLChkLnJlY2VudF9hY3Rpdml0eXx8W10pLnNsaWNlKDAsMTIpKTt9IGNhdGNoKGUpeyB0b2FzdCgnRXJyZXVyIDogJytlLm1lc3NhZ2UsJ2Vycm9yJyk7IH0gfQpmdW5jdGlvbiBzZXRLUElzKGQpeyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna3BpLWNvbXBhbmllcycpLnRleHRDb250ZW50PWQuY29tcGFuaWVzX2NvdW50Pz8wOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna3BpLWVtcGxveWVlcycpLnRleHRDb250ZW50PWQuZW1wbG95ZWVzX2NvdW50Pz8wOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna3BpLW9ubGluZScpLnRleHRDb250ZW50PWQub25saW5lX2NvdW50Pz8wOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna3BpLXN1c3BlbmRlZCcpLnRleHRDb250ZW50PWQuc3VzcGVuZGVkX2NvdW50Pz8wOyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgna3BpLXNhbGVzLXRvZGF5JykudGV4dENvbnRlbnQ9ZC5zYWxlc190b2RheV9jb3VudD8/MDsgfQpmdW5jdGlvbiB0aW1lU2luY2UoZGF0ZSl7IGNvbnN0IHNlYz1NYXRoLmZsb29yKChEYXRlLm5vdygpLWRhdGUuZ2V0VGltZSgpKS8xMDAwKTsgaWYoc2VjPDYwKSByZXR1cm4gJ8OgIGxcJ2luc3RhbnQnOyBjb25zdCBtaW49TWF0aC5mbG9vcihzZWMvNjApOyByZXR1cm4gJ2lsIHkgYSAnK21pbisnIG1pbic7IH0KZnVuY3Rpb24gYWN0aXZpdHlEb3QoYWN0aW9uKXsgaWYoL1NBTEV8VkVOVEUvaS50ZXN0KGFjdGlvbikpIHJldHVybiAnZ3JlZW4nOyBpZigvUVVPVEV8REVWSVMvaS50ZXN0KGFjdGlvbikpIHJldHVybiAnYmx1ZSc7IGlmKC9ERUxFVEV8U1VQUFJ8Q0FOQ0VML2kudGVzdChhY3Rpb24pKSByZXR1cm4gJ3JlZCc7IGlmKC9TVVNQRU5EfFJFU1RPUkUvaS50ZXN0KGFjdGlvbikpIHJldHVybiAnYW1iZXInOyBpZigvTE9HSU58Q09OTkVYL2kudGVzdChhY3Rpb24pKSByZXR1cm4gJ3B1cnBsZSc7IHJldHVybiAnYmx1ZSc7IH0KZnVuY3Rpb24gcmVuZGVyQWN0aXZpdHkoY29udGFpbmVyLGl0ZW1zKXsKICBpZighaXRlbXMubGVuZ3RoKXsgY29udGFpbmVyLmlubmVySFRNTD0nPGRpdiBjbGFzcz0iZW1wdHktc3RhdGUiPkF1Y3VuZSBhY3Rpdml0w6kgcsOpY2VudGU8L2Rpdj4nOyByZXR1cm47IH0KICBjb250YWluZXIuaW5uZXJIVE1MPWl0ZW1zLm1hcChpdD0+ewogICAgY29uc3QgZG90PWFjdGl2aXR5RG90KGl0LmFjdGlvbnx8JycpOwogICAgY29uc3QgdGltZT1pdC5jcmVhdGVkX2F0P25ldyBEYXRlKGl0LmNyZWF0ZWRfYXQpLnRvTG9jYWxlU3RyaW5nKCdmci1GUicpOicnOwogICAgcmV0dXJuICc8ZGl2IGNsYXNzPSJhY3Rpdml0eS1pdGVtIj48ZGl2IGNsYXNzPSJhY3QtZG90ICcrZG90KyciPjwvZGl2PjxkaXY+PGRpdiBjbGFzcz0iYWN0LXRleHQiPicrZXNjKGl0LmRldGFpbHN8fGl0LmFjdGlvbnx8JycpKycgPGI+Jytlc2MoaXQudXRpbGlzYXRldXJfZW1haWx8fCcnKSsnPC9iPjwvZGl2PjxkaXYgY2xhc3M9ImFjdC10aW1lIj4nK3RpbWUrJzwvZGl2PjwvZGl2PjwvZGl2Pic7CiAgfSkuam9pbignJyk7Cn0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2aXR5UmVmcmVzaCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxsb2FkQWN0aXZpdHkpOwphc3luYyBmdW5jdGlvbiBsb2FkQWN0aXZpdHkoKXsgY29uc3QgYz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZpdHlGZWVkJyk7IHRyeSB7IGNvbnN0IGQ9YXdhaXQgYXBpKCdzdXBlckFkbWluQWN0aXZpdHlGZWVkJyx7bGltaXQ6MTUwfSk7IHJlbmRlckFjdGl2aXR5KGMsZC5pdGVtc3x8W10pO30gY2F0Y2goZSl7IGMuaW5uZXJIVE1MPSc8ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+RXJyZXVyIDogJytlc2MoZS5tZXNzYWdlKSsnPC9kaXY+JzsgfSB9CmFzeW5jIGZ1bmN0aW9uIGxvYWRDb21wYW5pZXMoKXsKICBjb25zdCBib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21wYW5pZXNCb2R5Jyk7CiAgdHJ5ewogICAgY29uc3QgbGlzdD1hd2FpdCBhcGkoJ3N1cGVyQWRtaW5MaXN0Q29tcGFuaWVzJyk7CiAgICBpZighbGlzdC5sZW5ndGgpeyBib2R5LmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSI4Ij48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+QXVjdW5lIGVudHJlcHJpc2U8L2Rpdj48L3RkPjwvdHI+JzsgcmV0dXJuOyB9CiAgICBib2R5LmlubmVySFRNTD1saXN0Lm1hcChjPT57CiAgICAgIGNvbnN0IHN1c3BlbmRlZD1TdHJpbmcoYy5zdGF0dXQpLnRvTG93ZXJDYXNlKCk9PT0nc3VzcGVuZHUnOwogICAgICBjb25zdCBiYWRnZT1zdXNwZW5kZWQ/JzxzcGFuIGNsYXNzPSJiYWRnZSBiLWVyciI+PHNwYW4+PC9zcGFuPlN1c3BlbmR1ZTwvc3Bhbj4nOic8c3BhbiBjbGFzcz0iYmFkZ2UgYi1vayI+PHNwYW4+PC9zcGFuPkFjdGl2ZTwvc3Bhbj4nOwogICAgICByZXR1cm4gJzx0cj48dGQgc3R5bGU9ImZvbnQtd2VpZ2h0OjcwMCI+Jytlc2MoYy5uYW1lKSsnPC90ZD48dGQ+Jytlc2MoYy5vd25lcl9uYW1lfHwn4oCUJykrJzwvdGQ+PHRkIHN0eWxlPSJjb2xvcjp2YXIoLS1ncmF5KSI+Jytlc2MoYy5vd25lcl9lbWFpbHx8J+KAlCcpKyc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6dmFyKC0tZ3JheSkiPicrZXNjKGMucGhvbmV8fCfigJQnKSsnPC90ZD48dGQ+JysoYy5lbXBsb3llZXNfY291bnR8fDApKyc8L3RkPjx0ZD4nK2JhZGdlKyc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6dmFyKC0tZ3JheSkiPicrKGMuY3JlYXRlZF9hdD9uZXcgRGF0ZShjLmNyZWF0ZWRfYXQpLnRvTG9jYWxlRGF0ZVN0cmluZygnZnItRlInKTon4oCUJykrJzwvdGQ+PHRkPjxkaXYgY2xhc3M9InJvdy1hY3Rpb25zIiBkYXRhLWlkPSInK2VzYyhjLmlkKSsnIiBkYXRhLXR5cGU9ImNvbXBhbnkiPjxidXR0b24gY2xhc3M9ImJ0bi1zbSBidG4tdG9nZ2xlIiBkYXRhLWFjdGlvbj0idG9nZ2xlIiBkYXRhLXN1c3BlbmRlZD0iJytzdXNwZW5kZWQrJyI+Jysoc3VzcGVuZGVkPydSw6lhY3RpdmVyJzonU3VzcGVuZHJlJykrJzwvYnV0dG9uPjxidXR0b24gY2xhc3M9ImJ0bi1zbSBidG4tZGVsZXRlIiBkYXRhLWFjdGlvbj0iZGVsZXRlIj5TdXBwcmltZXI8L2J1dHRvbj48L2Rpdj48L3RkPjwvdHI+JzsKICAgIH0pLmpvaW4oJycpOwogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NvbXBhbmllc0JvZHkgLmJ0bi10b2dnbGUnKS5mb3JFYWNoKGI9PmIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57CiAgICAgIGNvbnN0IGlkPWIuY2xvc2VzdCgnW2RhdGEtaWRdJykuZGF0YXNldC5pZDsKICAgICAgY29uc3Qgc3VzcGVuZGVkPWIuZGF0YXNldC5zdXNwZW5kZWQ9PT0ndHJ1ZSc7CiAgICAgIGNvbnN0IHRpdGxlPXN1c3BlbmRlZD8nUsOpYWN0aXZlciBsXCdlbnRyZXByaXNlJzonU3VzcGVuZHJlIGxcJ2VudHJlcHJpc2UnOwogICAgICBjb25zdCB0ZXh0PXN1c3BlbmRlZD8nTFwnZW50cmVwcmlzZSBldCB0b3VzIHNlcyBlbXBsb3nDqXMgcG91cnJvbnQgZGUgbm91dmVhdSBzZSBjb25uZWN0ZXIuJzonTGUgcGF0cm9uIEVUIHRvdXMgc2VzIGVtcGxvecOpcyBzZXJvbnQgaW1tw6lkaWF0ZW1lbnQgYmxvcXXDqXMuJzsKICAgICAgY29uZmlybUFjdGlvbih0aXRsZSx0ZXh0LGFzeW5jKCk9PnsgYXdhaXQgYXBpKCdzdXBlckFkbWluU3VzcGVuZENvbXBhbnknLHtjb21wYW55SWQ6aWQsc3VzcGVuZDohc3VzcGVuZGVkfSk7IHRvYXN0KHN1c3BlbmRlZD8nRW50cmVwcmlzZSByw6lhY3RpdsOpZS4nOidFbnRyZXByaXNlIHN1c3BlbmR1ZS4nLCdzdWNjZXNzJyk7IGxvYWRDb21wYW5pZXMoKTsgbG9hZE92ZXJ2aWV3KCk7IH0sIXN1c3BlbmRlZCk7CiAgICB9KSk7CiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjY29tcGFuaWVzQm9keSAuYnRuLWRlbGV0ZScpLmZvckVhY2goYj0+Yi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PnsKICAgICAgY29uc3QgaWQ9Yi5jbG9zZXN0KCdbZGF0YS1pZF0nKS5kYXRhc2V0LmlkOwogICAgICBjb25maXJtQWN0aW9uKCdTdXBwcmltZXIgZMOpZmluaXRpdmVtZW50JywnQWN0aW9uIElSUsOJVkVSU0lCTEUgOiBsXCdlbnRyZXByaXNlIGV0IHNvbiBjb21wdGUgcmVzcG9uc2FibGUgc2Vyb250IHN1cHByaW3DqXMuIExlcyBkb25uw6llcyBoaXN0b3JpcXVlcyByZXN0ZW50IGRhbnMgbGEgZmV1aWxsZS4nLGFzeW5jKCk9PnsgYXdhaXQgYXBpKCdzdXBlckFkbWluRGVsZXRlQ29tcGFueScse2NvbXBhbnlJZDppZH0pOyB0b2FzdCgnRW50cmVwcmlzZSBzdXBwcmltw6llLicsJ3N1Y2Nlc3MnKTsgbG9hZENvbXBhbmllcygpOyBsb2FkT3ZlcnZpZXcoKTsgfSx0cnVlKTsKICAgIH0pKTsKICB9Y2F0Y2goZSl7IGJvZHkuaW5uZXJIVE1MPSc8dHI+PHRkIGNvbHNwYW49IjgiPjxkaXYgY2xhc3M9ImVtcHR5LXN0YXRlIj5FcnJldXIgOiAnK2VzYyhlLm1lc3NhZ2UpKyc8L2Rpdj48L3RkPjwvdHI+JzsgfQp9CmFzeW5jIGZ1bmN0aW9uIGxvYWRFbXBsb3llZXMoKXsKICBjb25zdCBib2R5PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXBsb3llZXNCb2R5Jyk7CiAgdHJ5ewogICAgY29uc3QgbGlzdD1hd2FpdCBhcGkoJ3N1cGVyQWRtaW5MaXN0RW1wbG95ZWVzJyk7CiAgICBpZighbGlzdC5sZW5ndGgpeyBib2R5LmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSI3Ij48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+QXVjdW4gZW1wbG95w6k8L2Rpdj48L3RkPjwvdHI+JzsgcmV0dXJuOyB9CiAgICBib2R5LmlubmVySFRNTD1saXN0Lm1hcChlPT57CiAgICAgIGNvbnN0IHN1c3BlbmRlZD1TdHJpbmcoZS5zdGF0dXQpLnRvTG93ZXJDYXNlKCkhPT0nYWN0aWYnOwogICAgICBjb25zdCBiYWRnZT1zdXNwZW5kZWQ/JzxzcGFuIGNsYXNzPSJiYWRnZSBiLWVyciI+PHNwYW4+PC9zcGFuPlN1c3BlbmR1PC9zcGFuPic6JzxzcGFuIGNsYXNzPSJiYWRnZSBiLW9rIj48c3Bhbj48L3NwYW4+QWN0aWY8L3NwYW4+JzsKICAgICAgcmV0dXJuICc8dHI+PHRkIHN0eWxlPSJmb250LXdlaWdodDo3MDAiPicrZXNjKGUuZnVsbF9uYW1lKSsnPC90ZD48dGQgc3R5bGU9ImNvbG9yOnZhcigtLWdyYXkpIj4nK2VzYyhlLmNvbXBhbnlfbmFtZXx8J+KAlCcpKyc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6dmFyKC0tZ3JheSkiPicrZXNjKGUucG9zdGV8fCfigJQnKSsnPC90ZD48dGQgc3R5bGU9ImNvbG9yOnZhcigtLWdyYXkpIj4nK2VzYyhlLnBob25lfHwn4oCUJykrJzwvdGQ+PHRkPicrYmFkZ2UrJzwvdGQ+PHRkIHN0eWxlPSJjb2xvcjp2YXIoLS1ncmF5KSI+JysoZS5jcmVhdGVkX2F0P25ldyBEYXRlKGUuY3JlYXRlZF9hdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdmci1GUicpOifigJQnKSsnPC90ZD48dGQ+PGRpdiBjbGFzcz0icm93LWFjdGlvbnMiIGRhdGEtaWQ9IicrZXNjKGUuaWQpKyciIGRhdGEtdHlwZT0iZW1wbG95ZWUiPjxidXR0b24gY2xhc3M9ImJ0bi1zbSBidG4tdG9nZ2xlIiBkYXRhLWFjdGlvbj0idG9nZ2xlIiBkYXRhLXN1c3BlbmRlZD0iJytzdXNwZW5kZWQrJyI+Jysoc3VzcGVuZGVkPydSw6lhY3RpdmVyJzonU3VzcGVuZHJlJykrJzwvYnV0dG9uPjxidXR0b24gY2xhc3M9ImJ0bi1zbSBidG4tZGVsZXRlIiBkYXRhLWFjdGlvbj0iZGVsZXRlIj5TdXBwcmltZXI8L2J1dHRvbj48L2Rpdj48L3RkPjwvdHI+JzsKICAgIH0pLmpvaW4oJycpOwogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2VtcGxveWVlc0JvZHkgLmJ0bi10b2dnbGUnKS5mb3JFYWNoKGI9PmIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT57CiAgICAgIGNvbnN0IGlkPWIuY2xvc2VzdCgnW2RhdGEtaWRdJykuZGF0YXNldC5pZDsKICAgICAgY29uc3Qgc3VzcGVuZGVkPWIuZGF0YXNldC5zdXNwZW5kZWQ9PT0ndHJ1ZSc7CiAgICAgIGNvbmZpcm1BY3Rpb24oc3VzcGVuZGVkPydSw6lhY3RpdmVyIGxcJ2VtcGxvecOpJzonU3VzcGVuZHJlIGxcJ2VtcGxvecOpJyxzdXNwZW5kZWQ/J0xcJ2VtcGxvecOpIHBvdXJyYSBkZSBub3V2ZWF1IHNlIGNvbm5lY3Rlci4nOidMXCdlbXBsb3nDqSBuZSBwb3VycmEgcGx1cyBzZSBjb25uZWN0ZXIuJyxhc3luYygpPT57IGF3YWl0IGFwaSgnc3VwZXJBZG1pblN1c3BlbmRFbXBsb3llZScse2VtcGxveWVlSWQ6aWQsc3VzcGVuZDohc3VzcGVuZGVkfSk7IHRvYXN0KHN1c3BlbmRlZD8nRW1wbG95w6kgcsOpYWN0aXbDqS4nOidFbXBsb3nDqSBzdXNwZW5kdS4nLCdzdWNjZXNzJyk7IGxvYWRFbXBsb3llZXMoKTsgbG9hZE92ZXJ2aWV3KCk7IH0sIXN1c3BlbmRlZCk7CiAgICB9KSk7CiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjZW1wbG95ZWVzQm9keSAuYnRuLWRlbGV0ZScpLmZvckVhY2goYj0+Yi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PnsKICAgICAgY29uc3QgaWQ9Yi5jbG9zZXN0KCdbZGF0YS1pZF0nKS5kYXRhc2V0LmlkOwogICAgICBjb25maXJtQWN0aW9uKCdTdXBwcmltZXInLCdTdXBwcmltZXIgZMOpZmluaXRpdmVtZW50IGxcJ2FjY8OocyBkZSBjZXQgZW1wbG95w6kuIEFjdGlvbiBpcnLDqXZlcnNpYmxlLicsYXN5bmMoKT0+eyBhd2FpdCBhcGkoJ3N1cGVyQWRtaW5EZWxldGVFbXBsb3llZScse2VtcGxveWVlSWQ6aWR9KTsgdG9hc3QoJ0VtcGxvecOpIHN1cHByaW3DqS4nLCdzdWNjZXNzJyk7IGxvYWRFbXBsb3llZXMoKTsgbG9hZE92ZXJ2aWV3KCk7IH0sdHJ1ZSk7CiAgICB9KSk7CiAgfWNhdGNoKGUpeyBib2R5LmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSI3Ij48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+RXJyZXVyIDogJytlc2MoZS5tZXNzYWdlKSsnPC9kaXY+PC90ZD48L3RyPic7IH0KfQphc3luYyBmdW5jdGlvbiBsb2FkT25saW5lKCl7CiAgY29uc3QgYm9keT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb25saW5lQm9keScpOwogIHRyeXsKICAgIGNvbnN0IGxpc3Q9YXdhaXQgYXBpKCdzdXBlckFkbWluTGlzdE9ubGluZScpOwogICAgaWYoIWxpc3QubGVuZ3RoKXsgYm9keS5pbm5lckhUTUw9Jzx0cj48dGQgY29sc3Bhbj0iNyI+PGRpdiBjbGFzcz0iZW1wdHktc3RhdGUiPlBlcnNvbm5lIGVuIGxpZ25lIGFjdHVlbGxlbWVudDwvZGl2PjwvdGQ+PC90cj4nOyByZXR1cm47IH0KICAgIGJvZHkuaW5uZXJIVE1MPWxpc3QubWFwKHM9PnsKICAgICAgY29uc3Qgcm9sZUJhZGdlPXMucm9sZT09PSdvd25lcic/JzxzcGFuIGNsYXNzPSJiYWRnZSBiLXB1cnBsZSI+UGF0cm9uPC9zcGFuPic6cy5yb2xlPT09J2VtcGxveWVlJz8nPHNwYW4gY2xhc3M9ImJhZGdlIGItaW5mbyI+RW1wbG95w6k8L3NwYW4+JzonPHNwYW4gY2xhc3M9ImJhZGdlIGItZXJyIj5TdXBlciBBZG1pbjwvc3Bhbj4nOwogICAgICBjb25zdCBsb2M9W3MuY2l0eSxzLmNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpfHwn4oCUJzsKICAgICAgcmV0dXJuICc8dHI+PHRkIHN0eWxlPSJmb250LXdlaWdodDo3MDAiPicrZXNjKHMubGFiZWx8fCfigJQnKSsnPC90ZD48dGQ+Jytyb2xlQmFkZ2UrJzwvdGQ+PHRkIHN0eWxlPSJjb2xvcjp2YXIoLS1ncmF5KSI+Jytlc2Mocy5jb21wYW55X25hbWV8fCfigJQnKSsnPC90ZD48dGQgc3R5bGU9ImNvbG9yOnZhcigtLWdyYXkpIj4nK2VzYyhsb2MpKyc8L3RkPjx0ZCBzdHlsZT0iY29sb3I6dmFyKC0tZ3JheSkiPicrZXNjKHMuaXB8fCfigJQnKSsnPC90ZD48dGQgc3R5bGU9ImNvbG9yOnZhcigtLWdyYXkpIj4nK2VzYyhzLnVzZXJfYWdlbnRfc2hvcnR8fCfigJQnKSsnPC90ZD48dGQgc3R5bGU9ImNvbG9yOnZhcigtLWdyZWVuKTtmb250LXdlaWdodDo2MDAiPicrdGltZVNpbmNlKG5ldyBEYXRlKHMubGFzdF9zZWVuKSkrJzwvdGQ+PC90cj4nOwogICAgfSkuam9pbignJyk7CiAgfWNhdGNoKGUpeyBib2R5LmlubmVySFRNTD0nPHRyPjx0ZCBjb2xzcGFuPSI3Ij48ZGl2IGNsYXNzPSJlbXB0eS1zdGF0ZSI+RXJyZXVyIDogJytlc2MoZS5tZXNzYWdlKSsnPC9kaXY+PC90ZD48L3RyPic7IH0KfQooZnVuY3Rpb24gaW5pdCgpeyB0cnl7IGNvbnN0IHQ9c2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZWZfYWRtaW5fc2VjcmV0Jyk7IGlmKHQpeyBBRE1JTl9UT0tFTj10OyBhcGkoJ3N1cGVyQWRtaW5Mb2dpbicpLnRoZW4oKCk9PnsgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luU2NyZWVuJykuc3R5bGUuZGlzcGxheT0nbm9uZSc7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXNoJykuc3R5bGUuZGlzcGxheT0nYmxvY2snOyBzdGFydERhc2hib2FyZCgpOyB9KS5jYXRjaCgoKT0+c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnZWZfYWRtaW5fc2VjcmV0JykpOyB9IH1jYXRjaChlKXt9IH0pKCk7Cjwvc2NyaXB0Pgo8L2JvZHk+CjwvaHRtbD4K')).getDataAsString();
    return HtmlService.createHtmlOutput(html).setTitle('EntreFlow — Super Admin').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput('<pre>' + err + '</pre>');
  }
}

function generateAdminPwaSvg_(size) {
  const s = size || 192;
  const pad = Math.floor(s * 0.15);
  const r = s * 0.22;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '">' +
    '<rect width="' + s + '" height="' + s + '" rx="' + (s * 0.22) + '" fill="#040810"/>' +
    '<rect x="' + pad + '" y="' + pad + '" width="' + (s - pad * 2) + '" height="' + (s - pad * 2) + '" rx="' + r + '" fill="#EF4444"/>' +
    '<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="' + (s * 0.55) + '" fill="#fff">E</text>' +
    '</svg>';
}
function generateAdminManifest_() {
  const url = (ScriptApp.getService().getUrl() || 'https://script.google.com/macros/s/SCRIPT_ID/exec') + '?admin=1';
  return JSON.stringify({
    name: 'EntreFlow Super Admin',
    short_name: 'EntreFlow',
    start_url: url,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#040810',
    theme_color: '#040810',
    icons: [
      { src: url + '&icon=192', sizes: '192x192', type: 'image/svg+xml' },
      { src: url + '&icon=512', sizes: '512x512', type: 'image/svg+xml' }
    ]
  });
}
function generateAdminIcon_(size) {
  return ContentService.createTextOutput(generateAdminPwaSvg_(size || 192)).setMimeType('image/svg+xml');
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.options) return jsonResp_({ ok: true });
  if (params.sign && params.t) return servePublicSignPage_(params.sign, params.t);
  if (params.employeeLogin) return HtmlService.createHtmlOutput(buildEmployeeCodeLoginHTML_()).setTitle('Connexion Espace Vendeur').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  if (params.employeeToken) return serveEmployeePortal_(params.employeeToken);
  if (params.admin == '1') {
    if (params.manifest) return HtmlService.createHtmlOutput(generateAdminManifest_()).setMimeType('application/json');
    if (params.icon) return generateAdminIcon_(parseInt(params.icon) || 192);
    return serveSuperAdminPage_();
  }
  return jsonResp_({ ok: true, app: 'EntreFlow v14', status: 'running' });
}
function doPost(e) { return handleRequest_(e); }
function doOptions(e) { return jsonResp_({ ok: true }); }
function servePublicSignPage_(quoteId, token) {
  try {
    const detail = getQuoteDetail_({ id: quoteId });
    if (!detail || String(detail.quote.sign_token) !== String(token)) {
      return HtmlService.createHtmlOutput('<html><body style="font-family:Arial;padding:40px;text-align:center;background:#F1F5F9;"><h2>Lien invalide</h2><p>Ce lien de signature est invalide ou a expiré.</p></body></html>').setTitle('Lien invalide');
    }
    const company = getCompanyById_(detail.quote.company_id) || {};
    return HtmlService.createHtmlOutput(buildSignPageHTML_(detail.quote, detail.items, company))
      .setTitle('Devis ' + detail.quote.quote_number + ' — Signature')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput('<html><body style="font-family:Arial;padding:40px;color:#EF4444;"><h2>Erreur</h2><p>' + err.message + '</p></body></html>');
  }
}
function serveEmployeePortal_(token) {
  try {
    const emp = findEmployeeByToken_({ token });
    if (!emp) return HtmlService.createHtmlOutput('<html><body style="font-family:Arial;padding:40px;text-align:center;background:#040810;color:#EEF2FF;"><h2>Accès refusé</h2><p>Lien invalide ou expiré.</p></body></html>').setTitle('EntreFlow — Accès refusé');
    if (String(emp.statut) !== 'actif') return HtmlService.createHtmlOutput('<html><body style="font-family:Arial;padding:40px;text-align:center;background:#040810;color:#EEF2FF;"><h2>Compte inactif</h2></body></html>').setTitle('EntreFlow — Compte inactif');
    const dashData = getEmployeeDashboard_({ token });
    return HtmlService.createHtmlOutput(buildEmployeePortalHTML_(emp, dashData)).setTitle('Espace Vendeur — ' + emp.full_name).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (e) {
    return HtmlService.createHtmlOutput('<html><body style="font-family:Arial;padding:40px;color:#EF4444;background:#040810;"><h2>Erreur</h2><p>' + e.message + '</p></body></html>');
  }
}
function doOptions(e) {
  const out = jsonResp_({ ok: true });
  try {
    out.setHeader('Access-Control-Allow-Origin', '*');
    out.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    out.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    out.setHeader('Access-Control-Max-Age', '86400');
  } catch(_) {}
  return out;
}
function jsonResp_(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  try {
    out.setHeader('Access-Control-Allow-Origin', '*');
  } catch(_) {}
  return out;
}
function getSuperAdminSecret_() {
  try { return PropertiesService.getScriptProperties().getProperty('ENTREFLOW_SUPER_ADMIN_SECRET') || ''; }
  catch (e) { return ''; }
}
function requireSuperAdmin_(token) {
  const secret = String(getSuperAdminSecret_() || '').trim();
  if (!secret) return false;
  const t = String(token || '').trim();
  return t === secret;
}
function superAdminLogin_(data) {
  const secret = String(data && data.secret || '').trim();
  const real = String(getSuperAdminSecret_() || '').trim();
  if (!real || secret !== real) return { ok: false, error: 'Secret invalide.' };
  return { ok: true, token: secret };
}
function superAdminOverview_(token) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    const sessionsSh = ss.getSheetByName(CONFIG.SHEETS.SESSIONS);
    const salesSh = ss.getSheetByName(CONFIG.SHEETS.SALES);
    const auditSh = ss.getSheetByName(CONFIG.SHEETS.AUDIT_LOG);
    const companiesCount = companiesSh ? Math.max(0, companiesSh.getDataRange().getNumRows() - 1) : 0;
    const employeesCount = employeesSh ? Math.max(0, employeesSh.getDataRange().getNumRows() - 1) : 0;
    let onlineCount = 0;
    if (sessionsSh) {
      const now = new Date();
      const twoMinAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const data = sessionsSh.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) { const last = data[i][4]; if (last instanceof Date && last > twoMinAgo) onlineCount++; }
    }
    let suspendedCount = 0;
    if (companiesSh) {
      const data = companiesSh.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) { if (String(data[i][13]).toLowerCase() === 'suspendu') suspendedCount++; }
    }
    if (employeesSh) {
      const data = employeesSh.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) { if (String(data[i][11]).toLowerCase() !== 'actif') suspendedCount++; }
    }
    let salesTodayCount = 0;
    if (salesSh) {
      const data = salesSh.getDataRange().getValues();
      const today = new Date(); today.setHours(0,0,0,0);
      for (let i = 1; i < data.length; i++) { const created = data[i][15]; if (created instanceof Date && created >= today) salesTodayCount++; }
    }
    let recentActivity = [];
    if (auditSh) {
      const data = auditSh.getDataRange().getValues();
      const rows = data.slice(1).reverse().slice(0, 12);
      recentActivity = rows.map(r => ({ action: r[1], details: r[5], utilisateur_email: r[4], created_at: r[6] }));
    }
    return { companies_count: companiesCount, employees_count: employeesCount, online_count: onlineCount, suspended_count: suspendedCount, sales_today_count: salesTodayCount, recent_activity: recentActivity };
  } catch (e) { return { error: e.message }; }
}
function superAdminListCompanies_(token) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    const usersSh = ss.getSheetByName(CONFIG.SHEETS.USERS);
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    if (!companiesSh) return { error: 'Feuille entreprises introuvable.' };
    const companies = companiesSh.getDataRange().getValues();
    const users = usersSh ? usersSh.getDataRange().getValues() : [];
    const employees = employeesSh ? employeesSh.getDataRange().getValues() : [];
    const userMap = {}; for (let i = 1; i < users.length; i++) userMap[String(users[i][0])] = users[i];
    const empCountByCompany = {}; for (let i = 1; i < employees.length; i++) { const cid = String(employees[i][1]); empCountByCompany[cid] = (empCountByCompany[cid] || 0) + 1; }
    const list = [];
    for (let i = 1; i < companies.length; i++) {
      const row = companies[i]; const owner = userMap[String(row[1])];
      list.push({ id: String(row[0]), name: row[2] || '', owner_name: owner ? (owner[1] + ' ' + owner[2]) : '', owner_email: owner ? owner[3] : '', phone: row[3] || '', employees_count: empCountByCompany[String(row[0])] || 0, statut: row[13] || 'actif', created_at: row[14] });
    }
    return list;
  } catch (e) { return { error: e.message }; }
}
function superAdminListEmployees_(token) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    if (!employeesSh) return { error: 'Feuille employés introuvable.' };
    const employees = employeesSh.getDataRange().getValues();
    const companies = companiesSh ? companiesSh.getDataRange().getValues() : [];
    const compMap = {}; for (let i = 1; i < companies.length; i++) compMap[String(companies[i][0])] = companies[i][2];
    const list = [];
    for (let i = 1; i < employees.length; i++) {
      const row = employees[i];
      list.push({ id: String(row[0]), full_name: row[3] || '', company_name: compMap[String(row[1])] || '', poste: row[7] || '', phone: row[4] || '', statut: row[11] || '', created_at: row[12] });
    }
    return list;
  } catch (e) { return { error: e.message }; }
}
function superAdminListOnline_(token) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sessionsSh = ss.getSheetByName(CONFIG.SHEETS.SESSIONS);
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    if (!sessionsSh) return [];
    const now = new Date();
    const twoMinAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const sessions = sessionsSh.getDataRange().getValues();
    const employees = employeesSh ? employeesSh.getDataRange().getValues() : [];
    const companies = companiesSh ? companiesSh.getDataRange().getValues() : [];
    const empMap = {}; for (let i = 1; i < employees.length; i++) empMap[String(employees[i][0])] = employees[i];
    const compMap = {}; for (let i = 1; i < companies.length; i++) compMap[String(companies[i][0])] = companies[i][2];
    const list = [];
    for (let i = 1; i < sessions.length; i++) {
      const s = sessions[i]; const last = s[4];
      if (last instanceof Date && last > twoMinAgo) {
        let label = s[1] || '', role = s[2] || '', companyName = '', ip = s[5] || '', ua = s[9] || '', city = s[7] || '', country = s[8] || '';
        if (role === 'owner' || role === 'employee') { const emp = empMap[String(s[3])]; if (emp) { label = emp[3]; companyName = compMap[String(emp[1])] || ''; } }
        list.push({ label, role, company_name: companyName, city, country, ip, user_agent_short: ua.length > 40 ? ua.slice(0, 40) + '…' : ua, last_seen: last });
      }
    }
    return list;
  } catch (e) { return { error: e.message }; }
}
function superAdminActivityFeed_(token, payload) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const auditSh = ss.getSheetByName(CONFIG.SHEETS.AUDIT_LOG);
    if (!auditSh) return { items: [] };
    const limit = Math.min((payload && payload.limit) ? Number(payload.limit) : 150, 500);
    const data = auditSh.getDataRange().getValues();
    const rows = data.slice(1).reverse().slice(0, limit);
    const items = rows.map(r => ({ action: r[1], details: r[5], utilisateur_email: r[4], created_at: r[6] }));
    return { items };
  } catch (e) { return { error: e.message }; }
}
function superAdminSuspendCompany_(token, payload) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    if (!companiesSh) return { error: 'Feuille entreprises introuvable.' };
    const companyId = String(payload && payload.companyId || '').trim();
    const suspend = !!(payload && payload.suspend);
    if (!companyId) return { error: 'companyId requis.' };
    const data = companiesSh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === companyId) {
        const newStatut = suspend ? 'suspendu' : 'actif';
        if (String(data[i][13]).toLowerCase() !== String(newStatut).toLowerCase()) {
          companiesSh.getRange(i + 1, 14).setValue(newStatut);
          logAudit_('superAdminSuspendCompany', 'Boutiques', companyId, 'superadmin', 'Statut entreprise changé en ' + newStatut + ' par Super Admin');
        }
        break;
      }
    }
    if (suspend && employeesSh) {
      const edata = employeesSh.getDataRange().getValues();
      for (let i = 1; i < edata.length; i++) {
        if (String(edata[i][1]) === companyId && String(edata[i][11]).toLowerCase() === 'actif') {
          employeesSh.getRange(i + 1, 12).setValue('inactif');
          logAudit_('superAdminSuspendCompany', 'Employes', String(edata[i][0]), 'superadmin', 'Employé suspendu automatiquement avec l\'entreprise.');
        }
      }
    }
    return { ok: true };
  } catch (e) { return { error: e.message }; }
}
function superAdminDeleteCompany_(token, payload) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const companiesSh = ss.getSheetByName(CONFIG.SHEETS.COMPANIES);
    const usersSh = ss.getSheetByName(CONFIG.SHEETS.USERS);
    if (!companiesSh) return { error: 'Feuille entreprises introuvable.' };
    const companyId = String(payload && payload.companyId || '').trim();
    if (!companyId) return { error: 'companyId requis.' };
    const data = companiesSh.getDataRange().getValues();
    let ownerId = '';
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === companyId) {
        ownerId = String(data[i][1]);
        companiesSh.getRange(i + 1, 1).setValue('__DELETED__' + companyId);
        companiesSh.getRange(i + 1, 15).setValue(new Date());
        companiesSh.getRange(i + 1, 14).setValue('supprimee');
        break;
      }
    }
    if (ownerId && usersSh) {
      const udata = usersSh.getDataRange().getValues();
      for (let i = 1; i < udata.length; i++) {
        if (String(udata[i][0]) === ownerId) {
          usersSh.getRange(i + 1, 1).setValue('__DELETED__' + ownerId);
          usersSh.getRange(i + 1, 13).setValue('supprime');
          usersSh.getRange(i + 1, 15).setValue(new Date());
          break;
        }
      }
    }
    logAudit_('superAdminDeleteCompany', 'Boutiques', companyId, 'superadmin', 'Entreprise supprimée par Super Admin.');
    return { ok: true };
  } catch (e) { return { error: e.message }; }
}
function superAdminSuspendEmployee_(token, payload) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    if (!employeesSh) return { error: 'Feuille employés introuvable.' };
    const employeeId = String(payload && payload.employeeId || '').trim();
    const suspend = !!(payload && payload.suspend);
    if (!employeeId) return { error: 'employeeId requis.' };
    const data = employeesSh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === employeeId) {
        const newStatut = suspend ? 'suspendu' : 'actif';
        if (String(data[i][11]).toLowerCase() !== String(newStatut).toLowerCase()) {
          employeesSh.getRange(i + 1, 12).setValue(newStatut);
          logAudit_('superAdminSuspendEmployee', 'Employes', employeeId, 'superadmin', 'Statut employé changé en ' + newStatut);
        }
        break;
      }
    }
    return { ok: true };
  } catch (e) { return { error: e.message }; }
}
function superAdminDeleteEmployee_(token, payload) {
  if (!requireSuperAdmin_(token)) return { error: 'Accès refusé.' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const employeesSh = ss.getSheetByName(CONFIG.SHEETS.EMPLOYEES);
    if (!employeesSh) return { error: 'Feuille employés introuvable.' };
    const employeeId = String(payload && payload.employeeId || '').trim();
    if (!employeeId) return { error: 'employeeId requis.' };
    const data = employeesSh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === employeeId) {
        employeesSh.getRange(i + 1, 1).setValue('__DELETED__' + employeeId);
        employeesSh.getRange(i + 1, 12).setValue('supprime');
        employeesSh.getRange(i + 1, 13).setValue(new Date());
        break;
      }
    }
    logAudit_('superAdminDeleteEmployee', 'Employes', employeeId, 'superadmin', 'Employé supprimé par Super Admin.');
    return { ok: true };
  } catch (e) { return { error: e.message }; }
}
function heartbeat_(token, payload) {
  if (!token) return { ok: false, error: 'token requis' };
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sessionsSh = ss.getSheetByName(CONFIG.SHEETS.SESSIONS);
    if (!sessionsSh) return { ok: false, error: 'Sessions introuvable.' };
    const role = String((payload && payload.role) || '').trim();
    const label = String((payload && payload.label) || '').trim();
    const email = String((payload && payload.email) || '').trim() || label;
    const ip = String((payload && payload.visitor_ip) || '').trim();
    const city = String((payload && payload.visitor_city) || '').trim();
    const country = String((payload && payload.visitor_country) || '').trim();
    const ua = String((payload && payload.user_agent) || '').trim();
    const now = new Date();
    let updated = false;
    const data = sessionsSh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]) === String(token)) {
        sessionsSh.getRange(i + 1, 5).setValue(now);
        sessionsSh.getRange(i + 1, 3).setValue(label);
        sessionsSh.getRange(i + 1, 4).setValue(role);
        sessionsSh.getRange(i + 1, 7).setValue(email);
        if (ip) sessionsSh.getRange(i + 1, 8).setValue(ip);
        updated = true; break;
      }
    }
    if (!updated) {
      sessionsSh.appendRow([now.toISOString(), token, label, role, now, 1, email, ip, city, country, ua]);
    }
    return { ok: true };
  } catch (e) { return { error: e.message }; }
}

const PUBLIC_NO_AUTH = ['login', 'loginUser', 'registerUser', 'forgotPassword', 'confirmSignature', 'setupSheet', 'employeeLoginByCode', 'requestBossResetCode', 'verifyResetCode', 'resetBossPassword'];
const SCOPED_ACTIONS = new Set([
  'createSale', 'updateSale', 'cancelSale', 'createQuote', 'createClient', 'createProduct',
  'updateStock', 'restockProduct', 'createEmployee', 'deleteEmployee', 'permanentDeleteEmployee', 'updateCompany', 'updateProduct',
  'deleteProduct', 'permanentDeleteProduct', 'updateClient', 'deleteClient', 'createBranch',
  'deleteQuote', 'signQuote', 'generateQuotePDF', 'restoreTrash'
]);
/** Actions strictement réservées au boss (scope 'admin') — jamais un employé */
/* P1: createCompany retiré de la liste publique — réservé à l'exploitant du SaaS. */
const ADMIN_ONLY_ACTIONS = new Set(['getDailySalesByEmployee', 'listEmployees', 'createEmployee', 'deleteEmployee', 'permanentDeleteEmployee', 'createCompany', 'createDefaultCompany']);

function handleRequest_(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.contents) { try { data = JSON.parse(e.postData.contents); } catch (_) {} }
    const action = String(data.action || '').trim();
    if (!action) return jsonResp_({ ok: false, error: 'action requis' });

    if (action === 'confirmSignature') return jsonResp_({ ok: true, result: confirmQuoteSignature_(data) });
    if (action === 'employeeLoginByCode') return jsonResp_({ ok: true, result: employeeLoginByCode_(data) });

    let access = null;
    if (SCOPED_ACTIONS.has(action) || ADMIN_ONLY_ACTIONS.has(action)) {
      access = verifyAccess_(data);
      if (!access.ok) return jsonResp_({ ok: false, error: access.error });
      if (ADMIN_ONLY_ACTIONS.has(action) && access.scope !== 'admin' && access.scope !== 'owner') return jsonResp_({ ok: false, error: "Accès réservé au responsable de l'entreprise." });
      data = scopePayload_(data, access);
    } else if (!PUBLIC_NO_AUTH.includes(action)) {
      access = verifyAccess_(data);
      if (!access.ok) return jsonResp_({ ok: false, error: access.error });
      if (access.scope === 'employee' || access.scope === 'owner') data = scopePayload_(data, access);
    }

    let result;
    switch (action) {
      case 'registerUser':            result = registerUser(data); break;
      case 'login': case 'loginUser': return jsonResp_(loginUser_(data));
      case 'logout':                  result = logoutUser_(data); break;
      case 'forgotPassword':          result = forgotPassword(data.email); break;
      case 'requestBossResetCode':    result = requestBossResetCode(data); break;
      case 'verifyResetCode':         result = verifyResetCode(data); break;
      case 'resetBossPassword':       result = resetBossPassword(data); break;
      case 'init':                    result = init_(data); break;

      case 'getCompanyByEmail':       result = getCompanyByEmail_(data); break;
      case 'createCompany':           result = createCompany_(data); break;
      case 'createDefaultCompany':    result = createDefaultCompany_(data); break;
      case 'updateCompany':           result = updateCompany_(data); break;
      case 'listBranches':            result = listBranches_(data); break;
      case 'createBranch':            result = createBranch_(data); break;

      case 'createProduct':           result = createProduct_(data); break;
      case 'listProducts':            result = listProducts_(data); break;
      case 'getProduct':              result = getProduct_(data); break;
      case 'updateProduct':           result = updateProduct_(data); break;
      case 'deleteProduct':           result = deleteProduct_(data); break;
      case 'permanentDeleteProduct':  result = permanentDeleteProduct_(data); break;

      case 'listStock':               result = listStock_(data); break;
      case 'updateStock':             result = updateStock_(data); break;
      case 'restockProduct':          result = restockProduct_(data); break;

      case 'createClient':            result = createClient_(data); break;
      case 'listClients':             result = listClients_(data); break;
      case 'getClient':               result = getClient_(data); break;
      case 'updateClient':            result = updateClient_(data); break;
      case 'deleteClient':            result = deleteClient_(data); break;

      case 'createEmployee':          result = createEmployee_(data); break;
      case 'listEmployees':           result = listEmployees_(data); break;
      case 'deleteEmployee':          result = deleteEmployee_(data); break;
      case 'permanentDeleteEmployee': result = permanentDeleteEmployee_(data); break;
      case 'findEmployeeByToken':     result = findEmployeeByToken_(data); break;
      case 'getEmployeeDashboard':    result = getEmployeeDashboard_(data); break;
      case 'getEmployeeStats':        result = getEmployeeStats_(data); break;
      case 'listSalesByEmployee':     result = listSalesByEmployee_(data); break;
      case 'getDailySalesByEmployee': result = getDailySalesByEmployee_(data); break;

      case 'createSale':              result = saveSaleRecord_(data); break;
      case 'updateSale':              result = updateSale_(data); break;
      case 'listSales':               result = listSales_(data); break;
      case 'listSaleItems':           result = listSaleItems_(); break;
      case 'cancelSale':              result = cancelSale_(data); break;

      case 'createQuote':             result = createQuote_(data); break;
      case 'listQuotes':              result = listQuotes_(data); break;
      case 'getQuoteDetail':          result = getQuoteDetail_(data); break;
      case 'generateQuotePDF':        result = generateQuotePDF_(data); break;
      case 'sendQuoteSignLink':       result = sendQuoteSignLink_(data); break;
      case 'signQuote':                result = signQuote_(data); break;
      case 'deleteQuote':             result = deleteQuote_(data); break;

      case 'submitAvis':              result = submitAvis_(data); break;
      case 'listAvis':                result = listAvis_(); break;
      case 'repondreAvis':            result = repondreAvis_(data); break;
      case 'shouldShowAvisPrompt':    result = shouldShowAvisPrompt_(data); break;

      case 'contactAdmin':            result = contactAdmin_(data); break;
      case 'listTrash':               result = listTrash_(); break;
      case 'restoreTrash':            result = restoreTrashItem_(data); break;

      case 'listNotifications':       result = listNotifications_(data); break;
      case 'markNotificationsRead':   result = markNotificationsRead_(data); break;

      case 'getRevenueHistory':       result = getRevenueHistory_(data); break;
      case 'getRevenueHistoryDetail': result = getRevenueHistoryDetail_(data); break;

      case 'superAdminOverview':      result = superAdminOverview_(data.token, data); break;
      case 'superAdminLogin':        result = superAdminLogin_(data.payload || data); break;
      case 'superAdminListCompanies':result = superAdminListCompanies_(data.token); break;
      case 'superAdminListEmployees':result = superAdminListEmployees_(data.token); break;
      case 'superAdminListOnline':    result = superAdminListOnline_(data.token); break;
      case 'superAdminActivityFeed':  result = superAdminActivityFeed_(data.token, data); break;
      case 'superAdminSuspendCompany':result = superAdminSuspendCompany_(data.token, data); break;
      case 'superAdminDeleteCompany': result = superAdminDeleteCompany_(data.token, data); break;
      case 'superAdminSuspendEmployee': result = superAdminSuspendEmployee_(data.token, data); break;
      case 'superAdminDeleteEmployee': result = superAdminDeleteEmployee_(data.token, data); break;
      case 'heartbeat':               result = heartbeat_(data.token, data); break;

      case 'setupSheet':              result = setupSheetApi(); break;
      case 'warmup':                  result = null; break;

      default: return jsonResp_({ ok: false, error: 'action inconnue : ' + action });
      }
      return jsonResp_({ ok: true, result });
  } catch (err) {
    console.error(err);
    return jsonResp_({ ok: false, error: (err && err.message) || String(err) });
  }
} 

/* ═══════════════════════════════════════════════════════════════════
   FIN — EntreFlow Backend v14
   ═══════════════════════════════════════════════════════════════════ */
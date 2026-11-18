/**
 * notify-orders.gs — email Sammy and Kelly every time a merch order comes in.
 *
 * SET UP ONCE (2 minutes):
 *   1. Sign in to Google as the account that OWNS the
 *      "Navy Hockey Merchandise Order" form.
 *   2. script.google.com > New project > paste this whole file in.
 *      (Use a separate project from sync-order-form.gs, or paste both in
 *       the same project — the function names don't collide.)
 *   3. Pick `setupOrderNotifications` in the function dropdown and click Run.
 *      Approve the permissions (open your form, send email as you).
 *   4. Pick `sendTestNotification` and Run it. Both inboxes should get a
 *      sample email. If they did, you're done — it runs on its own from here.
 *
 * Running setup again is safe: it removes the old trigger before adding one,
 * so you never get double emails.
 *
 * To add or remove a recipient, edit RECIPIENTS below and save. No re-run needed.
 */

var NOTIFY_FORM_NAME = 'Navy Hockey Merchandise Order';
var RECIPIENTS = [
  'dorchuck@usna.edu',
  'kellyteuschl@gmail.com'
];

/** Run once. Attaches the on-submit trigger to the form. */
function setupOrderNotifications() {
  var form = notifyOpenForm_();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onOrderSubmit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onOrderSubmit').forForm(form).onFormSubmit().create();
  Logger.log('Notifications on for "%s" -> %s', NOTIFY_FORM_NAME, RECIPIENTS.join(', '));
}

/** Fires automatically on every submission. */
function onOrderSubmit(e) {
  var r = e.response;
  var rows = r.getItemResponses().map(function (ir) {
    var a = ir.getResponse();
    if (Array.isArray(a)) a = a.join('\n');
    return [ir.getItem().getTitle(), String(a || '')];
  });
  var email = r.getRespondentEmail();
  if (email) rows.unshift(['Email', email]);
  notifySend_(rows, r.getTimestamp(), e.source);
}

/** Sends a sample so you can confirm both inboxes receive it. */
function sendTestNotification() {
  var form = notifyOpenForm_();
  notifySend_([
    ['Name', 'TEST ORDER — ignore'],
    ['What would you like to order?', 'Trucker Hat — $25'],
    ['Sizes and quantities', '1x OSFA']
  ], new Date(), form);
}

function notifySend_(rows, when, form) {
  var name = '';
  rows.forEach(function (kv) { if (kv[0] === 'Name') name = kv[1]; });

  var html = '<h2 style="color:#0b2545;margin:0 0 8px">New Navy Hockey merch order</h2>'
    + '<p style="color:#555;margin:0 0 12px">'
    + Utilities.formatDate(when, 'America/New_York', 'EEE MMM d, yyyy h:mm a') + ' ET</p>'
    + '<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">';
  rows.forEach(function (kv) {
    html += '<tr><td style="border-bottom:1px solid #ddd;color:#555;vertical-align:top"><b>'
      + notifyEsc_(kv[0]) + '</b></td><td style="border-bottom:1px solid #ddd">'
      + notifyEsc_(kv[1]).replace(/\n/g, '<br>') + '</td></tr>';
  });
  html += '</table>';

  var sheetUrl = '';
  try {
    var id = form.getDestinationId();
    if (id) sheetUrl = SpreadsheetApp.openById(id).getUrl();
  } catch (err) { /* no linked sheet — fine */ }
  html += '<p style="margin-top:14px">'
    + (sheetUrl ? '<a href="' + sheetUrl + '">All orders (spreadsheet)</a> · ' : '')
    + '<a href="' + form.getEditUrl() + '#responses">Form responses</a></p>';

  var plain = rows.map(function (kv) { return kv[0] + ': ' + kv[1]; }).join('\n');
  var replyTo = '';
  rows.forEach(function (kv) { if (kv[0] === 'Email') replyTo = kv[1]; });

  var opts = { htmlBody: html, name: 'Navy Hockey Orders' };
  if (replyTo) opts.replyTo = replyTo;   // hitting Reply goes to the customer
  MailApp.sendEmail(RECIPIENTS.join(','),
                    'New merch order' + (name ? ' — ' + name : ''),
                    plain, opts);
}

function notifyOpenForm_() {
  var files = DriveApp.getFilesByName(NOTIFY_FORM_NAME), found = [];
  while (files.hasNext()) found.push(files.next());
  if (!found.length) throw new Error('No file named "' + NOTIFY_FORM_NAME
      + '" in this Google account\'s Drive. Sign in as the form owner, or fix NOTIFY_FORM_NAME.');
  if (found.length > 1) throw new Error(found.length + ' files are named "'
      + NOTIFY_FORM_NAME + '". Trash the extras so there is only one.');
  return FormApp.openById(found[0].getId());
}

function notifyEsc_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

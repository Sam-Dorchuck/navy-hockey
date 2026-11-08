/**
 * sync-order-form.gs — makes the Google order form match the website.
 *
 * The form's item list is a static copy. Every time stock changes on the
 * site, the form drifts. This reads the live site and rewrites the form's
 * item checkboxes to match — prices, sold-out notes and all.
 *
 * RUN IT WHENEVER THE STORE CHANGES:
 *   1. script.google.com > your project (or a new one) > paste this in.
 *   2. Click Run. Approve the permissions the first time.
 *      (It asks for Drive and external-request access: it needs to open
 *       your form and to read usnahockey.com.)
 *   3. View > Logs shows exactly what it added and removed.
 *
 * It finds the form by NAME in your Drive, so nothing has to be pasted in.
 * If you rename the form, change FORM_NAME below to match.
 *
 * Only the item checkboxes are touched. Every other question, all existing
 * responses, and the response spreadsheet are left alone.
 */

var FORM_NAME = 'Navy Hockey Merchandise Order';
var SITE_URL  = 'https://usnahockey.com/';
var QUESTION  = 'What would you like to order?';

function syncOrderForm() {
  var choices = readStoreFromSite_();
  var form    = openFormByName_(FORM_NAME);
  var item    = findCheckboxItem_(form, QUESTION);

  var before = item.getChoices().map(function (c) { return c.getValue(); });
  item.setChoiceValues(choices);

  Logger.log('Synced "%s" from %s\n', FORM_NAME, SITE_URL);
  logDiff_(before, choices);
  Logger.log('\nForm: ' + form.getPublishedUrl());
}

/** Pull the store list straight out of the live page. */
function readStoreFromSite_() {
  var res = UrlFetchApp.fetch(SITE_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    throw new Error('Could not load ' + SITE_URL +
                    ' (HTTP ' + res.getResponseCode() + ').');
  }

  var block = res.getContentText().match(/const MERCH = \[([\s\S]*?)\n\];/);
  if (!block) {
    throw new Error('Loaded the site but could not find the store list on it. ' +
                    'If index.html was restructured, this script needs updating.');
  }

  var choices = [];
  block[1].split('\n').forEach(function (line) {
    var name = line.match(/name:"([^"]+)"/);
    if (!name) return;                       // comments and continuation lines
    var price  = line.match(/price:"([^"]+)"/);
    var status = line.match(/status:"([^"]+)"/);

    var label = name[1] + ' — ' + (price ? price[1] : 'price on request');
    if (status && status[1] === 'soldout') label += '  (sold out — joins the waitlist)';
    if (status && status[1] === 'soon')    label += '  (coming soon — joins the waitlist)';
    choices.push(label);
  });

  if (!choices.length) {
    throw new Error('Found the store list but it parsed as empty. Nothing changed.');
  }
  return choices;
}

/** Google Forms has no "open by name", so go through Drive. */
function openFormByName_(name) {
  var files = DriveApp.getFilesByName(name);
  var found = [];
  while (files.hasNext()) found.push(files.next());

  if (!found.length) {
    throw new Error('No file named "' + name + '" in your Drive. ' +
                    'Check the name, or update FORM_NAME at the top.');
  }
  if (found.length > 1) {
    throw new Error(found.length + ' files are named "' + name + '". ' +
                    'Rename or trash the extras so there is only one.');
  }
  return FormApp.openById(found[0].getId());
}

function findCheckboxItem_(form, title) {
  var items = form.getItems(FormApp.ItemType.CHECKBOX);
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle() === title) return items[i].asCheckboxItem();
  }
  throw new Error('No checkbox question titled "' + title + '" on the form. ' +
                  'If you renamed that question, update QUESTION at the top.');
}

function logDiff_(before, after) {
  var gone  = before.filter(function (b) { return after.indexOf(b)  === -1; });
  var added = after.filter(function (a)  { return before.indexOf(a) === -1; });

  if (!gone.length && !added.length) {
    Logger.log('No changes — the form already matched the site.');
    return;
  }
  gone.forEach(function (g)  { Logger.log('  removed:  ' + g); });
  added.forEach(function (a) { Logger.log('  added:    ' + a); });
  Logger.log('\n%s item(s) on the form now.', after.length);
}

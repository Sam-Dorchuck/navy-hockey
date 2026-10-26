/**
 * make-order-form.gs — creates the Navy Hockey merchandise order form.
 *
 * RUN THIS ONCE:
 *   1. Go to script.google.com and click "New project".
 *   2. Delete whatever is in the editor and paste this whole file in.
 *   3. Click Run. Google will ask for permission the first time — approve it.
 *      (You are approving your own script to make a form in your own Drive.)
 *   4. Open View > Logs. It prints the live form link and the edit link.
 *   5. Send me the live link and I will wire it into the website.
 *
 * It creates the form, a linked response spreadsheet, and puts both in a
 * "Navy Hockey" folder in your Drive. Running it twice makes a second form,
 * so run it once and edit the form by hand after that.
 */

function createOrderForm() {
  var FOLDER = 'Navy Hockey';
  var folders = DriveApp.getFoldersByName(FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER);

  var form = FormApp.create('Navy Hockey Merchandise Order');
  form.setDescription(
      'Order Navy Hockey gear. Fill this out and Kelly Teuschl will confirm '
    + 'availability, total, and payment. Nothing is charged through this form.\n\n'
    + 'Questions: kellyteuschl@gmail.com');

  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setConfirmationMessage(
      'Order received. Kelly will email you to confirm sizes, total, and payment. '
    + 'Go Navy!');

  // --- who ---
  form.addTextItem()
      .setTitle('Name')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Phone')
      .setHelpText('Optional. Only used if we need to reach you quickly about your order.');

  form.addTextItem()
      .setTitle('Your connection to the program')
      .setHelpText('Optional — e.g. player family, alumni, fan, Brigade.');

  // --- what ---
  form.addCheckboxItem()
      .setTitle('What would you like to order?')
      .setHelpText('Check everything you want. Sizes and quantities go in the next question.')
      .setChoiceValues([
    "UA Youth Hoodie \u2014 $55  (sold out \u2014 joins the waitlist)",
    "Full-Zip Sweatshirt \u2014 $55  (coming soon \u2014 joins the waitlist)",
    "UA Lightweight Hoodie \u2014 $50  (coming soon \u2014 joins the waitlist)",
    "UA Quarter-Zip \u2014 $50",
    "Champion Crewneck \u2014 $40",
    "UA Long Sleeve T-Shirt \u2014 $35",
    "UA Short Sleeve T-Shirt \u2014 $30",
    "Blanket \u2014 $75  (sold out \u2014 joins the waitlist)",
    "Trucker Hat \u2014 $25",
    "Classic Hat \u2014 $25",
    "Beanie \u2014 $25",
    "Mittens \u2014 $20",
    "White Jersey \u2014 price on request",
    "Youth Jersey \u2014 price on request"
      ])
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle('Sizes and quantities')
      .setHelpText('List each item with size and how many. '
                 + 'Example: UA Quarter-Zip, Large, 1 / Beanie, 2')
      .setRequired(true);

  // --- how it gets to them ---
  var pickup  = 'Pick up at a home game at McMullen Arena';
  var ship    = 'Ship it to me';
  form.addMultipleChoiceItem()
      .setTitle('How would you like to get your order?')
      .setChoiceValues([pickup, ship])
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle('Shipping address')
      .setHelpText('Required only if you chose "Ship it to me". '
                 + 'Street, city, state, ZIP.');

  form.addParagraphTextItem()
      .setTitle('Anything else?')
      .setHelpText('Optional. Gift notes, deadlines, questions about sizing.');

  // --- responses land in a spreadsheet ---
  var ss = SpreadsheetApp.create('Navy Hockey Merchandise Orders');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // tidy both files into the folder
  [DriveApp.getFileById(form.getId()), DriveApp.getFileById(ss.getId())]
    .forEach(function (f) { folder.addFile(f); DriveApp.getRootFolder().removeFile(f); });

  Logger.log('LIVE FORM (send this one to Claude):\n' + form.getPublishedUrl());
  Logger.log('\nEDIT THE FORM:\n' + form.getEditUrl());
  Logger.log('\nRESPONSES SPREADSHEET:\n' + ss.getUrl());
  Logger.log('\nTo get an email on every order: open the responses spreadsheet,'
           + '\nthen Tools > Notification settings > Notify me when a user submits a form.');
}

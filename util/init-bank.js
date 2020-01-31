const Banking = require('banking');
const moment = require('moment');
const config = require('./config');

// Use moment.js to format the date and prior 30 days
function dateRange() {
  let today = moment().format('YYYYMMDD');
  let thirtyDays = moment().subtract(30, 'days').format('YYYYMMDD');
  return {
    start: thirtyDays,
    end: today
  }
}

// Format response statements post dates
function formatPostedDate(statements) {
  let postedDates = [];
  statements.forEach(statement => {
    let posted = statement.DTPOSTED.replace('[0:GMT]', '').split('');
    posted.splice(8);
    let post = posted.join('');
    let formatPost = moment(post).format('MMM DD, YYYY');
    postedDates.push(formatPost);
  })
  return postedDates;
}

function addDecimal(val) {
  return parseFloat(val).toFixed(2);
}

exports.isAuthorized = async function(user, pass, banking, res, req) {
  let bank;
  let formatted = [];

  config.chase.user = user;
  config.chase.password = pass;
  config.patelco.user = user;
  config.patelco.password = pass;

   // Selects bank options based on bank name
   if (banking === 'Chase') {
    bank = new Banking(config.chase);
  } else if (banking === 'Patelco') {
    bank = new Banking(config.patelco);
  }

  // Sends bank options to OFX and gets statements
  bank.getStatement(dateRange(), async function (err, response) {
    if (err) {
      console.log(`OFX ERROR: ${err}`);
      res.send(`${JSON.stringify(err)}`);
    } else {
      // console.log(response.body.OFX.BANKMSGSRSV1);
      const statusCode = await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STATUS.CODE;
      console.log(response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STATUS.CODE);
      console.log(response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN);
      const statements = statusCode != 0 ? '' : await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
      const postedDates = statusCode != 0 ? '' : [...formatPostedDate(await statements)];

      if (statusCode == 0) {
        const balance = banking === 'Chase' ? parseFloat(await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.AVAILBAL.BALAMT).toFixed(2) : parseFloat(await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.LEDGERBAL.BALAMT).toFixed(2);
        // Formats statement info to digestable data
        statements.forEach((data, idx) => {

          formatted.push({
            type: data.TRNTYPE,
            date: postedDates[idx],
            name: data.NAME,
            memo: data.MEMO ? data.MEMO : '',
            amt: addDecimal(data.TRNAMT)
          });
        });

        const bankInfo = {
          statusCode: statusCode,
          formatted: formatted,
          balance: balance,
          banking: banking === 'Chase' ? 'Chase' : 'Patelco'
        };

        req.session.id = user;
        req.session.save();
        res.send(`${JSON.stringify(bankInfo)}`);
      } else {
        console.log(statusCode);
        res.end(`LOGIN ERROR: STATUS CODE ${statusCode}`);
      }
    }
  });
}

// Sets up bank request and formats response
// exports.formatBalance = async function(user, pass, banking, res) {
//   let bank;

//   config.chase.user = user;
//   config.chase.pass = pass;
//   config.patelco.user = user;
//   config.patelco.pass = pass;

  // Selects bank options based on bank name
  // if (banking === 'Chase') {
  //   bank = new Banking(config.chase);
  // } else if (banking === 'Patelco') {
  //   bank = new Banking(config.patelco);
  // }

  // Sends bank options to OFX and gets statements
//   bank.getStatement(dateRange(), async function (err, response) {
//     if (err) {
//       console.log(`OFX ERROR: ${err}`);
//     } else {
//       // returns formatted balance
//       const balance = parseFloat(await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.AVAILBAL.BALAMT).toFixed(2);
//       res.send(`${balance}`);
//     }
//   });
// }

// Sets up bank request and formats response
// exports.formatStatement = async function(user, pass, banking, res) {
//   let formatted = [];
//   let bank;

//   config.chase.user = user;
//   config.chase.pass = pass;
//   config.patelco.user = user;
//   config.patelco.pass = pass;

  // Selects bank options based on bank name
  // if (banking === 'Chase') {
  //   bank = new Banking(config.chase);
  // } else {
  //   bank = new Banking(config.patelco);
  // }

  // Sends bank options to OFX and gets statements
  // bank.getStatement(dateRange(), async function (err, response) {
  //   if (err) {
  //     console.log(`OFX ERROR: ${err}`);
  //   } else {
  //     const statements = await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
  //     const postedDates = [...formatPostedDate(await statements)];

      // Formats statement info to digestable data
//       statements.forEach((data, idx) => {
//         formatted.push({
//           type: data.TRNTYPE,
//           date: postedDates[idx],
//           name: data.NAME,
//           memo: data.MEMO ? data.MEMO : ''
//         });
//       });
//       const statusCode = await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STATUS.CODE;
//       const balance = parseFloat(await response.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.AVAILBAL.BALAMT).toFixed(2);
//       const bankInfo = {
//         statusCode: statusCode,
//         formatted: await formatted,
//         balance: balance
//       }
//       res.end(`${JSON.stringify(bankInfo)}`);
//     }
//   });
// }
// models/account-model.js

//
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = `
      INSERT INTO account (
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password, 
        account_type
      ) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    
    const result = await pool.query(sql, [
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password
    ])
    
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(account_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.account WHERE account_id = $1",
      [account_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    throw new Error("Unable to get account by ID.")
  }
}

async function updateAccount(account_id, firstname, lastname, email) {
  return pool.query(
    `UPDATE account
     SET account_firstname = $1, account_lastname = $2, account_email = $3
     WHERE account_id = $4`,
    [firstname, lastname, email, account_id]
  ).then(result => result.rowCount)
}

async function updatePassword(accountId, hashedPassword) {
  const sql = `
    UPDATE account
    SET password = $1
    WHERE account_id = $2
  `;
  return pool.query(sql, [hashedPassword, accountId]);
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword}

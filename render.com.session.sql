INSERT INTO account (
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_type
  )
VALUES (
    account_id:integer,
    'account_firstname:character varying',
    'account_lastname:character varying',
    'account_email:character varying',
    'account_password:character varying',
    'account_type:USER-DEFINED'
  );INSERT INTO inventory (
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES (
    inv_id:integer,
    'inv_make:character varying',
    'inv_model:character varying',
    'inv_year:character',
    'inv_description:text',
    'inv_image:character varying',
    'inv_thumbnail:character varying',
    inv_price:numeric,
    inv_miles:integer,
    'inv_color:character varying',
    classification_id:integer
  );
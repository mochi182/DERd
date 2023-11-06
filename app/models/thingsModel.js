'user strict';

const client = require('./db.js');

exports.create = async function (req) {
    try {
        //const query = `INSERT INTO ${entity} (${columns}) VALUES (${values})`;
        //const result = await client.promise().query(query);
        //return result[0].insertId;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.readAll = async function (req) {
    try {
        //const query = `SELECT * FROM ${entity}`;
        //const result = await client.promise().query(query);
        //return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.read = async function (req) {
    try {
        //const query = `SELECT * FROM ${entity} WHERE id = ${id}`;
        //const result = await client.promise().query(query);
        //return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.update = async function (req) {
    try {
        //const query = `UPDATE ${entity} SET ${updates} WHERE id=${id}`;
        //const result = await client.promise().query(query);
        //return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

exports.delete = async function (req) {
    try {
      //const query = `DELETE FROM ${entity} WHERE id = ${id}`;
      //const result = await client.promise().query(query);
      //return result[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  
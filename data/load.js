"use strict";

/* global require */

const XLSX = require('xlsx');
const toHead = require('to-camel-case');

function extract(input)
{
  // console.log('Reading input file:', input);

  var book = XLSX.readFile(input,
  {
    cellFormula: false,
    cellHTML: false
  });

  var sheetName = Object.keys(book.Sheets)
    .sort((a, b) => Object.keys(book.Sheets[b])
      .length - Object.keys(book.Sheets[a])
      .length)[0];

//  console.log('Taking sheet:', sheetName, JSON.stringify(Object.keys(book.Sheets)));

  var sheet = book.Sheets[sheetName];

  var range = XLSX.utils.decode_range(sheet['!ref']);

  var rows = [];
  var blanks = 0;

  var cols = {},
    val, col, row, cell;
  //console.log('Taking headings from first row of data.');
  for (col = range.s.c; col <= range.e.c; col++)
  {
    cell = XLSX.utils.encode_cell(
    {
      r: range.s.r,
      c: col
    });
    if (sheet[cell] !== undefined)
    {
      val = sheet[cell].w;
      val = val.replace(/(^\s*|\s*$)*/g, '');
      if (val != '')
      {
        cols[col] = [toHead(val)];
      //  console.log('Taking column', cell, 'as', cols[col]);
      }
    }
  }
  range.s.r++;

  for (row = range.s.r;; row++)
  {
    var rowdata = {};
    for (col = range.s.c; col <= range.e.c; col++)
    {
      if (cols[col] !== undefined)
      {
        cell = XLSX.utils.encode_cell(
        {
          r: row,
          c: col
        });
        if (sheet[cell] !== undefined)
        {
          val = sheet[cell].w;
          if (val)
          {
            val = val.replace(/(^\s*|\s*$)*/g, '');
            if (val !== '')
            {
              cols[col].forEach(head => rowdata[head] = val);
            }
          }
        }
      }
    }
    if (Object.keys(rowdata)
      .length > 0)
    {
      rows.push(rowdata);
      blanks = 0;
    }
    else
    {
      if (++blanks > 1024)
      {
        break;
      }
    }
  }
  //console.log(rows.length, 'rows loaded');

  return rows;
}

module.exports = extract;

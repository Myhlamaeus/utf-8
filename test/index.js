'use strict'

require('babel/register')
;['code-points', 'strings'].map(function (file) {
  return './' + file
}).forEach(require)

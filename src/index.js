
'use strict'

const request = require('request-promise-native')
const analyses = require('./analyses')

const main = async () => {
  const x = await analyses.votesPerMember()

  console.log(JSON.stringify(x, null, 2))
}

main()

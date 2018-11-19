
const requests = require('./requests')

const analyses = {}

analyses.votesPerMember = async () => {
  const votes = await requests.getVotes()
  const members = await requests.getMembers()
  const coalated = {}

  votes.map(vote => {
    for (let opt of ['yes', 'no', 'abstain']) {
      for (let member of vote.tallies[opt]) {
        const memberData = members.find(data => data.id === member) || {}

        if (!coalated[member]) {
          coalated[member] = Object.assign(memberData, {
            votes: {
              yes: new Set([]),
              abstain: new Set([]),
              no: new Set([]),
            }
          })
        }

        coalated[member].votes[opt].add(vote.debate)
      }
    }
  })

  for (const member of Object.keys(coalated)) {
    for (const opt of ['yes', 'no']) {
      coalated[member].votes[opt] = Array.from(coalated[member].votes[opt]).sort()
    }
  }

  return coalated
}

module.exports = analyses

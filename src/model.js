
'use strict'

const model = {}

model.asVoteData = data => {
  const {division} = data
  const tallies = {
    yes: division.tallies.taVotes.members.map(member => member.member.memberCode),
    no: division.tallies.nilVotes.members.map(member => member.member.memberCode)
  }

  tallies.abstain = division.tallies.staonVotes
    ? division.tallies.staonVotes.members.map(member => member.member.memberCode)
    : []

  const output = {
    isBill: division.isBill,
    chamber: division.chamber.showAs,
    house: division.house.showAs,
    outcome: division.outcome,
    tallies,
    debate: division.debate.showAs
  }

  return output
}

model.asMember = data => {
  const {memberships} = data.member
  const output = {
    id: data.member.memberCode,
    name: data.member.fullName,
    dates: data.member.dateRange
  }

  output.roles = memberships.map(membership => {
    return {
      represents: membership.membership.represents.map(data => data.represent.showAs),
      parties: membership.membership.parties.map(party => party.party.partyCode)
    }
  })

  return output
}

module.exports = model

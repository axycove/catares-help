function getCandidates(prog) {
  return fetch(`${process.env.API_URL}/candidates/${prog}`)
    .then(res => res.json())
}

function deleteCandidate(cand) {
  return fetch(`${process.env.API_URL}/results/${cand}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
}

function getResults(cand) {
  return fetch(`${process.env.API_URL}/results/${cand}`)
    .then(res => res.json())
}

function postResults(cand, results) {
  return fetch(`${process.env.API_URL}/results/${cand}`, {
    method: 'POST',
    body: JSON.stringify(results),
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

function getProgs(prog) {
  return fetch(`${process.env.API_URL}/progs/${prog}`)
    .then(res => res.json())
}

function postProgs(prog, repos) {
  return fetch(`${process.env.API_URL}/progs/${prog}`, {
    method: 'POST',
    body: JSON.stringify(repos),
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

function postGrades(gradeList) {
  return fetch(`${process.env.API_URL}/grades`, {
    method: 'POST',
    body: JSON.stringify(gradeList),
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

function getGrades() {
  return fetch(`${process.env.API_URL}/grades`)
    .then(res => res.json())
}

export {
  getCandidates, getGrades, getProgs, getResults,
  deleteCandidate, postResults, postProgs, postGrades
}
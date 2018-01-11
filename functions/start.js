const request = require('request-promise');
module.exports = function (region, callback) {
  if (region === 'fr') {
    id = 'fr2'
  } else if (region === 'ar') {
    id = 'ar2'
  } else if (region === 'it') {
    id = 'it2'
  } else if (region === 'nl') {
    id = 'nl2'
  } else if (region === 'pt') {
    id = 'pt4'
  } else {
    id = `${region}1`
  }
  try {
    const opts = {
      method: 'GET',
      json: true,
      uri: `http://api-${id}.akinator.com/ws/new_session?callback=&partner=1&player=desktopPlayer`,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
      },
      gzip: true
    }
    request(opts)
      .then(function(json) {
        if (json.completion === 'OK') {
          ans = []
          for (var i = 0; i < json.parameters.step_information.answers.length; i++) {
            ans.push(`${i} - ${json.parameters.step_information.answers[i].answer}`)
          }
          game = {
            session: json.parameters.identification.session,
            signature: json.parameters.identification.signature,
            question: json.parameters.step_information.question,
            answers: ans
          }
          callback(JSON.stringify(game))
        } else if (json.completion === 'KO - SERVER DOWN') {
          callback(null, `Akinator servers are down for the "${region}" region. Check back later.`)
        } else if (json.completion === 'KO - TECHNICAL ERROR') {
          callback(null, `Akinator's servers have had a technical error for the "${region}" region. Check back later.`)
        } else {
          console.log(json);
          callback(null, 'Unknown error has occured.')
        }
      })
  } catch (e) {
    callback(null, e)
  }
}

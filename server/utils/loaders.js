const axios = require("axios");

readLogsFromPage = (page, erro, callback) => {
	const logs = [];
	axios.get(page).then(res => {
		const list = [];
		const lines = res.data.split(/\r?\n/);
		const regex = new RegExp(`${erro}*`, "gi");
    const dateRegEx = new RegExp(":[0-2][0-9]:[0-5][0-9]:[0-5][0-9]");
		const linkRegEx = new RegExp(/\b((?:[a-z][\w\-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\((?:[^\s()<>]|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i);
		lines.forEach(line => {
			const occur = regex.exec(line);
			if(occur) {
				const logMinutes = new Date().getMinutes();
        list.push({
          ocorrencia: occur,
          date: dateRegEx.exec(occur.input)[0].slice(1),
					url: occur.input.search(linkRegEx)[0],
					index: occur.index,
        });
      };
		});
    if(list.length > 0) {
      list.forEach(l => {;
  			const found = l.ocorrencia.input.search(/\bhttps:\/\/www+\w*\b.*/);
  			if(found) logs.push({ log: found.input, data: l.date, url: l.url, index: l.index, tipo: erro });
  		});
    } else {
      return "Não foi encontrado nenhum erro no servidor";
    }
    return new Promise((res, err) => {
       res(logs);
  	}).then(logs => {
  		callback(logs);
  	}).catch(err => "Não foi possível retornar os logs do servidor");
	});
}

String.prototype.search = function(match) {
	return match.exec(this);
}

module.exports.readLogsFromPage = readLogsFromPage;

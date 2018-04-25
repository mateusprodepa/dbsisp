tickClock();
setInterval(() => {
  tickClock();
}, 1000);



const socket = io();

const objetos = {
  logs: document.querySelector(".log"),
  tipos: document.querySelector(".tipo"),
  urls: document.querySelector(".url"),
  horas: document.querySelector(".hora"),
  logsContainer: document.querySelector("#logs"),
  logBtn: document.querySelector("#logExp"),
  qtdErros: document.querySelector(".qtdErros"),
  loadingPage: document.querySelector(".loadingPage"),
}

socket.on("logs", logs => {

  for(obj in objetos) {
    resetText(obj);
  }

  logs.forEach(log => {
    objetos.logs.innerHTML += `<span>${log.log}</span>`;
    objetos.tipos.innerHTML += `<span>${log.tipo}</span>`;
    objetos.urls.innerHTML += `<span>${log.url}</span>`;
    objetos.horas.innerHTML += `<span>${log.data}</span>`;
  });

  removerLoadingPage();
});

socket.on("log-qtd", logs => {
  objetos.qtdErros.innerHTML = `<span>${logs}</span>`;
});

function resetText(elem) {
  elem.innerText = "";
}

function tickClock() {
  const d = new Date();
  document.querySelector("#data").innerText = `Hora Atual: ${d.getHours()}:${d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()}:${d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds()}`;
}

function removerLoadingPage() {
  document.querySelector(".dados-header").style.display = "flex";
  objetos.loadingPage.classList.add("offPage");
  objetos.qtdErros.style.display = "block";
  document.querySelector(".wrapper").style.display = "flex";
  setTimeout(() => {
    objetos.loadingPage.style.display = "none";
  }, 600);
}

objetos.loadingPage.style.height = window.innerHeight - document.querySelector(".wrapper").style.height + "px";

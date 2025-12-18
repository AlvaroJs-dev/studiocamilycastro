function abrirAba(aba) {
    document.querySelectorAll('.aba').forEach(div => div.classList.remove('ativa'));
    document.getElementById(aba).classList.add('ativa');

    if (aba === "agendamentos") {
        gerarCalendario();
        listarAgendamentos();
    }
}

/* ===== SALVAR ===== */
// Mapa de preços por procedimento (valores em BRL)
const precos = {
    "Alongamento em Fibra": 150.00,
    "Gel na Tip": 120.00,
    "Banho de Gel": 90.00,
    "Esmaltação em Gel": 80.00,
    "Blindagem": 70.00,
    "Manutenção de Alongamento": 80.00,
    "Spa das Mãos": 60.00,
    "Design de Cílios – Fio a Fio": 120.00,
    "Design de Cílios – Volume Russo": 160.00
};

// Atualiza o campo de preço quando o serviço for alterado
const servicoEl = document.getElementById("servico");
const precoEl = document.getElementById("preco");
if (servicoEl && precoEl) {
    servicoEl.addEventListener("change", () => {
        const val = precos[servicoEl.value] || 0;
        // preencher como número para permitir edição manual
        precoEl.value = val ? val.toFixed(2) : "";
    });
}
function salvarAgendamento(ag) {
    let lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    lista.push(ag);
    localStorage.setItem("agendamentos", JSON.stringify(lista));
}

document.getElementById("formAgendamento").addEventListener("submit", function(e) {
    e.preventDefault();

    // permite que o usuário edite o preço; se vazio, usa o preço padrão do mapa
    const valor = (preco.value && !isNaN(Number(preco.value))) ? Number(preco.value) : (precos[servico.value] || 0);
    const ag = {
        nome: nome.value,
        servico: servico.value,
        data: data.value,
        hora: hora.value,
        valor: valor
    };

    salvarAgendamento(ag);

    alert("Agendamento realizado com sucesso! 💅✨\nValor: " + valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    this.reset();
    if (precoEl) precoEl.value = "";
});

/* ===== CALENDÁRIO ===== */
function gerarCalendario() {
    const calendario = document.getElementById("calendario");
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    let html = `<h3>${meses[mes]} ${ano}</h3>`;
    html += `<div class="grid">`;

    for (let i = 0; i < primeiroDia; i++) html += `<div></div>`;
    for (let d = 1; d <= ultimoDia; d++) html += `<div class="dia">${d}</div>`;

    html += `</div>`;
    calendario.innerHTML = html;
}

/* ===== LISTAR ===== */


function excluirAgendamento(index) {
    const lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    if (index < 0 || index >= lista.length) return;

    const confirmado = confirm(`Excluir agendamento de ${lista[index].nome} em ${lista[index].data} às ${lista[index].hora}?`);
    if (!confirmado) return;

    lista.splice(index, 1);
    localStorage.setItem("agendamentos", JSON.stringify(lista));
    listarAgendamentos();
    alert("Agendamento excluído.");
}

// Atualiza a lista para incluir botões de excluir com índice
function listarAgendamentos() {
    const lista = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const ul = document.getElementById("listaAgendamentos");

    ul.innerHTML = "";

    // resumo por procedimento
    const resumo = {};

    lista.forEach((ag, idx) => {
        const valor = Number(ag.valor) || 0;
        // montar lista
        ul.innerHTML += `
            <li>
                <div class="item">
                    <strong>${ag.nome}</strong> — <span class="valor">${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span><br>
                    Serviço: ${ag.servico}<br>
                    Data: ${ag.data} • Hora: ${ag.hora}
                </div>
                <button class="btn-excluir" onclick="excluirAgendamento(${idx})">Excluir</button>
            </li>
        `;

        // acumular resumo
        if (!resumo[ag.servico]) resumo[ag.servico] = { quantidade: 0, total: 0 };
        resumo[ag.servico].quantidade += 1;
        resumo[ag.servico].total += valor;
    });

    // renderizar resumo
    const resumoEl = document.getElementById('resumoProcedimentos');
    if (resumoEl) {
        let html = "";
        const entries = Object.entries(resumo);
        if (entries.length === 0) {
            html = `<p class="sem">Nenhum agendamento ainda.</p>`;
        } else {
            html = `<table class="resumo-table"><thead><tr><th>Procedimento</th><th>Quantidade</th><th>Total</th></tr></thead><tbody>`;
            let grandTotal = 0;
            entries.forEach(([serv, info]) => {
                html += `<tr><td>${serv}</td><td>${info.quantidade}</td><td>${info.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>`;
                grandTotal += info.total;
            });
            html += `</tbody><tfoot><tr class="total-row"><td>Total</td><td></td><td>${grandTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr></tfoot></table>`;
        }
        resumoEl.innerHTML = html;
    }
}

abrirAba("agendar");

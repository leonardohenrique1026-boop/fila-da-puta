// Função para buscar o relatório com filtros
function buscarAgendamentos() {
    const cpf = document.getElementById("cpf").value;
    const servico = document.getElementById("servico").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Construir a URL com os parâmetros de filtro
    let url = `/agendamentos?`;
    if (cpf) url += `cpf_cliente=${encodeURIComponent(cpf)}&`;
    if (servico) url += `servico=${encodeURIComponent(servico)}&`;
    if (dataInicio) url += `dataInicio=${encodeURIComponent(dataInicio)}&`;
    if (dataFim) url += `dataFim=${encodeURIComponent(dataFim)}&`;
    url = url.replace(/[&?]$/, ''); // remove & ou ? final

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Resposta do servidor não OK: ' + response.status);
            return response.json();
        })
        .then(data => {
            console.log('Agendamentos recebidos:', data); // <--- verifique aqui no console
            const tabelaAgendamentos = document.getElementById("tabela-agendamentos");
            tabelaAgendamentos.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                const trEmpty = document.createElement('tr');
                trEmpty.innerHTML = `<td colspan="5">Nenhum agendamento encontrado.</td>`;
                tabelaAgendamentos.appendChild(trEmpty);
                return;
            }

            data.forEach(agendamento => {
                // fallback para vários nomes possíveis que o JSON pode trazer
                const id = agendamento.id ?? '—';
                const clienteNome = agendamento.cliente_nome || agendamento.clienteNome || agendamento.cliente || agendamento.cliente_nome || '—';
                const clienteCpf = agendamento.cliente_cpf || agendamento.clienteCpf || agendamento.cpf || agendamento.cpf_cliente || '';
                const servicoNome = agendamento.servico_nome || agendamento.servicoNome || agendamento.nome_servico || agendamento.servico || '—';
                const horario = agendamento.horario || '—';
                const dataStr = agendamento.data || agendamento.data_agendamento || '';
                const dataFormatada = dataStr ? new Date(dataStr).toLocaleDateString() : '—';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${id}</td>
                    <td>${clienteNome}${clienteCpf ? ' (' + clienteCpf + ')' : ''}</td>
                    <td>${servicoNome}</td>
                    <td>${horario}</td>
                    <td>${dataFormatada}</td>
                `;
                tabelaAgendamentos.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
            const tabelaAgendamentos = document.getElementById("tabela-agendamentos");
            tabelaAgendamentos.innerHTML = `<tr><td colspan="5">Erro ao carregar agendamentos.</td></tr>`;
        });
}

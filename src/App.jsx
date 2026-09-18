import { useState } from 'react';

function App() {
  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('Recarga de cartucho');
  const [detalhesCartucho, setDetalhesCartucho] = useState('');
  const [valor, setValor] = useState('');
  const [valorExtenso, setValorExtenso] = useState('');
  const [empresa, setEmpresa] = useState('Master Cartuchos');
  const [telefone, setTelefone] = useState('');
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState('');
const API_URL = 'https://master-cartuchos-pdf.onrender.com'
  async function gerarPDF(event) {
    event.preventDefault();
    setErro('');
    setGerando(true);

    try {
      const resposta = await fetch(`${API_URL}/gerar-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          servico,
          detalhesCartucho,
          valor,
          valorExtenso,
          empresa,
          telefone,
        }),
      });

      if (!resposta.ok) {
        const mensagem = await resposta.text();
        throw new Error(mensagem || 'Não foi possível gerar o PDF.');
      }

      const arquivo = await resposta.blob();
      const url = window.URL.createObjectURL(arquivo);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'recibo-master-cartuchos.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErro(
        'Não foi possível gerar o PDF. Verifique se o backend está rodando na porta 3000.'
      );
      console.error(error);
    } finally {
      setGerando(false);
    }
  }

  function limparFormulario() {
    setNome('');
    setServico('Recarga de cartucho');
    setDetalhesCartucho('');
    setValor('');
    setValorExtenso('');
    setEmpresa('Master Cartuchos');
    setTelefone('');
    setErro('');
  }

  return (
    <main className="pagina">
      <section className="card">
        <div className="cabecalho">
          <span className="icone">MC</span>
          <div>
            <h1>Master Cartuchos</h1>
            <p>Gerador de recibo em PDF</p>
          </div>
        </div>

        <form onSubmit={gerarPDF}>
          <div className="campo">
            <label htmlFor="nome">Nome do cliente</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Débora"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="servico">Serviço</label>
            <input
              id="servico"
              type="text"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              placeholder="Ex.: Recarga de cartucho"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="detalhesCartucho">Detalhes do cartucho</label>
            <textarea
              id="detalhesCartucho"
              value={detalhesCartucho}
              onChange={(e) => setDetalhesCartucho(e.target.value)}
              placeholder="Ex.: HP 667 preto, cartucho original, número/observações..."
              rows="4"
            />
          </div>

          <div className="linha">
            <div className="campo">
              <label htmlFor="valor">Valor</label>
              <input
                id="valor"
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="15,00"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="valorExtenso">Valor por extenso</label>
              <input
                id="valorExtenso"
                type="text"
                value={valorExtenso}
                onChange={(e) => setValorExtenso(e.target.value)}
                placeholder="Quinze Reais"
                required
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="empresa">Empresa</label>
            <input
              id="empresa"
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="telefone">Telefone da empresa</label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex.: (81) 99999-9999"
            />
          </div>

          {erro && <div className="erro">{erro}</div>}

          <div className="acoes">
            <button
              className="botao secundario"
              type="button"
              onClick={limparFormulario}
            >
              Limpar
            </button>

            <button className="botao principal" type="submit" disabled={gerando}>
              {gerando ? 'Gerando PDF...' : 'Gerar PDF'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default App;
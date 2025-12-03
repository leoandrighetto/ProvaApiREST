import axios from "axios"
import { useState, useEffect } from "react";

const API = 'http://localhost:3000';

export default function Exercicio() {

    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);

    const [todosClientes, setTodosClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [data, setData] = useState(null);

    const [todosPedidos, setTodosPedidos] = useState(null);

    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [mostrarPedidos, setMostrarPedidos] = useState(false);

    const [clientePedidoSelecionado, setClientePedidoSelecionado] = useState(null);
    const [produtosDoPedido, setProdutosDoPedido] = useState([]);
    const [mostrarDadosPedido, setMostrarDadosPedido] = useState(false);
    const [totalPedidoSelecionado, setTotalPedidoSelecionado] = useState(0);



    async function carregarProdutos() {

        let { data: produtos } = await axios.get(API + "/produtos");
        setProdutos(produtos)
    }

    async function adicionarAoCarrinho(produto) {

        if (produto.estoque > 0) {

            let novoProduto = {
                id: produto.id,
                nome: produto.nome,
                valor: produto.valor,
                estoque: produto.estoque - 1
            }

            await axios.put(API + "/produtos/" + produto.id, novoProduto);


            setCarrinho([...carrinho, produto]);

            setTotal(total + produto.valor)
            carregarProdutos()

        } else {

        }
    }

    async function carregarClientes() {

        let { data: clientes } = await axios.get(API + "/clientes");
        setTodosClientes(clientes);

    }

    async function carregarPedidos() {

        let { data: pedidos } = await axios.get(API + "/pedidos");
        setTodosPedidos(pedidos);


    }

    async function finalizarCompra() {

        let produtos = carrinho.map(produto => { return { "produto_id": Number(produto.id) } })
        console.log(produtos)

        const maiorId = Math.max(...todosPedidos.map(c => Number(c.id)));

        let novoPedido = {
            id: String(maiorId + 1),
            cliente_id: Number(clienteSelecionado.id),
            data_pedido: data,
            produtos: produtos
        }

        await axios.post(API + "/pedidos", novoPedido)

    }

    async function selecionarClientes(id) {


        const Cliente = todosClientes.find(cliente => Number(cliente.id) === Number(id))
        setClienteSelecionado(Cliente);

    }

    async function cadastrarCliente(form) {

        let maiorId = Math.max(...todosClientes.map(c => Number(c.id)));


        let nome = form.get('nome');
        let cidade = form.get('cidade');

        let novoCliente = {
            id: String(maiorId + 1),
            nome,
            cidade
        }


        await axios.post(API + "/clientes", novoCliente);
        setMostrarCadastro(false);
        carregarClientes();
        setClienteSelecionado(novoCliente.nome)

    }

    async function selecionarPedidos(id) {

        carregarClientes()
        let pedido = todosPedidos.find(pedido => Number(pedido.id) === Number(id))

        let cliente = todosClientes.find(cliente => Number(cliente.id) === pedido.cliente_id);

        let novoP = [];
        let novoT = 0;


        for (let index = 0; index < pedido.produtos.length; index++) {
            for (let p = 0; p < produtos.length; p++) {
                if ((pedido.produtos[index].produto_id) === Number(produtos[p].id)) {
                    novoP.push({ nome: produtos[p].nome, valor: produtos[p].valor });
                    novoT += produtos[p].valor;
                }
            }
        }

        setClientePedidoSelecionado(cliente);
        setPedidoSelecionado(pedido);
        setMostrarDadosPedido(true);
        setProdutosDoPedido(novoP);
        setTotalPedidoSelecionado(novoT);


    }

    useEffect(() => { carregarProdutos(), carregarClientes(), carregarPedidos() }, []);
    return <>

        <h1>Sistemas de Vendas</h1>



        Selecione o cliente:
        <select onChange={(e) => {
            selecionarClientes(e.target.value);

        }}>

            <option > {() => clienteSelecionado.nome} </option>

            {todosClientes.map(cliente => <option value={cliente.id}>{cliente.nome}</option>)}


        </select>


        <br />

        Data do Pedido: <input type="date" onChange={(e) => setData(e.target.value)} /><br /><br />

        <button onClick={() => setMostrarPedidos(true)}>Visualizar Pedidos</button><br /><br />

        {mostrarPedidos ?
            <dialog open>

                <h2>Visualizar Pedido</h2>

                Selecione um Pedido:
                <select onChange={(e) => selecionarPedidos(e.target.value)}>

                    {todosPedidos.map(pedido =>
                        <option value={pedido.id}> ID: {pedido.id}, Data: {pedido.data_pedido} </option>)}

                </select>

                {mostrarDadosPedido ? <div>

                    <h2>Dados do Cliente</h2>

                    <h3 style={{ display: 'inline' }}>Nome: </h3> {clientePedidoSelecionado.nome} <br />
                    <h3 style={{ display: 'inline' }}>Data do Pedido: </h3> {pedidoSelecionado.data_pedido} <br />

                    <h2>Produtos</h2>
                        <table border={1}>
                            <thead>
                                <tr>
                                    <th>Nome</th><th>Valor(R$)</th>
                                </tr>

                            </thead>
                            <tbody>

                                {produtosDoPedido.map(produto =>
                                    <tr>
                                        <td>{produto.nome}</td>
                                        <td>R$ {produto.valor.toFixed(2)}</td>
                                    </tr>)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Total:</th><th>R$ {totalPedidoSelecionado.toFixed(2)}</th>
                                </tr>
                            </tfoot>

                        </table>
                </div> : null}

                <br /><br />
                <button onClick={() => setMostrarPedidos(false)}>Fechar</button>
            </dialog>

            : null}

        <button onClick={() => setMostrarCadastro(true)}>

            Cadastrar Novo Cliente</button> <br /><br /><br />

        {mostrarCadastro ? <dialog open>

            <form action={(form) => cadastrarCliente(form)}>

                <label >Nome: <input name="nome" required placeholder="Digite o nome do cliente..." /></label> <br /><br />
                <label >Cidade: <input name="cidade" required placeholder="Digite a cidade do cliente..." /></label>
                <br /><br />
                <button type="submit">Salvar</button><button onClick={() => setMostrarCadastro(false)}>Cancelar</button>
            </form>

        </dialog> : null}

        <h2>Carrinho: </h2>


        <h4>{carrinho.map(compra => <li>{compra.nome}</li>)}</h4>
        Total: R$ {total.toFixed(2)} <br /><br />

        <button onClick={() => finalizarCompra()}>Finalizar Compra</button><br /><br />

        <h2>Produtos</h2>

        {produtos.map(produto => <div key={produto.id}>
            {produto.nome} - R$ {produto.valor} (Estoque: {produto.estoque}) <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
        </div>
        )}
    </>
}
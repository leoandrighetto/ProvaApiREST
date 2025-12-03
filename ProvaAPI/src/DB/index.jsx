import axios from "axios";
import { useState, useEffect } from "react";
const API = 'http://localhost:3000';

export default function BancoDeDados() {

    const [voos, setVoos] = useState([]);
    const [vooSelecionado, setVooSelecionado] = useState(null);
    const [menuVoos, setMenuVoos] = useState(false);

    const [tickets, setTickets] = useState([]);

    const [assentos, setAssentos] = useState([]);
    const [assentoSelecionado, setAssencoSelecionado] = useState(null);

    const [nomeCliente, setNomeCliente] = useState('');

    async function carregarVoos() {

        let { data: voos } = await axios.get(API + '/voos')
        setVoos(voos);
    }

    async function selecionarVoo(id) {

        setVooSelecionado(voos.find(voo => voo.id == id));
        setMenuVoos(true);
    }

    async function carregarTickets() {

        let { data: tickets } = await axios.get(API + '/tickets');
        setTickets(tickets);

    }

    async function carregarAssentos(id) {

        let { data: assentos } = await axios.get(API + '/assentos?voo_id=' + id);
        setAssentos(assentos);

    }

    async function atualizarAssento(assento) {

        const maiorId = Math.max(...assentos.map(c => Number(c.id)));

        if (nomeCliente) {

            let novoAssento = {
                id: maiorId + 1,
                voo_id: assento.voo_id,
                poltrona: assento.poltrona,
                ocupado: true
            }

            await axios.put(API + "/assentos/" + assento.id, novoAssento);
            carregarAssentos(vooSelecionado.id)
        } else {
            alert('Por favor, digite todas as informações necessárias para a reserva.')
        }

    }

    async function salvarCliente(form) {

        let nome = form.get("nomeCliente");

        setNomeCliente(nome);

    }

    async function atualizarTicket(assento) {

        const maiorID = Math.max(...tickets.map(c => Number(c.id)));

        let novoTicket = {
            id: maiorID + 1,
            cliente: nomeCliente,
            assento_id: assento.id
        }

        await axios.post(API + "/tickets", novoTicket)
        alert("Ticket emitido! Anote o Número: " + novoTicket.id)
        carregarTickets()

    }

    useEffect(() => { carregarVoos(), carregarTickets(), carregarAssentos() }, []);


    console.log(nomeCliente);

    return <>
        <h1>Sistema de Agendamento de Voos</h1>

        <h3>Selecione o Voo: <select onChange={(e) => { selecionarVoo(e.target.value), carregarAssentos(e.target.value) }}>

            <option> Voos </option>
            {voos.map(voo =>
                <option key={voo.id} value={voo.id}> {voo.origem} - {voo.destino} ({voo.data}) </option>

            )}
        </select> </h3>

        {/* MENU VOOS MENU VOOS MENU VOOS MENU VOOS MENU VOOS MENU VOOS */}


        {menuVoos ? <div>

            <h2>Voo Selecionado</h2>

            Origem: {vooSelecionado.origem}, Destino: {vooSelecionado.destino}, Data: {vooSelecionado.data} <br />
            <div style={{ display: 'flex', whiteSpace: 'pre' }}>
                Nome do Cliente: <form onChange={(e) => setNomeCliente(e.target.value)} > <input type="text" name="nomeCliente" /></form></div>

            <h3>Selecione um Assento:</h3>

            {assentos.map(assento => <button key={assento.id} onClick={() => {if(nomeCliente) { atualizarTicket(assento)}atualizarAssento(assento); }} disabled={assento.ocupado}>{assento.poltrona}</button>)}


        </div> : null}

        <hr />

        <h2>Log de Tickets Emitidos no Sistema</h2>

        {tickets.map(t => <div key={t.id}> <li>Ticket ID: {t.id} Cliente: {t.cliente}, Assento ID: {t.assento_id}</li> </div>)}








    </>
}

import axios from "axios";
import { useState, useEffect } from "react";
const API = 'http://localhost:3000';
import eletronica from '../assets/eletronica.png'
import informatica from '../assets/informatica.png'
import lazer from '../assets/lazer.png'

export default function BancoDeDados() {

    const [turmas, setTurmas] = useState([]);
    const [cadastrando, setCadastrando] = useState(false);
    const [editarTurma, setEditarturma] = useState('');

    const maiorId = Math.max(...turmas.map(c => Number(c.id)));

    const [cursoSelecionado, setcursoSelecionado] = useState('');
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [idSelecionado, setIdSelecionado] = useState('');


    async function CarregarTurmas() {

        let { data: turmas } = await axios.get(API + "/turmas");

        setTurmas(turmas);
    }

    async function cadastrarTurma(form) {

        let disciplina = form.get("disciplina");
        let nAlunos = form.get("nAlunos");
        let id;
        let curso = cursoSelecionado.toLowerCase()

        if (editarTurma) {
            id = String(editarTurma.id);

        } else {
            id = String(maiorId + 1);

        }

        let novaTurma = {
            disciplina: disciplina,
            curso: curso,
            alunos: Number(nAlunos),
            id: id

        }

        if (editarTurma) {
            await axios.put(API + "/turmas/" + id, novaTurma);
            setEditarturma('');
            setCadastrando(false);

        } else {
            await axios.post(API + "/turmas", novaTurma);
            setEditarturma('');
            setCadastrando(false);
        }

        CarregarTurmas()

    }

    async function excluirAlunos(id) {

        if (window.confirm("Tem certeza que deseja excluir a turma " + turmaSelecionada + " do curso " + cursoSelecionado + " de ID " + idSelecionado + "?")) {
            let turma = turmas.find(turma => Number(turma.id) === Number(id));
            await axios.delete(API + "/turmas/" + turma.id)
            CarregarTurmas()
        }
    }

    async function zerarAlunos(turma) {

        let novaTurma = {
            disciplina: turma.disciplina,
            curso: turma.curso,
            alunos: 0,
            id: turma.id
        }

        await axios.put(API + "/turmas/" + turma.id, novaTurma);
        CarregarTurmas()

    }

    async function selecionarCurso(curso) {

        setcursoSelecionado(String(curso))

    }

    useEffect(() => { CarregarTurmas() }, []);

    return <>

        <h1>Turmas</h1>

        <button onClick={() => setCadastrando(true)}>Cadastrar Nova Turma</button><br /><br />

        {cadastrando || editarTurma ?

            <dialog open>

                <h3>{editarTurma ? "Editar Turma" : "Cadastro"}</h3>

                <form action={(form) => { cadastrarTurma(form) }}>

                    <label>Disciplina: <input required name="disciplina" defaultValue={editarTurma?.disciplina}></input></label>
                    <br /><br />

                    Selecione o curso:  <select onChange={(e) => { selecionarCurso(e.target.value) }}>
                        <option >Cursos</option>
                        <option value={'Eletrônica'} selected={editarTurma?.curso === 'eletrônica'}> Eletrônica </option>
                        <option value={'Informática'} selected={editarTurma?.curso === 'informática'}> Informática </option>
                        <option value={'Lazer'} selected={editarTurma?.curso === 'lazer'}> Lazer </option>


                    </select>
                    <br /><br />

                    <label>Número de Alunos: <input required="" min="0" defaultValue={editarTurma?.alunos} placeholder="Quantidade de Alunos" type="number" name="nAlunos"></input></label>
                    <br /><br />

                    <button type="submit">{editarTurma ? "Editar" : "Cadastrar"}</button>
                    <button onClick={() => { setCadastrando(false), setEditarturma(false), setcursoSelecionado('') }}>Fechar</button>
                    <br /><br />
                </form>
            </dialog > : null
        }

        <br /><br />

        <table border={1}>
            <thead>
                <tr>
                    <th>ID</th><th>Disciplina</th><th>Curso</th><th>Alunos</th><th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {turmas.map(turma => <tr key={turma.id}>
                    <td>{turma.id}</td>
                    <td>{turma.disciplina}</td>
                    <td>
                        {turma.curso === "eletrônica" ? <img src={eletronica} title="eletrônica" /> :
                            turma.curso === "informática" ? <img src={informatica} title="informática" /> :
                                turma.curso === "lazer" ? <img src={lazer} title="lazer" /> : null}
                    </td>

                    <td>{turma.alunos}</td>

                    <td><button onClick={() => {
                        setcursoSelecionado(turma.curso);
                        setEditarturma(turma);

                    }}>Editar</button>

                        <button onClick={() => zerarAlunos(turma)}>Zerar Alunos</button>
                        <button disabled={turma.alunos > 0}
                            onClick={() => {
                                setcursoSelecionado(turma.curso);
                                setTurmaSelecionada(turma.disciplina);
                                setIdSelecionado(turma.id);
                                excluirAlunos(turma.id);
                            }}>Excluir</button></td>
                </tr>)}
            </tbody>
        </table>
    </>
}
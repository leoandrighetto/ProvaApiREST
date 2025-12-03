import { useState } from "react";
import ItemAvaliado from "./ItemAvaliado"

import bomAtivado from './assets/bomAtivado.png'
import neutroAtivado from './assets/neutroAtivado.png'
import ruimAtivado from './assets/ruimAtivado.png'



export default function PesquisaSatisfacao(props) {

    const [pontos, setPontos] = useState([]);
    const [finalizar, setFinalizar] = useState(false);
    const [media, setMedia] = useState(0)

    function onPontuar(flag, indice) {

        let pontosN = [...pontos];
        pontosN[indice] = flag;

        if (flag === 'desativado') {
            pontosN.splice(indice, 1)
        }

        setPontos(pontosN)

    }

    function finalizacao() {

        if (pontos.length === props.itens.length) {
            setFinalizar(true);
            calcularMedia();

        } else {
            alert('Preencha todos os ietns, por favor.')
        }
    }

    function calcularMedia() {

        let soma = 0
        pontos.map(p => soma += p);
        let media = soma / pontos.length
        setMedia(media);

    }

    return <>
        {!finalizar ?

            <div style={{textAlign:'center'}}>
                <h1>Pesquisa de Avaliação</h1>
                <br />
                {props.itens.map((item, key) =>

                    <div key={key}>
                        {item}
                        <br />
                        <br />
                        <ItemAvaliado onPontuar={onPontuar} indice={key} />
                        <br />
                        <br />
                    </div>
                )}
                <br /><button style={{backgroundColor:'gray', 
                    border:'0px',fontSize:'15pt',height:'50px', width:'100px',fontFamily:'math'}} 
                    onClick={finalizacao}>Finalizar</button>
            </div> :
            <div style={{textAlign:'center'}}>
                <h1>Obrigado por Responder!</h1>
                <br />
                Média da avaliação: {media.toFixed(2)}
                <br />
                <br />
                <img src={media >= 4 ? bomAtivado : media >= 2 && media < 4 ? neutroAtivado : ruimAtivado} />
                <br /><br />
                <button style={{backgroundColor:'gray', 
                border:'0px',fontSize:'15pt',height:'50px', width:'100px',fontFamily:'math'}} 
                 onClick={
                    () => { 
                        setFinalizar(false);
                        setMedia(0)
                        setPontos([])
                    }
                }>Nova Pesquisa</button>




            </div>}
    </>

}
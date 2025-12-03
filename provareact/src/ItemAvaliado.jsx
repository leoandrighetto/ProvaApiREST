import { useState } from 'react'

import bomAtivado from './assets/bomAtivado.png'
import bomDesativado from './assets/bomDesativado.png'

import neutroAtivado from './assets/neutroAtivado.png'
import neutroDesativado from './assets/neutroDesativado.png'

import ruimAtivado from './assets/ruimAtivado.png'
import ruimDesativado from './assets/ruimDesativado.png'

export default function ItemAvaliado(props) {

    const [bom, setBom] = useState(false);
    const [neutro, setNeutro] = useState(false);
    const [ruim, setRuim] = useState(false);

    function clicar(botao) {

        if (botao === 'bom') {

            setBom(!bom);
            setNeutro(false);
            setRuim(false);

            if (!bom) {
                props.onPontuar(5, props.indice);
            }
            else {
                props.onPontuar('desativado',props.indice);
            }
        }
        if (botao === 'neutro') {

            setNeutro(!neutro);
            setBom(false);
            setRuim(false);
            if (!neutro) {
                props.onPontuar(3, props.indice);
            }
            else {
                props.onPontuar('desativado',props.indice);
            }
        }
        if (botao === 'ruim') {

            setRuim(!ruim);
            setBom(false);
            setNeutro(false);
            
            if (!ruim) {
                props.onPontuar(0, props.indice);
            }
            else {
                props.onPontuar('desativado',props.indice);
            }
        }
    }

    return <>

        <img src={bom ? bomAtivado : bomDesativado} onClick={() => clicar('bom')} />
        <img src={neutro ? neutroAtivado : neutroDesativado} onClick={() => clicar('neutro')} />
        <img src={ruim ? ruimAtivado : ruimDesativado} onClick={() => clicar('ruim')} />


    </>

}
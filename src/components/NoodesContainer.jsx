import Noode from "./Noode";

function NoodesContainer({noodes,setNoodes,onNewNoode,onLink}){

return(
<main className="relative w-full h-full bg-darker">
    {
        noodes.map((n,i)=>(<Noode key={n.id} noode={n} noodes={noodes} setNoodes={setNoodes} onLink={onLink} />))
    }

    <button onClick={onNewNoode} className="fixed bottom-12 right-12 w-16 h-16 rounded-full shadow-xl bg-primary text-lighter font-bold text-lg">+</button>
</main>
)
}

export default NoodesContainer;
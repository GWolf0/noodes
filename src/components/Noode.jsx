import { useEffect, useRef } from "react";
import AppService from "../services/appService";


function Noode({noode,setNoodes,noodes,onLink}){
//refs
const thisRef=useRef();
//effects
useEffect(()=>{

},[])

//methods
function onMouseDown(e){
    const mp={x:e.clientX,y:e.clientY};
    const thisRect=thisRef.current.getBoundingClientRect();
    const offs={x:mp.x-thisRect.x,y:mp.y-thisRect.y};//console.log(noode.id,offs)
    AppService.movingNoode.id=noode.id;
    AppService.movingNoode.offs=offs;
}
function onMouseUp(e){
    const mp={x:e.clientX,y:e.clientY};
    const offs=AppService.movingNoode.offs;
    AppService.movingNoode.id=null;
    setNoodes(prev=>prev.map((n,i)=>n.id===noode.id?{...n,pos:{x:mp.x-offs.x,y:mp.y-offs.y}}:n));
}
function onOutput(id){
    AppService.selectedOutput={n:noode.id,id:id};
}
function onInput(id){
    onLink(noode,id);
}
function onInputChanged(e,input){
    const newVal=e.target.value;
    // const newInput={...input,value:newVal};
    input.value=newVal;
    AppService.recalculate=true;
    setNoodes(prev=>prev.map((n,i)=>n));
    //const newNoode={...noode,outs:calculateOutputs()};
    //setNoodes(prev=>prev.map((n,i)=>n.id===noode.id?newNoode:n));
}
//utils
function calculateOutputs(){
    return noode.outs.map((out,i)=>{
        let res=noode.ins.reduce((total,cur)=>total+(parseFloat(cur.value)||0),0);
        return ({...out,value:res});
    });
}

return (
<div ref={thisRef} id={`noode_${noode.id}`} className="absolute rounded-lg shadow bg-lightest flex flex-col" style={{left:`${noode.pos.x}px`,top:`${noode.pos.y}px`,minHeight:'5rem',width:'360px'}}>
    <section onMouseDown={onMouseDown} onMouseUp={onMouseUp} className="noodeHeader py-2 px-4 flex cursor-move">
        <p className="grow text-sm text-darker font-semibold">{noode.type}</p>
        <button className="text-dark mr-auto">&times;</button>
    </section>
    <section className="noodeItems px-4 py-2 flex flex-col">
        ...
    </section>

    {
        noode.ins.map((input,i)=>(
            <span onClick={()=>onInput(i)} key={i} style={{top:`${20*i+20}px`}} className="in absolute w-2 h-2 left-0 -translate-x-1/2 bg-variant rounded-full hover:bg-accent">
                <div className="absolute right-4 px-2 py-2 rounded bg-lightest shadow flex" style={{top:`${20*i+4*i}px`,minWidth:"32px"}}>
                    <p className="text-dark text-sm">{input.name}</p>
                    <input value={input.value} onChange={(e)=>onInputChanged(e,input)} disabled={!input.free} type="text" className="w-full rounded px-1 ml-2 text-xs outline-none" style={{minWidth:"32px"}} />
                </div>
            </span>
        ))
    }
    {
        noode.outs.map((output,i)=>(
            <span onClick={()=>onOutput(i)} key={i} style={{top:`${20*i+20}px`}} className="out absolute w-2 h-2 right-0 translate-x-1/2 bg-variant rounded-full hover:bg-accent">
                <div className="absolute left-4 px-2 py-2 rounded bg-lightest shadow flex" style={{top:`${20*i+4*i}px`,minWidth:"32px"}}>
                    <p className="text-dark text-sm">{output.name}</p>
                    <input value={output.value} disabled={true} type="text" className="w-full rounded px-1 ml-2 text-xs outline-none" style={{minWidth:"32px"}} />
                </div>
            </span>
        ))
    }
    {
        noode.links.map((l,i)=>{
            const space=20;
            const noodeWidth=360;
            const otherNoode=noodes.find((n)=>n.id===l.n);
            const output=l.o;
            const input=l.i;
            const from={x:noode.pos.x+noodeWidth+4,y:space+output*space+noode.pos.y+4};
            const to={x:otherNoode.pos.x-4,y:space+input*space+otherNoode.pos.y+4};//console.log(from);console.log(to)
            return(
                <svg key={i} height={``} width={``} className="fixed left-0 top-0 z-20 pointer-events-none">
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{stroke:"#eee",strokeWidth:1}} />
                </svg>
            )
        })
    }
</div>
)
}

export default Noode;


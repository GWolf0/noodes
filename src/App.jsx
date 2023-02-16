import { useEffect, useState } from "react";
import NoodesContainer from "./components/NoodesContainer";
import AppService from "./services/appService";

function App(){
  //states
  const [noodes,setNoodes]=useState([
    {id:0,type:"Addition",title:"Noode 1",items:[],ins:[{name:"n1",value:"",free:true},{name:"n2",value:"",free:true}],outs:[{name:"res",value:""}],pos:{x:128,y:12},links:[{n:1,o:0,i:0}]},
    {id:1,type:"Addition",title:"Noode 2",items:[],ins:[{name:"n1",value:"",free:true},{name:"n2",value:"",free:true}],outs:[{name:"res",value:""}],pos:{x:510,y:128},links:[]},
  ]);
  //effects
  useEffect(()=>{
    //init
    AppService.idsCounter=noodes.length;
  },[]);
  useEffect(()=>{
    //events handlers
    function onMouseMove(e){
      const mp={x:e.clientX,y:e.clientY};
      //if moving node!=null move it
      const movingNoodeId=AppService.movingNoode.id;
      const movingNoodeOffs=AppService.movingNoode.offs;
      if(movingNoodeId!=null){
        const elem=document.getElementById(`noode_${movingNoodeId}`);
        if(elem){//console.log(movingNoodeId)
          elem.style.left=`${mp.x-movingNoodeOffs.x}px`;
          elem.style.top=`${mp.y-movingNoodeOffs.y}px`;
        }
      }
      //if selectedoutput id is >-1 then render new link line
      if(AppService.selectedOutput.id>-1){
        const noodeId=AppService.selectedOutput.n;
        const outputId=AppService.selectedOutput.id;
        const line=document.getElementById("newLinkLine");
        const noode=noodes.find((n)=>n.id===noodeId);
        if(line&&noode){//console.log(noode.pos.y)
          setNewLinkLineValues(`${noode.pos.x+360}`,`${noode.pos.y+(outputId*20+20)}`,`${mp.x}`,`${mp.y}`);
        }
      }
    }
    function onMouseRightClick(e){
      e.preventDefault();
      if(AppService.selectedOutput.id>-1){
        AppService.selectedOutput={n:-1,id:-1};
        setNewLinkLineValues("0","0","0","0");
      }
    }
    //events
    document.addEventListener("mousemove",onMouseMove);
    document.addEventListener("contextmenu",onMouseRightClick);
    //recalculate if needed
    if(AppService.recalculate){//console.log("rec")
      const newNoodes=noodes.map((n,i)=>{
        const newOuts=AppService.calculateNoodeResults(n);
        n.links.forEach((link,j)=>{
          const targetNoode=noodes.find((nn)=>nn.id===link.n);
          if(targetNoode){
            targetNoode.ins[link.i].value=newOuts[link.o].value;
          }
        });
        return {...n,outs:newOuts};
      });
      AppService.recalculate=false;
      setNoodes(newNoodes);
    }
    return ()=>{
      //remove events
      document.removeEventListener("mousemove",onMouseMove);
      document.removeEventListener("contextmenu",onMouseRightClick);
    }
  },[noodes]);

  //methods
  function onNewNoode(){
    const id=AppService.idsCounter++;
    const newNoode={id:id,type:"Addition",title:`Noode ${id+1}`,items:[],ins:[{name:"n1",value:"",free:true},{name:"n2",value:"",free:true}],outs:[{name:"res",value:""}],pos:{x:window.innerWidth*0.5,y:window.innerHeight*0.5},links:[]};
    setNoodes(prev=>[...prev,newNoode]);
  }
  function onLink(inputNoode,inputId){
    const noode=noodes.find((n)=>n.id===AppService.selectedOutput.n);
    if(noode){
      //setup link from noode to inputNoode on selectedoutputId to inputId
      const newNoode={...noode,links:[...noode.links,{n:inputNoode.id,o:AppService.selectedOutput.id,i:inputId}]};
      setNoodes(prev=>prev.map((n,i)=>n.id===noode.id?newNoode:n));
      //change input value
      const newInputNoode={...inputNoode,ins:inputNoode.ins.map((input,i)=>i===inputId?{...input,value:noode.outs[AppService.selectedOutput.id].value,free:false}:input)};
      setNoodes(prev=>prev.map((n,i)=>n.id===inputNoode.id?newInputNoode:n));
    }
    AppService.selectedOutput={n:-1,id:-1};
    setNewLinkLineValues("0","0","0","0");
  }
  //utils
  function setNewLinkLineValues(x1,y1,x2,y2){
    const line=document.getElementById("newLinkLine");
    if(line){//console.log(line)
      line.y1.baseVal.value=y1;
      line.x1.baseVal.value=x1;
      line.y2.baseVal.value=y2;
      line.x2.baseVal.value=x2;
    }
  }

  return (
    <div className="App w-screen h-screen">
      <NoodesContainer noodes={noodes} setNoodes={setNoodes} onLink={onLink} onNewNoode={onNewNoode} />
      {
        <svg height={``} width={``} className="fixed left-0 top-0 z-20 pointer-events-none">
          <line id="newLinkLine" x1={"0"} y1={"0"} x2={"0"} y2={"0"} style={{stroke:"#eee",strokeWidth:1}} />
        </svg>
      }
    </div>
  )
}

export default App;

class AppService{

    static idsCounter=0;
    static movingNoode={id:null,offs:{x:0,y:0}};
    static selectedOutput={n:-1,id:-1};
    static recalculate=true;

    static calculateNoodeResults(n){
        switch(n.type.toLowerCase()){
            case "addition":
            return AppService.calculateAdditionNoode(n);
            default:
            return n.outs.map((out,i)=>{
                return ({...out,value:"0"});
            });
        }
    }
        
    static calculateAdditionNoode(n){
        const res=n.outs.map((out,i)=>{
            let res=n.ins.reduce((total,cur)=>total+(parseFloat(cur.value)||0),0);
            return ({...out,value:res});
        });
        return res;
    }

}

export default AppService;

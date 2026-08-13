import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const PLANTS = [
  {id:1,n:"African Violet",r:"Dining Room",t:"flowering",i:5,pw:4,ph:3,lw:"2026-08-12",lf:"2026-08-12",mist:false,self:false,lr:"2026-02-21",snooze:null},
  {id:2,n:"Aloe Vera",r:"Kitchen",t:"succulent",i:14,pw:4,ph:5.5,lw:"2026-07-29",lf:"2026-05-27",mist:false,self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-17"},
  {id:3,n:"Asparagus Fern",r:"Dining Room",t:"fern",i:8,pw:5.5,ph:5.5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2025-08-24",snooze:null},
  {id:4,n:"Bamboo",r:"Kitchen",t:"tropical",i:9,pw:6,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:false,lr:"2026-01-30",snooze:null},
  {id:5,n:"Bamboo Palm",r:"Dining Room",t:"tropical",i:12,pw:8,ph:6,lw:"2026-07-27",lf:"2026-07-09",mist:true,self:true,lr:"2026-06-09",snooze:"2026-08-15"},
  {id:7,n:"Boston Fern",r:"Living Room",t:"fern",i:8,pw:5.5,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2026-06-10",snooze:null},
  {id:8,n:"Bougainvillea",r:"Balcony",t:"flowering",i:5,pw:10,ph:10,lw:"2026-08-06",lf:"2026-07-27",mist:false,self:false,lr:"2025-08-26",ri:18,snooze:null},
  {id:9,n:"Brittle Cactus",r:"Balcony",t:"succulent",i:13,pw:4,ph:3.5,lw:"2026-07-29",lf:"2026-07-21",mist:false,self:false,lr:"2025-08-27",snooze:null},
  {id:10,n:"Carnation",r:"Balcony",t:"flowering",i:4,pw:6,ph:6,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-05-17",snooze:null},
  {id:13,n:"Common Houseleek",r:"Balcony",t:"succulent",i:11,pw:3,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-04-09",snooze:null},
  {id:14,n:"Corn Plant",r:"Living Room",t:"tropical",i:9,pw:11,ph:19,lw:"2026-06-28",lf:"2026-06-28",mist:true,self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-14"},
  {id:15,n:"Crassula Conjuncta",r:"Balcony",t:"succulent",i:13,pw:2.5,ph:2,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-08-28",ri:14,snooze:null},
  {id:16,n:"Crassula Conjuncta 2026",r:"Living Room",t:"succulent",i:16,pw:3,ph:2,lw:"2026-08-12",lf:"2026-08-12",mist:false,self:false,lr:"2026-03-02",snooze:null},
  {id:17,n:"Crassula Tetragona",r:"Balcony",t:"succulent",i:13,pw:2.5,ph:2,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-11-01",snooze:null},
  {id:18,n:"Dracaena Marginata Colorama",r:"Dining Room",t:"tropical",i:11,pw:7,ph:5.5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2026-04-07",snooze:null},
  {id:19,n:"English Ivy",r:"Balcony",t:"tropical",i:5,pw:7.5,ph:7,lw:"2026-08-06",lf:"2026-07-09",mist:false,self:false,lr:"2026-06-09",snooze:"2026-08-10"},
  {id:20,n:"Fiddle Leaf Fig",r:"Living Room",t:"tropical",i:10,pw:8.5,ph:7,lw:"2026-07-27",lf:"2026-07-27",mist:true,self:true,lr:"2025-08-25",snooze:"2026-08-14"},
  {id:21,n:"Anthurium Andraeanum",r:"Studio",t:"flowering",i:6,pw:6.5,ph:7,lw:"2026-07-21",lf:"2026-07-21",mist:true,self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-14"},
  {id:23,n:"Gasteria Carinata",r:"Living Room",t:"succulent",i:18,pw:2,ph:3,lw:"2026-07-27",lf:"2026-07-09",mist:false,self:false,lr:"2025-08-25",ri:14,snooze:null},
  {id:26,n:"Geraniums",r:"Balcony",t:"flowering",i:3,pw:11,ph:11,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-05-17",snooze:null},
  {id:27,n:"Ghost Plant",r:"Living Room",t:"succulent",i:13,pw:2.5,ph:2.5,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-08-28",ri:14,snooze:null},
  {id:28,n:"Giant Chin Cactus",r:"Living Room",t:"succulent",i:10,pw:3,ph:2,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:29,n:"Golden Barrel Cactus",r:"Balcony",t:"succulent",i:15,pw:6,ph:5,lw:"2026-07-29",lf:"2026-07-21",mist:false,self:false,lr:"2025-08-24",ri:30,snooze:null},
  {id:30,n:"Golden Pothos",r:"Dining Room",t:"tropical",i:11,pw:9,ph:6,lw:"2026-08-12",lf:"2026-08-12",mist:true,self:true,lr:"2026-06-09",snooze:null},
  {id:31,n:"Golden Pothos 2025",r:"Dining Room",t:"tropical",i:15,pw:6,ph:4.75,lw:"2026-06-13",lf:"2026-04-01",mist:true,self:true,lr:"2025-08-12",snooze:"2026-08-14"},
  {id:32,n:"Golden Sedum",r:"Balcony",t:"succulent",i:10,pw:6,ph:6,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-06-04",snooze:null},
  {id:34,n:"Heartleaf Philodendron",r:"Dining Room",t:"tropical",i:11,pw:5.5,ph:5,lw:"2026-08-12",lf:"2026-08-12",mist:true,self:true,lr:"2026-06-09",snooze:null},
  {id:35,n:"Heartleaf Philodendron 2024",r:"Dining Room",t:"tropical",i:15,pw:6,ph:4.75,lw:"2026-06-13",lf:"2026-04-01",mist:true,self:true,lr:"2025-08-12",snooze:"2026-08-14"},
  {id:36,n:"Indian Fig & Golden Rat Tail",r:"Balcony",t:"succulent",i:13,pw:6,ph:6,lw:"2026-07-29",lf:"2026-07-09",mist:false,self:false,lr:"2026-06-04",snooze:null},
  {id:38,n:"Jade",r:"Balcony",t:"succulent",i:11,pw:3.5,ph:3.5,lw:"2026-07-29",lf:"2026-07-21",mist:false,self:false,lr:"2026-02-21",snooze:"2026-08-12"},
  {id:41,n:"Majesty Palm",r:"Balcony",t:"tropical",i:8,pw:10.5,ph:10.5,lw:"2026-08-06",lf:"2026-07-27",mist:true,self:false,lr:"2026-05-17",snooze:null},
  {id:42,n:"Mammillaria Gracilis",r:"Living Room",t:"succulent",i:18,pw:3,ph:2.5,lw:"2026-07-27",lf:"2026-07-27",mist:false,self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:43,n:"Mammillaria Gracilis 2025",r:"Living Room",t:"succulent",i:18,pw:2,ph:1,lw:"2026-07-27",lf:"2026-07-09",mist:false,self:false,lr:"2025-11-01",ri:30,snooze:null},
  {id:44,n:"Mint",r:"Balcony",t:"herb",i:2,pw:5.5,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:true,lr:"2026-06-10",snooze:"2026-08-15"},
  {id:45,n:"Monstera Thai",r:"Dining Room",t:"tropical",i:14,pw:10,ph:6,lw:"2026-07-27",lf:"2026-07-09",mist:true,self:true,lr:"2026-06-09",snooze:"2026-08-14"},
  {id:46,n:"Moon Cactus",r:"Living Room",t:"succulent",i:18,pw:2,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:48,n:"Peace Lily",r:"Bedroom",t:"tropical",i:12,pw:6,ph:4.5,lw:"2026-07-29",lf:"2026-08-09",mist:true,self:true,lr:"2026-04-24",snooze:"2026-08-17"},
  {id:50,n:"Pencil Cactus",r:"Balcony",t:"succulent",i:11,pw:4.5,ph:4,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-07-21",snooze:null},
  {id:52,n:"Philodendron Brasil",r:"Bedroom",t:"tropical",i:6,pw:3.5,ph:3.5,lw:"2026-07-29",lf:"2026-06-27",mist:true,self:false,lr:"2025-07-11",snooze:"2026-08-14"},
  {id:53,n:"Poinsettia",r:"Balcony",t:"flowering",i:5,pw:6,ph:6,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2025-12-15",snooze:null},
  {id:55,n:"Red Treasure",r:"Balcony",t:"succulent",i:13,pw:4,ph:5,lw:"2026-07-29",lf:"2026-05-27",mist:false,self:false,lr:"2025-08-28",ri:14,snooze:"2026-08-12"},
  {id:57,n:"Rubber Plant",r:"Living Room",t:"tropical",i:8,pw:8.5,ph:8.5,lw:"2026-05-07",lf:"2026-05-07",mist:true,self:false,lr:"2025-08-24",ri:30,snooze:"2026-08-14"},
  {id:58,n:"Snake Plant",r:"Studio",t:"succulent",i:14,pw:8,ph:7,lw:"2026-06-13",lf:"2026-04-01",mist:false,self:false,lr:"2026-01-23",snooze:"2026-08-14"},
  {id:59,n:"Snake Plant 2026",r:"Dining Room",t:"succulent",i:10,pw:3.5,ph:3,lw:"2026-06-13",lf:"2026-04-09",mist:false,self:false,lr:"2026-02-04",snooze:"2026-08-14"},
  {id:60,n:"Spider Plant",r:"Bedroom",t:"tropical",i:9,pw:10.5,ph:9,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:false,lr:"2026-06-10",snooze:null},
  {id:61,n:"Spiny PinCushion Cactus",r:"Living Room",t:"succulent",i:13,pw:4,ph:2,lw:"2026-07-21",lf:"2026-06-28",mist:false,self:false,lr:"2026-06-10",snooze:"2026-08-14"},
  {id:62,n:"String of Turtles",r:"Balcony",t:"tropical",i:4,pw:2.5,ph:2,lw:"2026-07-29",lf:"2026-07-09",mist:true,self:false,lr:"2026-04-29",snooze:"2026-08-12"},
  {id:63,n:"Swiss Cheese Vine",r:"Studio",t:"tropical",i:10,pw:6.5,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2026-04-07",snooze:null},
  {id:64,n:"Black Aeonium",r:"Kitchen",t:"succulent",i:15,pw:4.5,ph:4,lw:"2026-08-12",lf:"2026-08-12",mist:false,self:false,lr:"2026-06-10",snooze:null},
  {id:65,n:"ZZ Plant",r:"Studio",t:"tropical",i:14,pw:8,ph:7,lw:"2026-07-27",lf:"2026-07-12",mist:false,self:false,lr:"2026-06-10",ri:24,snooze:"2026-08-14"},
  {id:68,n:"Crassula Babys Necklace",r:"Balcony",t:"succulent",i:8,pw:2,ph:2,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-04-20",snooze:null},
  {id:69,n:"Crassula Tom Thumb",r:"Balcony",t:"succulent",i:8,pw:2,ph:2,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-04-20",snooze:null},
  {id:70,n:"Zanzibar Aloe",r:"Bedroom",t:"succulent",i:16,pw:3.5,ph:3,lw:"2026-08-12",lf:"2026-08-12",mist:false,self:false,lr:"2026-04-29",snooze:null},
  {id:74,n:"Lobelia",r:"Balcony",t:"flowering",i:2,pw:5.5,ph:5,lw:"2026-08-08",lf:"2026-07-21",mist:false,self:true,lr:"2026-06-10",snooze:null},
  {id:75,n:"Money Tree",r:"Studio",t:"tropical",i:10,pw:5,ph:4,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2026-06-09",snooze:null},
  {id:76,n:"Anthurium Nebraska Orange",r:"Studio",t:"flowering",i:9,pw:7,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:true,lr:"2026-06-09",snooze:null},
  {id:77,n:"Gasteria Little Warty",r:"Living Room",t:"succulent",i:14,pw:4,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-04-21",snooze:null},
  {id:78,n:"Calathea Ornata",r:"Bedroom",t:"tropical",i:7,pw:3,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:false,lr:"2026-04-21",snooze:null},
  {id:79,n:"Maranta Leuconeura",r:"Bedroom",t:"tropical",i:7,pw:3,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:false,lr:"2026-04-21",snooze:null},
  {id:80,n:"Dracaena Fragrans",r:"Dining Room",t:"tropical",i:7,pw:3,ph:3,lw:"2026-08-09",lf:"2026-08-09",mist:true,self:false,lr:"2026-04-21",snooze:null},
  {id:82,n:"Serrano Pepper",r:"Balcony",t:"herb",i:3,pw:6,ph:5,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-06-09",snooze:null},
  {id:83,n:"Red Treasure 2026",r:"Balcony",t:"succulent",i:13,pw:6,ph:6,lw:"2026-08-09",lf:"2026-08-09",mist:false,self:false,lr:"2026-06-04",snooze:null},
  {id:85,n:"Phalaenopsis White",r:"Living Room",t:"flowering",i:7,pw:0,ph:0,lw:"2026-08-09",lf:"2026-01-01",mist:false,self:false,lr:"2026-07-09",snooze:"2026-08-13"},
];

const FERT={succulent:56,tropical:28,fern:42,herb:21,flowering:21,tree:42};
const MIST_DAYS=2;
const ROOMS=["Living Room","Dining Room","Kitchen","Bedroom","Balcony","Studio"];
const DEPTH={succulent:70,fern:60,herb:60,tropical:60,flowering:60,tree:50};
const METER={succulent:"1-2/10",tropical:"3-4/10",fern:"5-6/10",herb:"4-5/10",flowering:"3-4/10",tree:"3-4/10"};
const RECHECK={succulent:3,fern:1,herb:1,tropical:2,flowering:2,tree:2};
const REPOT_M={succulent:24,tropical:12,fern:12,herb:12,flowering:12,tree:24};

function repotDue(lr,months){const d=new Date(lr+"T12:00:00");d.setMonth(d.getMonth()+months);return d;}
function today(){return new Date().toLocaleDateString("en-CA",{timeZone:"America/Los_Angeles"});}
function days(ds,ref){if(!ds)return 9999;return Math.floor((ref-new Date(ds+"T12:00:00"))/86400000);}
function nwd(lw,i,ref){const d=new Date(lw+"T12:00:00");d.setDate(d.getDate()+i);return Math.ceil((d-ref)/86400000);}
function snoozeDate(ds,n){const d=new Date(ds+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];}

export default function App(){
  const [room,setRoom]=useState("all");
  const [date,setDate]=useState(today());
  const [show,setShow]=useState("care");
  const [logs,setLogsState]=useState({});
  const [tab,setTab]=useState("schedule");
  const [copied,setCopied]=useState(false);
  const [copyMsg,setCopyMsg]=useState("");
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);

  // Load all plant logs from Supabase on mount
  useEffect(()=>{
    async function loadFromDB(){
      setLoading(true);
      const {data,error}=await supabase
        .from("plants")
        .select("id,last_watered,last_fertilized,last_repotted,snooze_until,mist");
      if(error){console.error("Load error:",error);setLoading(false);return;}
      const rebuilt={};
      data.forEach(row=>{
        rebuilt[row.id]={
          lw:row.last_watered||null,
          lf:row.last_fertilized||null,
          lr:row.last_repotted||null,
          snooze:row.snooze_until||null,
          misted:null, // misting is still session-only
        };
      });
      setLogsState(rebuilt);
      setLoading(false);
    }
    loadFromDB();
  },[]);

  // Save a single field update to Supabase
  async function saveToDb(id,field,value){
    const colMap={lw:"last_watered",lf:"last_fertilized",lr:"last_repotted",snooze:"snooze_until"};
    const col=colMap[field];
    if(!col)return; // misted is session-only, skip DB
    setSaving(true);
    const {error}=await supabase
      .from("plants")
      .upsert({id, [col]:value||null},{onConflict:"id"});
    if(error)console.error("Save error:",error);
    setSaving(false);

    // Also write to care_events for watering/fertilizing/repotting
    if((field==="lw"||field==="lf"||field==="lr")&&value){
      const actionMap={lw:"Watered",lf:"Fertilized",lr:"Repotted"};
      const plant=PLANTS.find(p=>p.id===id);
      await supabase.from("care_events").insert({
        plant_id:id,
        plant_name:plant?.n||"Unknown",
        action:actionMap[field],
        event_date:value,
      });
    }
  }

  const lg=id=>logs[id]||{};

  function upd(id,f,v){
    setLogsState(prev=>({...prev,[id]:{...(prev[id]||{}),[f]:v}}));
    saveToDb(id,f,v);
  }

  function clr(id,f){
    setLogsState(prev=>({...prev,[id]:{...(prev[id]||{}),[f]:null}}));
    saveToDb(id,f,null);
  }

  const ref=new Date(date+"T12:00:00");

  const rows=PLANTS.map(p=>{
    const l=lg(p.id);
    const lw=l.lw||p.lw, lf=l.lf||p.lf;
    const wT=l.lw===date, fT=l.lf===date, mistedToday=l.misted===date;
    const snoozeUntil=l.snooze||p.snooze||null;
    const snoozed=!!(snoozeUntil&&snoozeUntil>date);
    const w=!wT&&!snoozed&&days(lw,ref)>0&&days(lw,ref)>=p.i;
    const f=!fT&&!snoozed&&!!lf&&new Date(lf+"T12:00:00")<=ref&&days(lf,ref)>0&&days(lf,ref)>=FERT[p.t];
    const depth=DEPTH[p.t]||60;
    const needsMist=p.mist&&(!l.misted||days(l.misted,ref)>=MIST_DAYS);
    const lr=l.lr||p.lr||null;
    const rDue=lr?repotDue(lr,p.ri||REPOT_M[p.t]||12):null;
    const rT=l.lr===date;
    const needsRepot=!rT&&!!rDue&&rDue<=ref;
    return{...p,lw,lf,wT,fT,snoozed,snoozeUntil,mistedToday,w,f,depth,nd:nwd(lw,p.i,ref),needsMist,lr,rDue,rT,needsRepot};
  });

  const vis=rows
    .filter(p=>room==="all"||p.r===room)
    .filter(p=>{
      if(show==="care")return(p.w||p.f)&&!p.snoozed;
      if(show==="mist")return p.needsMist&&!p.mistedToday;
      if(show==="water")return p.w&&!p.snoozed;
      if(show==="fert")return p.f&&!p.snoozed;
      if(show==="done")return p.wT||p.fT;
      if(show==="moist")return p.snoozed;
      if(show==="repot")return p.needsRepot||p.rT;
      return true;
    });

  const byRoom={};
  vis.forEach(p=>{if(!byRoom[p.r])byRoom[p.r]=[];byRoom[p.r].push(p);});

  const nw=rows.filter(p=>p.w&&!p.snoozed).length;
  const nf=rows.filter(p=>p.f&&!p.snoozed).length;
  const nd=rows.filter(p=>p.wT||p.fT).length;
  const nm=rows.filter(p=>p.snoozed).length;
  const nmi=rows.filter(p=>p.needsMist&&!p.mistedToday).length;
  const nr=rows.filter(p=>p.needsRepot).length;

  const c={
    water:{bg:"#E6F1FB",border:"#85B7EB",text:"#0C447C"},
    fert:{bg:"#EAF3DE",border:"#97C459",text:"#27500A"},
    moist:{bg:"#fff8e6",border:"#EF9F27",text:"#854F0B"},
    undo:{bg:"#f5f5f0",border:"#ddd",text:"#666"},
    danger:{bg:"#fff",border:"#F09595",text:"#A32D2D"},
    repot:{bg:"#F3EDFB",border:"#B79CE4",text:"#5B3E96"},
    neutral:{bg:"#fff",border:"#ddd",text:"#333"},
  };

  const Pill=({s,txt})=><span style={{background:s.bg,color:s.text,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:99,marginRight:3,display:"inline-block",whiteSpace:"nowrap"}}>{txt}</span>;
  const Btn=({s,lbl,fn})=><button onClick={fn} style={{fontSize:12,padding:"5px 10px",borderRadius:8,border:`1px solid ${s.border}`,background:s.bg,color:s.text,cursor:"pointer",marginRight:5,marginTop:5,fontFamily:"inherit",whiteSpace:"nowrap"}}>{lbl}</button>;

  function copyLog(){
    const w=[],f=[],m=[],mi=[],rp=[];
    PLANTS.forEach(p=>{
      const l=lg(p.id);
      if(l.lw===date)w.push(p.n);
      if(l.lf===date)f.push(p.n);
      if(l.snooze&&l.snooze>date)m.push(p.n);
      if(l.misted===date)mi.push(p.n);
      if(l.lr===date)rp.push(p.n);
    });
    if(!w.length&&!f.length&&!m.length&&!mi.length&&!rp.length){
      setCopyMsg("Nothing logged yet!");
      setTimeout(()=>setCopyMsg(""),3000);
      return;
    }
    let msg=`Plant care log for ${date}:\n`;
    if(w.length)msg+=`Watered: ${w.join(", ")}\n`;
    if(f.length)msg+=`Fertilized: ${f.join(", ")}\n`;
    if(m.length)msg+=`Snoozed: ${m.map(n=>{const l=lg(PLANTS.find(p=>p.n===n)?.id||0);return l.snooze?`${n} (until ${l.snooze})`:n;}).join(", ")}\n`;
    if(mi.length)msg+=`Misted: ${mi.join(", ")}\n`;
    if(rp.length)msg+=`Repotted: ${rp.join(", ")}\n`;
    setCopyMsg(msg);
    try{navigator.clipboard.writeText(msg).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}catch(e){}
  }

  async function clearToday(){
    const updates=PLANTS.map(async p=>{
      const l=lg(p.id);
      const patch={};
      if(l.lw===date)patch.lw=null;
      if(l.lf===date)patch.lf=null;
      if(l.lr===date)patch.lr=null;
      if(Object.keys(patch).length){
        setLogsState(prev=>({...prev,[p.id]:{...(prev[p.id]||{}),...patch,snooze:null}}));
        await supabase.from("plants").upsert({
          id:p.id,
          ...(patch.lw!==undefined&&{last_watered:null}),
          ...(patch.lf!==undefined&&{last_fertilized:null}),
          ...(patch.lr!==undefined&&{last_repotted:null}),
          snooze_until:null,
        },{onConflict:"id"});
      }
    });
    await Promise.all(updates);
  }

  const sel={width:"100%",padding:"7px 8px",borderRadius:8,border:"1px solid #ddd",fontSize:13,fontFamily:"inherit",background:"#fff"};

  if(loading)return(
    <div style={{fontFamily:"system-ui,sans-serif",padding:40,textAlign:"center",color:"#aaa"}}>
      Loading plants... 🌱
    </div>
  );

  return(
    <div style={{fontFamily:"system-ui,sans-serif",padding:"12px 10px",color:"#1a1a1a",maxWidth:600,margin:"0 auto"}}>
      {saving&&<div style={{position:"fixed",top:8,right:12,fontSize:11,color:"#aaa",background:"#fff",padding:"4px 10px",borderRadius:8,border:"1px solid #eee",zIndex:99}}>Saving...</div>}

      <div style={{display:"flex",borderBottom:"1px solid #e0e0d8",marginBottom:14}}>
        {[["schedule","Schedule"],["list","All Plants"]].map(([k,v])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 14px",fontSize:13,border:"none",background:"none",cursor:"pointer",color:tab===k?"#1a1a1a":"#aaa",borderBottom:tab===k?"2px solid #1a1a1a":"2px solid transparent",fontWeight:tab===k?600:400,marginBottom:-1,fontFamily:"inherit"}}>{v}</button>
        ))}
      </div>

      {tab==="schedule"&&<>
        <div style={{background:"#f9f9f7",borderRadius:10,padding:12,marginBottom:10,border:"1px solid #e8e8e0"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <div style={{fontSize:10,color:"#aaa",fontWeight:600,textTransform:"uppercase",marginBottom:3}}>Room</div>
              <select value={room} onChange={e=>setRoom(e.target.value)} style={sel}>
                <option value="all">All rooms</option>
                {ROOMS.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:10,color:"#aaa",fontWeight:600,textTransform:"uppercase",marginBottom:3}}>Date</div>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={sel}/>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:"#aaa",fontWeight:600,textTransform:"uppercase",marginBottom:3}}>Show</div>
            <select value={show} onChange={e=>setShow(e.target.value)} style={sel}>
              <option value="care">Needs water or fertilizer</option>
              <option value="water">Needs watering only</option>
              <option value="fert">Needs fertilizer only</option>
              <option value="done">Logged today</option>
              <option value="mist">Needs misting</option>
              <option value="moist">Still moist</option>
              <option value="repot">Needs repotting</option>
              <option value="all">All plants</option>
            </select>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Btn s={c.neutral} lbl={copied?"Copied!":"Copy log"} fn={copyLog}/>
            <Btn s={c.danger} lbl="Clear today" fn={clearToday}/>
          </div>
          {copyMsg&&<div style={{marginTop:10,background:"#fff",border:"1px solid #e0e0d8",borderRadius:8,padding:"10px 12px",fontSize:12,color:"#333",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{copyMsg}</div>}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:12}}>
          {[[vis.length,"shown","#333"],[nw,"water","#185FA5"],[nf,"fert","#3B6D11"],[nm,"moist","#854F0B"],[nmi,"mist","#0F6E56"],[nr,"repot","#5B3E96"]].map(([n,l,cl])=>(
            <div key={l} style={{background:"#f5f5f0",borderRadius:8,padding:"8px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:cl}}>{n}</div>
              <div style={{fontSize:10,color:"#aaa",marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>

        {vis.length===0
          ?<div style={{textAlign:"center",padding:"2rem",color:"#aaa",fontSize:14}}>
            {show==="moist"?"No plants marked still moist.":show==="done"?"Nothing logged yet today.":"All good!"}
          </div>
          :ROOMS.filter(r=>byRoom[r]).map(r=>(
            <div key={r} style={{background:"#fff",borderRadius:10,border:"1px solid #e8e8e0",padding:"10px 12px",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",paddingBottom:6,borderBottom:"1px solid #f0f0e8",marginBottom:4}}>{r} — {byRoom[r].length} plant{byRoom[r].length>1?"s":""}</div>
              {byRoom[r].map(p=>{
                const allDone=(p.w?p.wT:true)&&(p.f?p.fT:true);
                return(
                  <div key={p.id} style={{padding:"10px 0",borderBottom:"1px solid #f8f8f5",opacity:allDone&&p.mistedToday||p.snoozed?0.4:1}}>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:5,display:"flex",flexWrap:"wrap",alignItems:"center",gap:3}}>
                      {p.n}
                      {p.self&&<Pill s={{bg:"#EEEDFE",border:"",text:"#534AB7"}} txt="self-water"/>}
                      {p.mist&&<Pill s={{bg:"#E1F5EE",border:"",text:"#0F6E56"}} txt={p.mistedToday?"Misted today":"Mist"}/>}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
                      {p.snoozed&&<Pill s={c.moist} txt={`Snoozed until ${new Date(p.snoozeUntil+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}`}/>}
                      {p.wT&&<Pill s={c.water} txt="Watered today"/>}
                      {p.fT&&<Pill s={c.fert} txt="Fertilized today"/>}
                      {!p.wT&&p.w&&<Pill s={c.water} txt="Water"/>}
                      {!p.fT&&p.f&&<Pill s={c.fert} txt="Fertilize"/>}
                      {p.needsRepot&&<Pill s={c.repot} txt="Repot due"/>}
                      {p.rT&&<Pill s={c.repot} txt="Repotted today"/>}
                    </div>
                    <div style={{fontSize:12,color:"#777",lineHeight:1.8}}>
                      Next water: {p.w?"Today":p.nd<=0?"Today":`in ${p.nd} day${p.nd===1?"":"s"}`} · every {p.i} days
                      <div style={{fontSize:11,color:"#bbb"}}>Last watered: {p.lw} · Last fertilized: {p.lf||"never"}</div>
                      {p.w&&!p.wT&&!p.snoozed&&<div>Probe <strong>{p.depth}%</strong> deep · water when <strong>≤ {METER[p.t]}</strong></div>}
                      {p.f&&!p.fT&&!p.snoozed&&<div>Fertilize: balanced liquid, half strength</div>}
                      {p.needsRepot&&<div style={{color:"#5B3E96"}}>Repot due — last repotted {p.lr} ({p.ri||REPOT_M[p.t]} mo cycle)</div>}
                      {p.rT&&<div style={{fontSize:11,color:"#5B3E96"}}>Repotted {p.lr} <button onClick={()=>clr(p.id,"lr")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                      {p.snoozed&&<div style={{color:"#854F0B",fontStyle:"italic"}}>Snoozed — check again {new Date(p.snoozeUntil+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>}
                      {p.wT&&<div style={{fontSize:11,color:"#185FA5"}}>Watered {p.lw} <button onClick={()=>clr(p.id,"lw")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                      {p.fT&&<div style={{fontSize:11,color:"#3B6D11"}}>Fertilized {p.lf} <button onClick={()=>clr(p.id,"lf")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap"}}>
                      {!p.wT&&<Btn s={c.water} lbl="Watered today" fn={()=>upd(p.id,"lw",date)}/>}
                      {!p.fT&&<Btn s={c.fert} lbl="Fertilized today" fn={()=>upd(p.id,"lf",date)}/>}
                      {!p.snoozed&&(p.w||p.f)&&!p.wT&&!p.fT&&[1,3,5].map(d=>(
                        <Btn key={d} s={c.moist} lbl={`Snooze ${d}d`} fn={()=>upd(p.id,"snooze",snoozeDate(date,d))}/>
                      ))}
                      {p.snoozed&&<Btn s={c.undo} lbl="Undo snooze" fn={()=>clr(p.id,"snooze")}/>}
                      {(p.needsRepot||show==="repot"||show==="all")&&!p.rT&&<Btn s={c.repot} lbl="Repotted today" fn={()=>upd(p.id,"lr",date)}/>}
                      {p.mist&&!p.mistedToday&&<Btn s={{bg:"#E1F5EE",border:"#5DCAA5",text:"#0F6E56"}} lbl="Misted today" fn={()=>upd(p.id,"misted",date)}/>}
                      {p.mistedToday&&<Btn s={c.undo} lbl="Undo mist" fn={()=>clr(p.id,"misted")}/>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        }
      </>}

      {tab==="list"&&(
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e8e8e0",padding:"10px 12px"}}>
          {ROOMS.map(r=>{
            const rp=PLANTS.filter(p=>p.r===r);
            if(!rp.length)return null;
            return <div key={r}>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",padding:"8px 0 4px",borderBottom:"1px solid #f0f0e8",marginBottom:2}}>{r}</div>
              {rp.map(p=>{
                const log=lg(p.id);
                const lastW=log.lw||p.lw;
                const lastF=log.lf||p.lf;
                return(
                  <div key={p.id} style={{padding:"7px 0",borderBottom:"1px solid #fafaf8"}}>
                    <div style={{fontSize:13,fontWeight:500}}>{p.n}{p.self&&<span style={{fontSize:10,background:"#EEEDFE",color:"#534AB7",padding:"1px 6px",borderRadius:99,marginLeft:5}}>self-water</span>}</div>
                    <div style={{fontSize:11,color:"#aaa"}}>{p.t} · every {p.i} days · {DEPTH[p.t]}% probe · {METER[p.t]}</div>
                    <div style={{fontSize:11,color:"#aaa"}}>Pot: {p.pw}"W × {p.ph}"H {p.self?"(self-watering)":""}</div>
                    <div style={{fontSize:11,color:"#aaa"}}>Repotted: {log.lr||p.lr||"?"} · next ~{p.lr?repotDue(log.lr||p.lr,p.ri||REPOT_M[p.t]||12).toLocaleDateString("en-US",{month:"short",year:"numeric"}):"?"}</div>
                    <div style={{fontSize:11,color:"#bbb"}}>Last watered: {lastW} · Last fertilized: {lastF||"never"}</div>
                  </div>
                );
              })}
            </div>;
          })}
        </div>
      )}
    </div>
  );
}
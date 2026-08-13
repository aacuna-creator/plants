import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Base plant data — source of truth for static fields
const PLANTS_BASE = [
  {id:1,n:"African Violet",r:"Dining Room",t:"flowering",i:5,pw:4,ph:3,pm:"plastic",self:false,lr:"2026-02-21",snooze:null},
  {id:2,n:"Aloe Vera",r:"Kitchen",t:"succulent",i:14,pw:4,ph:5.5,pm:"ceramic",self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-17"},
  {id:3,n:"Asparagus Fern",r:"Dining Room",t:"fern",i:8,pw:5.5,ph:5.5,pm:"plastic",self:true,lr:"2025-08-24",snooze:null},
  {id:4,n:"Bamboo",r:"Kitchen",t:"tropical",i:9,pw:6,ph:5,pm:"plastic",self:false,lr:"2026-01-30",snooze:null},
  {id:5,n:"Bamboo Palm",r:"Dining Room",t:"tropical",i:12,pw:8,ph:6,pm:"plastic",self:true,lr:"2026-06-09",snooze:"2026-08-15"},
  {id:7,n:"Boston Fern",r:"Living Room",t:"fern",i:8,pw:5.5,ph:5,pm:"plastic",self:true,lr:"2026-06-10",snooze:null},
  {id:8,n:"Bougainvillea",r:"Balcony",t:"flowering",i:5,pw:10,ph:10,pm:"plastic",self:false,lr:"2025-08-26",ri:18,snooze:null},
  {id:9,n:"Brittle Cactus",r:"Balcony",t:"succulent",i:13,pw:4,ph:3.5,pm:"plastic",self:false,lr:"2025-08-27",snooze:null},
  {id:10,n:"Carnation",r:"Balcony",t:"flowering",i:4,pw:6,ph:6,pm:"terracotta",self:false,lr:"2026-05-17",snooze:null},
  {id:13,n:"Common Houseleek",r:"Balcony",t:"succulent",i:11,pw:3,ph:3,pm:"terracotta",self:false,lr:"2026-04-09",snooze:null},
  {id:14,n:"Corn Plant",r:"Living Room",t:"tropical",i:9,pw:11,ph:19,pm:"ceramic",self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-14"},
  {id:15,n:"Crassula Conjuncta",r:"Balcony",t:"succulent",i:13,pw:2.5,ph:2,pm:"plastic",self:false,lr:"2025-08-28",ri:14,snooze:null},
  {id:16,n:"Crassula Conjuncta 2026",r:"Living Room",t:"succulent",i:16,pw:3,ph:2,pm:"ceramic",self:false,lr:"2026-03-02",snooze:null},
  {id:17,n:"Crassula Tetragona",r:"Balcony",t:"succulent",i:13,pw:2.5,ph:2,pm:"plastic",self:false,lr:"2025-11-01",snooze:null},
  {id:18,n:"Dracaena Marginata Colorama",r:"Dining Room",t:"tropical",i:11,pw:7,ph:5.5,pm:"plastic",self:true,lr:"2026-04-07",snooze:null},
  {id:19,n:"English Ivy",r:"Balcony",t:"tropical",i:5,pw:7.5,ph:7,pm:"plastic",self:false,lr:"2026-06-09",snooze:"2026-08-10"},
  {id:20,n:"Fiddle Leaf Fig",r:"Living Room",t:"tropical",i:10,pw:8.5,ph:7,pm:"plastic",self:true,lr:"2025-08-25",snooze:"2026-08-14"},
  {id:21,n:"Anthurium Andraeanum",r:"Studio",t:"flowering",i:6,pw:6.5,ph:7,pm:"plastic",self:false,lr:"2025-08-25",ri:30,snooze:"2026-08-14"},
  {id:23,n:"Gasteria Carinata",r:"Living Room",t:"succulent",i:18,pw:2,ph:3,pm:"ceramic",self:false,lr:"2025-08-25",ri:14,snooze:null},
  {id:26,n:"Geraniums",r:"Balcony",t:"flowering",i:3,pw:11,ph:11,pm:"ceramic",self:false,lr:"2026-05-17",snooze:null},
  {id:27,n:"Ghost Plant",r:"Living Room",t:"succulent",i:13,pw:2.5,ph:2.5,pm:"plastic",self:false,lr:"2025-08-28",ri:14,snooze:null},
  {id:28,n:"Giant Chin Cactus",r:"Living Room",t:"succulent",i:10,pw:3,ph:2,pm:"ceramic",self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:29,n:"Golden Barrel Cactus",r:"Balcony",t:"succulent",i:15,pw:6,ph:5,pm:"ceramic",self:false,lr:"2025-08-24",ri:30,snooze:null},
  {id:30,n:"Golden Pothos",r:"Dining Room",t:"tropical",i:11,pw:9,ph:6,pm:"plastic",self:true,lr:"2026-06-09",snooze:null},
  {id:31,n:"Golden Pothos 2025",r:"Dining Room",t:"tropical",i:15,pw:6,ph:4.75,pm:"plastic",self:true,lr:"2025-08-12",snooze:"2026-08-14"},
  {id:32,n:"Golden Sedum",r:"Balcony",t:"succulent",i:10,pw:6,ph:6,pm:"terracotta",self:false,lr:"2026-06-04",snooze:null},
  {id:34,n:"Heartleaf Philodendron",r:"Dining Room",t:"tropical",i:11,pw:5.5,ph:5,pm:"plastic",self:true,lr:"2026-06-09",snooze:null},
  {id:35,n:"Heartleaf Philodendron 2024",r:"Dining Room",t:"tropical",i:15,pw:6,ph:4.75,pm:"plastic",self:true,lr:"2025-08-12",snooze:"2026-08-14"},
  {id:36,n:"Indian Fig & Golden Rat Tail",r:"Balcony",t:"succulent",i:13,pw:6,ph:6,pm:"terracotta",self:false,lr:"2026-06-04",snooze:null},
  {id:38,n:"Jade",r:"Balcony",t:"succulent",i:11,pw:3.5,ph:3.5,pm:"ceramic",self:false,lr:"2026-02-21",snooze:"2026-08-12"},
  {id:41,n:"Majesty Palm",r:"Balcony",t:"tropical",i:8,pw:10.5,ph:10.5,pm:"terracotta",self:false,lr:"2026-05-17",snooze:null},
  {id:42,n:"Mammillaria Gracilis",r:"Living Room",t:"succulent",i:18,pw:3,ph:2.5,pm:"ceramic",self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:43,n:"Mammillaria Gracilis 2025",r:"Living Room",t:"succulent",i:18,pw:2,ph:1,pm:"plastic",self:false,lr:"2025-11-01",ri:30,snooze:null},
  {id:44,n:"Mint",r:"Balcony",t:"herb",i:2,pw:5.5,ph:5,pm:"plastic",self:true,lr:"2026-06-10",snooze:"2026-08-15"},
  {id:45,n:"Monstera Thai",r:"Dining Room",t:"tropical",i:14,pw:10,ph:6,pm:"plastic",self:true,lr:"2026-06-09",snooze:"2026-08-14"},
  {id:46,n:"Moon Cactus",r:"Living Room",t:"succulent",i:18,pw:2,ph:3,pm:"ceramic",self:false,lr:"2025-08-25",ri:30,snooze:null},
  {id:48,n:"Peace Lily",r:"Bedroom",t:"tropical",i:12,pw:6,ph:4.5,pm:"plastic",self:true,lr:"2026-04-24",snooze:"2026-08-17"},
  {id:50,n:"Pencil Cactus",r:"Balcony",t:"succulent",i:11,pw:4.5,ph:4,pm:"terracotta",self:false,lr:"2026-07-21",snooze:null},
  {id:52,n:"Philodendron Brasil",r:"Bedroom",t:"tropical",i:6,pw:3.5,ph:3.5,pm:"plastic",self:false,lr:"2025-07-11",snooze:"2026-08-14"},
  {id:53,n:"Poinsettia",r:"Balcony",t:"flowering",i:5,pw:6,ph:6,pm:"plastic",self:false,lr:"2025-12-15",snooze:null},
  {id:55,n:"Red Treasure",r:"Balcony",t:"succulent",i:13,pw:4,ph:5,pm:"plastic",self:false,lr:"2025-08-28",ri:14,snooze:"2026-08-12"},
  {id:57,n:"Rubber Plant",r:"Living Room",t:"tropical",i:8,pw:8.5,ph:8.5,pm:"plastic",self:false,lr:"2025-08-24",ri:30,snooze:"2026-08-14"},
  {id:58,n:"Snake Plant",r:"Studio",t:"succulent",i:14,pw:8,ph:7,pm:"plastic",self:false,lr:"2026-01-23",snooze:"2026-08-14"},
  {id:59,n:"Snake Plant 2026",r:"Dining Room",t:"succulent",i:10,pw:3.5,ph:3,pm:"plastic",self:false,lr:"2026-02-04",snooze:"2026-08-14"},
  {id:60,n:"Spider Plant",r:"Bedroom",t:"tropical",i:9,pw:10.5,ph:9,pm:"plastic",self:false,lr:"2026-06-10",snooze:null},
  {id:61,n:"Spiny PinCushion Cactus",r:"Living Room",t:"succulent",i:13,pw:4,ph:2,pm:"ceramic",self:false,lr:"2026-06-10",snooze:"2026-08-14"},
  {id:62,n:"String of Turtles",r:"Balcony",t:"tropical",i:4,pw:2.5,ph:2,pm:"plastic",self:false,lr:"2026-04-29",snooze:"2026-08-12"},
  {id:63,n:"Swiss Cheese Vine",r:"Studio",t:"tropical",i:10,pw:6.5,ph:5,pm:"plastic",self:true,lr:"2026-04-07",snooze:null},
  {id:64,n:"Black Aeonium",r:"Kitchen",t:"succulent",i:15,pw:4.5,ph:4,pm:"ceramic",self:false,lr:"2026-06-10",snooze:null},
  {id:65,n:"ZZ Plant",r:"Studio",t:"tropical",i:14,pw:8,ph:7,pm:"plastic",self:false,lr:"2026-06-10",ri:24,snooze:"2026-08-14"},
  {id:68,n:"Crassula Babys Necklace",r:"Balcony",t:"succulent",i:8,pw:2,ph:2,pm:"plastic",self:false,lr:"2026-04-20",snooze:null},
  {id:69,n:"Crassula Tom Thumb",r:"Balcony",t:"succulent",i:8,pw:2,ph:2,pm:"plastic",self:false,lr:"2026-04-20",snooze:null},
  {id:70,n:"Zanzibar Aloe",r:"Bedroom",t:"succulent",i:16,pw:3.5,ph:3,pm:"plastic",self:false,lr:"2026-04-29",snooze:null},
  {id:74,n:"Lobelia",r:"Balcony",t:"flowering",i:2,pw:5.5,ph:5,pm:"plastic",self:true,lr:"2026-06-10",snooze:null},
  {id:75,n:"Money Tree",r:"Studio",t:"tropical",i:10,pw:5,ph:4,pm:"plastic",self:true,lr:"2026-06-09",snooze:null},
  {id:76,n:"Anthurium Nebraska Orange",r:"Studio",t:"flowering",i:9,pw:7,ph:5,pm:"plastic",self:true,lr:"2026-06-09",snooze:null},
  {id:77,n:"Gasteria Little Warty",r:"Living Room",t:"succulent",i:14,pw:4,ph:3,pm:"plastic",self:false,lr:"2026-04-21",snooze:null},
  {id:78,n:"Calathea Ornata",r:"Bedroom",t:"tropical",i:7,pw:3,ph:3,pm:"plastic",self:false,lr:"2026-04-21",snooze:null},
  {id:79,n:"Maranta Leuconeura",r:"Bedroom",t:"tropical",i:7,pw:3,ph:3,pm:"plastic",self:false,lr:"2026-04-21",snooze:null},
  {id:80,n:"Dracaena Fragrans",r:"Dining Room",t:"tropical",i:7,pw:3,ph:3,pm:"plastic",self:false,lr:"2026-04-21",snooze:null},
  {id:82,n:"Serrano Pepper",r:"Balcony",t:"herb",i:3,pw:6,ph:5,pm:"plastic",self:false,lr:"2026-06-09",snooze:null},
  {id:83,n:"Red Treasure 2026",r:"Balcony",t:"succulent",i:13,pw:6,ph:6,pm:"terracotta",self:false,lr:"2026-06-04",snooze:null},
  {id:85,n:"Phalaenopsis White",r:"Living Room",t:"flowering",i:7,pw:0,ph:0,pm:"plastic",self:false,lr:"2026-07-09",snooze:"2026-08-13"},
];

// Constants
const FERT_BASE={succulent:56,tropical:28,fern:42,herb:21,flowering:21,tree:42};
const REPOT_M={succulent:24,tropical:12,fern:12,herb:12,flowering:12,tree:24};
const BASE_I={succulent:14,tropical:9,fern:7,herb:3,flowering:5,tree:10};
const ROOMS=["Living Room","Dining Room","Kitchen","Bedroom","Balcony","Studio"];
const TYPES=["succulent","tropical","fern","herb","flowering","tree"];
const MATERIALS=["plastic","ceramic","terracotta","glazed","fabric","metal"];
const DEPTH={succulent:70,fern:60,herb:60,tropical:60,flowering:60,tree:50};
const METER={succulent:"1-2/10",tropical:"3-4/10",fern:"5-6/10",herb:"4-5/10",flowering:"3-4/10",tree:"3-4/10"};

// Season multipliers — San Diego (0=Jan..11=Dec)
const SEASON_W=[1.25,1.20,1.10,1.00,0.90,0.82,0.78,0.78,0.85,0.95,1.10,1.20];
const SEASON_F=[1.20,1.15,1.05,1.00,0.90,0.85,0.80,0.80,0.88,0.95,1.05,1.15];
const MIN_TO_LEARN=3;

function potMult(pw,pm){
  let m=1.0;
  if(!pw||pw<=0)return m;
  if(pw<=3)m*=0.85; else if(pw<=5)m*=0.95; else if(pw<=7)m*=1.00; else if(pw<=9)m*=1.10; else m*=1.20;
  if(pm==="terracotta")m*=0.85; else if(pm==="ceramic")m*=1.00; else if(pm==="plastic")m*=1.10;
  return m;
}
function weatherMult(tempF,hum){
  let m=1.0;
  if(tempF>=90)m*=0.80; else if(tempF>=80)m*=0.88; else if(tempF>=70)m*=0.95; else if(tempF<=55)m*=1.15; else m*=1.05;
  if(hum>=80)m*=1.10; else if(hum<=30)m*=0.90;
  return m;
}
function smartWaterInterval(p,weather,learned){
  const base=learned||p.i;
  const sm=SEASON_W[new Date().getMonth()]||1.0;
  const pm=potMult(p.pw,p.pm);
  const wm=weather&&p.r==="Balcony"?weatherMult(weather.tempF,weather.humidity):1.0;
  return Math.max(1,Math.round(base*sm*pm*wm));
}
function smartFertInterval(t){
  const base=FERT_BASE[t]||28;
  const sm=SEASON_F[new Date().getMonth()]||1.0;
  return Math.max(7,Math.round(base*sm));
}

function repotDue(lr,months){const d=new Date(lr+"T12:00:00");d.setMonth(d.getMonth()+months);return d;}
function today(){return new Date().toLocaleDateString("en-CA",{timeZone:"America/Los_Angeles"});}
function days(ds,ref){if(!ds)return 9999;return Math.floor((ref-new Date(ds+"T12:00:00"))/86400000);}
function nwd(lw,i,ref){const d=new Date(lw+"T12:00:00");d.setDate(d.getDate()+i);return Math.ceil((d-ref)/86400000);}
function snoozeDate(ds,n){const d=new Date(ds+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];}

// Empty form state for adding plants
const EMPTY_FORM={name:"",room:"Living Room",type:"tropical",pw:"",ph:"",pm:"plastic",self:false};

export default function App(){
  const [plants,setPlants]=useState(PLANTS_BASE);
  const [room,setRoom]=useState("all");
  const [date,setDate]=useState(today());
  const [show,setShow]=useState("care");
  const [logs,setLogsState]=useState({});
  const [tab,setTab]=useState("schedule");
  const [copied,setCopied]=useState(false);
  const [copyMsg,setCopyMsg]=useState("");
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [weather,setWeather]=useState(null);
  const [weatherLabel,setWeatherLabel]=useState("");
  const [learnedIntervals,setLearnedIntervals]=useState({});
  const [wateringCounts,setWateringCounts]=useState({});
  // UI state
  const [addOpen,setAddOpen]=useState(false);
  const [form,setForm]=useState(EMPTY_FORM);
  const [deleteModal,setDeleteModal]=useState(null); // {plant}
  const [deleteReason,setDeleteReason]=useState("");
  const [repotModal,setRepotModal]=useState(null); // {plant}
  const [repotForm,setRepotForm]=useState({pw:"",ph:"",pm:"plastic",date:today()});
  const [pastDateModal,setPastDateModal]=useState(null); // {plant,action}
  const [pastDate,setPastDate]=useState(today());

  // Fetch weather
  useEffect(()=>{
    fetch("https://api.open-meteo.com/v1/forecast?latitude=32.7157&longitude=-117.1611&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles")
      .then(r=>r.json()).then(data=>{
        const tempF=Math.round(data.current.temperature_2m);
        const humidity=Math.round(data.current.relative_humidity_2m);
        setWeather({tempF,humidity});
        setWeatherLabel(`${tempF}°F · ${humidity}% humidity`);
      }).catch(()=>{});
  },[]);

  // Load from Supabase
  useEffect(()=>{
    async function load(){
      setLoading(true);
      const {data,error}=await supabase.from("plants")
        .select("id,name,room,type,interval_days,pot_width,pot_height,self_watering,last_watered,last_fertilized,last_repotted,snooze_until,learned_interval,watering_count,repot_interval_months,pot_material,deleted_at")
        .is("deleted_at",null);
      if(error){console.error(error);setLoading(false);return;}

      // Merge DB rows with base data — DB wins for dynamic fields
      const dbMap={};
      const learned={},counts={};
      data.forEach(row=>{
        dbMap[row.id]=row;
        if(row.learned_interval)learned[row.id]=row.learned_interval;
        if(row.watering_count)counts[row.id]=row.watering_count;
      });

      // Build merged plant list: base plants + any new ones from DB
      const baseIds=new Set(PLANTS_BASE.map(p=>p.id));
      const dbOnlyPlants=data.filter(r=>!baseIds.has(r.id)).map(r=>({
        id:r.id, n:r.name, r:r.room, t:r.type,
        i:r.interval_days||BASE_I[r.type]||7,
        pw:r.pot_width||0, ph:r.pot_height||0,
        pm:r.pot_material||"plastic",
        self:r.self_watering||false,
        lr:r.last_repotted||null,
        ri:r.repot_interval_months||null,
        snooze:r.snooze_until||null,
      }));
      setPlants([...PLANTS_BASE,...dbOnlyPlants]);

      // Build logs from DB
      const rebuilt={};
      data.forEach(row=>{
        rebuilt[row.id]={
          lw:row.last_watered||null,
          lf:row.last_fertilized||null,
          lr:row.last_repotted||null,
          snooze:row.snooze_until||null,
          pw:row.pot_width||null,
          ph:row.pot_height||null,
          pm:row.pot_material||null,
        };
      });
      setLogsState(rebuilt);
      setLearnedIntervals(learned);
      setWateringCounts(counts);
      setLoading(false);
    }
    load();
  },[]);

  async function saveField(id,field,value,prevLW){
    const colMap={lw:"last_watered",lf:"last_fertilized",lr:"last_repotted",snooze:"snooze_until"};
    const col=colMap[field];
    if(!col)return;
    setSaving(true);
    const payload={id,[col]:value||null};

    if(field==="lw"&&value&&prevLW){
      const gap=Math.round((new Date(value+"T12:00:00")-new Date(prevLW+"T12:00:00"))/86400000);
      if(gap>0&&gap<60){
        const {data}=await supabase.from("care_events").select("event_date").eq("plant_id",id).eq("action","Watered").order("event_date",{ascending:false}).limit(5);
        const gaps=[gap];
        if(data&&data.length>=2){
          const dates=data.map(r=>new Date(r.event_date+"T12:00:00")).sort((a,b)=>b-a);
          for(let i=0;i<Math.min(dates.length-1,4);i++){
            const diff=Math.round((dates[i]-dates[i+1])/86400000);
            if(diff>0&&diff<60)gaps.push(diff);
          }
        }
        if(gaps.length>=MIN_TO_LEARN){
          const avg=Math.max(1,Math.round(gaps.reduce((a,b)=>a+b,0)/gaps.length));
          payload.learned_interval=avg;
          setLearnedIntervals(prev=>({...prev,[id]:avg}));
        }
        const nc=(wateringCounts[id]||0)+1;
        payload.watering_count=nc;
        setWateringCounts(prev=>({...prev,[id]:nc}));
      }
    }

    await supabase.from("plants").upsert(payload,{onConflict:"id"});
    if((field==="lw"||field==="lf"||field==="lr")&&value){
      const actionMap={lw:"Watered",lf:"Fertilized",lr:"Repotted"};
      const plant=plants.find(p=>p.id===id);
      await supabase.from("care_events").insert({plant_id:id,plant_name:plant?.n||"",action:actionMap[field],event_date:value});
    }
    setSaving(false);
  }

  const lg=id=>logs[id]||{};
  function upd(id,f,v){
    const prevLW=f==="lw"?(lg(id).lw||plants.find(p=>p.id===id)?.lw||null):null;
    setLogsState(prev=>({...prev,[id]:{...(prev[id]||{}),[f]:v}}));
    saveField(id,f,v,prevLW);
  }
  function clr(id,f){
    setLogsState(prev=>({...prev,[id]:{...(prev[id]||{}),[f]:null}}));
    saveField(id,f,null,null);
  }

  // Add new plant
  async function addPlant(){
    if(!form.name.trim()){alert("Plant name is required");return;}
    const baseI=BASE_I[form.type]||7;
    const {data,error}=await supabase.from("plants").insert({
      name:form.name.trim(),
      room:form.room,
      type:form.type,
      interval_days:baseI,
      pot_width:parseFloat(form.pw)||0,
      pot_height:parseFloat(form.ph)||0,
      pot_material:form.pm,
      self_watering:form.self,
      repot_interval_months:REPOT_M[form.type]||12,
    }).select().single();
    if(error){console.error(error);alert("Error adding plant");return;}
    const newPlant={id:data.id,n:data.name,r:data.room,t:data.type,i:data.interval_days,pw:data.pot_width,ph:data.pot_height,pm:data.pot_material,self:data.self_watering,lr:null,ri:data.repot_interval_months,snooze:null};
    setPlants(prev=>[...prev,newPlant]);
    setForm(EMPTY_FORM);
    setAddOpen(false);
  }

  // Delete plant
  async function deletePlant(){
    if(!deleteModal)return;
    const {error}=await supabase.from("plants").upsert({
      id:deleteModal.id,
      deleted_at:new Date().toISOString(),
    },{onConflict:"id"});
    if(!error){
      await supabase.from("care_events").insert({
        plant_id:deleteModal.id,
        plant_name:deleteModal.n,
        action:"Deleted",
        event_date:today(),
        notes:deleteReason||null,
      });
      setPlants(prev=>prev.filter(p=>p.id!==deleteModal.id));
    }
    setDeleteModal(null);
    setDeleteReason("");
  }

  // Repot plant
  async function repotPlant(){
    if(!repotModal)return;
    const pw=parseFloat(repotForm.pw)||repotModal.pw;
    const ph=parseFloat(repotForm.ph)||repotModal.ph;
    const pm=repotForm.pm||repotModal.pm;
    await supabase.from("plants").upsert({
      id:repotModal.id,
      pot_width:pw,
      pot_height:ph,
      pot_material:pm,
      last_repotted:repotForm.date,
    },{onConflict:"id"});
    await supabase.from("care_events").insert({
      plant_id:repotModal.id,
      plant_name:repotModal.n,
      action:"Repotted",
      event_date:repotForm.date,
    });
    setPlants(prev=>prev.map(p=>p.id===repotModal.id?{...p,pw,ph,pm}:p));
    setLogsState(prev=>({...prev,[repotModal.id]:{...(prev[repotModal.id]||{}),lr:repotForm.date,pw,ph,pm}}));
    setRepotModal(null);
    setRepotForm({pw:"",ph:"",pm:"plastic",date:today()});
  }

  // Log past date
  async function logPastDate(){
    if(!pastDateModal)return;
    const {plant,action}=pastDateModal;
    const field=action==="water"?"lw":action==="fert"?"lf":"lr";
    const prevLW=field==="lw"?(lg(plant.id).lw||plant.lw||null):null;
    setLogsState(prev=>({...prev,[plant.id]:{...(prev[plant.id]||{}),[field]:pastDate}}));
    await saveField(plant.id,field,pastDate,prevLW);
    setPastDateModal(null);
    setPastDate(today());
  }

  const ref=new Date(date+"T12:00:00");
  const month=new Date().getMonth();
  const seasonName=["Winter","Winter","Spring","Spring","Spring","Summer","Summer","Summer","Fall","Fall","Fall","Winter"][month];
  const seasonMult=SEASON_W[month];
  const seasonEffect=seasonMult<1?"🌞 Watering more frequently":"❄️ Watering less frequently";

  const rows=plants.map(p=>{
    const l=lg(p.id);
    const lw=l.lw||p.lw||null, lf=l.lf||p.lf||null;
    const wT=l.lw===date, fT=l.lf===date;
    const snoozeUntil=l.snooze||p.snooze||null;
    const snoozed=!!(snoozeUntil&&snoozeUntil>date);
    const learned=learnedIntervals[p.id]||null;
    const count=wateringCounts[p.id]||0;
    const si=smartWaterInterval(p,weather,learned);
    const fi=smartFertInterval(p.t);
    const w=!wT&&!snoozed&&days(lw,ref)>0&&days(lw,ref)>=si;
    const f=!fT&&!snoozed&&!!lf&&new Date(lf+"T12:00:00")<=ref&&days(lf,ref)>0&&days(lf,ref)>=fi;
    const lr=l.lr||p.lr||null;
    const rDue=lr?repotDue(lr,p.ri||REPOT_M[p.t]||12):null;
    const rT=l.lr===date;
    const needsRepot=!rT&&!!rDue&&rDue<=ref;
    const isLearned=!!learned&&count>=MIN_TO_LEARN;
    const pw=l.pw||p.pw, ph=l.ph||p.ph, pm=l.pm||p.pm||"plastic";
    return{...p,lw,lf,wT,fT,snoozed,snoozeUntil,w,f,nd:nwd(lw,si,ref),lr,rDue,rT,needsRepot,si,fi,learned,count,isLearned,pw,ph,pm};
  });

  const vis=rows.filter(p=>room==="all"||p.r===room).filter(p=>{
    if(show==="care")return(p.w||p.f)&&!p.snoozed;
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
  const nr=rows.filter(p=>p.needsRepot).length;

  const c={
    water:{bg:"#E6F1FB",border:"#85B7EB",text:"#0C447C"},
    fert:{bg:"#EAF3DE",border:"#97C459",text:"#27500A"},
    moist:{bg:"#fff8e6",border:"#EF9F27",text:"#854F0B"},
    undo:{bg:"#f5f5f0",border:"#ddd",text:"#666"},
    danger:{bg:"#fff",border:"#F09595",text:"#A32D2D"},
    repot:{bg:"#F3EDFB",border:"#B79CE4",text:"#5B3E96"},
    neutral:{bg:"#fff",border:"#ddd",text:"#333"},
    learned:{bg:"#FFF0F6",border:"#F0A0C0",text:"#8B1A4A"},
  };

  const Pill=({s,txt})=><span style={{background:s.bg,color:s.text,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:99,marginRight:3,display:"inline-block",whiteSpace:"nowrap"}}>{txt}</span>;
  const Btn=({s,lbl,fn})=><button onClick={fn} style={{fontSize:12,padding:"5px 10px",borderRadius:8,border:`1px solid ${s.border}`,background:s.bg,color:s.text,cursor:"pointer",marginRight:5,marginTop:5,fontFamily:"inherit",whiteSpace:"nowrap"}}>{lbl}</button>;
  const inp={width:"100%",padding:"7px 8px",borderRadius:8,border:"1px solid #ddd",fontSize:13,fontFamily:"inherit",background:"#fff",boxSizing:"border-box"};
  const sel={...inp};

  function copyLog(){
    const w=[],f=[],m=[],rp=[];
    plants.forEach(p=>{const l=lg(p.id);if(l.lw===date)w.push(p.n);if(l.lf===date)f.push(p.n);if(l.snooze&&l.snooze>date)m.push(p.n);if(l.lr===date)rp.push(p.n);});
    if(!w.length&&!f.length&&!m.length&&!rp.length){setCopyMsg("Nothing logged yet!");setTimeout(()=>setCopyMsg(""),3000);return;}
    let msg=`Plant care log for ${date}:\n`;
    if(w.length)msg+=`Watered: ${w.join(", ")}\n`;
    if(f.length)msg+=`Fertilized: ${f.join(", ")}\n`;
    if(m.length)msg+=`Snoozed: ${m.map(n=>{const l=lg(plants.find(p=>p.n===n)?.id||0);return l.snooze?`${n} (until ${l.snooze})`:n;}).join(", ")}\n`;
    if(rp.length)msg+=`Repotted: ${rp.join(", ")}\n`;
    setCopyMsg(msg);
    try{navigator.clipboard.writeText(msg).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}catch(e){}
  }

  async function clearToday(){
    await Promise.all(plants.map(async p=>{
      const l=lg(p.id);const patch={};
      if(l.lw===date)patch.lw=null;if(l.lf===date)patch.lf=null;if(l.lr===date)patch.lr=null;
      if(Object.keys(patch).length){
        setLogsState(prev=>({...prev,[p.id]:{...(prev[p.id]||{}),...patch,snooze:null}}));
        await supabase.from("plants").upsert({id:p.id,...(patch.lw!==undefined&&{last_watered:null}),...(patch.lf!==undefined&&{last_fertilized:null}),...(patch.lr!==undefined&&{last_repotted:null}),snooze_until:null},{onConflict:"id"});
      }
    }));
  }

  const modalStyle={position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16};
  const cardStyle={background:"#fff",borderRadius:14,padding:20,width:"100%",maxWidth:400,boxShadow:"0 8px 32px rgba(0,0,0,0.18)"};

  if(loading)return<div style={{fontFamily:"system-ui",padding:40,textAlign:"center",color:"#aaa"}}>Loading plants... 🌱</div>;

  return(
    <div style={{fontFamily:"system-ui,sans-serif",padding:"12px 10px",color:"#1a1a1a",maxWidth:600,margin:"0 auto"}}>
      {saving&&<div style={{position:"fixed",top:8,right:12,fontSize:11,color:"#aaa",background:"#fff",padding:"4px 10px",borderRadius:8,border:"1px solid #eee",zIndex:99}}>Saving...</div>}

      {/* Weather bar */}
      <div style={{background:"#f0f7ff",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#444",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
        <span>{seasonName} · {seasonEffect}</span>
        <span style={{color:"#888"}}>{weatherLabel||"Loading weather..."}</span>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #e0e0d8",marginBottom:14}}>
        {[["schedule","Schedule"],["list","All Plants"]].map(([k,v])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 14px",fontSize:13,border:"none",background:"none",cursor:"pointer",color:tab===k?"#1a1a1a":"#aaa",borderBottom:tab===k?"2px solid #1a1a1a":"2px solid transparent",fontWeight:tab===k?600:400,marginBottom:-1,fontFamily:"inherit"}}>{v}</button>
        ))}
        <button onClick={()=>setAddOpen(true)} style={{marginLeft:"auto",padding:"6px 14px",fontSize:13,border:"1px solid #97C459",background:"#EAF3DE",color:"#27500A",borderRadius:8,cursor:"pointer",fontFamily:"inherit",marginBottom:4}}>+ Add plant</button>
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
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:10,color:"#aaa",fontWeight:600,textTransform:"uppercase",marginBottom:3}}>Show</div>
            <select value={show} onChange={e=>setShow(e.target.value)} style={sel}>
              <option value="care">Needs water or fertilizer</option>
              <option value="water">Needs watering only</option>
              <option value="fert">Needs fertilizer only</option>
              <option value="done">Logged today</option>
              <option value="moist">Snoozed</option>
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

        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:12}}>
          {[[vis.length,"shown","#333"],[nw,"water","#185FA5"],[nf,"fert","#3B6D11"],[nm,"snoozed","#854F0B"],[nr,"repot","#5B3E96"]].map(([n,l,cl])=>(
            <div key={l} style={{background:"#f5f5f0",borderRadius:8,padding:"8px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:cl}}>{n}</div>
              <div style={{fontSize:10,color:"#aaa",marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>

        {vis.length===0
          ?<div style={{textAlign:"center",padding:"2rem",color:"#aaa",fontSize:14}}>
            {show==="done"?"Nothing logged yet today.":"All good! 🌱"}
          </div>
          :ROOMS.filter(r=>byRoom[r]).map(r=>(
            <div key={r} style={{background:"#fff",borderRadius:10,border:"1px solid #e8e8e0",padding:"10px 12px",marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.06em",paddingBottom:6,borderBottom:"1px solid #f0f0e8",marginBottom:4}}>{r} — {byRoom[r].length} plant{byRoom[r].length>1?"s":""}</div>
              {byRoom[r].map(p=>(
                <div key={p.id} style={{padding:"10px 0",borderBottom:"1px solid #f8f8f5",opacity:p.snoozed?0.4:1}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:5,display:"flex",flexWrap:"wrap",alignItems:"center",gap:3}}>
                    {p.n}
                    {p.self&&<Pill s={{bg:"#EEEDFE",border:"",text:"#534AB7"}} txt="self-water"/>}
                    {p.isLearned&&<Pill s={c.learned} txt="🧠 learned"/>}
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
                    Water every {p.si} days{p.isLearned?<span style={{fontSize:10,color:"#8B1A4A",marginLeft:4}}>(learned {p.learned}d · {p.count} waterings)</span>:p.si!==p.i?<span style={{fontSize:10,color:"#888",marginLeft:4}}>(base {p.i}d)</span>:null}
                    {" · "}Fertilize every {p.fi} days
                    <div style={{fontSize:11,color:"#bbb"}}>Last watered: {p.lw||"never"} · Last fertilized: {p.lf||"never"}</div>
                    {p.w&&!p.wT&&!p.snoozed&&<div>Probe <strong>{DEPTH[p.t]}%</strong> deep · water when <strong>≤ {METER[p.t]}</strong></div>}
                    {p.f&&!p.fT&&!p.snoozed&&<div>Fertilize: balanced liquid, half strength</div>}
                    {p.needsRepot&&<div style={{color:"#5B3E96"}}>Repot due — last repotted {p.lr} ({p.ri||REPOT_M[p.t]} mo cycle)</div>}
                    {p.snoozed&&<div style={{color:"#854F0B",fontStyle:"italic"}}>Check again {new Date(p.snoozeUntil+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>}
                    {p.wT&&<div style={{fontSize:11,color:"#185FA5"}}>Watered {p.lw} <button onClick={()=>clr(p.id,"lw")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                    {p.fT&&<div style={{fontSize:11,color:"#3B6D11"}}>Fertilized {p.lf} <button onClick={()=>clr(p.id,"lf")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                    {p.rT&&<div style={{fontSize:11,color:"#5B3E96"}}>Repotted {p.lr} <button onClick={()=>clr(p.id,"lr")} style={{fontSize:11,padding:"1px 6px",borderRadius:5,border:"1px solid #ddd",background:"#f5f5f0",cursor:"pointer",marginLeft:4}}>Undo</button></div>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap"}}>
                    {!p.wT&&<Btn s={c.water} lbl="Watered today" fn={()=>upd(p.id,"lw",date)}/>}
                    {!p.fT&&<Btn s={c.fert} lbl="Fertilized today" fn={()=>upd(p.id,"lf",date)}/>}
                    {!p.snoozed&&(p.w||p.f)&&!p.wT&&!p.fT&&[1,3,5].map(d=>(
                      <Btn key={d} s={c.moist} lbl={`Snooze ${d}d`} fn={()=>upd(p.id,"snooze",snoozeDate(date,d))}/>
                    ))}
                    {p.snoozed&&<Btn s={c.undo} lbl="Undo snooze" fn={()=>clr(p.id,"snooze")}/>}
                    <Btn s={c.repot} lbl="Repotted" fn={()=>{setRepotModal(p);setRepotForm({pw:p.pw||"",ph:p.ph||"",pm:p.pm||"plastic",date:today()});}}/>
                    <Btn s={{bg:"#fff8e6",border:"#EF9F27",text:"#854F0B"}} lbl="Log past date" fn={()=>{setPastDateModal({plant:p,action:"water"});setPastDate(today());}}/>
                    <Btn s={c.danger} lbl="Delete" fn={()=>{setDeleteModal(p);setDeleteReason("");}}/>
                  </div>
                </div>
              ))}
            </div>
          ))
        }
      </>}

      {tab==="list"&&(
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e8e8e0",padding:"10px 12px"}}>
          {ROOMS.map(r=>{
            const rp=rows.filter(p=>p.r===r);
            if(!rp.length)return null;
            return <div key={r}>
              <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",padding:"8px 0 4px",borderBottom:"1px solid #f0f0e8",marginBottom:2}}>{r}</div>
              {rp.map(p=>(
                <div key={p.id} style={{padding:"7px 0",borderBottom:"1px solid #fafaf8"}}>
                  <div style={{fontSize:13,fontWeight:500}}>
                    {p.n}
                    {p.self&&<span style={{fontSize:10,background:"#EEEDFE",color:"#534AB7",padding:"1px 6px",borderRadius:99,marginLeft:5}}>self-water</span>}
                    {p.isLearned&&<span style={{fontSize:10,background:"#FFF0F6",color:"#8B1A4A",padding:"1px 6px",borderRadius:99,marginLeft:5}}>🧠 learned</span>}
                  </div>
                  <div style={{fontSize:11,color:"#aaa"}}>{p.t} · Water every {p.si}d{p.isLearned?` (learned ${p.learned}d)`:(p.si!==p.i?` (base ${p.i}d)`:"")} · Fert every {p.fi}d</div>
                  <div style={{fontSize:11,color:"#aaa"}}>Pot: {p.pw}"W × {p.ph}"H · {p.pm} {p.self?"(self-watering)":""}</div>
                  <div style={{fontSize:11,color:"#aaa"}}>Repotted: {p.lr||"?"} · next ~{p.lr?repotDue(p.lr,p.ri||REPOT_M[p.t]||12).toLocaleDateString("en-US",{month:"short",year:"numeric"}):"?"}</div>
                  <div style={{fontSize:11,color:"#bbb"}}>Watered: {p.lw||"never"} · Fertilized: {p.lf||"never"}</div>
                  {p.count>0&&<div style={{fontSize:11,color:"#bbb"}}>{p.count} waterings · {p.count<MIN_TO_LEARN?`${MIN_TO_LEARN-p.count} more to unlock learning`:"Learning active ✓"}</div>}
                </div>
              ))}
            </div>;
          })}
        </div>
      )}

      {/* ADD PLANT MODAL */}
      {addOpen&&<div style={modalStyle} onClick={e=>{if(e.target===e.currentTarget)setAddOpen(false);}}>
        <div style={cardStyle}>
          <div style={{fontSize:16,fontWeight:600,marginBottom:14}}>Add new plant 🌱</div>
          {[["Plant name","text","name"],["Pot width (inches)","number","pw"],["Pot height (inches)","number","ph"]].map(([label,type,key])=>(
            <div key={key} style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#888",marginBottom:3}}>{label}</div>
              <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={inp} placeholder={label}/>
            </div>
          ))}
          {[["Room","room",ROOMS],["Plant type","type",TYPES],["Pot material","pm",MATERIALS]].map(([label,key,opts])=>(
            <div key={key} style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#888",marginBottom:3}}>{label}</div>
              <select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={sel}>
                {opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
            <input type="checkbox" id="sw" checked={form.self} onChange={e=>setForm(f=>({...f,self:e.target.checked}))}/>
            <label htmlFor="sw" style={{fontSize:13}}>Self-watering pot</label>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={addPlant} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#1a1a1a",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Add plant</button>
            <button onClick={()=>setAddOpen(false)} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      </div>}

      {/* DELETE MODAL */}
      {deleteModal&&<div style={modalStyle} onClick={e=>{if(e.target===e.currentTarget)setDeleteModal(null);}}>
        <div style={cardStyle}>
          <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>Remove {deleteModal.n}?</div>
          <div style={{fontSize:13,color:"#666",marginBottom:14}}>This will record the plant as removed. All history is kept.</div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Reason (optional)</div>
            <input value={deleteReason} onChange={e=>setDeleteReason(e.target.value)} style={inp} placeholder="e.g. died, gave away, replaced"/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={deletePlant} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#A32D2D",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Remove plant</button>
            <button onClick={()=>setDeleteModal(null)} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      </div>}

      {/* REPOT MODAL */}
      {repotModal&&<div style={modalStyle} onClick={e=>{if(e.target===e.currentTarget)setRepotModal(null);}}>
        <div style={cardStyle}>
          <div style={{fontSize:16,fontWeight:600,marginBottom:14}}>Repot {repotModal.n} 🪴</div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Repot date</div>
            <input type="date" value={repotForm.date} onChange={e=>setRepotForm(f=>({...f,date:e.target.value}))} style={inp}/>
          </div>
          {[["New pot width (inches)","pw"],["New pot height (inches)","ph"]].map(([label,key])=>(
            <div key={key} style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#888",marginBottom:3}}>{label}</div>
              <input type="number" value={repotForm[key]} onChange={e=>setRepotForm(f=>({...f,[key]:e.target.value}))} style={inp} placeholder={`Current: ${repotModal[key]}"`}/>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>New pot material</div>
            <select value={repotForm.pm} onChange={e=>setRepotForm(f=>({...f,pm:e.target.value}))} style={sel}>
              {MATERIALS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={repotPlant} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#5B3E96",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Save repot</button>
            <button onClick={()=>setRepotModal(null)} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      </div>}

      {/* LOG PAST DATE MODAL */}
      {pastDateModal&&<div style={modalStyle} onClick={e=>{if(e.target===e.currentTarget)setPastDateModal(null);}}>
        <div style={cardStyle}>
          <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>Log past date for {pastDateModal.plant.n}</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Action</div>
            <select value={pastDateModal.action} onChange={e=>setPastDateModal(m=>({...m,action:e.target.value}))} style={sel}>
              <option value="water">Watered</option>
              <option value="fert">Fertilized</option>
              <option value="repot">Repotted</option>
            </select>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Date</div>
            <input type="date" value={pastDate} onChange={e=>setPastDate(e.target.value)} style={inp}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={logPastDate} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#185FA5",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Save</button>
            <button onClick={()=>setPastDateModal(null)} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
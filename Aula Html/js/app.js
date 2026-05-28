// Helpers
const $ = id => document.getElementById(id);

const STORAGE_KEY = 'senai_bauru_rooms_v1';

let state = { rooms: [], reservations: [], selectedRoomId: null };

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() { const raw = localStorage.getItem(STORAGE_KEY); if(raw) state = JSON.parse(raw); }

function seedSample(){
  if(state.rooms.length) return;
  state.rooms = [
    {id:uid(),'name':'LAB 101','building':'Bloco A','capacity':28,'resources':'Projetor, PC'},
    {id:uid(),'name':'SALA 203','building':'Bloco B','capacity':12,'resources':'Ar-condicionado'},
    {id:uid(),'name':'AULA 5','building':'Bloco C','capacity':60,'resources':'Som, Tela'},
  ];
  state.reservations = [
    {id:uid(),roomId:state.rooms[0].id,date:nextDate(1),start:'09:00',end:'11:00',owner:'Departamento TI'}
  ];
  save();
}

function uid(){return Math.random().toString(36).slice(2,9)}
function nextDate(days){ const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10) }

// Simple entry loader/animation handling
(function entry(){
  // wait a tick so loader shows, then initialize app and fade in
  document.body.classList.remove('app-ready');
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      document.body.classList.add('app-ready');
      const loader = $('loader'); if(loader) loader.remove();
    }, 700);
  });
})();

// Rendering
function renderRooms(){
  const grid = $('roomsGrid'); if(!grid) return; grid.innerHTML='';
  const q = ($('searchInput')? $('searchInput').value.toLowerCase() : '');
  const cap = $('capacityFilter')? $('capacityFilter').value : ''; const bld = $('buildingFilter')? $('buildingFilter').value : '';
  const list = state.rooms.filter(r=>{
    if(cap){ if(cap==10 && r.capacity>10) return false; if(cap==30 && r.capacity>30) return false; if(cap==100 && r.capacity<=30) return false }
    if(bld && r.building!==bld) return false;
    if(!q) return true;
    return (r.name+' '+r.building+' '+r.resources).toLowerCase().includes(q);
  });
  list.forEach(r=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h4>${r.name}</h4><div class="muted">${r.building} • ${r.capacity} lugares</div>
      <p class="muted">${r.resources}</p>
      <div class="meta"><div class="badge small">Reservas: ${countReservations(r.id)}</div>
      <div><button class="btn" data-id="${r.id}" data-action="view">Ver</button>
      <button class="btn primary" data-id="${r.id}" data-action="reserve">Reservar</button></div></div>`;
    grid.appendChild(card);
  });
}

function countReservations(roomId){ return state.reservations.filter(x=>x.roomId===roomId).length }

function populateBuildingFilter(){
  const sel=$('buildingFilter'); if(!sel) return; const buildings=[...new Set(state.rooms.map(r=>r.building))];
  sel.innerHTML = '<option value="">Todos</option>' + buildings.map(b=>`<option value="${b}">${b}</option>`).join('');
}

// Modals & forms
function openRoomModal(edit=null){
  const modal = $('roomModal'); if(!modal) return;
  modal.classList.remove('hidden');
  $('roomModalTitle').textContent = edit ? 'Editar Sala' : 'Nova Sala';
  $('roomName').value = edit?edit.name:''; $('roomBuilding').value=edit?edit.building:'';
  $('roomCapacity').value = edit?edit.capacity:''; $('roomResources').value=edit?edit.resources:'';
  $('roomForm').onsubmit = e=>{ e.preventDefault(); const r={id: edit?edit.id:uid(),name:$('roomName').value,building:$('roomBuilding').value,capacity:+$('roomCapacity').value,resources:$('roomResources').value};
    if(edit) state.rooms = state.rooms.map(rr=>rr.id===r.id?r:rr); else state.rooms.push(r); save(); closeRoomModal(); refreshAll(); };
}
function closeRoomModal(){ const modal=$('roomModal'); if(modal) modal.classList.add('hidden'); }

function openReserveModal(roomId){
  const room = state.rooms.find(r=>r.id===roomId); if(!room) return;
  state.selectedRoomId = roomId; const modal=$('reserveModal'); if(!modal) return; modal.classList.remove('hidden');
  $('reserveRoomInfo').textContent = `${room.name} — ${room.building} • ${room.capacity} lugares`;
  $('reserveForm').onsubmit = e=>{ e.preventDefault(); const res={id:uid(),roomId:roomId,date:$('resDate').value,start:$('resStart').value,end:$('resEnd').value,owner:$('resOwner').value};
    if(!res.date||!res.start||!res.end){ alert('Preencha data e horário'); return }
    if(res.start>=res.end){ alert('Horário inválido'); return }
    if(hasConflict(roomId,res.date,res.start,res.end)){ alert('Conflito de horário detectado'); return }
    state.reservations.push(res); save(); closeReserveModal(); refreshAll(); };
  renderExistingReservations(roomId);
}
function closeReserveModal(){ const modal=$('reserveModal'); if(modal) modal.classList.add('hidden'); state.selectedRoomId=null }

function renderExistingReservations(roomId){
  const ul=$('existingReservations'); if(!ul) return; ul.innerHTML='';
  state.reservations.filter(r=>r.roomId===roomId).sort((a,b)=>a.date.localeCompare(b.date)).forEach(r=>{
    const li=document.createElement('li'); li.textContent = `${r.date} • ${r.start}-${r.end} — ${r.owner}`;
    ul.appendChild(li);
  });
}

function hasConflict(roomId,date,start,end){
  return state.reservations.some(r=>r.roomId===roomId && r.date===date && !(r.end<=start || r.start>=end));
}

function refreshAll(){ populateBuildingFilter(); renderRooms(); }

// Events
function bind(){
  const addBtn = $('addRoomBtn'); if(addBtn) addBtn.onclick = ()=>openRoomModal();
  const cancelRoom = $('cancelRoom'); if(cancelRoom) cancelRoom.onclick = closeRoomModal;
  const cancelReserve = $('cancelReserve'); if(cancelReserve) cancelReserve.onclick = closeReserveModal;
  const search = $('searchInput'); if(search) search.oninput = renderRooms;
  const cap = $('capacityFilter'); if(cap) cap.onchange = renderRooms;
  const bld = $('buildingFilter'); if(bld) bld.onchange = renderRooms;
  document.addEventListener('click', e=>{ const b=e.target.closest('[data-action]'); if(!b) return; const action=b.dataset.action; const id=b.dataset.id; if(action==='reserve') openReserveModal(id); if(action==='view') openReserveModal(id); });

  // quick menu
  const importFile = $('importFile');
  document.addEventListener('click', e=>{ const btn = e.target.closest('.qm-btn'); if(!btn) return; const act = btn.dataset.action; if(act==='export') exportData(); if(act==='import') importFile.click(); if(act==='fullscreen') toggleFullScreen(); });
  if(importFile) importFile.onchange = handleImportFile;

  // room panel controls
  const closePanel = $('closePanel'); if(closePanel) closePanel.onclick = closeRoomPanel;
  const panelEdit = $('panelEditRoom'); if(panelEdit) panelEdit.onclick = ()=>{ const id = state.selectedRoomId; const room = state.rooms.find(r=>r.id===id); if(room) openRoomModal(room); };
  const panelDelete = $('panelDeleteRoom'); if(panelDelete) panelDelete.onclick = ()=>{ if(!state.selectedRoomId) return; deleteRoom(state.selectedRoomId); };
  document.addEventListener('click', e=>{ const del = e.target.closest('[data-res-delete]'); if(!del) return; deleteReservation(del.dataset.resDelete); renderExistingReservations(state.selectedRoomId); renderPanelReservations(state.selectedRoomId); });
}

// Quick menu utilities
function downloadJSON(filename, data){ const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
function exportData(){ downloadJSON('senai_bauru_export.json', state); }
function handleImportFile(e){ const f = e.target.files[0]; if(!f) return; const reader = new FileReader(); reader.onload = ev=>{ try{ const parsed = JSON.parse(ev.target.result); if(!confirm('Substituir dados atuais pelos dados importados?')) return; state = parsed; save(); refreshAll(); alert('Importação concluída'); }catch(err){ alert('Arquivo inválido'); } }; reader.readAsText(f); }
function toggleFullScreen(){ if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); else document.exitFullscreen().catch(()=>{}); }

// Room panel functions
function openRoomPanel(roomId){ const panel = $('roomPanel'); if(!panel) return; const room = state.rooms.find(r=>r.id===roomId); if(!room) return; state.selectedRoomId = roomId; panel.classList.remove('hidden'); panel.setAttribute('aria-hidden','false'); $('panelRoomName').textContent = room.name; $('panelRoomMeta').textContent = `${room.building} • ${room.capacity} lugares`; $('panelRoomResources').textContent = room.resources || '';
  renderPanelReservations(roomId);
}
function closeRoomPanel(){ const panel = $('roomPanel'); if(!panel) return; panel.classList.add('hidden'); panel.setAttribute('aria-hidden','true'); state.selectedRoomId = null; }

function renderPanelReservations(roomId){ const ul = $('panelReservations'); if(!ul) return; ul.innerHTML=''; state.reservations.filter(r=>r.roomId===roomId).sort((a,b)=>a.date.localeCompare(b.date)).forEach(res=>{ const li = document.createElement('li'); li.innerHTML = `${res.date} • ${res.start}-${res.end} — ${res.owner} <button class="btn" data-res-delete="${res.id}">Excluir</button>`; ul.appendChild(li); }); }

function deleteRoom(roomId){ if(!confirm('Excluir sala e todas as reservas associadas?')) return; state.rooms = state.rooms.filter(r=>r.id!==roomId); state.reservations = state.reservations.filter(res=>res.roomId!==roomId); save(); refreshAll(); closeRoomPanel(); }

function deleteReservation(resId){ state.reservations = state.reservations.filter(r=>r.id!==resId); save(); refreshAll(); }

// Init
function init(){ load(); seedSample(); bind(); refreshAll(); }

init();

(function () {
  var all = [];
  var search = document.getElementById("search");
  var area = document.getElementById("area");
  var grade = document.getElementById("grade");
  var list = document.getElementById("activities");
  var count = document.getElementById("count");
  var status = document.getElementById("status");
  function norm(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function fillSelect(select, values) { values.filter(Boolean).filter(function (value, index, array) { return array.indexOf(value) === index; }).sort().forEach(function (value) { var option=document.createElement("option"); option.value=value; option.textContent=value; select.appendChild(option); }); }
  function render() {
    var text=norm(search.value); var selectedArea=area.value; var selectedGrade=grade.value;
    var filtered=all.filter(function (item) { var haystack=norm([item.titulo,item.area,item.archivo].join(" ")); return (!text || haystack.indexOf(text)>=0) && (!selectedArea || item.area===selectedArea) && (!selectedGrade || String(item.grado)===selectedGrade); });
    list.textContent=""; count.textContent=String(filtered.length); status.hidden=filtered.length>0; status.textContent=all.length ? "No hay actividades para los filtros seleccionados." : "No hay actividades habilitadas.";
    filtered.forEach(function (item) { var card=document.createElement("a"); card.className="activity"; card.href="actividades/"+encodeURIComponent(item.archivo); card.target="_blank"; card.rel="noopener"; var tag=document.createElement("small"); tag.textContent=[item.area,item.grado ? item.grado+" grado" : "",item.tipo ? "Tipo "+item.tipo : ""].filter(Boolean).join(" | "); var title=document.createElement("strong"); title.textContent=item.titulo; var file=document.createElement("span"); file.textContent=item.archivo; card.appendChild(tag); card.appendChild(title); card.appendChild(file); list.appendChild(card); });
  }
  fetch("catalogo.json?t="+Date.now(), { cache:"no-store" }).then(function (response) { if (!response.ok) throw new Error("No se pudo cargar el catalogo."); return response.json(); }).then(function (data) { all=Array.isArray(data.actividades)?data.actividades:[]; fillSelect(area,all.map(function(item){return item.area;})); fillSelect(grade,all.map(function(item){return String(item.grado||"");})); render(); }).catch(function (err) { status.hidden=false; status.textContent=err.message; });
  [search,area,grade].forEach(function(control){ control.addEventListener(control===search?"input":"change",render); });
  document.getElementById("clear").addEventListener("click",function(){search.value="";area.value="";grade.value="";render();});
}());

function databaseId_(){const id=PropertiesService.getScriptProperties().getProperty('DATABASE_ID');if(!id)throw Error('主辦人尚未設定資料庫');return id;}
const DEPARTMENTS = ['Marketing','Sales','HR','Finance','Customer Service','IT','Other'];
function doPost(e) {
  try { return json_(handle_(JSON.parse(e.postData.contents))); }
  catch (err) { return json_({ok:false,error:err.message || '服務暫時無法使用'}); }
}
function doGet() { return json_({ok:true,service:'AI Passport',version:3}); }
function json_(v) { return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON); }
function hash_(v) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,v).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join(''); }
function text_(v,max) { if(typeof v!=='string'||v.trim().length>max)throw Error('欄位格式不正確');return v.trim(); }
function safe_(v) { return /^[=+\-@]/.test(v)?"'"+v:v; }
function rows_(s) { return s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,s.getLastColumn()).getValues():[]; }
function handle_(p) {
 const lock=LockService.getScriptLock();if(!lock.tryLock(15000))throw Error('服務忙碌，請稍後重試');
 try {
  const db=SpreadsheetApp.openById(databaseId_()),users=db.getSheetByName('Participants'),all=rows_(users),now=new Date().toISOString();
  const id=text_(p.id||'',40).toLowerCase(),pin=text_(p.pin||'',100);
  if(!/^[a-z0-9_-]{4,40}$/.test(id)||pin.length<10)throw Error('護照代號須為 4–40 個英數字；通關密語至少 10 個字元');
  let user=all.find(r=>r[0]===id);
  const throttle=CacheService.getScriptCache(),key='fail:'+hash_(id),fail=Number(throttle.get(key)||0);
  if(fail>=10)throw Error('嘗試次數過多，請 15 分鐘後再試');
  if(p.action==='register') {
   if(user)throw Error('代號已使用，請改用其他代號或取回護照');
   const nick=text_(p.nick||'',35),dept=text_(p.dept||'',40);if(!nick||!DEPARTMENTS.includes(dept))throw Error('請填寫暱稱及部門');
   const salt=Utilities.getUuid();user=[id,safe_(nick),dept,salt,hash_(salt+pin),now];users.appendRow(user);
  } else {
   if(!user||hash_(user[3]+pin)!==user[4]){throttle.put(key,String(fail+1),900);throw Error('代號或通關密語不正確');}throttle.remove(key);
  }
  if(p.action==='checkin') {
   const day=Number(p.day),reflection=text_(p.reflection||'',600),route=p.route||'';
   if(!Number.isInteger(day)||day<1||day>10||reflection.length<12)throw Error('請填写至少 12 個字的心得及有效任務');
   if(day===8&&JSON.stringify(p.safety)!=='[1,2,3]')throw Error('請先完成資料安全辨識');
   if(day===10&&!['Explorer','Creator'].includes(route))throw Error('請選擇成果路線');
   const s=db.getSheetByName('Checkins'),records=rows_(s),idx=records.findIndex(r=>r[0]===id&&Number(r[1])===day);
   const row=[id,day,safe_(reflection),day===10?route:'',idx<0?now:records[idx][4],now];
   if(idx<0)s.appendRow(row);else s.getRange(idx+2,1,1,6).setValues([row]);
  } else if(p.action==='feedback') {
   const s=db.getSheetByName('Feedback'),idx=rows_(s).findIndex(r=>r[0]===id),v=p.feedback||{},row=[id,safe_(text_(v.work||'',400)),safe_(text_(v.blocker||'',80)),safe_(text_(v.support||'',400)),now];
   if(idx<0)s.appendRow(row);else s.getRange(idx+2,1,1,5).setValues([row]);
  } else if(p.action==='creation') {
   if(p.consent!==true)throw Error('請同意保存作品介紹');const a=p.art||{},title=text_(a.title||'',70),desc=text_(a.desc||'',130);if(!title||!desc)throw Error('請填寫作品介紹');
   db.getSheetByName('Creations').appendRow([id,safe_(title),safe_(text_(a.type||'',40)),safe_(desc),now]);
  } else if(!['login','register'].includes(p.action))throw Error('不支援的操作');
  SpreadsheetApp.flush();const progress={};rows_(db.getSheetByName('Checkins')).filter(r=>r[0]===id).forEach(r=>progress[r[1]]={done:true,reflection:r[2],route:r[3]});
  const f=rows_(db.getSheetByName('Feedback')).find(r=>r[0]===id);
  const art=rows_(db.getSheetByName('Creations')).filter(r=>r[0]===id).map(r=>({title:r[1],type:r[2],desc:r[3]}));
  return {ok:true,state:{profile:{nick:user[1],dept:user[2]},progress,survey:f?{work:f[1],blocker:f[2],support:f[3]}:null,art}};
 } finally {lock.releaseLock();}
}

// ==UserScript==
// @name          Override
// @version       4.3.5
// @description   Allow copy novel to clipboard or text file for backup
// @author        Ann
// @icon          https://i.imgur.com/F9j3waR.png
// @homepage      https://github.com/YaninL/Override
// @supportURL    https://github.com/YaninL/Override
// @updateURL     https://raw.githubusercontent.com/YaninL/Override/master/Override.user.js
// @require       https://raw.githubusercontent.com/YaninL/Override/master/FileSaver.min.js
// @require       https://raw.githubusercontent.com/YaninL/Override/master/Axios.min.js
// @require       https://raw.githubusercontent.com/YaninL/Override/master/Readability.min.js
// @include       *
// @grant         unsafeWindow
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_setClipboard
// @grant         GM_notification
// @grant         GM_registerMenuCommand
// ==/UserScript==
// สคิปนี้ทำเพื่อแบคอัพนิยายไว้อ่านส่วนตัวเท่านั้น
// ขอความร่วมมือทุกท่านที่ใช้สคิปในทางที่ถูกต้อง

let ovr = function Override(parameter, context) {
  if (!(this instanceof ovr)) {
    return new ovr(parameter, context);
  }
  if (parameter instanceof ovr) {
    return parameter;
  }
  if (typeof parameter === 'string') {
    parameter = this.select(parameter, context);
  }
  if (parameter && parameter.nodeName) {
    parameter = [parameter];
  }
  this.nodes = this.slice(parameter);
};

ovr.devwebelement = {/*dev section*/


}/*end dev section*/


ovr.prototype = {
  name: 'Override',
  initialize() {
    if(window.parent != window.self) return;
    this.registersettings();
    this.addcommands();
    this.addcontentcopy();
  },
  setting: {
    webelement: {},
    content: false
  },
  appsetting: {
    preset: {
      saveFile: false,
      autoCopy: false,
      autoBuy: false,
      addUri: false,
      botDownload: false,
      contentcleanup: true,
      doubleNewline: true,
      showmenu: true,
      notification: true,
      cleanup: {},
      host: {},
      userhost: {},
      usercleanup: {},
      namedigit: 3,
      detectlength: 3000,
      countindex: 0
    },
    decryptUpdate: 'https://raw.githubusercontent.com/YaninL/Override/master/Data/DataHost.json',
    cleanwordUpdate: 'https://raw.githubusercontent.com/YaninL/Override/master/Data/CleanupWord.json',
    insertcss: [
      '#ovropennav{background:url("https://i.imgur.com/2e58Fs8.png") no-repeat center center/100% #c9d9f9;position:fixed;;z-index:10000;right:0.5rem;bottom:60px;width:38px;height:38px;border-radius:50%;cursor:pointer;opacity:.5;transform:rotate(0deg);transition:2s}',
      '#ovropennav:hover{opacity:1;transform:rotate(180deg);transition:1s}',
      '.ovrlogo{width:100%;height:90px;}',
      '.ovrlogo .image{background:url("https://i.imgur.com/F9j3waR.png") no-repeat center center/40%;width:70%;height:80px;transform:rotate(-90deg);transition:2s}',
      '.ovrlogo .image:hover{transform:rotate(90deg);transition:2s}',
      '.ovrsidenav{background:#111;height:100%;width:0;position:fixed;z-index:10001;top:0;right:0;overflow-x:hidden;transition:.3s;padding:0;margin:0;font:initial}',
      '.ovrsidenav *{font:normal 100 16px/1.2em Tahoma!important;display:inline;letter-spacing:0em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:inherit}',
      '.ovrsidenav div{margin:0 10px 0 10px;padding:8px;font-size:16px;color:#818181;display:block}',
      '.ovrsidenav label, .ovrsidenav a{color:#818181;font:normal 100 16px/1.2em Tahoma!important}',
      '.ovrsidenav label:hover, .ovrsidenav a:hover{color:#f1f1f1;text-decoration:none;}',
      '.ovrsidenav div.ovrhead{font:normal 100 20px/1.2em Tahoma!important;color:#4facfd;text-align:center}',
      '.ovrsidenav input, .ovrsidenav select{margin:3px;padding:0px;background:#fff;text-align:center;display:inline-block;border-radius:4px}',
      '.ovrselect{margin:0 10px 0 10px;display:inline-block}',
      '.hiddenbox{width:1px;height:1px;overflow:hidden}'
    ],
    title: /(ep\.?|ภาค|ภาคที่|ตอนพิเศษ|บทที่|ตอนที่|ch|chapter|volume|arc|เล่ม|เล่มที่)\s{0,4}(\d+)\s{0,4}:?\s?(\-|\.|บทที่|\-?ตอนที่?).*?\s{0,4}(\d+)?/i
  },
  addcontentcopy() {
    let hostname = window.location.hostname.replace('www.', '');
    let pathname = decodeURIComponent(window.location.pathname);
    let devhostsetting = ovr.devwebelement[hostname] || false;
    let userhostsetting = this.setting.userhost[hostname] || false;
    let apphostsetting = this.setting.host[hostname] || false;
    if (devhostsetting) {
      this.setting.webelement = devhostsetting;
      this.setting.hostgroup = 'ส่วนผู้พัฒนา';
    } else if (userhostsetting) {
      this.setting.webelement = userhostsetting;
      this.setting.hostgroup = 'ผู้ใช้กำหนดเอง';
    } else if (apphostsetting) {
      this.setting.webelement = apphostsetting;
      this.setting.hostgroup = 'ฐานข้อมูล อัพเดทเมื่อ ' + this.setting.host.updatetime;
    } else {
      return;
    }
    this.addcommandmenu();
    let script = this.setting.webelement.script || false;
    if (typeof script === 'string') {
      this.setting.webelement.script = new Function (script);
    }
    let execpath = this.setting.webelement.execpath || false;
    let remove = this.setting.webelement.remove || false;
    let css = this.setting.webelement.css || false;
    let autodetect = this.setting.webelement.autodetect || false;
    let title = this.setting.webelement.title || false;
    let content = this.setting.webelement.content || false;
    let regtest = (new RegExp(execpath, 'i')).test(pathname);
    console.log('[Override] Host', hostname, ' : Path', pathname);
    console.log('[Override] Execpath', regtest);
    console.log('[Override] Element', this.setting.webelement);
    if (css) GM_addStyle(css.join('\n'));
    if (execpath && regtest == false && autodetect != true) return;
    if (remove) document.querySelectorAll(remove).forEach(e => e.parentNode.removeChild(e));
    if (script) this.setting.webelement.script();
    if (Object.keys(this.setting.webelement).length == 0) autodetect = true;
    if (content || autodetect) {
      let selectcontent = [];
      if(autodetect) {
        document.body.insertAdjacentHTML('beforeend', '<div id="autoclipboard" class="hiddenbox"></div>');
        let autoclipboard = document.getElementById('autoclipboard');
        let article = new ovr.Readability(document.cloneNode(true)).parse();
        console.log('[Override] Readability', article);
        if(article.length < this.setting.detectlength) return;
        autoclipboard.insertAdjacentHTML('beforeend', article.content.replace(/\n/g, ''));
        selectcontent.push(autoclipboard);
      } else {
        if(title){
          let titles = title.split(',').map(e => e.trim());
          selectcontent.push(document.querySelectorAll(titles[0])[(titles[1] || 0)]);
        }
        selectcontent = selectcontent.concat([].slice.call(document.querySelectorAll(content)));
      }
      console.log('[Override] Select', selectcontent);
      this.copycontent(selectcontent);
    }
  },
  copycontent(content, area){
    let dbclick = area || 'body';
    let self = this;
    dbclick = (typeof dbclick === 'string') ? document.querySelector(dbclick) : dbclick;
    dbclick.addEventListener('dblclick', function() {
      self.setclipboard(content);
    });
    if (this.setting.autoCopy) {
      this.setclipboard(content);
    }
  },
  setclipboard(target) {
    let content = '';
    let skipsource = this.setting.webelement.skipsource || false;
    target.forEach((node) => {
      let textContent = node.innerText;
      if (textContent == '') return;
      content += textContent + '\n';
    });
    content = this.setting.contentcleanup ? this.cleanupcontent(content) : content;
    if (this.setting.addUri && skipsource == false) {
      content = decodeURIComponent(window.location) + '\n' + content;
    }
    content = content.replace(/\n/g, '\r\n');
    if (this.setting.saveFile) {
      let filename = this.getfilename(content.replace(/http.*/i, ''));
      let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
      ovr.saveAs(blob, filename);
      this.notification('บันทึกไฟล์ ' + filename + ' แล้ว');
    } else {
      GM_setClipboard(content);
      console.log(content);
      this.notification('คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว');
    }
  },
  getfilename(content) {
    let title_line = content.substring(0, 200).replace(/\s+/g, ' ').replace(/[\r\t\n,]/g, '').replace('(', '-');
    if(this.setting.namedigit == 0 || this.setting.namedigit == 9){
      let index = '';
      if(this.setting.namedigit == 9){
        index = parseInt(this.setting.countindex);
        this.setValue('countindex', index + 1);
        document.getElementById('countindex').value = index + 1;
        index = this.padLeft(index, 3) + ' - ';
      }
      return index + content.trim().split('\n')[0].substring(0, 80) + '.txt';
    }
    if(this.appsetting.title.test(title_line)) {
      let chapter = title_line.match(this.appsetting.title);
      let type = /บทที่|ตอนที่/i.test(chapter[3]);
      chapter[3] = (typeof chapter[3] !== 'undefined' && typeof chapter[4] !== 'undefined') ? chapter[3] : '';
      chapter[4] = (typeof chapter[4] !== 'undefined') ? chapter[4] : '';
      chapter[2] = type ? chapter[2] : this.padLeft(chapter[2]);
      chapter[3] = type ? '-' : chapter[3];
      chapter[4] = type ? this.padLeft(chapter[4]) : chapter[4];
      chapter[4] = (chapter[3] == ' ') ? '' : chapter[4];
      chapter[3] = (chapter[3] == ' ') ? '' : chapter[3];
      let ex = /ตอนพิเศษ/i.test(title_line) ? 'ex' : '';
      return ex + chapter[2] + chapter[3].trim() + chapter[4] + '.txt';
    } else if (/\d+/.test(title_line)) {
      return this.padLeft(title_line.match(/\d+/)) + '.txt';
    } else {
      let name = content.trim().split('\n')[0].substring(0, 80) + '.txt';
      return name == '.txt' ? 'filename.txt' : name;
    }
  },
  cleanupcontent (input) {
    let cleanupword = this.setting.cleanup;
    let cleanuphost = this.setting.webelement.cleanup || [];
    let usercleanup = this.setting.usercleanup || [];
    let regexcleanup = Object.entries(cleanuphost);
    regexcleanup = regexcleanup.concat(Object.entries(cleanupword));
    regexcleanup = regexcleanup.concat(Object.entries(usercleanup));
    let input_line = input.replace('\r', '\n').split('\n').filter(String);
    let output = [];
    input_line.forEach((in_line)=> {
      let textline = in_line.trim();
      regexcleanup.forEach((line)=>{
        textline = textline.replace(new RegExp(line[0], 'g'), line[1]);
      });
      if (in_line >= 1 && textline == input_line[0].trim()) return;
      output.push(textline.trim());
    });
    output = output.filter(String);
    if(output[0] == output[1]) output.splice(1, 1);
    if(new RegExp('.*' + output[1]).test(output[0])) {output.splice(0, 1);}
    return output.join(this.setting.doubleNewline ? '\n\n' : '\n');
  },
  addcommands() {
    if (window.parent == window.self) {
      let self = this;
      GM_registerMenuCommand('อัพเดทฐานข้อมูล', function() {
        self.updatedb();
      });
      GM_registerMenuCommand('อัพเดทตัวทำความสะอาด', function() {
        self.updateword();
      });
      GM_registerMenuCommand('เปิด/ปิดปุ่มเมนู', function() {
        let openmenu = document.getElementById('ovropennav');
        if(openmenu.style.display === "none"){
          openmenu.style.display = "block";
          self.setValue('showmenu', true);
        }else{
          openmenu.style.display = "none";
          self.setValue('showmenu', false);
        }
      });
    }
  },
  addcommandmenu() {
    let self = this;
    if (window.parent == window.self) {
      GM_addStyle(this.appsetting.insertcss.join('\n'));
      document.body.insertAdjacentHTML('beforeend', [
        '<div id="ovropennav" title="การตั้งค่า ' + this.name + ' (ใช้ข้อมูลเว็ปนี้จาก' +this.setting.hostgroup + ')"></div>',
        '<div id="ovrsidenav" class="ovrsidenav">',
        '<div class="ovrlogo"><div class="image"></div></div>',
        '<div class="ovrhead">◆◇ ' + this.name + ' ◇◆</div>',
        '<div><label><input type="checkbox" id="autoCopy">คัดลอกอัตโนมัติ</label></div>',
        '<div><label><label><input type="checkbox" id="saveFile">คัดลอกเป็นไฟล์ข้อความ</label></div>',
        '<div><label><input type="checkbox" id="addUri">เพิ่มแหล่งที่มา</label></div>',
        '<div class="ovrhead">ทำความสะอาด</div>',
        '<div><label><input type="checkbox" id="contentcleanup">เปิดใช้งานทำความสะอาด</label></div>',
        '<div><label><input type="checkbox" id="doubleNewline">ขึ้นบรรทัดใหม่แบบเว้นบรรทัด</label></div>',
        '<div class="ovrhead">รูปแบบชื่อไฟล์</div>',
        '<div class="ovrselect"><select id ="namedigit" name="namedigit" style="width:200px">',
        '<option value="0">ตั้งตามชื่อตอน</option><option value="9">ตัวนับ + ชื่อตอน</option>',
        '<option value="1">ตอนที่ 1 หลัก : 1</option><option value="2">ตอนที่ 2 หลัก : 01</option>',
        '<option value="3">ตอนที่ 3 หลัก : 001</option><option value="4">ตอนที่ 4 หลัก : 0001</option></select></div>',
        '<div class="countindex"><label>ตัวนับเริ่มต้นที่<input type="text" id="countindex" style="width:80px"></label></div>',
        '<div class="ovrhead">อื่นๆ</div>',
        '<div><label><input type="checkbox" id="notification">เปิดแจ้งเตือน</label></div>',
        '<div><a href="https://buymeacoffee.com/sunsettia" target="_blank">☕ ช่วยแมวซื้อกาแฟ</a></div>',
        '</div>'
      ].join(''));
      document.querySelectorAll('#ovrsidenav input[id], #ovrsidenav select').forEach((input)=>{
        let valuetype = (input.type == 'checkbox') ? 'checked' : 'value';
        document.getElementById(input.id)[valuetype] = this.setting[input.id];
        input.addEventListener('input', (e)=>{
          self.setValue(e.target.id, e.target[valuetype]);
        });
      })
      let openmenu = document.getElementById('ovropennav');
      let sidenav = document.getElementById('ovrsidenav');
      openmenu.style.display = this.setting.showmenu ? 'block' : 'none';
      openmenu.addEventListener('click', ()=>{
        sidenav.style.width = "260px";
      });
      document.addEventListener('click', (e)=>{
        if (!sidenav.contains(e.target) && (!openmenu.contains(e.target))){
          sidenav.style.width = "0px";
        }
      })
      let countindex = document.querySelector('.countindex');
      countindex.style.display = (this.setting.namedigit == 9) ? 'inline-block' : 'none';
      document.getElementById('namedigit').addEventListener('input', (e)=>{
        countindex.style.display = e.target.value == 9 ? 'inline-block' : 'none';
      });
    }
  },
  notification(text, time) {
    if(this.setting.notification == false) return;
    time = typeof time !== 'undefined' ? time : 1500;
    GM_notification({
      title: 'แจ้งเตือน',
      text: text,
      timeout: time
    });
  },
  updatedb() {
    let self = this;
    ovr.axios.get(this.appsetting.decryptUpdate, {
      params: { u: Date.now() }
    }).then(function (response) {
      let updateData = response.data;
      self.setValue('host', updateData);
      self.notification('อัพเดทฐานข้อมูลเว็ปแล้ว... ' + updateData.updatetime);
    }).catch(function (error) {
      self.notification('อัพเดทฐานข้อมูลเว็ปไม่สำเร็จ... ');
    });
  },
  updateword(){
    let self = this;
    ovr.axios.get(this.appsetting.cleanwordUpdate, {
      params: { u: Date.now() }
    }).then(function (response) {
      self.setValue('cleanup', response.data);
      self.notification('อัพเดทตัวทำความสะอาดแล้ว...');
    }).catch(function (error) {
      self.notification('อัพเดทตัวทำความสะอาดไม่สำเร็จ... ');
    });
  },
  setValue(name, value) {
    if (typeof GM_setValue !== "undefined") {
      GM_setValue(name, value);
      this.registersettings();
    }
  },
  getValue(name) {
    if (typeof GM_getValue !== "undefined" && typeof GM_getValue(name) !== "undefined") {
      return GM_getValue(name);
    } else {
      return null;
    }
  },
  registersettings() {
    for (let settingname in this.appsetting.preset) {
      if(this.getValue(settingname) == null) {
        GM_setValue(settingname, this.appsetting.preset[settingname]);
      }
      this.setting[settingname] = this.getValue(settingname);
    }
    if(window.parent == window.self){
      if (Object.keys(this.setting.host).length == 0) {
        this.updatedb();
        this.updateword();
      }
    }
  },
  padLeft(char, len, str) {
    len = len || this.setting.namedigit;
    return Array(len - String(char).length + 1).join(str || '0') + char;
  },
  nodes: [],
  first() {
    return this.nodes[0] || false;
  },
  last() {
    return this.nodes[this.length - 1] || false;
  },
  select(parameter, context) {
    parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');
    return (context || document).querySelectorAll(parameter);
  },
  slice(pseudo) {
    if (!pseudo || pseudo.length === 0 || typeof pseudo === 'string' ||
        pseudo.toString() === '[object Function]') return [];
    return pseudo.length ? [].slice.call(pseudo.nodes || pseudo) : [pseudo];
  }
};

var window = unsafeWindow;
window.ovr = ovr;
window.ovr.Readability = Readability;
window.ovr.saveAs = saveAs;
window.ovr.axios = axios;
ovr.prototype.initialize();
// ==UserScript==
// @name              Override
// @version           4.0.5
// @description       Allow copy novel to clipboard or text file for backup
// @author            Ann
// @icon              https://i.imgur.com/Fvu5RPq.png
// @homepage          https://github.com/YaninL/Override
// @supportURL        https://github.com/YaninL/Override
// @updateURL         https://raw.githubusercontent.com/YaninL/Override/master/Override.js
// @downloadURL       https://raw.githubusercontent.com/YaninL/Override/master/Override.js
// @require           https://raw.githubusercontent.com/YaninL/Override/master/FileSaver.min.js
// @require           https://raw.githubusercontent.com/YaninL/Override/master/Readability.min.js
// @include           *
// @connect           githubusercontent.com
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @grant             GM_addValueChangeListener
// @grant             GM_setClipboard
// @grant             GM_notification
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// ==/UserScript==
// สคิปนี้ทำเพื่อแบคอัพนิยายไว้อ่านส่วนตัวเท่านั้น
// ขอความร่วมมือทุกท่านที่ใช้สคิปในทางที่ถูกต้อง

var window = unsafeWindow;
var saveAs = saveAs;
var Readability = Readability;

var ovr = function Override(parameter, context) {
  if (parameter == null) {
    this.initialize();
  }
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

ovr.usersetting = {};
ovr.usersetting.webelement = {};
ovr.usersetting.cleanup = {};

ovr.prototype = {
  name: 'Override',
  initialize: function() {
    this.registersettings();
    this.addcanonical();
    this.addcommands();
    this.addcontentcopy();
  },
  setting: {},
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
      webelement: {},
      namedigit: 3,
      content: false,
      wait: true,
      autodetectlength: 3000
    },
    decryptUpdate: 'https://raw.githubusercontent.com/YaninL/Override/master/Data/DataHost.json',
    cleanwordUpdate: 'https://raw.githubusercontent.com/YaninL/Override/master/Data/CleanupWord.json',
    handlerName: [
      'contextmenu', 'copy', 'cut', 'paste', 'mousedown', 'mouseup', 'beforeunload', 'beforeprint', 'keyup',
      'keydown', 'select', 'selectstart', 'selectionchang'
    ],
    cssProtection: [
      '*{-webkit-user-select:text !important;',
      '-moz-user-select:text !important;',
      '-ms-user-select:text !important;',
      '-o-user-select:text !important;',
      'user-select:text !important;}'
    ],
    customCss: [
      '.dropovr{background:0;position:fixed;right:5px;bottom:0;width:100%;text-align:right;z-index:9999999999;font:initial}',
      '.dropup{position:relative;display:inline-block;width:120px}',
      '.dropbtn{font:bold 12px tahoma!important;text-transform:capitalize;background:#36c;color:#fff;width:100%;height:20px;margin:0;padding:2px;border:none;border-radius:3px 3px 0 0}',
      '.dropup-content{background:#b9dff4;display:none;width:100%;bottom:20px;z-index:9999999999}',
      '.dropup-content div{font:normal 12px tahoma;text-align:left;display:block;color:#000;padding:2px 5px}',
      '.dropup-content div:hover{background:#9fbeff}',
      '.dropup:hover .dropup-content{display:block}',
      '.dropup:hover .dropbtn{background:#2980b9}',
      '.hiddenbox {width:1px;height:1px;overflow:hidden;}'
    ],
    title: /(ep\.?|บทที่|ตอนที่|ch|chapter|volume|arc|เล่ม|เล่มที่)\s{0,4}(\d+)\s{0,4}(\-|\.|บทที่|\-?ตอนที่?).*?\s{0,4}(\d+)?/i
  },
  addcontentcopy: function() {
    var usersetting = ovr.usersetting.webelement[this.hostName] || false;
    usersetting = usersetting ? usersetting : this.setting.userhost[this.hostName];
    var appsetting = this.setting.host[this.hostName] || false;
    if (usersetting) {
      this.setting.webelement = usersetting;
    } else if (appsetting) {
      this.setting.webelement = appsetting;
      var dbscript = appsetting.script || false;
      if (dbscript) {
        this.setting.webelement.script = new Function (dbscript);
      }
    } else {
      return;
    }
    this.addcommandmenu();
    var execpath = this.setting.webelement.execpath || false;
    var skipremove = this.setting.webelement.skipremove || false;
    var remove = this.setting.webelement.remove || false;
    var css = this.setting.webelement.css || false;
    var autodetect = this.setting.webelement.autodetect || false;
    var title = this.setting.webelement.title || false;
    var content = this.setting.webelement.content || false;
    var script = this.setting.webelement.script || false;
    var regtest = new RegExp(execpath, 'i')
    console.log('[Override] Host', this.hostName);
    console.log('[Override] Path', this.pathName);
    console.log('[Override] Execpath', execpath ? regtest.test(this.pathName) : false);
    console.log('[Override] Element', this.setting.webelement);
    if (skipremove == false) this.removeprotection();
    if (css) GM_addStyle(css.join('\n'));
    if (execpath && regtest.test(this.pathName) == false && autodetect != true) return;
    if (remove) ovr(remove).nodes.forEach(e => e.parentNode.removeChild(e));
    if (script) script();
    if (content || autodetect) {
      var selectcontent = [];
      if(autodetect) {
        document.body.insertAdjacentHTML('beforeend', '<div id="autoclipboard" class="hiddenbox"></div>');
        var autoclipboard = document.getElementById('autoclipboard');
        var article = new Readability(document.cloneNode(true)).parse();
        console.log('[Override] Readability', article);
        if(article.length < this.setting.autodetectlength) return;
        autoclipboard.insertAdjacentHTML('beforeend', article.content.replace(/\n/g, ''));
        selectcontent.push(ovr(autoclipboard).nodes[0]);
      } else {
        if(title){
          var titles = title.split(',').map(e => e.trim());;
          var titlenode = titles[1] || 0;
          selectcontent.push(ovr(titles[0]).nodes[titlenode]);
        }
        selectcontent = selectcontent.concat(ovr(content).nodes);
      }
      console.log('[Override] Select', selectcontent);
      this.copycontent(selectcontent);
    } else {
      return;
    }
  },
  copycontent: function (content, area){
    var dbclick = area || 'body';
    var self = this;
    ovr(dbclick).first().addEventListener('dblclick', function() {
      self.setclipboard(content);
    });
    if (this.setting.autoCopy) {
      if (this.setting.webelement.hasOwnProperty('buyButton')) {
        if(this.setting.webelement.buyButton != null && this.setting.autoBuy){
          setTimeout(function(){this.setting.webelement.buyButton.click();}, 4000);
          console.log('[Override] Auto buy active', this.setting.webelement.buyButton);
        }else if(this.setting.webElement.buyButton != null && this.setting.autoBuy == false){
          console.log('[Override] Detect buy button and auto buy not active');
          return;
        }else{
          this.setclipboard(content);
        }
      }else{
        this.setclipboard(content);
      }
    }
  },
  setclipboard: function (target) {
    document.body.insertAdjacentHTML('beforeend', '<div id="clipboard" class="hiddenbox"></div>');
    var clipboard = document.getElementById('clipboard');
    if (this.setting.addUri && this.setting.webelement.hasOwnProperty('skipsource') == false) {
      clipboard.insertAdjacentHTML('beforeend', decodeURIComponent(window.location) + '<br/>');
    }
    var content = '';
    for (var i = 0; i < target.length; i++) {
      var textContent = target[i].innerText;
      if (textContent == '') continue;
      content += textContent + '\n';
    }
    content = this.setting.contentcleanup ? this.cleanupcontent(content) : content;
    clipboard.insertAdjacentHTML('beforeend', content.replace(/\n/g, '<br/>'));
    var selection = window.getSelection();
    selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(clipboard);
    selection.removeAllRanges();
    setTimeout(function() {}, 50);
    selection.addRange(range);
    if (this.setting.saveFile) {
      var text = selection.toString();
      var filename = this.getfilename(text.replace(/http.*/i, ''));
      var blob = new Blob([text.replace(/\n\n/g, '\r\n\r\n')], {
        type: 'text/plain;charset=utf-8'
      });
      saveAs(blob, filename);
      this.notification('บันทึกไฟล์ ' + filename + ' แล้ว', 1500);
    } else {
      GM_setClipboard();
      this.notification('คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว', 1500);
    }
    clipboard.parentNode.removeChild(clipboard);
    selection.removeAllRanges();
  },
  next: function() {
    var next = this.setting.webElement.next || false;
    if(next == false) return;
    var node = document.getElementById(next) || false;
    if(node && this.setting.wait == false) {
      this.setting.wait = true;
      if(node.nodeName == 'a') {
        node.click();
      }else if (node.nodeName == 'button' || node.nodeName == 'form'){
        node.submit();
      }
    }else{
      console.log('[Override] Next node name', next, 'not found...');
    }
  },
  removeprotection: function() {
    this.removeprotectionwindow(window);
    this.removeprotectionwindow(document);
    GM_addStyle(this.appsetting.cssProtection.join('\n'));
  },
  removeprotectionwindow: function(protectedWindow) {
    for (var i in this.appsetting.handlerName) {
      var handlerName = this.appsetting.handlerName[i];
      var handlerOnName = 'on' + handlerName;
      if (protectedWindow[handlerOnName]) {
        protectedWindow[handlerOnName] = null;
      }
      protectedWindow.addEventListener(handlerName, function(e) {
        e.stopPropagation();
      }, true);
    }
  },
  removeframeprotectionwindow: function() {
    var framelist = window.frames;
    for (var i = 0; i < framelist.length; i++) {
      try {
        this.removeprotectionwindow(framelist[i]);
      } catch (e) {}
    }
  },
  addcommands: function() {
    if (window.parent == window.self) {
      var self = this;
      GM_registerMenuCommand('Update database', function() {
        self.updatedb();
      });
      GM_registerMenuCommand('Update cleanup word', function() {
        self.updateword();
      });
      GM_registerMenuCommand('Hide/Show menu', function() {
        var menu = ovr('.dropovr').first();
        if(menu.style.display === "none"){
          menu.style.display = "block";
          self.setValue('showmenu', true);
        }else{
          menu.style.display = "none";
          self.setValue('showmenu', false);
        }
      });
      GM_registerMenuCommand('Enable/Disable notification', function() {
        if(self.setting.notification == false){
          self.setValue('notification', true);
        }else{
          self.setValue('notification', false);
        }
      });
    }
  },
  addcommandmenu: function() {
    var self = this;
    if (window.parent == window.self) {
      GM_addStyle(this.appsetting.customCss.join('\n'));
      document.body.insertAdjacentHTML('beforeend', [
        '<div class="dropovr"><div class="dropup">',
        '<button class="dropbtn">◆◇ Override ◇◆</button><div class="dropup-content">',
        '<div><input type="checkbox" id="saveFile" style=""' + (this.getValue('saveFile') ? ' checked' : '') + '>Copy to file</div>',
        '<div><input type="checkbox" id="autoBuy"' + (this.getValue('autoBuy') ? ' checked' : '') + '>Auto Buy</div>',
        '<div><input type="checkbox" id="addUri"' + (this.getValue('addUri') ? ' checked' : '') + '>Source url</div>',
        '<div><input type="checkbox" id="contentcleanup"' + (this.getValue('contentcleanup') ? ' checked' : '') + '>Cleanup Novel</div>',
        '</div></div></div>'
      ].join(''));
      document.getElementById('saveFile').addEventListener('click', function() {
        self.setValue('saveFile', document.getElementById('saveFile').checked);
      });
      document.getElementById('autoBuy').addEventListener('click', function() {
        self.setValue('autoBuy', document.getElementById('autoBuy').checked);
      });
      document.getElementById('addUri').addEventListener('click', function() {
        self.setValue('addUri', document.getElementById('addUri').checked);
      });
      document.getElementById('contentcleanup').addEventListener('click', function() {
        self.setValue('contentcleanup', document.getElementById('contentcleanup').checked);
      });
      var display = this.setting.showmenu;
      var menu = ovr('.dropovr').first();
      menu.style.display = display ? 'block' : 'none';
    }
  },
  getfilename: function(content) {
    var title_line = content.substring(0, 200).replace(/\s+/g, ' ').replace(/[\r\t\n,]/g, '').replace('(', '-');
    if (this.appsetting.title.test(title_line)) {
      var chapter = title_line.match(this.appsetting.title);
      var type = /บทที่|ตอนที่/i.test(chapter[3]);
      chapter[3] = (typeof chapter[3] !== 'undefined' && typeof chapter[4] !== 'undefined') ? chapter[3] : '';
      chapter[4] = (typeof chapter[4] !== 'undefined') ? chapter[4] : '';
      chapter[2] = type ? chapter[2] : this.padLeft(chapter[2], this.setting.namedigit);
      chapter[3] = type ? '-' : chapter[3];
      chapter[4] = type ? this.padLeft(chapter[4], this.setting.namedigit) : chapter[4];
      chapter[4] = (chapter[3] == ' ') ? '' : chapter[4];
      chapter[3] = (chapter[3] == ' ') ? '' : chapter[3];
      return chapter[2] + chapter[3].trim() + chapter[4] + '.txt';
    } else if (/\d+/.test(title_line)) {
      return this.padLeft(title_line.match(/\d+/), this.setting.namedigit) + '.txt';
    } else {
      return 'filename.txt';
    }
  },
  cleanupcontent: function(input) {
    var cleanupword = this.setting.cleanup;
    var cleanuphost = this.setting.webelement.cleanup || false;
    var usercleanupword = ovr.usersetting.cleanup.common || false;
    var usercleanuphost = ovr.usersetting.cleanup[this.hostName] || false;
    var regexcleanup = Object.entries(cleanupword);
    if (cleanuphost) {
      regexcleanup = regexcleanup.concat(Object.entries(cleanuphost));
    }
    if (usercleanupword && usercleanupword) {
      regexcleanup = regexcleanup.concat(Object.entries(usercleanupword));
    }
    if (usercleanupword && usercleanuphost) {
      regexcleanup = regexcleanup.concat(Object.entries(usercleanuphost));
    }
    var input_line = input.replace('\r', '\n').split('\n');
    var output = [];
    for (var in_line in input_line) {
      var textline = input_line[in_line].trim();
      if (textline == '') continue;
      for (var line in regexcleanup) {
        textline = textline.replace(
          new RegExp(regexcleanup[line][0], 'g'), regexcleanup[line][1]);
      }
      if (in_line >= 1 && textline == input_line[0].trim()) continue;
      if (textline == '') continue;
      output.push(textline.trim());
    }
    for(var contentline in output){
      if(output[0] == output[contentline] && contentline != 0){
        output.splice(contentline, 1)
      }
    }
    return output.join(this.setting.doubleNewline ? '\n\n' : '\n');
  },
  decode: function(s) {
    s = Array.isArray(s) ? s.join('') : s;
    return s.split('');
  },
  addcanonical: function() {
    document.querySelector('head').insertAdjacentHTML('afterbegin', '<link href="' + window.location + '" rel="canonical"/>')
  },
  updatedb: function() {
    var self = this;
    GM_xmlhttpRequest({
      method: 'GET',
      url: this.appsetting.decryptUpdate + '?u=' + Date.now(),
      onload: function(response) {
        var updateData = JSON.parse(response.responseText);
        self.setValue('host', updateData);
        self.notification('Decrypt has been update... ' + updateData.updatetime, 3000);
      }
    });
  },
  updateword: function(){
    var self = this;
    GM_xmlhttpRequest({
      method: 'GET',
      url: this.appsetting.cleanwordUpdate + '?u=' + Date.now(),
      onload: function(response) {
        self.setValue('cleanup', JSON.parse(response.responseText));
        self.notification('Cleanup word has been update...', 3000);
      }
    });
  },
  hostName: window.location.hostname.replace('www.', ''),
  pathName: decodeURIComponent(window.location.pathname),
  notification: function(text, time) {
    if(this.setting.notification == false) return;
    time = typeof time !== 'undefined' ? time : 1500;
    GM_notification({
      title: 'แจ้งเตือน',
      text: text,
      timeout: time
    });
  },
  setValue: function(name, value) {
    if (typeof GM_setValue !== "undefined") {
      GM_setValue(name, value);
    }
    this.registersettings();
  },
  getValue: function(name) {
    if (typeof GM_getValue !== "undefined" && typeof GM_getValue(name) !== "undefined") {
      return GM_getValue(name);
    } else {
      return null;
    }
  },
  padLeft: function(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  },
  registersettings: function() {
    for (var settingname in this.appsetting.preset) {
      if (this.appsetting.preset.hasOwnProperty(settingname)) {
        this.setting[settingname] = this.getValue(settingname) != null ?
          this.getValue(settingname) : this.appsetting.preset[settingname];
      }
    }
    if (this.getValue('host') == null ||
        this.getValue('cleanup') == null) {
      this.updatedb();
      this.updateword();
    }
    // add user host
    if(this.getValue('userhost') == null) this.setValue('userhost', {})
    // delete old version value
    if(this.getValue('cleanupWord') != null) GM_deleteValue('cleanupWord');
    if(this.getValue('Decrypt') != null) GM_deleteValue('Decrypt');
    console.log('[Override] Setting', this.setting);
  },
  nodes: [],
  first: function () {
    return this.nodes[0] || false;
  },
  last: function () {
    return this.nodes[this.length - 1] || false;
  },
  select: function (parameter, context) {
    parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');
    return (context || document).querySelectorAll(parameter);
  },
  slice: function (pseudo) {
    if (!pseudo ||
        pseudo.length === 0 ||
        typeof pseudo === 'string' ||
        pseudo.toString() === '[object Function]') return [];
    return pseudo.length ? [].slice.call(pseudo.nodes || pseudo) : [pseudo];
  }
};

window.ovr = ovr;
new ovr();

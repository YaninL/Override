// ==UserScript==
// @name         Override - Master
// @homepage     https://github.com/YaninL/Override
// @version      3.0.0
// @description  Allow copy novel to clipboard or text file for backup
// @author       Ann
// @icon         https://raw.githubusercontent.com/YaninL/Override/master/logo.png
// @homepage     https://github.com/YaninL/Override
// @supportURL   https://github.com/YaninL/Override
// @updateURL    https://raw.githubusercontent.com/YaninL/Override/master/Override.js
// @downloadURL  https://raw.githubusercontent.com/YaninL/Override/master/Override.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @include      http://*
// @include      https://*
// @connect      githubusercontent.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==
// สคิปนี้ทำเพื่อแบคอัพนิยายไว้อ่านส่วนตัวเท่านั้น
// ขอความร่วมมือทุกท่านที่ใช้สคิปในทางที่ถูกต้อง

(function() {

  'use strict';

  var NovelSetting = {
    webElement: {
      /*"example.com": {
        //Override.webElement = {};
        acceptPath: /ba/i,
        skipbypass: false,
        skipsource: false,
        selectDecrypt: '',
        remove: document.querySelectorAll(''),
        doubleClickArea: document.querySelector(''),
        contentArea: document.querySelectorAll(''),
        decrypt : function () {}
      },*/
      "wuxiaworld.com": {
        acceptPath: /novel\/.*\/.*\d+/i,
        doubleClickArea: document.querySelector('.panel-default'),
        contentArea: document.querySelectorAll('.p-15 h4[class=""], .p-15 .fr-view p'),
      }
  };

  var Override = {
    name: 'Override',
    scriptid: 'GtHueEHH',
    initialize: function() {
      Override.general.registerSettings();
      Override.general.addSourcetoHead();
      Override.addCommands();
      Override.contentAddCopy()
    },
    options: {},
    webElement: {},
    Decrypt: {},
    cleanupWord: {},
    thaiChar: {},
    encryptChar: {},
    novelContent: null,
    novelDecrypt: null,
    scriptSetting: {
      scriptOption: {
        saveFile: false,
        autoCopy: false,
        addUri: false,
        botDownload: false,
        cleanup: false
      },
      decryptUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/Data/Decrypt.json',
      cleanwordUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/Data/CleanupWord.json',
      handlerName: [
        'contextmenu', 'copy', 'cut', 'paste', 'mousedown', 'mouseup', 'beforeunload', 'beforeprint', 'keyup',
        'keydown', 'select', 'selectstart', 'selectionchang'
      ],
      cssProtection: [
        '* {-webkit-user-select: text! important;',
        '-moz-user-select: text! important;',
        '-ms-user-select: text! important;',
        '-o-user-select: text! important;',
        'user-select: text! important;}'
      ],
      customCss: [
        '.dropoverride {background: transparent; position: fixed; right: 5px; bottom: 0; width: 100%; text-align: right; z-index: 9999999999; font: initial;}',
        '.dropup {position: relative; display: inline-block;width: 120px;}',
        '.dropbtn {font: bold 12px "tahoma"; background: #3366cc; color: white;width: 100%; height: 20px; margin: 0px; padding: 2px; border: none; border-radius: 3px 3px 0px 0px}',
        '.dropup-content {background: #b9dff4; display: none;width: 100%; bottom: 20px; z-index: 9999999999;}',
        '.dropup-content div {font: normal 12px tahoma; text-align: left; display: block; color: black; padding: 2px 5px;}',
        '.dropup-content div:hover {background: #9fbeff;}',
        '.dropup:hover .dropup-content {display: block;}',
        '.dropup:hover .dropbtn {background: #2980B9;}'
      ],
      validationWord: ['ได้', 'ไม่', 'ที่'],
      newline: '\n\n'
    },
    contentAddCopy: function() {
      console.log('Override :', Override.hostName, Override.pathName);
      if (Override.Decrypt == null) return;
      if (NovelSetting.webElement.hasOwnProperty(Override.hostName)) {
        Override.webElement = NovelSetting.webElement[Override.hostName];
      } else if (Override.Decrypt.hasOwnProperty(Override.hostName)) {
        eval(Override.helper.base64Decode(Override.Decrypt[Override.hostName]));
      } else {
        console.log('Override : not support', Override.hostName);
        return;
      }
      if (Override.webElement.hasOwnProperty('selectDecrypt')) {
        eval(Override.helper.base64Decode(Override.webElement[Override.webElement.selectDecrypt]));
      }
      Override.optionMunu();
      console.log('Override : Element', Override.hostName, Override.webElement);
      if (Override.webElement.hasOwnProperty('acceptPath')) {
        console.log('Override : Accept path', Override.webElement.acceptPath.test(Override.pathName));
        if (Override.webElement.acceptPath.test(Override.pathName) == false) {
          if (Override.webElement.hasOwnProperty('skipbypass') == false) {
            Override.removeProtection.removeProtection();
          }
          return false;
        }
      }
      Override.removeProtection.removeProtection();
      if (Override.webElement.hasOwnProperty('remove')) {
        Override.webElement.remove.forEach(e => e.parentNode.removeChild(e));
      }
      if (Override.webElement.hasOwnProperty('decrypt')) {
        Override.webElement.decrypt();
      }
      if (Override.webElement.hasOwnProperty('doubleClickArea')) {
        if (typeof Override.webElement.doubleClickArea === 'undefined'
            || typeof Override.webElement.contentArea === 'undefined') {
          return;
        } else {
          Override.addDoubleClickEvent(Override.webElement.doubleClickArea, Override.webElement.contentArea);
        }
      }
    },
    eval: function evil(script) {
      return ((unsafeWindow, window) => {return eval(script);})();
    },
    removeProtection: {
      removeProtection: function() {
        Override.removeProtection.removeProtectionWindow(window);
        Override.removeProtection.removeProtectionWindow(document);
        Override.removeProtection.removeCssProtection();
      },
      removeProtectionWindow: function(protectedWindow) {
        for (var i in Override.scriptSetting.handlerName) {
          var handlerName = Override.scriptSetting.handlerName[i];
          var handlerOnName = 'on' + handlerName;
          if (protectedWindow[handlerOnName]) {
            protectedWindow[handlerOnName] = null;
          }
          protectedWindow.addEventListener(handlerName, function(e) {
            e.stopPropagation();
          }, true);
        }
      },
      removeFrameProtectionWindow: function() {
        var frameList = window.frames;
        for (var i = 0; i < frameList.length; i++) {
          try {
            Override.removeProtection.removeProtectionWindow(frameList[i]);
          } catch (e) {}
        }
      },
      removeCssProtection: function() {
        GM_addStyle(Override.scriptSetting.cssProtection.join('\n'));
      },
    },
    addCommands: function() {
      GM_registerMenuCommand(Override.name + ' update database', function() {
        Override.updateDB();
      })
    },
    optionMunu: function() {
      GM_addStyle(Override.scriptSetting.customCss.join('\n'));
      if (window.parent == window.self) {
        document.body.insertAdjacentHTML('beforeend', [
          '<div class="dropoverride"><div class="dropup">',
          '<button class="dropbtn">◆◇ ' + Override.name + ' ◇◆</button><div class="dropup-content">',
          '<div><input type="checkbox" id="saveFile" style=""' + (Override.helper.getValue('saveFile') ? ' checked' : '') + '>Copy to file</div>',
          '<div><input type="checkbox" id="autoCopy"' + (Override.helper.getValue('autoCopy') ? ' checked' : '') + '>Auto Copy</div>',
          '<div><input type="checkbox" id="addUri"' + (Override.helper.getValue('addUri') ? ' checked' : '') + '>Source url</div>',
          '<div><input type="checkbox" id="botDownload"' + (Override.helper.getValue('botDownload') ? ' checked' : '') + '>Bot Download</div>',
          '<div><input type="checkbox" id="cleanup"' + (Override.helper.getValue('cleanup') ? ' checked' : '') + '>Cleanup Novel</div>',
          '</div></div></div>'
        ].join(''));
        document.getElementById('saveFile').addEventListener('click', function() {
          Override.helper.setValue('saveFile', document.getElementById('saveFile').checked);
        });
        document.getElementById('autoCopy').addEventListener('click', function() {
          Override.helper.setValue('autoCopy', document.getElementById('autoCopy').checked);
        });
        document.getElementById('addUri').addEventListener('click', function() {
          Override.helper.setValue('addUri', document.getElementById('addUri').checked);
        });
        document.getElementById('botDownload').addEventListener('click', function() {
          Override.helper.setValue('botDownload', document.getElementById('botDownload').checked);
          Override.helper.setValue('autoCopy', document.getElementById('autoCopy').checked);
        });
        document.getElementById('cleanup').addEventListener('click', function() {
          Override.helper.setValue('cleanup', document.getElementById('cleanup').checked);
        });
      }
    },
    decryptValidation: function() {
      for (var i in Override.scriptSetting.validationWord) {
        if (Override.novelDecrypt.indexOf(Override.scriptSetting.validationWord[i]) == -1) return false;
      }
      return true;
    },
    addDoubleClickEvent: function(clickArea, contentArea) {
      clickArea.addEventListener('dblclick', function() {
        Override.setClipboard(contentArea);
      });
      if (Override.options.autoCopy) {
        Override.setClipboard(contentArea);
      }
    },
    setClipboard: function(target) {
      document.body.insertAdjacentHTML('beforeend', '<div id="clipboard"></div>');
      var clipboard = document.getElementById('clipboard');
      if (Override.options.addUri && Override.webElement.hasOwnProperty('skipsource') == false) {
        clipboard.insertAdjacentHTML('beforeend', Override.helper.uriDocode(window.location) + '<br>');
      }
      for (var i = 0; i < target.length; i++) {
        var textContent = target[i].innerText;
        textContent = Override.options.cleanup ? Override.cleanup(textContent) : textContent;
        if (textContent == '') continue;
        clipboard.insertAdjacentHTML('beforeend', textContent.replace(/\n/g, '<br>'));
        (i + 1) < target.length ? clipboard.insertAdjacentHTML('beforeend', '<br><br>') : null;
        console.log(target[i].innerText);
      }
      var selection = window.getSelection();
      selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(clipboard);
      selection.removeAllRanges();
      setTimeout(function() {}, 50);
      selection.addRange(range);
      if (Override.options.saveFile) {
        var text = selection.toString();
        var filename = Override.getFilename(text.replace(/http.*/i, ''));
        var blob = new Blob([text.replace(/\n\n/g, '\r\n\r\n')], {
          type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, filename);
        Override.helper.notification('บันทึกไฟล์ ' + filename + ' แล้ว', 1500);
      } else {
        GM_setClipboard();
        Override.helper.notification('คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว', 1500);
      }
      clipboard.parentNode.removeChild(clipboard);
      selection.removeAllRanges();
    },
    getFilename: function(content) {
      var title_line = content.substring(0, 200).replace(/[\s\r\t\n]/g, '').replace('(', '-');
      var name = /(บทที่|ตอนที่|ch|chapter|volume|เล่ม|เล่มที่)(\d+)(\-|\.|บทที่|ตอนที่)?(\d+)?/i;
      if (name.test(title_line)) {
        var chapter = title_line.match(name);
        var type = /บทที่|ตอนที่/i.test(chapter[3]);
        chapter[3] = (typeof chapter[3] !== 'undefined' && typeof chapter[4] !== 'undefined') ? chapter[3] : '';
        chapter[4] = (typeof chapter[4] !== 'undefined') ? chapter[4] : '';
        chapter[2] = type ? chapter[2] : Override.helper.padLeft(chapter[2], 3);
        chapter[3] = type ? '-' : chapter[3];
        chapter[4] = type ? Override.helper.padLeft(chapter[4], 3) : chapter[4];
        return chapter[2] + chapter[3] + chapter[4] + '.txt';
      } else if (/\d+/.test(title_line)) {
        return Override.helper.padLeft(title_line.match(/\d+/), 3) + '.txt';
      } else {
        return 'filename.txt';
      }
    },
    cleanup: function(input) {
      var regexCleanup = Object.entries(Override.cleanupWord.common);
      if (Override.cleanupWord.hasOwnProperty(Override.hostName)) {
        Array.prototype.push.apply(regexCleanup, Object.entries(Override.cleanupWord[Override.hostName]));
      }
      if (NovelSetting.hasOwnProperty('cleanupWord') && NovelSetting.cleanupWord.hasOwnProperty(Override.hostName)) {
        Array.prototype.push.apply(regexCleanup, Object.entries(NovelSetting.cleanupWord[Override.hostName]));
      }
      var input_line = input.replace('\r', '\n').split('\n');
      var output = '';
      for (var in_line in input_line) {
        var textline = input_line[in_line].trim();
        if (textline == '') continue;
        for (var line in regexCleanup) {
          textline = textline.replace(new RegExp(regexCleanup[line][0], 'g'), regexCleanup[line][1]);
        }
        if (in_line >= 1 && textline == input_line[0].trim()) continue;
        if (textline == '') continue;
        output += textline + Override.scriptSetting.newline;
      }
      return output.trim();
    },
    contentDecrypt: function() {
      Override.novelDecrypt = Override.textReplace(Override.novelContent, Override.encryptChar, Override.thaiChar);
    },
    textReplace: function(str, find, replace) {
      if (find.length != replace.length) {
        console.log('Both arrays are not equal fine:' + find.length + '/replace:' + replace.length);
      }
      for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'g'), replace[i]);
      }
      return str;
    },
    decode: function(s) {
      return Override.helper.base64Decode(Array.isArray(s) ? s.join('') : s).split('');
    },
    general: {
      windowLocation: function() {
        Override.helper.uriDocode(window.location)
      },
      addSourcetoHead: function() {
        document.querySelector('head').insertAdjacentHTML('afterbegin', '<link href="' + window.location + '" rel="canonical"/>')
      },
      registerSettings: function() {
        for (var optionName in Override.scriptSetting.scriptOption) {
          if (Override.scriptSetting.scriptOption.hasOwnProperty(optionName)) {
            Override.options[optionName] = Override.helper.getValue(optionName) != null ?
              Override.helper.getValue(optionName) : Override.scriptSetting.scriptOption[optionName];
          }
        }
        if (Override.helper.getValue('Decrypt') == null ||
          Override.helper.getValue('cleanupWord') == null) {
          Override.updateDB();
          return;
        }
        Override.Decrypt = Override.helper.getValue('Decrypt');
        Override.cleanupWord = Override.helper.getValue('cleanupWord');
      },
    },
    updateDB: function() {
      GM_xmlhttpRequest({
        method: 'GET',
        url: Override.scriptSetting.decryptUpdate + '?' + Date.now(),
        onload: function(response) {
          var updateData = JSON.parse(response.responseText);
          Override.helper.setValue('Decrypt', updateData);
          Override.helper.notification('Decrypt has been update... ' + updateData.updatetime, 3000);
        }
      });
      GM_xmlhttpRequest({
        method: 'GET',
        url: Override.scriptSetting.cleanwordUpdate + '?' + Date.now(),
        onload: function(response) {
          Override.helper.setValue('cleanupWord', JSON.parse(response.responseText));
        }
      });
    },
    hostName: window.location.hostname.replace('www.', ''),
    pathName: window.location.pathname,
    helper: {
      notification: function(text, time) {
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
        Override.general.registerSettings();
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
      base64Decode: function(s) {
        return decodeURIComponent(escape(window.atob(s)));
      },
      unicodeUnescape: function(s) {
        return decodeURIComponent(JSON.parse('"' + s.replace(/\"/g, '\\"') + '"'));
      },
      uriDocode: function(s) {
        return decodeURIComponent(s);
      },
      reload: function(t) {
        t = typeof t !== 'undefined' ? t : 0;
        setTimeout(function(){window.location.reload(true)}, t);
      }
    }
  };

  Override.initialize();

})();

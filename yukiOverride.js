// ==UserScript==
// @name         yukiOverride
// @version      2.5.1
// @description  Allow copy novel to clipboard or text file for backup
// @author       Ann
// @icon         https://raw.githubusercontent.com/YaninL/Override/master/logo.png
// @updateURL    https://raw.githubusercontent.com/YaninL/Override/master/yukiOverride.js
// @downloadURL  https://raw.githubusercontent.com/YaninL/Override/master/yukiOverride.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @include      http://*
// @include      https://*
// @connect      githubusercontent.com
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==
// สคิปนี้ทำเพื่อแบคอัพนิยายไว้อ่านส่วนตัวเท่านั้น
// ขอความร่วมมือทุกท่านที่ใช้สคิปในทางที่ถูกต้อง

(function() {

  'use strict';

  jQuery.noConflict();

  var NovelSetting = {
    webElement : {
      // your script here
    },
    cleanupWord : {
      // your word here
    }
  };

  var Override = {
    name : 'yukiOverride',
    scriptid : 'GtHueEHH',
    initialize : function () {
      Override.general.registerSettings();
      Override.general.addSourcetoHead();
      Override.addCommands();
      Override.contentAddCopy()
    },
    options : {},
    webElement : {},
    Decrypt : {},
    cleanupWord : {},
    thaiChar : {},
    encryptChar : {},
    novelContent : null,
    novelDecrypt : null,
    scriptSetting : {
      scriptOption : {
        saveFile : true,
        autoCopy : false,
        addUri : false,
        botDownload : false
      },
      decryptUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/Data/yukiDecryptScripts.json',
      cleanwordUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/Data/CleanupWord.json',
      handlerName : [
        'contextmenu', 'copy', 'cut', 'paste', 'mousedown', 'mouseup', 'beforeunload', 'beforeprint', 'keyup',
        'keydown', 'select', 'selectstart', 'selectionchang'
      ],
      cssProtection : [
        '* {-webkit-user-select: text! important;',
        '-moz-user-select: text! important;',
        '-ms-user-select: text! important;',
        '-o-user-select: text! important;',
        'user-select: text! important;}'
      ],
      customCss : [
        '.dropoverride {background: transparent; position: fixed; right: 5px; bottom: 0; width: 100%; text-align: right; z-index: 9999999999; font: initial;}',
        '.dropup {position: relative; display: inline-block;width: 160px;}',
        '.dropbtn {font: bold 12px "tahoma"; background: #3366cc; color: white;width: 100%; height: 20px; margin: 0px; padding: 2px; border: none; border-radius: 3px 3px 0px 0px}',
        '.dropup-content {background: #b9dff4; display: none;width: 100%; bottom: 20px; z-index: 9999999999;}',
        '.dropup-content div {font: normal 12px tahoma; text-align: left; display: block; color: black; padding: 2px 5px;}',
        '.dropup-content div:hover {background: #9fbeff;}',
        '.dropup:hover .dropup-content {display: block;}',
        '.dropup:hover .dropbtn {background: #2980B9;}'
      ],
      validationWord : ['ได้', 'ไม่', 'ที่']
    },
    contentAddCopy : function () {
      if(Override.Decrypt == null) return;
      if (NovelSetting.webElement.hasOwnProperty(Override.hostName)) {
        Override.webElement = NovelSetting.webElement[Override.hostName];
      } else if (Override.Decrypt.hasOwnProperty(Override.hostName)) {
        eval(Override.helper.base64Decode(Override.Decrypt[Override.hostName]));
      } else {
        return;
      }
      if (Override.webElement.hasOwnProperty('selectDecrypt')) {
        eval(Override.helper.base64Decode(Override.webElement[Override.webElement.selectDecrypt]));
      }
      Override.optionMunu();
      if (Override.webElement.hasOwnProperty('acceptPath')) {
        if (Override.webElement.acceptPath.test(Override.pathName) == false){
          if (Override.webElement.hasOwnProperty('skipbypass') == false) {
            Override.removeProtection.removeProtection();
          }
          return false;
        }
      }
      Override.removeProtection.removeProtection();
      if (Override.webElement.hasOwnProperty('remove')) {
        Override.webElement.remove.remove();
      }
      if (Override.webElement.hasOwnProperty('decrypt')) {
        Override.webElement.decrypt();
      }
      if (Override.webElement.hasOwnProperty('doubleClickArea')) {
        if(Override.webElement.doubleClickArea.length == 0 || Override.webElement.contentArea.length == 0) {
          return;
        }else{
          Override.addDoubleClickEvent(Override.webElement.doubleClickArea, Override.webElement.contentArea);
        }
      }
    },
    removeProtection : {
      removeProtection: function () {
        Override.removeProtection.removeProtectionWindow(window);
        Override.removeProtection.removeProtectionWindow(document);
        Override.removeProtection.removeCssProtection();
      },
      removeProtectionWindow : function (protectedWindow) {
        for(var i in Override.scriptSetting.handlerName) {
          var handlerName = Override.scriptSetting.handlerName[i];
          var handlerOnName = 'on' + handlerName;
          if(protectedWindow[handlerOnName]){protectedWindow[handlerOnName] = null;}
          protectedWindow.addEventListener(handlerName, function(e){ e.stopPropagation(); }, true);
        }
      },
      removeFrameProtectionWindow : function () {
        var frameList = window.frames;
        for(var i = 0; i < frameList.length; i++) {
          try {
            Override.removeProtection.removeProtectionWindow(frameList[i]);
          } catch(e) {}
        }
      },
      removeCssProtection : function () {
        GM_addStyle(Override.scriptSetting.cssProtection.join('\n'));
      },
    },
    addCommands : function () {
      GM_registerMenuCommand(Override.name + ' update database', function(){Override.updateDB();})
    },
    optionMunu : function () {
      GM_addStyle(Override.scriptSetting.customCss.join('\n'));
      if(window.parent == window.self) {
      var menu = [
        '<div class="dropoverride"><div class="dropup">',
        '<button class="dropbtn">◆◇ ' + Override.name + ' ◇◆</button><div class="dropup-content">',
        '<div><input type="checkbox" id="saveFile" style=""' + (Override.helper.getValue('saveFile') ? ' checked':'') + '>Copy to file</div>',
        '<div><input type="checkbox" id="autoCopy"' + (Override.helper.getValue('autoCopy') ? ' checked':'') + '>Auto Copy</div>',
        '</div></div></div>'
      ];
      jQuery('body').append(menu.join(''));
      jQuery('#saveFile')[0].addEventListener('click', function(){Override.helper.setValue('saveFile', jQuery('#saveFile')[0].checked);});
      jQuery('#autoCopy')[0].addEventListener('click', function(){Override.helper.setValue('autoCopy', jQuery('#autoCopy')[0].checked);});
      }
    },
    decryptValidation : function () {
      for (var i in Override.scriptSetting.validationWord) {
        if(Override.novelDecrypt.indexOf(Override.scriptSetting.validationWord[i]) == -1) return false;
      }
      return true;
    },
    addDoubleClickEvent : function (clickArea, contentArea) {
      clickArea.addEventListener('dblclick', function() {
        Override.setClipboard(contentArea);
      });
      if(Override.helper.getValue('autoCopy')) {
        Override.setClipboard(contentArea);
      }
    },
    setClipboard : function (target) {
      jQuery('body').append('<div id="clipboard"></div>');
      if(Override.helper.getValue('addUri') && Override.webElement.hasOwnProperty('skipsource') == false) {
        jQuery('#clipboard').append(Override.helper.uriDocode(window.location)+ '<br>');
      }
      for(var i=0;i<target.length;i++) {
        var textContent = Override.cleanup(target[i].innerText).replace(/\n/g, '<br>');
        jQuery('#clipboard').append(textContent);
        (i+1) < target.length ? jQuery('#clipboard').append('<br><br>') : null;
      }
      var selection = window.getSelection();
      selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(jQuery('#clipboard')[0]);
      selection.removeAllRanges();
      setTimeout(function(){}, 50);
      selection.addRange(range);
      if(Override.helper.getValue('saveFile')) {
        var text = selection.toString();
        var filename = Override.getFilename(text.replace(/http.*/i, '').substring(0, 100));
        var blob = new Blob([text.replace(/\n\n/g, '\r\n\r\n')], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, filename);
      } else {
        GM_setClipboard();
        Override.helper.notification('คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว', 3000);
      }
      jQuery('#clipboard').remove();
      selection.removeAllRanges();
    },
    getFilename : function (content){
      var filename = 'filename';
      var title_line = content.replace(/\s\r\n/i, '').trim();
      var name1 = new RegExp(/(บทที่|ตอนที่|ch|Chapter)\s?(\d+)/i);
      var name2 = new RegExp(/\d+/i);
      var name3 = new RegExp(/(บทที่|ตอนที่|ch|Chapter)?\s?(\d+)\s?\-\s?(\d+)/i);
      if(name3.test(title_line)){
        filename = Override.helper.padLeft(title_line.match(name3)[2], 3) + '-' + title_line.match(name3)[3];
      }else if(name1.test(title_line)){
        filename = Override.helper.padLeft(title_line.match(name1)[2], 3);
      }else if(name2.test(title_line)){
        filename = Override.helper.padLeft(title_line.match(name2), 3);
      }
      return filename + '.txt';
    },
    cleanup : function (input) {
      var regexCleanup = Object.entries(Override.cleanupWord.common);
      if(Override.cleanupWord.hasOwnProperty(Override.hostName)){
        Array.prototype.push.apply(regexCleanup, Object.entries(Override.cleanupWord[Override.hostName]));
      }
      if(NovelSetting.cleanupWord.hasOwnProperty(Override.hostName)){
        Array.prototype.push.apply(regexCleanup, Object.entries(NovelSetting.cleanupWord[Override.hostName]));
      }
      var input_line = input.split('\n');
      var output = '';
      for(var in_line in input_line){
        var textline = input_line[in_line].trim();
        if(textline == '') continue;
        for(var line in regexCleanup){
          textline = textline.replace(new RegExp(regexCleanup[line][0], 'g'), regexCleanup[line][1]);
        }
        if(in_line >= 1 && textline == input_line[0].trim()) continue;
        if(textline == '') continue;
        output += textline + '\n\n';
      }
      return output.trim();
    },
    contentDecrypt : function() {
      Override.novelDecrypt = Override.textReplace(Override.novelContent, Override.encryptChar, Override.thaiChar);
    },
    textReplace : function(str, find, replace) {
      if(find.length != replace.length) {
        console.log('Both arrays are not equal fine:' + find.length +'/replace:'+ replace.length);
      }
      for(var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'g'), replace[i]);
      }
      return str;
    },
    decode : function (s) {
      return Override.helper.base64Decode(jQuery.isArray(s)? s.join('') : s).split('');
    },
    general : {
      windowLocation : function () {
        Override.helper.uriDocode(window.location)
      },
      addSourcetoHead : function () {
        jQuery('head').prepend('<link href="' + window.location + '" rel="canonical"/>')
      },
      registerSettings : function () {
        for (var optionName in Override.scriptSetting.scriptOption) {
          if (Override.scriptSetting.scriptOption.hasOwnProperty(optionName)) {
            Override.options[optionName] = Override.helper.getValue(optionName) != null
              ? Override.helper.getValue(optionName) : Override.scriptSetting.scriptOption[optionName];
          }
        }
        if (Override.helper.getValue('Decrypt') == null
            || Override.helper.getValue('cleanupWord') == null) {
          Override.updateDB();
        }
        Override.Decrypt = Override.helper.getValue('Decrypt');
        Override.cleanupWord = Override.helper.getValue('cleanupWord');
      },
    },
    updateDB : function () {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: Override.scriptSetting.decryptUpdate + '?' + Date.now(),
        onload: function(response) {
          var updateData = JSON.parse(response.responseText);
          Override.helper.setValue('Decrypt', updateData);
          Override.helper.notification('Decrypt has been update... ' + updateData.updatetime, 3000);
        }
      });
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: Override.scriptSetting.cleanwordUpdate + '?' + Date.now(),
        onload: function(response) {
          Override.helper.setValue('cleanupWord', JSON.parse(response.responseText));
        }
      });
    },
    hostName : window.location.hostname.replace('www.', ''),
    pathName : window.location.pathname,
    helper : {
      notification : function (text, time = 1500) {
        GM_notification ({ title: 'แจ้งเตือน', text: text, timeout: time });
      },
      setValue : function (name, value) {
        if (typeof GM_setValue !== "undefined") {
          GM_setValue(name, value);
        }
      },
      getValue : function (name) {
        if (typeof GM_getValue !== "undefined" && typeof GM_getValue(name) !== "undefined") {
          return GM_getValue(name);
        } else {
          return null;
        }
      },
      padLeft : function (nr, n, str) {
        return Array(n-String(nr).length + 1).join(str||'0') + nr;
      },
      base64Decode : function (s) {
        return decodeURIComponent(escape(window.atob(s)));
      },
      unicodeUnescape : function (s) {
        return decodeURIComponent(JSON.parse('"' + s.replace(/\"/g, '\\"') + '"'));
      },
      uriDocode : function (s) {
        return decodeURIComponent(s);
      },
      reload : function () {
        window.location.reload(true);
      },
    }
  };

  jQuery(document).ready(function() {
    Override.initialize();
  });

})();

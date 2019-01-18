// ==UserScript==
// @name         yukiOverride
// @namespace    yukiOverride
// @version      2.2.4
// @description  Allow copy novel to clipboard or text file for backup
// @author       Ann
// @icon         https://raw.githubusercontent.com/YaninL/Override/master/logo.png
// @homepage     https://github.com/YaninL/Override
// @updateURL    https://raw.githubusercontent.com/YaninL/Override/master/yuki/yukiOverride.js
// @downloadURL  https://raw.githubusercontent.com/YaninL/Override/master/yuki/yukiOverride.js
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

  var NovelSetting = {
    webElement : {
      'amnovel.com' : {
        acceptPath : /subcon\.php/i,
        remove : $('#background'),
        doubleClickArea : $('#buttons')[0],
        contentArea : $('div[style^="font-size: 22px"], #buttons')
      },
      'kawebook.com' : {
        acceptPath : /story\/\d+\/\d+/i,
        remove : $('#protect'),
        doubleClickArea : $('#read_content')[0],
        contentArea : [$('.readstory-storyname, #read_content')][0]
      },
      'spoilsoc.com' : {
        remove : $('#background'),
        doubleClickArea : $('#content')[0],
        contentArea : [$('#content')[0]]
      },
      'hellfact.com' : {
        acceptPath : /chapter/i,
        remove : $('.headline-top, .seed-social'),
        doubleClickArea : $('.entry-content')[0],
        contentArea : [$('.main-title, .entry-content')][0]
      },
      'thai-novel.com' : {
        doubleClickArea : $('.td-post-content')[0],
        contentArea : $('h1.entry-title, .td-post-content')
      },
      'tunwalai.com' : {
        acceptPath : /chapter/i,
        doubleClickArea : $('#story-detail')[0],
        contentArea : [$('.story-title-bar, #story-detail')][0]
      },
      'hongsamut.com' : {
        acceptPath : /fiction\/chapter/i,
        doubleClickArea : $('#changecolor')[0],
        contentArea : [$('#changecolor')[0]]
      },
      'nekopost.net' : {
        acceptPath : /novel\/\d+\/\d+/i,
        doubleClickArea : $('.display_content')[0],
        contentArea : [$('.display_content h4, .display_content p')][0]
      },
      'my.dek-d.com' : {
        acceptPath : /writer\/viewlongc/i,
        doubleClickArea : $('#content-area')[0],
        remove : $('script'),
        contentArea : [$('.chaptername, #content-area')][0]
      },
      'writer.dek-d.com' : {
        acceptPath : /writer\/viewlongc/i,
        remove : $('script'),
        doubleClickArea : $('#story-content')[0],
        contentArea : [$('.chaptername, #story-content')][0]
      },
      'sainamrin.blogspot.com' : {
        acceptPath : /\d{4,}\/\d{1,}/i,
        doubleClickArea : $('.entry-content')[0],
        contentArea : [$('.entry-content')][0]
      },
      'ispoil.blogspot.com' : {
        acceptPath : /\d{4,}\/\d{1,}/i,
        doubleClickArea : $('#content-wrapper')[0],
        contentArea : [$('.entry-content')][0]
      },
      'imakeuread.blogspot.com' : {
        acceptPath : /\d{4,}\/\d{1,}/i,
        doubleClickArea : $('.entry-content')[0],
        contentArea : [$('.entry-title, .entry-content')][0]
      },
      'facebook.com' : {
        acceptPath : /notes/i,
        doubleClickArea : $('._39k5')[0],
        contentArea : [$('._4lmk, ._39k5')][0]
      },
      'readgos.yuki2th.xyz' : {},
      'rakeaan.com' : {
        acceptPath : /th\/tofiction_story/i,
        remove : $('.post-meta'),
        doubleClickArea : $('.contents')[0],
        contentArea : [$('.page-info h3, .contents .postdtl-info')][0]
      },
      'seek-novel.com' : {
        specialDecrypt : 'seek-novel.com'
      },
      'nonbiri.yuki2th.xyz' : {
        specialDecrypt : 'seek-novel.com'
      },
      'vision.yuki2th.xyz' : {
        specialDecrypt : 'seek-novel.com'
      },
      'storynovelclub.com' : {
        acceptPath : /novels/i,
        doubleClickArea : $('.single-movie-player')[0],
        contentArea : [$('div h2:not(.widgettitle), .single-movie-player p')][0]
      },
      'fictionlog.co' : {},
      'readawrite.com' : {
        acceptPath : /c\//i,
      },
      'novelrealm.com' : {
        acceptPath : /read/i
      },
      'docs.google.com' : {
        acceptPath : /document\/d\/.*mobilebasic/i,
        doubleClickArea : $('.doc-container')[0],
        contentArea : [$('.doc-container')][0]
      },
      'read-thai.com' : {}
    },
    validationWord : ['ได้', 'ไม่', 'ที่'],
    specialDecrypt : {
      //paste your code here
    }
  };

  var Override = {
    name : 'Copy Override',
    scriptid : 'GtHueEHH',
    initialize : function () {
      Override.general.registerSettings();
      Override.general.addSourcetoHead();
      Override.addCommands();
      Override.contentAddCopy()
    },
    options : {},
    Script : {},
    thaiChar : {},
    DecryptChar : {},
    encryptChar : {},
    novelContent : null,
    novelDecrypt : null,
    specialDecrypt : {},
    scriptSetting : {
      scriptOption : {
        saveFile : true,
        autoCopy : false,
        addUri : false,
        botDownload : false,
        runScript : true,
        hideOptionMunu : false
      },
      scriptUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/yukiScript.json',
      charUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/yukiencryptchardb.json',
      cleanwordUpdate : 'https://raw.githubusercontent.com/YaninL/Override/master/cleanupword.json',
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
      ]
    },
    contentAddCopy : function () {
      if (NovelSetting.webElement.hasOwnProperty(Override.hostName)) {
        Override.removeProtection.removeProtectionWindow(window);
        Override.removeProtection.removeProtectionWindow(document);
        Override.removeProtection.removeCssProtection();
        if(Override.options.hideOptionMunu == false) {
          Override.optionMunu();
        }
        if (Override.helper.getValue('runScript') == false) return;
        var webElement = NovelSetting.webElement[Override.hostName];
        if (webElement.hasOwnProperty('remove')) {
          webElement.remove.remove();
        }
        if (webElement.hasOwnProperty('acceptPath')) {
          if (webElement.acceptPath.test(Override.pathName) == false) return;
        }
        if (NovelSetting.specialDecrypt.hasOwnProperty(Override.hostName)) {
          NovelSetting.specialDecrypt[Override.hostName]();
        }else if (Override.Script.hasOwnProperty(Override.hostName)) {
          eval(Override.helper.base64Decode(Override.Script[Override.hostName]));
        }else if (webElement.hasOwnProperty('specialDecrypt')) {
          NovelSetting.specialDecrypt[webElement.specialDecrypt]();
        }
        if (webElement.hasOwnProperty('doubleClickArea')) {
          if(webElement.doubleClickArea.length == 0 || webElement.contentArea.length == 0) {
            return;
          }else{
            Override.addDoubleClickEvent(webElement.doubleClickArea, webElement.contentArea);
          }
        }
      }
    },
    removeProtection : {
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
      GM_registerMenuCommand('Override update database', function(){Override.updateDB();})
    },
    optionMunu : function () {
      GM_addStyle(Override.scriptSetting.customCss.join('\n'));
      if(window.parent == window.self) {
      var menu = [
        '<div class="dropoverride"><div class="dropup">',
        '<button class="dropbtn">◆◇ yukiOverride ◇◆</button><div class="dropup-content">',
        '<div><input type="checkbox" id="saveFile" style=""' + (Override.helper.getValue('saveFile') ? ' checked':'') + '>Copy to file</div>',
        '<div><input type="checkbox" id="autoCopy"' + (Override.helper.getValue('autoCopy') ? ' checked':'') + '>Auto Copy</div>',
        '</div></div></div>'
      ];
      $('body').append(menu.join(''));
      $('#saveFile')[0].addEventListener('click', function(){Override.helper.setValue('saveFile', $('#saveFile')[0].checked);});
      $('#autoCopy')[0].addEventListener('click', function(){Override.helper.setValue('autoCopy', $('#autoCopy')[0].checked);});
      }
    },
    decryptValidation : function () {
      for (var i in NovelSetting.validationWord) {
        if(Override.novelDecrypt.indexOf(NovelSetting.validationWord[i]) == -1) return false;
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
      $('body').append('<div id="clipboard"></div>');
      if(Override.helper.getValue('addUri') && Override.hostName.indexOf('clubzap') == -1) {
        $('#clipboard').append(Override.helper.uriDocode(window.location)+ '<br>');
      }
      for(var i=0;i<target.length;i++) {
        var textContent = Override.cleanup(target[i].innerText).replace(/\n/g, '<br>');
        $('#clipboard').append(textContent);
        (i+1) < target.length ? $('#clipboard').append('<br><br>') : null;
        console.log(target[i]);
      }
      var selection = window.getSelection();
      selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents($('#clipboard')[0]);
      selection.removeAllRanges();
      setTimeout(function(){}, 50);
      selection.addRange(range);
      if(Override.helper.getValue('saveFile')) {
        var text = selection.toString();
        var filename = Override.getFilename(text.replace(/http.*/i, '').substring(0, 100));
        var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, filename);
      } else {
        GM_setClipboard();
        Override.helper.notification('คัดลอกเนื้อหาไปยังคลิปบอร์ดแล้ว', 3000);
      }
      $('#clipboard').remove();
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
      var regexCleanup = Object.entries(Override.options.cleanupWord.common);
      if(Override.options.cleanupWord.hasOwnProperty(Override.hostName)){
        Array.prototype.push.apply(regexCleanup, Object.entries(Override.options.cleanupWord[Override.hostName]));
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
        output += textline + '\r\n\r\n';
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
      return Override.helper.base64Decode($.isArray(s)? s.join('') : s).split('');
    },
    general : {
      windowLocation : function () {
        Override.helper.uriDocode(window.location)
      },
      addSourcetoHead : function () {
        $('head').prepend('<link href="' + window.location + '" rel="canonical"/>')
      },
      registerSettings : function () {
        for (var optionName in Override.scriptSetting.scriptOption) {
          if (Override.scriptSetting.scriptOption.hasOwnProperty(optionName)) {
            Override.options[optionName] = Override.helper.getValue(optionName) != null
              ? Override.helper.getValue(optionName) : Override.scriptSetting.scriptOption[optionName];
          }
        }
        if (Override.helper.getValue('DecryptChar') == null
            || Override.helper.getValue('cleanupWord') == null) {
          Override.updateDB();
        }
        Override.DecryptChar = Override.helper.getValue('DecryptChar');
        Override.Script = Override.helper.getValue('Script');
        Override.options.cleanupWord = Override.helper.getValue('cleanupWord');
      },
    },
    updateDB : function () {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: Override.scriptSetting.scriptUpdate + '?' + Date.now(),
        onload: function(response) {
          Override.helper.setValue('Script', JSON.parse(response.responseText));
          Override.helper.notification('Scripts has been update... ' + Override.Script.updatetime, 3000);
        }
      });
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: Override.scriptSetting.charUpdate + '?' + Date.now(),
        onload: function(response) {
          Override.helper.setValue('DecryptChar', JSON.parse(response.responseText));
          Override.helper.notification('Char has been update... ' + Override.DecryptChar.updatetime, 3000);
        }
      });
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: Override.scriptSetting.cleanwordUpdate + '?' + Date.now(),
        onload: function(response) {
          Override.helper.setValue('cleanupWord', JSON.parse(response.responseText));
          Override.general.registerSettings();
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

  $(document).ready(function() {
    Override.initialize();
  });

})();

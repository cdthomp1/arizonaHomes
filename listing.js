Appfolio = {
    Listing: function(config) {
      var defaultConfig = {
        height: 'auto',
        width: '100%',
        hostUrl: document.location.host,
        propertyGroup: null,
        themeColor: null,
        themeFont: null,
        defaultOrder: 'date_posted'
      };
  
      for (var key in config) {
        if ( config.hasOwnProperty( key ) && typeof config[key] != 'function' ) {
          defaultConfig[key] = config[key];
        }
      }
  
      var listingHost = '';
      if (defaultConfig.hostUrl == 'localhost:3000') {
        listingHost = 'http://localhost:5000';
      } else if (defaultConfig.hostUrl == 'localhost:44333') {
        listingHost = 'http://localhost:44335';
      } else {
        listingHost = (('https:' == document.location.protocol) ? 'https://' : 'http://') + defaultConfig.hostUrl + '/listings';
      }
  
      var listingUrl = listingHost + '?' + (new Date).getTime();
      if(defaultConfig.propertyGroup) {
        listingUrl += ("&" + escape("filters[property_list]") + "=" + escape(defaultConfig.propertyGroup));
      }
      if(defaultConfig.themeColor) {
        listingUrl += ("&" + escape("theme_color") + "=" + escape(defaultConfig.themeColor));
      }
      if(defaultConfig.themeFont) {
        listingUrl += ("&" + escape("theme_font") + "=" + escape(defaultConfig.themeFont));
      }
      if(defaultConfig.defaultOrder) {
        listingUrl += ("&" + escape("filters[order_by]") + "=" + escape(defaultConfig.defaultOrder))
      }
  
      var iFrameStyle = 'height:' + defaultConfig.height + ';width:' + defaultConfig.width + ';border:0';
  
      if (defaultConfig.height != 'auto') {
        document.write("<iframe src='" + listingUrl + "' style='" + iFrameStyle + "'> </iframe>");
      } else {
        var iFrameId = 'af_iframe_' + document.getElementsByTagName('iframe').length;
        listingUrl += ("&" + escape("iframe_id") + "=" + escape(iFrameId));
        document.write("<iframe src='" + listingUrl + "' style='" + iFrameStyle + "' id='" + iFrameId + "'> </iframe>");
      }
  
      addEventListenserToWindow();
    }
  };
  
  function addEventListenserToWindow() {
    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  
    // Listen to message from child window
    eventer(messageEvent, function (e) {
      var dataFromIframe = JSON.parse(e.data);
      var eventType = dataFromIframe.eventType;
      var eventData = dataFromIframe.data;
      var ifr = document.getElementById(dataFromIframe.iframe_id);
  
      if(eventType === 'new_height') {
        ifr.style.height = (eventData + 10) + 'px';
      }
      if(eventType === 'scrollToTop') {
        location.href = '#' + dataFromIframe.iframe_id;
      }
  
    }, false);
  }
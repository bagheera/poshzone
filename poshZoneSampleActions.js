///////////////////////////////////////////////////////////////////////////////////////////////
var flightsLookup = {
  description: "Lookup flights on myjavaserver.com",
  shortDescription: "FlightLookup",
  scope: {
    semantic: {
      "poshZone" : {
        custom: "allof ['poshEvent']['place'],['poshEvent']['date']"
      }
    }
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    if (semanticObjectType == "poshZone") {
      var customSpec = this.scope.semantic[semanticObjectType].custom;
      Firebug.Console.log('customSpec orig'+customSpec);
      var allof, anyof = false;
      if(! (customSpec.charAt[0] == '[')){
        Firebug.Console.log('not [');
        if(customSpec.match(/allof .*/i)) allof = true;
        if(customSpec.match(/anyof .*/i)) anyof = true;
        if(allof || anyof){
          Firebug.Console.log('customSpec bef'+customSpec);
          customSpec = customSpec.split(' ')[1];
          Firebug.Console.log('customSpec aft'+customSpec);
        }
        else {
          Firebug.Console.log('regex did not match');
          return;
        }
      }
      Firebug.Console.log('customSpec '+customSpec);
      var specs = customSpec.split(',');
      for each (spec in specs){//only allof for now
        Firebug.Console.log('spec iss '+ spec);
        try {
          if(!eval("Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode)"+spec))
            return;
        }catch (ex) {
          return;
        }
      }
      return "";
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "poshZone") {
        var poshContent = Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode);
        var lookup_to = poshContent['poshEvent']['place'];
        var lookup_from = prompt("Fly to "+lookup_to+" from?","Bangalore");
        var lookup_date = poshContent['poshEvent']['date'];
        return "http://www.myjavaserver.com/servlet/bagheera.travelsite.Flights?from="+lookup_from+"&to="+lookup_to+"&date="+lookup_date;
    }
  }//do action
};

SemanticActions.add("flightsLookup", flightsLookup);
///////////////////////////////////////////////////////////////////////////////////////////////
var expediaLookup = {
  description: "Lookup flights on expedia.co.uk",
  shortDescription: "ExpediaLookup",
  scope: {
    semantic: {
      "poshZone" : {
        custom: "['poshEvent']"
      }
    }
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    if (semanticObjectType == "poshZone") {
      try {
        if( !eval("Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode)"
            +this.scope.semantic[semanticObjectType].custom) )
          return;
      }catch (ex) {
        return;
        }
      return "";
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
    if (semanticObjectType == "poshZone") {
        var poshContent = Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode);
        var lookup_to = poshContent['poshEvent']['place'];
        var lookup_from = prompt("Fly to "+lookup_to+" from?","Manchester");
        var lookup_date = poshContent['poshEvent']['date'];
        return "http://www.expedia.co.uk/pub/agent.dll?qscr=fexp&flag=q&city1="+lookup_from+"&citd1="+lookup_to+"&date1="+lookup_date+"&date2="+lookup_date;//inseats
    }
  }//do action
};

SemanticActions.add("expediaLookup", expediaLookup);
///////////////////////////////////////////////////////////////////////////////////////////////////
var rentalq = {
  description: "Add to RentalQ on myjavaserver.com",
  shortDescription: "RentalQ",
    scope: {
      semantic: {
        "poshZone" : {
          custom: "['movie']['movieName']"
        }
    }
  },
  getActionName: function(semanticObject, semanticObjectType, propertyIndex) {
    if (semanticObjectType == "poshZone") {
      try {
        if( !eval("Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode)"
            +this.scope.semantic[semanticObjectType].custom) )
          return;
      }catch (ex) {
        return;
        }
      return "";
    }
  },
  doAction: function(semanticObject, semanticObjectType, propertyIndex, event) {
    //adopted from http://www.kaply.com/weblog/wp-content/uploads/2007/10/fpu.js
    if (semanticObjectType == "poshZone") {
			var poshContent = Microformats.poshZone.mapPoshZone(semanticObject.resolvedNode);
      var body = "subscriberId=user123&password=password&movieName=" + poshContent['movie']['movieName'] + "&movieYear=" + poshContent["movie"]['movieYear'];
      var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      var referrerURI = ios.newURI("http://www.myjavaserver.com/servlet/bagheera.movierentals.RentalQHomePage", null, null);
      var stringStream =  Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
      if ("data" in stringStream) // Gecko 1.9 or newer
        stringStream.data = body;
      else // 1.8 or older
        stringStream.setData(body, body.length);

      var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);
      postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
      postData.addContentLength = true;
      postData.setData(stringStream);

      if (event) {
          var rentalQurl = "http://www.myjavaserver.com/servlet/bagheera.movierentals.RentalQ";
          openUILink(rentalQurl, event, undefined, undefined, undefined, postData, referrerURI);
      } else {
        getBrowser().webNavigation.loadURI("http://www.myjavaserver.com/servlet/bagheera.movierentals.RentalQ", 0, referrerURI, postData, null);
          return true;
      }
    }
  }
};

SemanticActions.add("rentalq", rentalq);
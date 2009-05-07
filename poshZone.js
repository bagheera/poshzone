function poshZone(node) {
  if (node) {
    Microformats.parser.newMicroformat(this, node, "poshZone");
  }
}
poshZone.prototype.toString = function() {
	if(this.resolvedNode){
		return Microformats.poshZone.mapPoshZone(this.resolvedNode)['poshZoneDescription'];
	}
	return "could not resolve tostring for poshZone";
}
var poshZone_definition = {
  mfVersion: 0.8,
  mfObject: poshZone,
  className: "poshZone",
  properties: {
	"content": {
		virtual: true,
		virtualGetter: function(node, parentNode){
			return Microformats.poshZone.mapPoshZone(node);
		}
	}
  },//properties
		getSpans : function (node){
			return this.getChildren(node, 'span').
              concat(this.getChildren(node, 'h1')).
              concat(this.getChildren(node, 'h2')).
              concat(this.getChildren(node, 'h3')).
              concat(this.getChildren(node, 'h4')).
              concat(this.getChildren(node, 'h5')).
              concat(this.getChildren(node, 'h6')).
              concat(this.getChildren(node, 'a')).
              concat(this.getChildren(node, 'abbr')).
              concat(this.getChildren(node, 'code')).
              concat(this.getChildren(node, 'dfn')).
              concat(this.getChildren(node, 'em')).
              concat(this.getChildren(node, 'q')).
              concat(this.getChildren(node, 'cite')).
              concat(this.getChildren(node, 'p')).
              concat(this.getChildren(node, 'li')).
              concat(this.getChildren(node, 'dd')).
              concat(this.getChildren(node, 'dt'));
		},

		getDivs : function (node){
			return this.getChildren(node, 'div').
              concat(this.getChildren(node, 'pre')).
              concat(this.getChildren(node, 'ol')).
              concat(this.getChildren(node, 'ul')).
              concat(this.getChildren(node, 'dl'));
		},

		getChildren : function (node, name){
			var children = node.childNodes;
			var rtnVal = new Array();
			for(var i=0; i < children.length ; i++){
				if(new String(children[i].tagName).toLowerCase() == name) rtnVal.push(children[i]);
			}
			return rtnVal;
		},

		isListLike : function(nodeset){
      if (nodeset.length <= 1) return false;
      for(var i=1; i < nodeset.length; i++){
				if(nodeset[i].getAttribute('class') != nodeset[i-1].getAttribute('class')) return false;
			}
			return true;
		},

	mapPoshZone : function(node){
		var rtnMap = new Array();
		var spans = this.getSpans(node);
    var useList = this.isListLike(spans);
		for(var i=0; i < spans.length; i++){
      var classesOfSpan = spans[i].getAttribute('class');
      if(! classesOfSpan) continue;
      var classList = classesOfSpan.split(' ');
      var clazz;
      if(useList){
        for each (clazz in classList){
          if(! rtnMap[clazz]) rtnMap[clazz] = new Array();
          rtnMap[clazz].push(spans[i].innerHTML);
        }
      }
      else
        for each (clazz in classList){
  				rtnMap[clazz] = spans[i].innerHTML;
        }
    }
    var subDivs = this.getDivs(node);
		useList = this.isListLike(subDivs);
    for(i=0; i < subDivs.length; i++){
      var classesOfSubDiv = subDivs[i].getAttribute('class');
      if(! classesOfSubDiv) continue;
      var classList = classesOfSubDiv.split(' ');
      var clazz;
      if(useList){
        for each (clazz in classList){
          if(! rtnMap[clazz]) rtnMap[clazz] = new Array();
          rtnMap[clazz].push(this.mapPoshZone(subDivs[i]));
        }
      }else
        for each (clazz in classList){
          rtnMap[clazz] = this.mapPoshZone(subDivs[i]);
        }
    }
		return rtnMap;
	}

}//poshZone_definition

Microformats.add("poshZone", poshZone_definition);

//shows the serialized poshZone content node in an alert
var poshAction = {
  description: "Posh action debug",
  shortDescription: "PoshDbg",
  scope: {
    semantic: {
      "poshZone" :  {
        custom : "['poshZoneDescription']"
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
        alert("ex in getActionName "+ ex)
        return;
        }
      return "";
    }
  },
  doAction: function(semanticObject, semanticObjectType) {
   function serialize(map){
     var s = "";
     for( key in map ){
     	s += " , "; s += key; s += ' = ';
     	if( map[key] instanceof Array){
     		s += '{';
     		 s += serialize(map[key]);
     		 s +='}';
     	}else{
     		s += map[key];
     	}
     }//for
     return s;
   }//serialize

    if (semanticObjectType == "poshZone") {
    	var poshContent = semanticObject.content;
    	alert(serialize(poshContent));
    }
  }//do action
};

SemanticActions.add("poshAction", poshAction);

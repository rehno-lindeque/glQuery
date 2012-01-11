  // Walk the scene hierarchy in order to collect all scene paths that include the given selector in a leaf node
  var collectDrawPaths = function(selector) {
    if (selector.length == 0)
      return [];

    var recurse = function(paths, tagStack, selectorSet) {      
    };
    
    
    var selectorSet = selector.split(' '); // Note: selector set may contain empty tags that will be ignored
    for (var key in scenes) {
      var scene = scenes[key],
          i = 0;
      for (; i < selectorSet.length; ++i) {
        
      }
      if (i == 0) 
        paths.push([key]);
    }
  }


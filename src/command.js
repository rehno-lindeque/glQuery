  var command = {
    insert: 0,
    remove: 1,
    shaderProgram: 2,
    geometry: 3,
    vertexAttribBuffer: 4,
    vertexAttrib1: 5,
    vertexAttrib2: 6,
    vertexAttrib3: 7,
    vertexAttrib4: 8,
    vertices: 9,
    normals: 10,
    indices: 11,
    material: 12,
    light: 12
  },
  commandDispatch = [
    // insert: 0
    function(selector, args) {
      logDebug("dispatch command: insert");
    },
    // remove: 1
    function(selector, args) {
      logDebug("dispatch command: remove");
    },
    // shaderProgram: 2
    function(selector, args) {
      logDebug("dispatch command: shaderProgram");
      if (args.length > 0) {
        for (var i = 0; i < selector.length; ++i) {
          var commandsStruct = (typeof tagCommands[selector[i]] == 'undefined'? (tagCommands[selector[i]] = {}) : tagCommands[selector[i]]);
          commandsStruct[command.shaderProgram] = args;
        }
      }
      else {
        for (var i = 0; i < selector.length; ++i)
          if (typeof tagCommands[selector[i]] !== 'undefined')
            delete tagCommands[selector[i]][command.shaderProgram];
      }
    },
    // geometry: 3
    function(selector, args) {
      logDebug("dispatch command: geometry");
      if (args.length > 0) {
        for (var i = 0; i < selector.length; ++i) {
          var commandsStruct = (typeof tagCommands[selector[i]] == 'undefined'? (tagCommands[selector[i]] = {}) : tagCommands[selector[i]]);
          commandsStruct[command.geometry] = args[0];
        }
      }
      else {
        for (var i = 0; i < selector.length; ++i)
          if (typeof tagCommands[selector[i]] !== 'undefined')
            delete tagCommands[selector[i]][command.geometry];
      }
    },
    // vertexAttribBuffer: 4
    function(selector,args) {
      logDebug("dispatch command: vertexAttribBuffer");
      if (args.length > 1) {
        for (var i = 0; i < selector.length; ++i) {
          var commandsStruct = (typeof tagCommands[selector[i]] == 'undefined'? (tagCommands[selector[i]] = {}) : tagCommands[selector[i]]);
          commandsStruct[command.vertexAttribute] = args;
        }
      }
      else {
        for (var i = 0; i < selector.length; ++i)
          if (typeof tagCommands[selector[i]] !== 'undefined')
            delete tagCommands[selector[i]][command.vertexAttribute];
      }
    },
    // vertexAttrib1: 5
    function(selector,args) {
      logDebug("dispatch command: vertexAttrib1");
    },
    // vertexAttrib2: 6
    function(selector,args) {
      logDebug("dispatch command: vertexAttrib2");
    },
    // vertexAttrib3: 7
    function(selector,args) {
      logDebug("dispatch command: vertexAttrib3");
    },
    // vertexAttrib4: 8
    function(selector,args) {
      logDebug("dispatch command: vertexAttrib4");
    },

    /*// vertices: 5
    function(selector,args) {
      logDebug("dispatch command: vertices");
      /*if (args.length > 0) {
        for (var i = 0; i < selector.length; ++i) {
          var commandsStruct = (typeof tagCommands[selector[i]] == 'undefined'? (tagCommands[selector[i]] = {}) : tagCommands[selector[i]];
          // TODO: convert argument into a buffer object first... (if it isn't already)
          commandsStruct[command.vertices] = args[0];
        }
      }
      else {
        for (var i = 0; i < selector.length; ++i)
          if (typeof tagCommands[selector[i]] !== 'undefined')
            delete tagCommands[selector[i]][command.vertices];
      }* /
    },
    // normals: 6
    function(selector, args) {
      logDebug("dispatch command: normals");
    },
    // indices: 7
    function(selector, args) {
      logDebug("dispatch command: indices");
      /*if (args.length > 0) {
        for (var i = 0; i < selector.length; ++i) {
          var commandsStruct = (typeof tagCommands[selector[i]] == 'undefined'? (tagCommands[selector[i]] = {}) : tagCommands[selector[i]];
          // TODO: convert argument into a buffer object first... (if it isn't already)
          commandsStruct[command.indices] = args[0];
        }
      }
      else {
        for (var i = 0; i < selector.length; ++i)
          if (typeof tagCommands[selector[i]] !== 'undefined')
            delete tagCommands[selector[i]][command.indices];
      }* /
    },
    // material: 8
    function(selector, args) {
      logDebug("dispatch command: material");
    },
    // light: 9
    function(selector, args) {
      logDebug("dispatch command: light");
    }*/
  ];
  assert(commandDispatch.length == command.light + 1, "Internal Error: Number of commands in commandDispatch is incorrect.");
  
  // Execute a command taken from the queue
  var dispatchCommand = function(key, selector, commandArgs) {
    commandDispatch[key](selector, commandArgs);
  };
    
  // Append a command to the stream
  gl.command = function() {
    // TODO: consider what should be done if the command is 'insert' or 'remove'
    if (!assertNumberOfArguments(arguments, 1, 'command')) return gl;
    if (!assert(command[arguments[0]] != null, "Unknown command '" + command[arguments[0]] + "' used.")) return gl;
    commands.push(command[arguments[0]], (command[arguments[1]] != null? command[arguments[1]] : null), Array.prototype.slice.call(arguments, 2));
    return gl;
  };


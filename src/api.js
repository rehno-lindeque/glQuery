  // glQuery API
  // Note: According to https://developer.mozilla.org/en/JavaScript/Reference/Functions_and_function_scope/arguments
  //       arguments is not a proper Array object, so assume arguments.slice is not implemented.
  gl.fn = gl.prototype = {
    init: function() {
      //logDebug("init");
      this._selector = Array.prototype.slice.call(arguments);
      return this;
    },
    render: function(context) {
      //logDebug("render");
      if (!assertType(context, 'object', 'render', 'context')) return this;
      // TODO: assert that the context is a WebGL context specifically
      // Dispatch all commands waiting in the queue
      dispatchCommands(context, commands);
      // Update the state hashes for sorting commands
      // (It could theoretically be faster to update only the scenes that are needed for the selector)
      if (dirtyTags.length > 0) {
        updateDirtyHashes(dirtyTags);
        for (var key in scenes)
          updateSceneHashes(scenes[key]);
        dirtyTags.length = 0;
      }
      // Execute the WebGL commands associated with this selector
      var renderSubTree = function(renderState, node) {
        for (var key in node.hashes) {
          var objectCommandStacks = node.hashes[key];
          for (var i = 0; i < objectCommandStacks.length; ++i)
            evalCommands(context, renderState, objectCommandStacks[i]); 
        }
        /*for (var i = 0; i < node.length; ++i) {
          var n = node[i];
          if (typeof n !== 'string') {
            for (var key in n.hashes) {
              evalCommands(context, renderState, n.hashes[key]);
            }
          }
        }*/
      }
      var renderTraverse = function(renderState, node, selector) {
        for (var i = 0; i < node.length; ++i) {
          var n = node[i];
          if (typeof n !== 'string') {
            for (var key in n)
              if (containsAnyTags(key, this._selector))
                renderSubTree(renderState, n[key]);
              else
                renderTraverse(renderState, n[key], this._selector);
          }
        }
      };
      for (var key in scenes) {
        var renderState = new Array(commandEval.length);
        if (containsAnyTags(key, this._selector))
          renderSubTree(renderState, scenes[key]);
        else
          renderTraverse(renderState, scenes[key], this._selector);
      }
      // Flush WebGL commands
      // TODO: Do we need to flush the WebGL commands? (Perhaps later when rendering to textures for example)
      //context.flush();
      return this;
    },
    command: function() {
      // TODO: consider what should be done if the command is 'insert' or 'remove'
      if (!assertNumberOfArguments(arguments, 1, 'command')) return this;
      if (!assert(command[arguments[0]] != null, "Unknown command '" + command[arguments[0]] + "' used.")) return this;
      commands.push([command[arguments[0]], this._selector, Array.prototype.slice.call(arguments, 1)]);
      return this;
    },
    shaderProgram: function() {
      logDebug("shaderProgram");
      commands.push([command.shaderProgram, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    triangles: function() {
      logDebug("triangles");
      commands.push([command.geometry, this._selector, [gl.TRIANGLES]]);
      return this;
    },
    vertexAttrib: function() {
      logDebug("vertexAttrib");
      commands.push([command.vertexAttribBuffer, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    vertexElem: function() {
      logDebug("vertexElem");
      commands.push([command.vertexElem, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    indices: function() {
      logDebug("indices");
      commands.push([command.indices, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    vertices: function() {
      logDebug("vertices");
      commands.push([command.vertices, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    material: function() {
      logDebug("material");
      commands.push([command.material, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    },
    light: function() {
      logDebug("light");
      commands.push([command.light, this._selector, Array.prototype.slice.call(arguments)]);
      return this;
    }
  };

  // Create a dummy API which behaves like a stand-in builder object when the selector fails
  var apiDummy = {};
  for (var key in gl.fn) {
    apiDummy[key] = function() { return this; };
  };


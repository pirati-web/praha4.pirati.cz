L.Control.LayerSwitchButton = L.Control.extend({
  options: {
    position: 'bottomleft',
    title: 'Vrstvy',
    expanded: false,
    autoExpandTimeout: 6000,
    initialOrder: []
  },
  initialize: function (options) {
    this._button = {};
    if (options === undefined) {
      options = {};
    }
    options = this._mergeOptions(options);
    this.setButton(options);
    //drobna oprava...
    L.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;
    this._container = L.DomUtil.create('div', 'leaflet-control-button leaflet-bar layer-switcher-container'),
            this._update();
    return this._container;
  },

  onRemove: function (map) {
    this._button = {};
    this._update();
  },

  setButton: function (options) {
    var button = {
      'class': options.class,
      'expanded': options.expanded,
      'title': options.title,
      'autoExpandTimeout': options.autoExpandTimeout,
      'initialOrder': options.initialOrder,
      'order': [],
      'menuClass': (options.position == 'topright' || options.position == 'bottomright') ? 'lm-right' : ''
    };
    this._button = button;
    this._update();
  },
  _mergeOptions: function (options) {
    var result = options;
    for (var prop in this.options) {
      if (this.options.hasOwnProperty(prop) && !result.hasOwnProperty(prop)) {
        // Push each value from `obj` into `extended`
        result[prop] = this.options[prop];
      }
    }
    return result;
  },
  _update: function () {
    if (!this._map) {
      return;
    }

    this._container.innerHTML = '';
    this._makeButton(this._button);
  },

  _makeButton: function (button) {
    var eclass = '';
    if (button.expanded == true) {
      eclass = 'expanded';
    }
    var newButton = L.DomUtil.create('div', 'leaflet-buttons-control-button layers-menu-container ' + eclass + ' ' + button.class, this._container);
    newButton.innerHTML = '<div id="layersmenu" class="layers-menu-content ' + this._button.menuClass + '"></div>';
    newButton.title = button.title;
    newButton.target = button.target;
    newButton.setAttribute('id', 'layerSwitcher');

    expand = function (cntrl) {
      if ($("#layersmenu").hasClass('displayed')) {
        return;
      }
      var layersmenu = '';

      document.getElementById("layersmenu").innerHTML = layersmenu;
      var lcnt = 0;
      map.eachLayer(function (l) {
        if (typeof l.eachLayer === "function") {
          if (l.hasOwnProperty('options') && l.options.hasOwnProperty('layerName') && l.getLayers().length > 0) {
            layersmenu += '<div title="Přesunout vrstvu do popředí (pravým tlačítkem do pozadí)" layer-name="' + l.options.layerName + '" id="layer_' + L.stamp(l) + '" class="layers-menu-item switchLayersItem"><img src="/img/layers16.png"  id="layerimg_' + L.stamp(l) + '">' + l.options.layerName + '</div>';
            lcnt++;
          }
        }
      });
      layersmenu += '</div>';
      document.getElementById("layersmenu").innerHTML = layersmenu;
      if (L.Browser.ie) {
        $("#layersmenu").css("min-width", (lcnt * 5) + 'vw');
      }

      $("#layersmenu").addClass('displayed');
      if (cntrl !== null) {
        cntrl._reorder(null, false, null);
      } else {
        if (button.order.length == 0) {
          button.order = button.initialOrder;
        }
        if (button.order.length > 0) {
          var lname = button.order[0];
          if ($("#layersmenu").hasClass('displayed')) {
            $(".switchLayersItem").removeClass('last-front');
            $('.switchLayersItem[layer-name="' + lname + '"]').addClass('last-front');
          }
        }
      }
      return false;
    };
    onClick = function (e) {
      var self = this;
      L.DomEvent.stop(e);
      e.stopPropagation();
      var back = e.type === 'contextmenu';
      if (e.target.id == 'layerSwitcher') {
        if (back) {
          return;
        }
        if ($("#layerSwitcher").hasClass('expanded')) {
          $("#layerSwitcher").removeClass('expanded');
          $("#layersmenu").removeClass('displayed');
        } else {
          $("#layerSwitcher").addClass('expanded');
          expand(this);
        }
        return;
      }
      var lid = e.target.id.split("_")[1];
      var lname = e.target.getAttribute('layer-name');
      var l = map._layers[lid];
      if (typeof l.bringToFront === "function") {
        if (back) {
          l.bringToBack();
        } else {
          l.bringToFront();
        }
      } else {
        if (typeof l.eachLayer === "function") {
          l.eachLayer(function (cl) {
            if (typeof cl.bringToFront === "function") {
              if (back) {
                cl.bringToBack();
              } else {
                cl.bringToFront();
              }
            }
          });
        }
      }
      this._reorder(lname, back, self);

      return false;
    }
    L.DomEvent
            .addListener(newButton, 'click', onClick, this)
            .addListener(newButton, 'contextmenu', onClick, this);

    setTimeout(function () {
      if ($("#layerSwitcher").hasClass('expanded')) {
        self.expand(null);
      }
    }
    , button.autoExpandTimeout);
    return newButton;
  },
  _reorder: function (lname, isBack, self) {
    if (self === null) {
      self = this;
    }
    if (self._button.order.length == 0) {
      self._button.order = self._button.initialOrder;
    }
    if (lname !== null) {
      if (isBack) {
        if (self._button.order.indexOf(lname) < 0) {
          self._button.order.push(lname);
        } else {
          self._button.order.push(self._button.order.splice(self._button.order.indexOf(lname), 1)[0]);
        }
      } else {
        var first = lname;
        if (self._button.order.indexOf(first) < 0) {
          self._button.order.push(first);
        }
        self._button.order.sort(function (x, y) {
          return x == first ? -1 : y == first ? 1 : 0;
        });
      }
      //console.log(this._button.order);
    }
    if (this._button.order.length > 0) {
      lname = self._button.order[0];
    }
    if ($("#layersmenu").hasClass('displayed')) {
      $(".switchLayersItem").removeClass('last-front');
      $('.switchLayersItem[layer-name="' + lname + '"]').addClass('last-front');
    }
  }
});


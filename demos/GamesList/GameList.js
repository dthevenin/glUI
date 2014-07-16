/**
 * Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and 
 * contributors. All rights reserved
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

glui ('GamesList', ['core', 'class', 'data', 'ListItem'],
function (core, klass, Data, ListItem) {

var GamesList = klass.createClass ({

  /** parent class */
  parent: core.Application,
  
  applicationStarted : function (event) {
    this.buildList ();
  },
  
  buildList: function () {
    var size = this.size;
    
//    console.profile ("list");
    var l = Data.length;
    for (var i = 0; i < l * 10; i++) {
//    for (var i = 0; i < 1; i++) {
      var d = Data [i % l];

      var item = new ListItem ({
        size : [size[0], 70],
        position: [0, 70 * i]
      }).init ();
      this.list.add (item);
      item.configure (d);

      item.style.backgroundColor = new core.Color (240, 240, 240);
    }
//    console.profileEnd ("list");
    
    // refresh to for scroll udpate
    this.list.refresh ();
  }
});

return GamesList;

});
game.states.loading = {
  updating: 0,
  totalUpdate: 6, // values + language + ui + units + package + db
  build: function () {
    //this.box = $('<div>').addClass('box');   
    //this.h2 = $('<p>').appendTo(this.box).addClass('loadtext').html('<span class="loader loading"></span><span class="message">Updating: </span><span class="progress">0%</span>');
    //this.el.append(this.box);
    this.el = $('.state.loading').removeClass('hidden');
    this.h2 = $('.state.loading .loadtext');
    this.box = $('.state.loading .box');
  },
  start: function () {
    if (game.debug) game.states.loading.ping();
    game.states.loading.package();
    game.language.load(function loadLanguage() { //console.log('lang', game.states.loading.updating)
      game.states.loading.updated();
      game.states.loading.json('values', game.states.loading.updated);
      // trasnslate
      game.states.loading.dwjson('units', game.states.loading.updated);
      game.states.loading.json('ui', game.states.loading.updated, true);
      game.states.loading.battlejson(game.states.loading.updated);
    });
    game.states.loading.progress();
  },
  updated: function () { //console.trace(this)
    game.states.loading.updating += 1;
    game.states.loading.progress();
  },
  progress: function () {
    var loading = parseInt(game.states.loading.updating / game.states.loading.totalUpdate * 100);
    $('.progress').text(loading + '%');
    if (game.states.loading.updating >= game.states.loading.totalUpdate) {
      game.states.loading.finished();
    }
  },
  preloadimgs: ['map/bkg.jpg'],
  imgload: 0,
  finished: function () {
    game.states.loading.box.addClass('hidden');
    game.container.append(game.topbar).addClass('loaded');
    game.options.build();
    game.states.build( function () {
      //preloadimgs
      $.each(game.states.loading.preloadimgs, function () {
        $('<img>').attr('src', 'img/'+this).on('load', function () {
          game.states.loading.imgload++;
          if (game.states.loading.imgload == game.states.loading.preloadimgs.length) {
            game.states.table.el.addClass('loaded');
          }
        }).appendTo(game.hidden);
      });
      game.timeout(400, function () {
        game.screen.resize();
        game.options.opt.show();
        game.history.recover();
      });
    });
  },
  json: function (name, cb, translate) {
    var u = game.dynamicHost + 'json/' + name + '.json';
    if (translate) u = game.dynamicHost + 'json/' + game.language.dir + name + '.json';
    $.ajax({
      type: 'GET',
      url: u,
      complete: function (response) { //console.log(name, response, game.states.loading.updating)
        var data = JSON.parse(response.responseText);
        game.data[name] = data;
        if (cb) {
          cb(data);
        }
      }
    });
  },
  dwjson: function (name, cb, translate) {
    var host = 'https://api.drugwars.io/';
    var u = host + name;
    //if (translate) u = game.dynamicHost + 'json/' + game.language.dir + name + '.json';
    $.ajax({
      type: 'GET',
      url: u,
      complete: function (response) { //console.log(name, response, game.states.loading.updating)
        var data = JSON.parse(response.responseText);
        game.data[name] = game.states.loading.parseDw(data);
        //console.log('loaded '+name+' data', game.data[name])
        if (cb) {
          cb(game.data[name]);
        }
      }
    });
  },
  parseDw: function (data) {
    var parsed = {};
    parsed.npc = {};
    parsed.pc = {};
    for (var i in data) {
      var name = 'pc';
      if (data[i].npc) {
        name = 'npc';
      }
      parsed[name][i] = {};
      Object.assign(parsed[name][i], data[i]);
      parsed[name][i]['damage type'] = data[i].dmg_type;
      parsed[name][i].hp = data[i].health;

    }
    return parsed;
  },
  battlejson: function (cb) {

    game.mode = 'online';
    var u = 'https://dwtheapi.herokuapp.com/fight/eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJUazJRVFZCTUVJeE5FWkNNVEkxTmpOQ04wWkNOVVU0T1RFeE5rSXhSVFUyUlVRME5rTTFPUSJ9.eyJpc3MiOiJodHRwczovL2RydWd3YXJzLmF1dGgwLmNvbS8iLCJzdWIiOiJmYWNlYm9va3wxMDE1NzA2MjQxODA2OTcwOSIsImF1ZCI6WyJodHRwczovL2FwaS5kcnVnd2Fycy5pbyIsImh0dHBzOi8vZHJ1Z3dhcnMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU2OTUxODg1NywiZXhwIjoxNTY5NjA1MjU3LCJhenAiOiJWcHlpUUk0YUNRWXVEd3FCMlZFOUlKM0N4RmdZNWNhTyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.R3GYqn2j8hKNe6JEp7I9BXn3XGc_lfbQwJJmBOrBic6jn60EbUXC5ui-lgeyBEPrHOuPzY63Rc71qXuvy9jDSoOa4hG7d17OxFD6gTdo8x5UyLZGrhwCE45W0xrhaRZmVZbVOin9P--NZcljs7HwPQw-D1HhZm-WaaDO6p8F8UxJqdqXt0EIHn9XUWom5mS729QnzUHpQ-p4gkZ3v332_H_Os7XcqEg4ZhcBC864KidEpjHNCxYf7exVTBnKyKt_4tB-lXT-I9veBryyiJisTiVuZK1vU_tmZ09gNoi1qODpVqSktONfqp3P9ClY4_vdGw4SE5xTfrYeg0vs5yeHuA/f1449be7e09345589a8ca2fbae29e17b/7/0';
    $.ajax({
      type: 'GET',
      url: u,
      complete: function (response) { //console.log(name, response, game.states.loading.updating)*/
        var data = JSON.parse(response.responseText);
        //console.log(data)


        // units
        game.player.name = data.information[0].nickname;
        game.player.picks = [];
        
        game.enemy.name = data.information[0].ennemy_nickname;
        game.enemy.picks = ['hitman'];
        data.units.forEach(function (unitsData) {
          //console.log(unitsData)
          if (unitsData.units) {
            var units = JSON.parse(unitsData.units);
            units.attacker.units.forEach(function (unit) {
              //console.log(unit)
              game.player.picks.push(unit.key);
            });     
          }
        });
        //console.log('loaded player units', game.player.picks)
        if (cb) {
          cb(data);
        }
      }
    });
  },
  package: function () {
    $.ajax({
      type: 'GET',
      url: game.dynamicHost + 'package.json',
      complete: function (response) {
        game.states.loading.updated();
        var data = JSON.parse(response.responseText);
        $.each(data, function (name) {
          game[name] = this;
        });
      }
    });
  },
  ping: function (cb) {
    var start = new Date();
    $.ajax({
      type: 'GET',
      url: game.dynamicHost,
      complete: function (response) {
        game.ping = new Date() - start;
        if (response.readyState === 4 && location.host.search('localhost') < 0) {
          game.offline = false;
        } else { game.offline = true; }
        if (cb) { cb(); }
      }
    });
  }
};

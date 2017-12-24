function loadCity() {
    
    var city_data = save.getItem('city') || false;
    if (city_data) {
        // Load preexiting game data
        city = JSON.parse(city_data);
    }
    else {
        // New game, setup starter state
        // Player starts with a starter mine
        city[0]['mine'] = [];
        
        city[0]['biome'] = 'grassland';
        city[0]['tax_rate'] = 1;
        city[0]['timer'] = 60;
        city[0]['storage_cap'] = 100;
        city[0]['prospecting'] = false;
        city[0]['storage'] = { lumber: 0, stone: 0 };
        city[0]['citizen'] = {
            amount: 0,
            idle: 0,
            max: 0
        };
    }
    
    for (var i=0; i < city.length; i++) {
        var storages = $('<div id="storage' + i + '" class="storages d-flex"></div>');
        $('#storage_pane').append(storages);
        var structures = $('<div id="structures' + i + '" class="structures d-flex"></div>');
        $('#structures_pane').append(structures);
        var blueprints = $('<div id="blueprints' + i + '" class="blueprints d-flex"></div>');
        $('#blueprints_pane').append(blueprints);
        var mines = $('<div id="mines' + i + '" class="mines d-flex"></div>');
        $('#mines_pane').append(mines);
        loadCityStorage(i);
        loadCityCore(i);
        loadMines(i);
        loadInfoBar(i);
    }
}

function loadCityStorage(id) {
    vue['storage' + id] = new Vue({
        data: { store: city[id]['storage'] }
    });
    unwatch[id] = {};
    Object.keys(city[id]['storage']).forEach(function (res) {
        drawCityStorage(id,res);
    });
}

function drawCityStorage(id,res) {
    var container = $('<div class="row ' + res + '"></div>');
    var popover_content = '<a id="destroy' + id + res + '">Destroy ' + nameCase(res) + '</a>';
    var resource = $('<div class="col"></div>');
    var resource = $('<div class="col"><a id="pop' + id + res + '" tabindex="0" href="#" role="button" data-trigger="manual" data-toggle="popover">' + nameCase(res) + '</a></div>');
    var amount = $('<div class="col">' + city[id]['storage'][res] + '</div>');
    container.append(resource);
    container.append(amount);
    
    if (global['resource'][res] && global['resource'][res].manual && global['resource'][res].unlocked && id === 0) {
        var row2 = $('<div class="row"></div>');
        var clicker = $('<div class="progress col"></div>');
        var harvest = $('<div class="progress-bar-title">Gather</div>');
        var progress = $('<div id="' + res + 'ProgressBar" class="progress-bar progress-bar-striped bg-success" style="width:0%" role="progress-bar"></div>');
        clicker.append(progress);
        clicker.append(harvest);
        row2.append(clicker);
        
        var outer = $('<div class="row"></div>');
        var inner = $('<div class="container"></div>');
        inner.append(container);
        inner.append(row2);
        outer.append(inner);
        $('#storage' + id).append(outer);
        
        clicker.on('click',function(e){
            e.preventDefault();
            var bar = $('#' + res + 'ProgressBar');
            if (parseInt(bar.width()) > 0) {
                return false;
            }
            var width = 1;
            intervals[res] = setInterval(function() {
                if (width >= 100) {
                    clearInterval(intervals[res]);
                    delete intervals[res];
                    var yield = global['resource'][res]['yield'];
                    var storage_sum = Number(Object.keys(city[id]['storage']).length ? Object.values(city[id]['storage']).reduce((a, b) => a + b) : 0);
                    if (yield + storage_sum > city[0].storage_cap) {
                        yield = city[0].storage_cap - storage_sum;
                    }
                    city[0]['storage'][res] += yield;
                    storage_sum += yield;
                    $('#cityStorage' + id).html(storage_sum + ' / ' + city[id]['storage_cap']);
                    bar.width('0');
                } else {
                    width++; 
                    bar.width(width + '%');
                }
            }, gatherRateTable[global['resource'][res]['rate']]);
            
            return false;
        });
    }
    else {
        $('#storage' + id).append(container);
    }
    
    $('#pop' + id + res).popover({
        html: true,
        placement: 'top',
        content: function() {
            if (city[id]['trading_post'] && city[id]['trading_post'].workers > 0) {
                return $('<a href="#">Sell $' + global['resource'][res]['value'] + '/unit</a>').on('click',function(e){
                    if (city[id]['storage'][res] > 0) {
                        city[id]['storage'][res]--;
                        global['money'] += global['resource'][res]['value'];
                    }
                });
            }
            else {
                return $('<a href="#">Destroy</a>').on('click',function(e){
                    if (city[id]['storage'][res] > 0) {
                        city[id]['storage'][res]--;
                    }
                });
            }
        }
    });
    
    $('#pop' + id + res).click(function() {
        $(this).popover('toggle');
    });
    
    unwatch[id]['storage' + res] = vue['storage' + id].$watch('store.'+res, function (newValue, oldValue) {
        amount.html(newValue);
    });
}

function loadInfoBar(id) {
    var container = $('<div id="info' + id + '" class="row"></div>');
    var money = $('<div class="money col-2">$' + global['money'] + '</div>');
    container.append(money);
    
    var current = $('<div class="citizen col-3">Citizens: <span id="citizens' + id + '">' + city[id]['citizen']['amount'] + ' / ' + city[id]['citizen']['max'] + '</span></div>');
    var idle = $('<div class="citizen col-3">Idle: <span id="idleCitizens' + id + '">' + city[id]['citizen']['idle'] + '</span></div>');
    
    container.append(current);
    container.append(idle);
    
    var storage_sum = Number(Object.keys(city[id]['storage']).length ? Object.values(city[id]['storage']).reduce((a, b) => a + b) : 0);
    var store = $('<div class="store col">Storage <span id="cityStorage' + id + '">' + storage_sum + ' / ' + city[id]['storage_cap'] + '</span></div>');
    container.append(store);
    
    $('#city_info').append(container);
    
    var vm_cash = new Vue({
        data: global
    });
    vm_cash.$watch('money', function (newValue, oldValue) {
        money.html('$' + newValue);
    });
    
    var vm = new Vue({
        data: city[id]['citizen']
    });
    vm.$watch('amount', function (newValue, oldValue) {
        var dif = newValue - oldValue;
        city[id]['citizen']['idle'] += dif;
        $('#citizens' + id).html(city[id]['citizen']['amount'] + ' / ' + city[id]['citizen']['max']);
    });
    vm.$watch('idle', function (newValue, oldValue) {
        $('#idleCitizens' + id).html(city[id]['citizen']['idle']);
    });
    vm.$watch('max', function (newValue, oldValue) {
        $('#citizens' + id).html(city[id]['citizen']['amount'] + ' / ' + city[id]['citizen']['max']);
    });
}

// Loads all core city elements
function loadCityCore(id) {
    $('#structures'+id).empty();
    $('#blueprints'+id).empty();
    
    Object.keys(building).forEach(function (key) {
        if(building[key]['allow'].all || building[key]['allow'][city[id].biome]) {
            switch (building[key]['type']) {
                case 'mine':
                    // Mines are handled elsewhere, do nothing
                    break;
                case 'factory':
                    // Load factory type buildings
                    loadFactory(id,key);
                    break;
                case 'storage':
                    // Load storage type buildings
                    loadStorage(id,key);
                    break;
                case 'unique':
                    // Load unique type buildings
                    loadUnique(id,key);
                    break;
                default:
                    // Building type was not recognized, ignore it
                    break;
            }
        }
    });
}

// Adds factory type building to city
function loadFactory(id,factory) {
    if (city[id][factory]) {
        // Player has this building
        var rank = city[id][factory]['rank'];
        var title = building[factory]['rank'][rank]['description'];
        
        var structure = $('<div id="' + factory + id + '" class="city factory" title="' + title + '"></div>');
        var header = $('<div class="header row"><div class="col">' + building[factory]['rank'][rank]['name'] +'</div></div>');
        var workers = $('<div class="col"></div>');
        var remove = $('<span id="' + factory + id + 'RemoveWorker" class="remove">&laquo;</span>');
        var add = $('<span id="' + factory + id + 'AddWorker" class="add">&raquo;</span>');
        var count = $('<span id="' + factory + id + 'Workers" class="workers">' + city[id][factory]['workers'] + '/' + building[factory]['rank'][rank]['labor_cap'] + ' ' + jobs[building[factory]['rank'][rank]['labor']]['title'] + '</span>');
        
        structure.append(header);
        
        var count_foreman;
        if (global['overseer'] && building[factory]['rank'][rank]['foreman']) {
            var foreman = $('<div class="col"></div>');
            var remove_foreman = $('<span id="' + factory + id + 'RemoveForeman" class="remove">&laquo;</span>');
            var add_foreman = $('<span id="' + factory + id + 'AddForeman" class="add">&raquo;</span>');
            count_foreman = $('<span id="' + factory + id + 'Foreman" class="workers">' + city[id][factory]['foreman'] + '/1 ' + jobs['foreman']['title'] + '</span>');
            
            foreman.append(remove_foreman);
            foreman.append(count_foreman);
            foreman.append(add_foreman);
            structure.append(foreman);
        }
        
        workers.append(remove);
        workers.append(count);
        workers.append(add);
        structure.append(workers);
        
        $('#structures' + id).append(structure);
        
        if (global['overseer']) {
            $('#' + factory + id + 'RemoveForeman').on('click',function(e){
                e.preventDefault();
                
                if (Number(city[id][factory]['foreman']) > 0) {
                    city[id][factory]['foreman']--;
                    city[id]['citizen']['idle']++;
                    count_foreman.html(city[id][factory]['foreman'] + '/1 ' + jobs['foreman']['title']);
                }
            });
            
            $('#' + factory + id + 'AddForeman').on('click',function(e){
                e.preventDefault();
                
                if (Number(city[id]['citizen']['idle']) > 0 && city[id][factory]['foreman'] < 1) {
                    city[id][factory]['foreman']++;
                    city[id]['citizen']['idle']--;
                    count_foreman.html(city[id][factory]['foreman'] + '/1 ' + jobs['foreman']['title']);
                }
            });
        }
        
        $('#' + factory + id + 'RemoveWorker').on('click',function(e){
            e.preventDefault();
            
            if (Number(city[id][factory]['workers']) > 0) {
                city[id][factory]['workers']--;
                city[id]['citizen']['idle']++;
                count.html(city[id][factory]['workers'] + '/' + building[factory]['rank'][rank]['labor_cap'] + ' ' + jobs[building[factory]['rank'][rank]['labor']]['title']);
            }
        });
        
        $('#' + factory + id + 'AddWorker').on('click',function(e){
            e.preventDefault();
            
            if (Number(city[id]['citizen']['idle']) > 0 && city[id][factory]['workers'] < building[factory]['rank'][rank]['labor_cap']) {
                city[id][factory]['workers']++;
                city[id]['citizen']['idle']--;
                count.html(city[id][factory]['workers'] + '/' + building[factory]['rank'][rank]['labor_cap'] + ' ' + jobs[building[factory]['rank'][rank]['labor']]['title']);
            }
        });
    }
    else {
        // Player does not have this building
        if (checkRequirements(building[factory]['rank'][0].require)) {
            var title = building[factory]['rank'][0]['description'];
            var structure = $('<div id="' + factory + id + '" class="city blueprint" title="' + title + '"></div>');
            var header = $('<div class="header row"><div class="col build">Construct ' + building[factory]['rank'][0]['name'] +'</div></div>');
            structure.append(header);
            
            Object.keys(building[factory]['rank'][0]['cost']).forEach(function (cost) { 
                var row = $('<div class="row"></div>');
                if (cost === 'money') {
                    var price = $('<span class="cost col">$' + inflation(id,factory,building[factory]['rank'][0]['cost'][cost]) + '</span>');
                    row.append(price);
                }
                else {
                    var res = $('<span class="resource col">' + nameCase(cost) + '</span>');
                    var price = $('<span class="cost col">' + inflation(id,factory,building[factory]['rank'][0]['cost'][cost]) + '</span>');
                    row.append(res);
                    row.append(price);
                }
                structure.append(row);
            });
            
            $('#blueprints' + id).append(structure);
            
            structure.on('click',function(e){
                e.preventDefault();
                
                var paid = payBuildingCosts(id,factory,0);
                if (paid) {
                    city[id][factory] = {
                        rank: 0,
                        workers: 0,
                        foreman: 0
                    };
                    if (building[factory]['rank'][0].effect) {
                        building[factory]['rank'][0].effect(city[id],factory);
                    }
                    loadCityCore(id);
                }
            });
        }
    }
}

// Adds storage type building to city
function loadStorage(id,storage) {
    // Find newest plans
    var rank = -1;
    for (var i=0; i < building[storage]['rank'].length; i++) {
        if (checkRequirements(building[storage]['rank'][i].require)) {
            rank = i;
        }
        else {
            break;
        }
    }
    
    // Building not available yet
    if (rank === -1) {
        return;
    }
    
    // Get current number of constructed
    var owned = 0;
    if ( city[id][storage] ) {
        owned = city[id][storage]['owned'];
    }
    var title = building[storage]['rank'][rank]['description'];
    var buildable = true;
    if (building[storage]['rank'][rank]['limit']) {
        title = title + ' (Limit ' + building[storage]['rank'][rank]['limit'] +')';
        if (building[storage]['rank'][rank]['limit'] <= owned) {
            buildable = false;
        }
    }
    
    // Blueprint available
    if (buildable) {
        var structure = $('<div id="' + storage + id + '" class="city blueprint" title="' + title + '"></div>');
        var header = $('<div class="header row"><div class="col build">Construct ' + building[storage]['rank'][rank]['name'] + '</div></div>');
        structure.append(header);
        
        Object.keys(building[storage]['rank'][rank]['cost']).forEach(function (cost) { 
            var row = $('<div class="row"></div>');
            if (cost === 'money') {
                var price = $('<span class="cost col">$' + inflation(id,storage,building[storage]['rank'][0]['cost'][cost]) + '</span>');
                row.append(price);
            }
            else {
                var res = $('<span class="resource col">' + nameCase(cost) + '</span>');
                var price = $('<span class="cost col">' + inflation(id,storage,building[storage]['rank'][rank]['cost'][cost]) + '</span>');
                row.append(res);
                row.append(price);
            }
            structure.append(row);
        });
        
        $('#blueprints' + id).append(structure);
        
        structure.on('click',function(e){
            e.preventDefault();
            
            var paid = payBuildingCosts(id,storage,rank);
            if (paid) {
                var owned = 0;
                if (city[id][storage]) {
                    owned = city[id][storage]['owned'];
                }
                city[id][storage] = {
                    owned: owned + 1,
                    rank: rank
                };
                if (building[storage]['rank'][rank].effect) {
                    building[storage]['rank'][rank].effect(city[id],storage);
                }
                loadCityCore(id);
            }
        });
    }
    
    // Player has at least one of this building
    if (city[id][storage]) {
        var structure = $('<div id="' + storage + id + 'bp" class="city storage" title="' + title + '"></div>');
        var header = $('<div class="header row"><div class="col build">' + building[storage]['rank'][rank]['name'] + '</div></div>');
        structure.append(header);
        
        var owned = $('<div class="col">Constructed: ' + owned + '</div>');
        structure.append(owned);
        
        $('#structures' + id).append(structure);
    }
}

// Adds unique type building to city
function loadUnique(id,unique) {
    if (city[id][unique]) {
        // Player has this building
        var rank = city[id][unique]['rank'];
        var title = building[unique]['rank'][rank]['description'];
        
        var structure = $('<div id="' + unique + id + '" class="city unique" title="' + title + '"></div>');
        var header = $('<div class="header row"><div class="col">' + building[unique]['rank'][rank]['name'] +'</div></div>');
        structure.append(header);
        
        if (building[unique]['rank'][rank]['staff']) {
            var workers = $('<div class="col"></div>');
            var remove = $('<span id="' + unique + id + 'RemoveWorker" class="remove">&laquo;</span>');
            var add = $('<span id="' + unique + id + 'AddWorker" class="add">&raquo;</span>');
            var count = $('<span id="' + unique + id + 'Workers" class="workers">' + city[id][unique]['workers'] + '/' + building[unique]['rank'][rank]['labor_cap'] + ' ' + jobs[building[unique]['rank'][rank]['labor']]['title'] + '</span>');
            
            workers.append(remove);
            workers.append(count);
            workers.append(add);
            structure.append(workers);
            
            $('#structures' + id).append(structure);
            
            $('#' + unique + id + 'RemoveWorker').on('click',function(e){
                e.preventDefault();
                
                if (Number(city[id][unique]['workers']) > 0) {
                    city[id][unique]['workers']--;
                    city[id]['citizen']['idle']++;
                    count.html(city[id][unique]['workers'] + '/' + building[unique]['rank'][rank]['labor_cap'] + ' ' + jobs[building[unique]['rank'][rank]['labor']]['title']);
                }
            });
            
            $('#' + unique + id + 'AddWorker').on('click',function(e){
                e.preventDefault();
                
                if (Number(city[id]['citizen']['idle']) > 0 && city[id][unique]['workers'] < building[unique]['rank'][rank]['labor_cap']) {
                    city[id][unique]['workers']++;
                    city[id]['citizen']['idle']--;
                    count.html(city[id][unique]['workers'] + '/' + building[unique]['rank'][rank]['labor_cap'] + ' ' + jobs[building[unique]['rank'][rank]['labor']]['title']);
                }
            });
        }
        else {
            $('#structures' + id).append(structure);
        }
    }
    else {
        // Player does not have this building
        if (checkRequirements(building[unique]['rank'][0].require)) {
            var title = building[unique]['rank'][0]['description'];
            var structure = $('<div id="' + unique + id + '" class="city blueprint" title="' + title + '"></div>');
            var header = $('<div class="header row"><div class="col">Construct ' + building[unique]['rank'][0]['name'] +'</div></div>');
            structure.append(header);
            
            Object.keys(building[unique]['rank'][0]['cost']).forEach(function (cost) { 
                var row = $('<div class="row"></div>');
                if (cost === 'money') {
                    var price = $('<span class="cost col">$' + inflation(id,unique,building[unique]['rank'][0]['cost'][cost]) + '</span>');
                    row.append(price);
                }
                else {
                    var res = $('<span class="resource col">' + nameCase(cost) + '</span>');
                    var price = $('<span class="cost col">' + inflation(id,unique,building[unique]['rank'][0]['cost'][cost]) + '</span>');
                    row.append(res);
                    row.append(price);
                }
                structure.append(row);
            });
                
            $('#blueprints' + id).append(structure);
            
            structure.on('click',function(e){
                e.preventDefault();
                
                var paid = payBuildingCosts(id,unique,0);
                if (paid) {
                    if (building[unique]['rank'][0]['staff']) {
                        city[id][unique] = {
                            rank: 0,
                            workers: 0
                        };
                    }
                    else {
                        city[id][unique] = {
                            rank: 0
                        };
                    }
                    if (building[unique]['rank'][0].effect) {
                        building[unique]['rank'][0].effect(city[id],unique);
                    }
                    loadCityCore(id);
                }
            });
        }
    }
}

// Reloads all mines into UI
function loadMines(id) {
    $('#mines' + id).empty();
    
    // Load existing mines
    Object.keys(city[id]['mine']).forEach(function (key) {
        registerMine(id,city[id]['mine'][key]);
    });
    // Prospecting action
    if (global['survey']) {
        loadProspect(id);
    }
}

function loadProspect(id) {
    if (city[id]['prospecting_offer']) {
        var mineral = Object.keys(city[id].prospecting_offer).reduce(function(a, b){ return city[id].prospecting_offer[a] > city[id].prospecting_offer[b] ? a : b });
        var container = $('<div id="prospecting' + id + '" class="city prospect offer"></div>');
        var header = $('<div class="header row"><div class="col" id="prospecting' + id + 'title">Prospecting Complete</div></div>');
        container.append(header);
        var row = $('<div class="row"></div>');
        
        console.log(city[id].prospecting_offer);
        
        var prefix = '';
        if (city[id]['prospecting_offer'][mineral] > 50000) {
            prefix = 'Rich ';
        }
        else if (city[id]['prospecting_offer'][mineral] > 5000) {
            prefix = 'Adundent ';
        }
        else if (city[id]['prospecting_offer'][mineral] > 1000) {
            prefix = '';
        }
        else if (city[id]['prospecting_offer'][mineral] > 500) {
            prefix = 'Poor ';
        }
        else {
            prefix = 'Worthless ';
        }
        
        var type = $('<div class="col">' + prefix + nameCase(mineral) + ' Mine</div>');
        row.append(type);
        container.append(row);
        
        var cash_row = $('<div class="row"></div>');
        var cost = inflation(id,'mine',city[id]['mine'].length * 100);
        var cash_cost = $('<div class="col">$' + cost + '</div>');
        cash_row.append(cash_cost);
        container.append(cash_row);
        
        var lumber_row = $('<div class="row"></div>');
        var lumber_cost = inflation(id,'mine',(city[id]['mine'].length + 1) * 25);
        var lumber_col = $('<div class="col">Lumber</div><div class="col">' + lumber_cost + '</div>');
        lumber_row.append(lumber_col);
        container.append(lumber_row);
        
        var option_row = $('<div class="row"></div>');
        var discard_col = $('<div class="col"></div>');
        var construct_col = $('<div class="col"></div>');
        var discard = $('<button class="prospect">Abandon</button>');
        var construct = $('<button class="prospect">Build</button>');
        discard_col.append(discard);
        construct_col.append(construct);
        option_row.append(discard_col);
        option_row.append(construct_col);
        container.append(option_row);
        
        $('#mines' + id).append(container);
        
        discard.on('click',function(e){
            e.preventDefault();
            delete city[id].prospecting_offer;
            loadMines(id);
        });
        
        construct.on('click',function(e){
            e.preventDefault();
            
            console.log('build clicked');
            
            if (global['money'] >= cost && city[id]['storage']['lumber'] >= lumber_cost) {
                global['money'] -= cost;
                city[id]['storage']['lumber'] -= lumber_cost;
                
                console.log('build pay');
                
                var mine = {
                    id: 'mine' + global['next_id'],
                    name: nameCase(mineral) + ' Mine',
                    type: 'mine',
                    resources: city[id].prospecting_offer,
                    workers: 0,
                    rank: 0
                };
                
                city[id]['mine'].push(mine);
                
                global['next_id']++;
                delete city[id].prospecting_offer;;
                loadMines(id);
            }
        });
    }
    else {
        var container = $('<div id="prospecting' + id + '" class="city prospect"></div>');
        var header = $('<div class="header row"><div class="col" id="prospecting' + id + 'title">Prospect Land</div></div>');
        container.append(header);
        var price = 0;
        var row = $('<div class="row"></div>');
        if (global['next_id'] === 0) {
            var cost = $('<div class="col">$0</div>');
            row.append(cost);
        }
        else {
            price = inflation(id,'mine',(city[id]['mine'].length * 100));
            var cost = $('<div class="col">$' + price + '</div>');
            row.append(cost);
        }
        container.append(row);
        $('#mines' + id).append(container);
        
        container.on('click',function(e){
            e.preventDefault();
            
            if (city[id].prospecting === false && global['money'] >= price) {
                global['money'] -= price;
                city[id].prospecting = Math.ceil((city[id].mine.length + 1) * 15 * biomes[city[id].biome].cost);
                $('#prospecting' + id + 'title').html('Prospecting 0%');
            }
        });
    }
}

// Adds an individual mine to the UI
function registerMine(id,mine) {
    var container = $('<div id="' + mine['id'] + '" class="city mine"></div>');
    
    var header = $('<div class="header row"><div class="col">' + mine['name'] +'</div></div>');
    var workers = $('<div class="col"></div>');
    var remove = $('<span id="' + mine['id'] + 'RemoveWorker" class="remove">&laquo;</span>');
    var add = $('<span id="' + mine['id'] + 'AddWorker" class="add">&raquo;</span>');
    var count = $('<span id="' + mine['id'] + 'Workers" class="workers">' + mine['workers'] + '/' + building['mine']['rank'][mine['rank']]['labor_cap'] + ' Miners</span>');
    
    workers.append(remove);
    workers.append(count);
    workers.append(add);
    container.append(header);
    container.append(workers);
    
    $('#mines' + id).append(container);
    
    $('#' + mine['id'] + 'RemoveWorker').on('click',function(e){
        e.preventDefault();
        
        if (Number(mine['workers']) > 0) {
            mine['workers']--;
            city[id]['citizen']['idle']++;
        }
    });
    
    $('#' + mine['id'] + 'AddWorker').on('click',function(e){
        e.preventDefault();
        
        if (Number(city[id]['citizen']['idle']) > 0 && mine['workers'] < building['mine']['rank'][mine['rank']]['labor_cap']) {
            mine['workers']++;
            city[id]['citizen']['idle']--;
        }
    });
    
    var vm_w = new Vue({
        data: mine
    });
    
    unwatch[mine['id'] + 'workers'] = vm_w.$watch('workers', function (newValue, oldValue) {
        count.html(newValue + '/' + building['mine']['rank'][mine['rank']]['labor_cap'] + ' Miners');
    });
    
    var vm_r = new Vue({
        data: mine['resources']
    });
    
    var minerals = $('<div></div>');
    Object.keys(mine['resources']).forEach(function (mineral) {
        var row = $('<div class="row"></div>');
        var type = $('<span class="col">' + nameCase(mineral) + ' </span>');
        var remain = $('<span class="col" id="' + mine['id'] + mineral + '">' + mine['resources'][mineral] + '</span>');
        row.append(type);
        row.append(remain);
        
        unwatch[mine['id'] + mineral] = vm_r.$watch(mineral, function (newValue, oldValue) {
            remain.html(newValue);
        });
        
        container.append(row);
    });
}

function payBuildingCosts(id,build,rank) {
    var paid = true;
    Object.keys(building[build]['rank'][rank]['cost']).forEach(function (cost) {
        if (cost === 'money') {
            if (global['money'] < inflation(id,build,building[build]['rank'][0]['cost'][cost])) {
                paid = false;
                return;
            }
        }
        else if (city[id]['storage'][cost] < inflation(id,build,building[build]['rank'][rank]['cost'][cost])) {
            paid = false;
            return;
        }
    });
    if (paid) {
        Object.keys(building[build]['rank'][0]['cost']).forEach(function (cost) {
            if (cost === 'money') {
                global['money'] -= Number(inflation(id,build,building[build]['rank'][rank]['cost'][cost]));
            }
            else {
                city[id]['storage'][cost] -= Number(inflation(id,build,building[build]['rank'][rank]['cost'][cost]));
            }
        });
    }
    return paid;
}
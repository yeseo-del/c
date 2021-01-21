function defineTech() {
    
    // General Technological Level of the Empire
    research['tech'] = [ 
        {
            name: 'Simple Handtools',
            description: "Knowledge of how to construct simple hand tools. Congratulations on advancing to the cave man era, only a few million more years and you could learn to make fire.",
            cost: { 
                lumber: 1,
                stone: 1
            }
        },
        {
            name: 'Construction',
            description: "Knowledge of how to build basic structures. Your mom always knew you'd be special.",
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                $('#city_info').show();
                $('#city_menu').show();
                $('#sub_city').show();
            }
        },
        {
            name: 'Electricity',
            require: { minerals: 3, knowledge: 20 },
            description: 'Discover electricity and advance into a new era. No Elephants were sacrificed for this achievement.',
            cost: { 
                money: 0,
                copper: 0,
                coal: 0
            }
        },
        {
            name: 'Power Tools',
            require: { mining: 5, timber: 5 },
            description: 'Modern tools powered by electricity. More pragmantic then steam punk, but not as cool.',
            cost: { 
                money: 0,
                coal: 0,
                oil: 0,
                steel: 0
            }
        }
    ];
    
    research['economics'] = [ 
        {
            name: 'Basic Economics',
            require: { knowledge: 5 },
            description: 'Learn about how to manage an economy through money and trade. ',
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                $('#city_info .money').show();
            }
        },
        {
            name: 'Taxation',
            require: { knowledge: 8 },
            description: 'Develop a tax code, this makes all citizens with jobs automatically generate revenue each minute.',
            cost: { 
                money: 0
            }
        },
        {
            name: 'Production Quotas',
            require: { government: 1, overseer: 1, knowledge: 15 },
            description: "Learn about how to set production quotas set by city hall, so your citizens know when it's ok to slack off",
            cost: { 
                money: 0
            }
        },
        {
            name: 'Fast Tax Cycles',
            require: { knowledge: 30 },
            description: 'A good citizen enjoys doing their patriotic duty of paying their taxes, so do it twice as often.',
            cost: { 
                money: 0
            }
        },
        {
            name: 'Accounting',
            require: { education: 1 },
            description: 'Learn the fundamentals of accounting and how it can help you manage your assets.',
            cost: { 
                money: 0
            }
        }
    ];
    
    research['cartography'] = [ 
        {
            name: 'Basic Cartography',
            require: { tech: 1, knowledge: 2 },
            description: 'Learn how draw crude maps which help you navigate further from your camp.',
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                city[0].size = 3;
                city[0].scale = 40;
                loadCityMap(0);
            }
        },
        {
            name: 'Landmarks',
            require: { knowledge: 10 },
            description: 'Learn to draw better maps by using landmarks, this increases your zone of influence.',
            cost: { 
                money: 0,
                lumber: 1
            },
            effect: function () {
                city[0].size = 4;
                city[0].scale = 30;
                loadCityMap(0);
            }
        },
        {
            name: 'Compass',
            require: { knowledge: 32 },
            description: 'Invent the compass which lets you navigate further away without getting lost, increases the zone of influence of your capital.',
            cost: { 
                money: 0,
                iron: 0
            },
            effect: function () {
                city[0].size = 5;
                city[0].scale = 25;
                loadCityMap(0);
            }
        },
        {
            name: 'Star Charts',
            require: { astrology: 1, knowledge: 45 },
            description: 'Learn to make star charts which aid navigation, increases the zone of influence of your capital.',
            cost: { 
                money: 0
            },
            effect: function () {
                city[0].size = 6;
                city[0].scale = 20;
                loadCityMap(0);
            }
        }
    ];
    
    research['astrology'] = [
        {
            name: 'Astrology',
            require: { economics: 1, knowledge: 38 },
            description: 'Learn about celestial objects and how to track their movements.',
            cost: { 
                money: 0
            }
        }
    ];
    
    research['government'] = [
        {
            name: 'Oxymoron Hall',
            require: { economics: 1, knowledge: 10 },
            description: 'Learn how to form a functioning government with a city hall.',
            cost: {
                money: 0,
                lumber: 1,
                stone: 1,
                iron: 0
            }
        },
        {
            name: 'Tax Rates',
            require: { economics: 2, knowledge: 20 },
            description: 'Gain ability to set the tax rate in city hall. Sure to be popular with your subjects.',
            cost: {
                money: 0
            }
        },
        {
            name: 'Oppressive Taxes',
            require: { knowledge: 25 },
            description: "Unlocks oppressive taxes, you may not want to use this but it's always nice to have the option of taxing your citizens to death.",
            cost: { 
                money: 0
            }
        },
        {
            name: 'Extra Bureaucracy',
            require: { knowledge: 30 },
            description: 'The only thing better then bureaucracy is more bureaucracy. Increases the number of bureaucrats you can have.',
            cost: { 
                money: 0
            },
            effect: function () {
                building['city_hall']['rank'][0]['labor_cap'] = 5;
            }
        }
    ];
    
    research['overseer'] = [ 
        {
            name: 'Foreman',
            require: { knowledge: 10 },
            description: 'Learn how to oversee a factory with a foreman who boosts productivity.',
            cost: { 
                money: 0
            }
        },
        {
            name: 'Operations Manager',
            require: { economics: 2, knowledge: 28 },
            description: 'Learn how to manage a factory with a manager who automatically sells excess materials.',
            cost: { 
                money: 0
            }
        }
    ];
    
    research['status_reports'] = [
        {
            name: 'Labor Reports',
            require: { government: 1 },
            description: 'Get easy tooltip updates which help you keep informed about your labor distribution.',
            cost: { 
                money: 0
            },
            effect: function () {
                loadCityMap(0);
            }
        }
    ];
    
    research['survey'] = [
        {
            name: 'Prospecting',
            require: { economics: 1, knowledge: 10 },
            description: 'Learn how to survey land for potential mine locations.',
            cost: { 
                money: 0,
                lumber: 1,
                stone: 1
            }
        }
    ];
    
    research['expedition'] = [
        {
            name: 'Exploration',
            require: { survey: 1, knowledge: 30 },
            description: 'Learn the logistics of mounting an expedition to find new lands, and how to exploit them.',
            cost: { 
                money: 0
            },
            effect: function () {
                //$('#expedition_button').show();
            }
        }
    ];
    
    research['housing'] = [
        {
            name: 'Basic Housing',
            require: { tech: 2, knowledge: 5 },
            description: "Learn how to build artifical caves for citizens to live in. Marketing wants to call it a hut",
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                $('#city_info .citizen').show();
            }
        },
        {
            name: 'Efficient Housing',
            require: { minerals: 4, tech: 3, knowledge: 20 },
            description: 'Learn how to build apartment buildings for citizens.',
            cost: { 
                money: 0,
                steel: 0,
                cement: 0,
                copper: 0,
                lumber: 1
            }
        }
    ];
    
    research['warehouse'] = [
        {
            name: 'Storage Shed',
            require: { minerals: 2, tech: 2, knowledge: 5 },
            description: 'Learn how to build a simple shed to store materials.',
            cost: { 
                lumber: 1,
                stone: 1,
                iron: 01
            }
        },
        {
            name: 'Warehouse',
            require: { minerals: 4, tech: 3, knowledge: 24 },
            description: 'Learn how to build a large storage building.',
            cost: { 
                money: 0,
                cement: 0,
                lumber: 1,
                steel: 0
            }
        }
    ];
    
    research['packing'] = [ 
        {
            name: 'Efficient Packing',
            require: { warehouse: 1, knowledge: 12 },
            description: 'Learn how to get the most out of your storage by arranging things in neat piles instead of haphazardly tossing them in. Increasese storage gain from Sheds by 25%',
            cost: { 
                money: 0
            }
        },
        {
            name: 'Pallets',
            require: { warehouse: 2, knowledge: 28 },
            description: 'Learn how to more efficiently pack a warehouse by stacking things on pallets. Increasese storage gain from Warehouses by 25%',
            cost: { 
                money: 0
            }
        }
    ];
    
    research['farming'] = [
        {
            name: 'Farming',
            require: { housing: 1 },
            description: 'Learn the basics of farming.',
            cost: { 
                lumber: 1,
                stone: 1
            }
        },
        {
            name: 'Greenhouse',
            require: { knowledge: 20 },
            description: 'Learn about how a greenhouse can enhance your farm.',
            cost: { 
                lumber: 1,
                stone: 1,
                iron: 0
            }
        }
    ];
    
    research['smelting'] = [
        {
            name: 'Smelting',
            require: { tech: 1 },
            description: 'Learn how to build a blast furnace to smelt ore into usable metals.',
            cost: { 
                lumber: 1,
                stone: 1
            }
        }
    ];
    
    research['minerals'] = [
        {
            name: 'Copper Ore',
            require: { smelting: 1 },
            description: 'Learn how to extract and smelt copper ore.',
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                global.resource.copper.unlocked = 1;
                city[0]['storage']['copper'] = 0;
            }
        },
        {
            name: 'Iron Ore',
            require: { knowledge: 4 },
            description: 'Learn how to extract and smelt iron ore.',
            cost: { 
                lumber: 1,
                stone: 1,
                copper: 0
            },
            effect: function () {
                global.resource.iron.unlocked = 1;
                city[0]['storage']['iron'] = 0;
            }
        },
        {
            name: 'Coal Ore',
            require: { knowledge: 6 },
            description: 'Learn how to extract coal.',
            cost: { 
                lumber: 1,
                stone: 1,
                iron: 0
            },
            effect: function () {
                global.resource.coal.unlocked = 1;
                city[0]['storage']['coal'] = 0;
            }
        },
        {
            name: 'Steel Smelting',
            require: { knowledge: 8 },
            description: 'Learn how to turn iron and coal into steel.',
            cost: { 
                lumber: 1,
                coal: 1,
                iron: 0
            },
            effect: function () {
                global.resource.steel.unlocked = 1;
            }
        }
    ];
    
    // General technology related to mining
    research['mining'] = [
        {
            name: 'Stone Pickaxe',
            require: { tech: 1 },
            description: 'A crude pickaxe made from a stone head attached to a stick. Increases manual mining speed.',
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                global.resource.stone.rate = 2;
            }
        },
        {
            name: 'Copper Pickaxe',
            require: { minerals: 1 },
            description: 'A pickaxe made from a wooden shaft with a copper head. Increases manual mining speed.',
            cost: { 
                lumber: 1,
                copper: 0
            },
            effect: function () {
                global.resource.stone.rate = 3;
                global.resource.copper.rate = 2;
            }
        },
        {
            name: 'Iron Pickaxe',
            require: { minerals: 2 },
            description: 'A pickaxe made from a wooden shaft with an iron head. Increases manual mining speed.',
            cost: { 
                lumber: 1,
                iron: 0
            },
            effect: function () {
                global.resource.stone.rate = 4;
                global.resource.copper.rate = 3;
                global.resource.iron.rate = 2;
                global.resource.coal.rate = 2;
            }
        },
        {
            name: 'Steel Pickaxe',
            require: { minerals: 4 },
            description: 'A pickaxe made from a wooden shaft with a steel head. Increases manual mining speed.',
            cost: { 
                money: 0,
                lumber: 1,
                steel: 0
            },
            effect: function () {
                global.resource.stone.rate = 5;
                global.resource.copper.rate = 4;
                global.resource.iron.rate = 3;
                global.resource.coal.rate = 3;
            }
        },
        {
            name: 'Lightweight Pickaxe',
            description: 'A pickaxe made from an aluminium shaft with a steel head. Increases manual mining speed.',
            cost: { 
                money: 0,
                lumber: 1,
                aluminium: 0
            },
            effect: function () {
                global.resource.stone.rate = 6;
                global.resource.copper.rate = 5;
                global.resource.iron.rate = 4;
                global.resource.coal.rate = 4;
            }
        },
        {
            name: 'Jackhammer',
            require: { tech: 4 },
            description: 'Jackhammers drastically increases manual mining production.',
            cost: { 
                money: 0,
                oil: 0,
                aluminium: 0,
                steel: 0
            },
            effect: function () {
                global.resource.stone.rate = 7;
                global.resource.copper.rate = 6;
                global.resource.iron.rate = 5;
                global.resource.coal.rate = 5;
                global.resource.stone.yield = 2;
            }
        }
    ];
    
    // Lumberjacking tech
    research['timber'] = [
        {
            name: 'Stone Axe',
            require: { tech: 1 },
            description: 'A crude axe made from a stone head attached to a stick. Increases manual wood cutting speed.',
            cost: { 
                lumber: 1,
                stone: 1
            },
            effect: function () {
                global.resource.lumber.rate = 2;
            }
        },
        {
            name: 'Copper Axe',
            require: { minerals: 1 },
            description: 'An axe made from a wooden shaft with a copper head. Increases manual wood cutting speed.',
            cost: { 
                lumber: 1,
                copper: 0
            },
            effect: function () {
                global.resource.lumber.rate = 3;
            }
        },
        {
            name: 'Iron Axe',
            require: { minerals: 2 },
            description: 'An axe made from a wooden shaft with a copper head. Increases manual wood cutting speed.',
            cost: { 
                lumber: 1,
                iron: 0
            },
            effect: function () {
                global.resource.lumber.rate = 4;
            }
        },
        {
            name: 'Steel Axe',
            require: { minerals: 4 },
            description: 'An axe made from a wooden shaft with a copper head. Increases manual wood cutting speed.',
            cost: { 
                money: 0,
                lumber: 1,
                steel: 0
            },
            effect: function () {
                global.resource.lumber.rate = 5;
            }
        },
        {
            name: 'Crosscut Saw',
            description: 'The next evolution in cutting down trees, saws are more efficent then axes. Increases manual wood cutting speed.',
            cost: { 
                money: 0,
                lumber: 1,
                steel: 0
            },
            effect: function () {
                global.resource.lumber.rate = 6;
            }
        },
        {
            name: 'Bow Saw',
            description: 'A better saw with an aluminium frame. Increases manual wood cutting speed.',
            cost: { 
                money: 0,
                aluminium: 0,
                steel: 0
            },
            effect: function () {
                global.resource.lumber.rate = 7;
            }
        },
        {
            name: 'Chainsaw',
            require: { tech: 4 },
            description: 'A lean mean tree cutting machine, chainsaws are way better then manual saws. Increased manual lumber yield.',
            cost: { 
                money: 0,
                oil: 0,
                aluminium: 0,
                steel: 0
            },
            effect: function () {
                global.resource.lumber.yield = 2;
            }
        }
    ];
    
    research['education'] = [
        {
            name: 'Education',
            require: { knowledge: 30 },
            description: "What came first, the teacher or the pupil? We're not sure how the first educator came to be without an education either but this research aims to find out.",
            cost: { 
                money: 0
            }
        }
    ];
}

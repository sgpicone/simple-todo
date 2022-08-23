const moment = require("moment");
const fs = require('fs');
const tasks = require('./tasks.json');
const generators = require('./generators.json');


let today = new moment().add(6, 'months');

for (let gen of generators) {
    let genDuration = moment.duration(gen.recur);
    let lastGenerated = gen.lastGenerated ? new moment(gen.lastGenerated) : null;

    if (lastGenerated == null) {
        tasks.push({
            name: gen.name,
            dueDate: new moment().add(genDuration).toISOString(),
            done: false,
            dateCreated: new moment().toISOString()
        });
        gen.lastGenerated = new moment().toISOString();
    } else {
        let timeSinceLastGen = moment.duration(today.diff(lastGenerated));
        if(timeSinceLastGen.asMilliseconds() >= genDuration.asMilliseconds()) {
            tasks.push({
                name: gen.name,
                dueDate: new moment().add(genDuration).toISOString(),
                done: false,
                dateCreated: new moment().toISOString()
            });
        }
    }
}


fs.writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
fs.writeFileSync('./generators.json', JSON.stringify(generators, null, 2));
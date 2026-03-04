
const incidentRepository = require('../repository/incidentrepository');
const heroRepository = require('../repository/herorepository');

const makeError = (message, code) => {
    const err = new Error(message);
    err.code = code;
    return err;
};

const assignHero = async (incidentId, heroId) => {
    const hero = await heroRepository.findById(heroId);
    if (!hero) throw makeError('Bohater nie istnieje', 'NOT_FOUND');

    const incident = await incidentRepository.findById(incidentId);
    if (!incident) throw makeError('Incydent nie istnieje', 'NOT_FOUND');

    if (incident.status != 'open') throw makeError('Incydent nie jest otwarty', 'CONFLICT');
    if (hero.status != 'available') throw makeError('Bohater jest obecnie niedostępny', 'CONFLICT');
    if (incident.level === 'critical' && hero.power != 'flight' && hero.power != 'strength') throw makeError('Zły bohater na ten incydent', 'FORBIDDEN');

    await incidentRepository.assignHeroToIncident(incidentId, heroId);
    
    return {incidentId, heroId, status: 'assigned'};    
};



const resolve = async (incidentId) => {
    const incident = await incidentRepository.findById(incidentId);

    if (!incident) throw makeError('Incydent nie istnieje', 'NOT_FOUND');
    if (incident.status != 'assigned') throw makeError('Incydent nie jest przypisany', 'CONFLICT');

    await incidentRepository.resolveIncident(incidentId, incident.hero_id);

    return { incidentId, status: 'resolved' };
};
module.exports = { assignHero, resolve };
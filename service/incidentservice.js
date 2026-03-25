const { sequelize } = require('../db/models'); // Importujemy główną instancję bazy
const incidentRepository = require('../repository/incidentrepository');
const heroRepository = require('../repository/herorepository');

const makeError = (message, code) => {
    const err = new Error(message);
    err.code = code;
    return err;
};

const assignHero = async (incidentId, heroId) => {
    // Zarządzana transakcja Sequelize!
    return await sequelize.transaction(async (t) => {
        // Przekazujemy 't' do metod repozytorium
        const hero = await heroRepository.findById(heroId, t);
        if (!hero) throw makeError('Bohater nie istnieje', 'NOT_FOUND');

        const incident = await incidentRepository.findById(incidentId, t);
        if (!incident) throw makeError('Incydent nie istnieje', 'NOT_FOUND');

        // Logika biznesowa (warunki) zostaje w serwisie!
        if (incident.status !== 'open') throw makeError('Incydent nie jest otwarty', 'CONFLICT');
        if (hero.status !== 'available') throw makeError('Bohater jest obecnie niedostępny', 'CONFLICT');
        if (incident.level === 'critical' && hero.power !== 'flight' && hero.power !== 'strength') throw makeError('Zły bohater na ten incydent', 'FORBIDDEN');

        await incidentRepository.assignHeroToIncident(incidentId, heroId, t);
        
        return { incidentId, heroId, status: 'assigned' };    
    });
};

const resolve = async (incidentId) => {
    return await sequelize.transaction(async (t) => {
        const incident = await incidentRepository.findById(incidentId, t);
        if (!incident) throw makeError('Incydent nie istnieje', 'NOT_FOUND');
        if (incident.status !== 'assigned') throw makeError('Incydent nie jest przypisany', 'CONFLICT');

        await incidentRepository.resolveIncident(incidentId, incident.hero_id, t);

        return { incidentId, status: 'resolved' };
    });
};

module.exports = { assignHero, resolve };
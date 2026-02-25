
const incidentRepository = require('../repositories/incidentRepository');
const heroRepository = require('../repositories/heroRepository');

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

    if (incident.status != 'open') throw makeError('Incydent nie jest obslugiwany')

    if (hero.status != 'available') throw makeError('Bohater jest obecnie niedostępny')
    // 3. Jeśli level incydentu to 'critical', a moc (power) bohatera to NIE 'flight' i NIE 'strength', rzuć błąd 'FORBIDDEN' (np. 'Zbyt słaby bohater na ten incydent')
    if (incident.level === 'critical' && hero.power != 'flight' && hero.power != 'strength') throw makeError('Zły bohater na ten incydent')

    // --------------------------------------------------------

    // Miejsce na transakcję (dodamy w kolejnym kroku!)
    return "Walidacja zakończona sukcesem";
};

module.exports = { assignHero };
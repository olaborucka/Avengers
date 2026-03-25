const { Hero, Incident, sequelize } = require('../db/models');

const getStats = async () => {
    // Proste zliczanie całościowe
    const heroesTotal = await Hero.count();
    const incidentsTotal = await Incident.count();
    
    // Użycie sequelize.fn i group do agregacji statusów i mocy
    const heroesByStatus = await Hero.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true // Zwraca czysty obiekt JSON zamiast ciężkiej instancji modelu
    });
    
    const heroesByPower = await Hero.findAll({
        attributes: ['power', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['power'],
        raw: true
    });
    
    const incidentsByStatus = await Incident.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true
    });
    
    const incidentsByLevel = await Incident.findAll({
        attributes: ['level', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['level'],
        raw: true
    });

    // Średnia liczba misji
    const avgMissionsData = await Hero.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('missions_count')), 'avg']],
        raw: true
    });
    const avgMissions = avgMissionsData[0]?.avg || 0;

    // Średni czas rozwiązania incydentu w minutach
    const resolved = await Incident.findAll({
        where: { status: 'resolved' },
        attributes: ['assigned_at', 'resolved_at'],
        raw: true
    });
    
    let totalMinutes = 0;
    if (resolved.length > 0) {
        resolved.forEach(inc => {
            const diffMs = new Date(inc.resolved_at) - new Date(inc.assigned_at);
            totalMinutes += (diffMs / 1000 / 60);
        });
    }

    return {
        heroes: {
            total: heroesTotal,
            byStatus: heroesByStatus,
            byPower: heroesByPower,
            avgMissions: parseFloat(avgMissions).toFixed(2)
        },
        incidents: {
            total: incidentsTotal,
            byStatus: incidentsByStatus,
            byLevel: incidentsByLevel,
            avgResolutionTimeMinutes: resolved.length > 0 ? (totalMinutes / resolved.length).toFixed(2) : 0
        }
    };
};

module.exports = { getStats };
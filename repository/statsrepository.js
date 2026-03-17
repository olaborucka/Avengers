const db = require('../db/knex');

const getStats = async () => {
    // 1. Zliczenia ogólne i grupowanie API Knex.js
    const heroesTotal = await db('heroes').count('* as total').first();
    const incidentsTotal = await db('incidents').count('* as total').first();
    
    const heroesByStatus = await db('heroes').select('status').count('* as count').groupBy('status');
    const heroesByPower = await db('heroes').select('power').count('* as count').groupBy('power');
    
    const incidentsByStatus = await db('incidents').select('status').count('* as count').groupBy('status');
    const incidentsByLevel = await db('incidents').select('level').count('* as count').groupBy('level');

    // 2. Wymóg: średnia (.avg()) z Knexa (np. średnia liczba misji bohaterów)
    const avgMissions = await db('heroes').avg('missions_count as avg').first();

    // 3. Średni czas rozwiązania incydentu w minutach (liczone w JS, aby w 100% uniknąć zakazanego knex.raw)
    const resolved = await db('incidents').where({ status: 'resolved' }).whereNotNull('assigned_at').whereNotNull('resolved_at').select('assigned_at', 'resolved_at');
    
    let totalMinutes = 0;
    if (resolved.length > 0) {
        resolved.forEach(inc => {
            const diffMs = new Date(inc.resolved_at) - new Date(inc.assigned_at);
            totalMinutes += (diffMs / 1000 / 60);
        });
    }

    return {
        heroes: {
            total: parseInt(heroesTotal.total, 10),
            byStatus: heroesByStatus,
            byPower: heroesByPower,
            avgMissions: parseFloat(avgMissions.avg || 0).toFixed(2)
        },
        incidents: {
            total: parseInt(incidentsTotal.total, 10),
            byStatus: incidentsByStatus,
            byLevel: incidentsByLevel,
            avgResolutionTimeMinutes: resolved.length > 0 ? (totalMinutes / resolved.length).toFixed(2) : 0
        }
    };
};

module.exports = { getStats };
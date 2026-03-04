
const incidentRepository = require('../repository/incidentrepository');
const incidentService = require('../service/incidentservice');
const { handleError } = require('./herocontroller');

const getAll = async (req, res) => {
    try {
        const { level, status } = req.query;
        const incidents = await incidentRepository.findAll({ level, status });
        res.status(200).json({ data: incidents });
    } catch (err) {
        handleError(err, res);
    }
};

const create = async (req, res) => {
    try {
        const { location, level } = req.body;
        if (!location || !level) {
            return res.status(400).json({ 
                type: '/errors/bad-request', 
                status: 400, 
                detail: 'Brakuje lokalizacji lub poziomu incydentu' 
            });
        }
        
        const incident = await incidentRepository.create({ location, level });
        
        res.status(201).header('Location', `/api/v1/incidents/${incident.id}`).json({ data: incident });
        
    } catch (err) {
        handleError(err, res);
    }
};

const assign = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);
        const { heroId } = req.body;

        if (isNaN(incidentId) || !heroId) {
            return res.status(400).json({ 
                type: '/errors/bad-request', 
                status: 400, 
                detail: 'Brakuje identyfikatora incydentu lub identyfikatora bohatera' 
            });
        }

        const result = await incidentService.assignHero(incidentId, heroId);
        res.status(200).json({ data: result });
    } catch (err) {
        handleError(err, res);
    }
};

const resolve = async (req, res) => {
    try {
        const incidentId = parseInt(req.params.id, 10);

            if (isNaN(incidentId)) {
                return res.status(400).json({ 
                    type: '/errors/bad-request', 
                    status: 400,
                    detail: 'Nieprawidłowy identyfikator incydentu'
                });
            }
        const result = await incidentService.resolve(incidentId);
        res.status(200).json({ data: result });
        
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = { getAll, create, assign, resolve };
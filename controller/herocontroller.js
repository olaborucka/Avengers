
const heroRepository = require('../repository/herorepository');
const incidentRepository = require('../repository/incidentrepository');

const handleError = (err, res) => {

    const status = err.code === 'NOT_FOUND' ? 404 :
                   err.code === 'CONFLICT' ? 409 :
                   err.code === 'FORBIDDEN' ? 403 :
                   err.code === 'VALIDATION_ERROR' ? 422 : 500;

    const type = err.code ? err.code.toLowerCase() : 'internal';
    if (status === 500) console.error(err);

    res.status(status).type('application/problem+json').json({
        type: `/errors/${type}`,
        title: err.code || 'Internal Error',
        status: status,
        detail: status === 500 ? 'Błąd wewnętrzny serwera' : err.message
    });
};

const getAll = async (req, res) => {
    try {
        const { status, power, sort, page, pageSize } = req.query;
        // Przekazujemy nowe parametry do repozytorium
        const result = await heroRepository.findAll({ status, power, sort, page, pageSize });

        res.status(200).json(result);
    } catch (err) {
        handleError(err, res);
    }
};

const create = async (req, res) => {
    try {
        const { name, power } = req.body;
        if (!name || !power) {
            return res.status(400).json({ 
                type: '/errors/bad-request', 
                status: 400, 
                detail: 'Brak imienia lub mocy' 
            });
        }
        
        const hero = await heroRepository.create({ name, power });
        
        res.status(201).header('Location', `/api/v1/heroes/${hero.id}`).json({ data: hero });
        
    } catch (err) {
        handleError(err, res);
    }
};

const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ type: '/errors/bad-request', status: 400, detail: 'Złe ID' });
        
        const hero = await heroRepository.findById(id);
        if (!hero) return res.status(404).json({ type: '/errors/not-found', status: 404, detail: 'Bohater nie istnieje' });

        const updated = await heroRepository.update(id, req.body);
        res.status(200).json({ data: updated });
    } catch (err) { handleError(err, res); }
};

const getIncidents = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ type: '/errors/bad-request', status: 400, detail: 'Złe ID' });

        const hero = await heroRepository.findById(id);
        if (!hero) return res.status(404).json({ type: '/errors/not-found', status: 404, detail: 'Bohater nie istnieje' });

        const { page, pageSize } = req.query;
        const result = await incidentRepository.findByHeroId(id, { page, pageSize });
        res.status(200).json(result);
    } catch (err) { handleError(err, res); }
};

// ZMIEŃ OSTATNIĄ LINIJKĘ NA TĘ:
module.exports = { getAll, create, handleError, update, getIncidents };

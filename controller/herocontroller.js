
const heroRepository = require('../repository/herorepository');

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
        const { status, power } = req.query;
        const heroes = await heroRepository.findAll({ status, power });

        res.status(200).json({ data: heroes });
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

module.exports = { getAll, create, handleError }; // Eksportujemy też handleError, przyda się do incydentów!
import pool from "../db.js"; // ✅ Importación sin destructuring

export const getQuestions = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM questions');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getQuestion = async (req, res) => {
    try {
        const { question_id } = req.params;

        const { rows } = await pool.query('SELECT * FROM questions WHERE id = $1', [question_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pregunta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const createQuestion = async (req, res) => {
    try {
        const { form_id, question_text } = req.body;

        if (!form_id || !question_text) {
            return res.status(400).json({
                success: false,
                message: 'El ID del formulario y el texto de la pregunta son obligatorios'
            });
        }

        // Validar que el formulario asociado exista
        const formCheck = await pool.query('SELECT * FROM forms WHERE form_id = $1', [form_id]);
        if (formCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El formulario asociado no existe'
            });
        }

        const { rows } = await pool.query(
            `INSERT INTO questions (form_id, question_text) 
             VALUES ($1, $2) RETURNING *`,
            [form_id, question_text]
        );

        res.status(201).json({
            success: true,
            message: 'Pregunta creada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al crear pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const editQuestion = async (req, res) => {
    try {
        const { question_id } = req.params;
        const { question_text } = req.body;

        const { rowCount, rows } = await pool.query(
            `UPDATE questions SET question_text = COALESCE($1, question_text) WHERE id = $2 RETURNING *`,
            [question_text, question_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pregunta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pregunta actualizada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { question_id } = req.params;

        const { rowCount } = await pool.query(
            'DELETE FROM questions WHERE id = $1',
            [question_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pregunta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pregunta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

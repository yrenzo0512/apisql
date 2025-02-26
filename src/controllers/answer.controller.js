import pool from "../db.js"; // ✅ Importación sin destructuring


export const getanswers = async(req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM answer_choices');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener los answer: ', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
        
    }
};

export const getanswer = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;

        // Validar que answer_choice_id sea un número
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El ID debe ser un número válido'
            });
        }

        const { rows } = await pool.query('SELECT * FROM answer_choices WHERE answer_choice_id = $1', [answer_choice_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al answer:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const createAnswer = async (req, res) => {
    try {
        const { response_id, question_id, answer_text, option_id } = req.body;

        // Validar que los datos no estén vacíos
        if (!response_id || !question_id || (!answer_text && !option_id)) {
            return res.status(400).json({
                success: false,
                message: 'response_id y question_id son obligatorios. Debes ingresar answer_text o option_id'
            });
        }

        // Verificar si response_id existe en responses
        const responseCheck = await pool.query('SELECT * FROM responses WHERE response_id = $1', [response_id]);
        if (responseCheck.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'response_id no válido' });
        }

        // Verificar si question_id existe en questions
        const questionCheck = await pool.query('SELECT * FROM questions WHERE question_id = $1', [question_id]);
        if (questionCheck.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'question_id no válido' });
        }

        // Si option_id fue enviado, verificar que exista en options
        if (option_id) {
            const optionCheck = await pool.query('SELECT * FROM options WHERE option_id = $1', [option_id]);
            if (optionCheck.rows.length === 0) {
                return res.status(400).json({ success: false, message: 'option_id no válido' });
            }
        }

        // Insertar la respuesta en la base de datos
        const { rows } = await pool.query(
            `INSERT INTO answers (response_id, question_id, answer_text, option_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [response_id, question_id, answer_text, option_id]
        );

        res.status(201).json({
            success: true,
            message: 'Respuesta registrada exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al registrar respuesta:', error);

        // Manejo de errores específicos
        if (error.code === '23505') { // Código de error de PostgreSQL para valores duplicados
            return res.status(409).json({
                success: false,
                message: 'Error: Respuesta duplicada'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};


export const deleteanswer = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;

        // Validar que answer_choice_id sea un número
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El answer id debe ser un número válido'
            });
        }

        // Intentar eliminar el usuario
        const { rowCount, rows } = await pool.query(
            'DELETE FROM answer_choices WHERE id = $1 RETURNING *',
            [answer_choice_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente',
            data: rows[0] // Devolvemos el usuario eliminado para confirmación
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const editanswer = async (req, res) => {
    try {
        const { answer_choice_id } = req.params;
        const data = req.body;

        // Validar que answer_choice_id sea un número válido
        if (isNaN(answer_choice_id)) {
            return res.status(400).json({
                success: false,
                message: 'El answer_choice_id debe ser un número válido'
            });
        }

        // Validar que los datos no estén vacíos
        if (!data.name || !data.email) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y el correo electrónico son obligatorios'
            });
        }

        // Intentar actualizar el usuario
        const { rowCount, rows } = await pool.query(
            'UPDATE answer_choices SET response_id = $1, question_id = $2, option_id = $3 WHERE answer_choice_id = $3 RETURNING *',
            [data.response_id, data.question_id,data.option_id, answer_choice_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
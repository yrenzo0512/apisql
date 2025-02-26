import pool from "../db.js"; // ✅ Importación sin destructuring


export const getForms = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM forms');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener formularios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getForm = async (req, res) => {
    try {
        const { form_id } = req.params;

        const { rows } = await pool.query('SELECT * FROM forms WHERE id = $1', [form_id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Formulario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener formulario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const createForm = async (req, res) => {
    try {
        const { title, description, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({
                success: false,
                message: 'El título y el ID del usuario son obligatorios'
            });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario no existe'
            });
        }

        const { rows } = await pool.query(
            `INSERT INTO forms (title, description, user_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [title, description, user_id]
        );

        res.status(201).json({
            success: true,
            message: 'Formulario creado exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al crear formulario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const editForm = async (req, res) => {
    try {
        const { form_id } = req.params;
        const { title, description } = req.body;

        const { rowCount, rows } = await pool.query(
            `UPDATE forms SET title = COALESCE($1, title), 
                    description = COALESCE($2, description) 
             WHERE id = $3 RETURNING *`,
            [title, description, form_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Formulario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formulario actualizado exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar formulario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const deleteForm = async (req, res) => {
    try {
        const { form_id } = req.params;

        const { rowCount } = await pool.query(
            'DELETE FROM forms WHERE id = $1',
            [form_id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Formulario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formulario eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar formulario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};



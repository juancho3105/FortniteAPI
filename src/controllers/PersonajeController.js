import mongoose from "mongoose";
import * as fs from "fs";

const PersonajeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    img: String,
    season: String,
    location: String,
    gun: String
}, { versionKey: false });

const PersonajeModel = new mongoose.model('personajes', PersonajeSchema);

export const getPersonajes = async (req, res) => {
    try {
        const { id } = req.params
        const rows = (id === undefined)
            ? await PersonajeModel.find()
            : await PersonajeModel.findById(id);
        return res.status(200).json({ status: true, data: rows });
    } catch (err) {
        return res.status(500).json({ status: false, errors: [err] });
    }
}

export const addPersonaje = async (req, res) => {
    try {
        const { name, season, location, gun } = req.body
        const validate = verifyData(name, season, location, gun, req.file, 'Y')
        if (validate == '') {
            const newPersonaje = new PersonajeModel({
                name: name, season: season, location: location, gun: gun,
                img: /uploads/ + req.file.filename
            })
            return await newPersonaje.save().then(() => {
                res.status(200).json({ status: true, messages: 'success' })
            })
        } else {
            return res.status(400).json({ status: false, errors: validate });
        }
    } catch (err) {
        return res.status(500).json({ status: false, errors: [err.message] })
    }
}

export const editPersonaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, season, location, gun } = req.body

        let imagen = ''
        let data = { name: name, season: season, location: location, gun: gun }

        if (req.file != null) {
            imagen = '/uploads/' + req.file.filename
            data = { name: name, season: season, location: location, img: imagen, gun: gun }
            await deleteImage(id)
        }

        const validate = verifyData(name, season, location, gun)
        if (validate == '') {
            await PersonajeModel.updateOne({ _id: id }, { $set: data })
            return res.status(200).json({ status: true, message: 'Personaje Actualizado' })
        } else {
            return res.status(400).json({ status: false, errors: validate });
        }
    } catch (err) {
        return res.status(500).json({ status: false, errors: [err.message] })
    }
}

export const deletePersonaje = async (req, res) => {
    try {
        const { id } = req.params
        await deleteImage(id)
        await PersonajeModel.deleteOne({ _id: id })
        return res.status(200).json({ status: true, message: 'Personaje Eliminado' })
    } catch (error) {
        return res.status(500).json({ status: false, errors: [err.message] })
    }
}

const verifyData = (nameP, season, location, gun, image, blnOK) => {
    let errors = []
    if (nameP === undefined || nameP.trim() === '') {
        errors.push('El nombre del personaje NO puede ser vacío')
    }
    if (season === undefined || season.trim() === '') {
        errors.push('La temporada del personaje NO puede ser vacío')
    }
    if (location === undefined || location.trim() === '') {
        errors.push('La ubicación del personaje NO puede ser vacío')
    }
    if (gun === undefined || gun.trim() === '') {
        errors.push('El arma del personaje NO puede ser vacío')
    }
    if (blnOK === 'Y' && image === undefined) {
        errors.push('Agrega una imagen para el personaje en formato JPG o PNG')
    } else {
        if (errors != '') {
            fs.unlinkSync('./public/uploads/' + image.filename)
        }
    }
    return errors
}

const deleteImage = async (id) => {
    const personaje = await PersonajeModel.findById(id)
    const img = personaje.img
    fs.unlinkSync('./public/' + img)
}

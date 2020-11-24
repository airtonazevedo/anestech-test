import express from 'express';
import api from './api.js';
import * as yup from 'yup';
import moment from 'moment';
const routes = express.Router();

routes.post('/pacientes', async (req, res) => {

  try {

    /*
    let schema = yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        cpf: yup.string().required().length(14),
        email: yup.string().email(),
        gender_id: yup.number().min(1).max(2).integer(),
        marital_status_id: yup.number().min(1).max(6).integer(),
        birth_date: yup.date().required()
      })
    )

    const validate = await schema.validate(req.body);
*/
    const responses = req.body.map(async paciente => {
      console.log(paciente)
      try {

        const response = await api.post('patients/', paciente);
        return response.data;
      } catch (err) {
        return false;
      }
    })
    console.log(responses)
    const resolves = await Promise.all(responses);
    res.send(resolves);
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }

})


routes.post('/convenios', async (req, res) => {

  try {
    req.body.document = req.body.document.replace(/[^\d]+/g, '');
    let schema = yup.object().shape({
      name: yup.string().required(),
      document: yup.string().required().length(14),
      email: yup.string().email(),
    });

    const validate = await schema.validate(req.body);
    req.body.medical_plan_table_id = 11;
    req.body.active = true;

    const response = await api.post('medical_plans/', req.body);
    res.send(response.data);
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }

})

routes.get('/procedimentos', async (req, res) => {
  moment.locale('pt-br');
  try {
    if (req.query.updated_after) {
      if (req.query.updated_after.indexOf('/') >= 0)
        req.query.updated_after = moment(req.query.updated_after, 'DD/MM/YYYY').format('YYYY-MM-DD');

      if (!moment(req.query.updated_after).isValid())
        throw new Error({ updated_after: 'data invalida' });
    }
    console.log(req.query.updated_after);
    const response = await api.get('surgical_procedures/', { params: { updated_after: req.query.updated_after } });
    res.send(response.data);
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }

})



routes.post('/agendamentos', async (req, res) => {

  try {

    let schema = yup.object().shape({
      patient_id: yup.number().required(),
      pre_probable_date: yup.date().required(),
      patient_age: yup.number(),
      patient_height: yup.number(),
      procedure_medical_plans: yup.array().of(
        yup.object().shape({
          medical_plan_id: yup.number(),
          laterality_procedures: yup.array().of(
            yup.object().shape({
              surgical_procedure_id: yup.number()
            })
          )
        })
      )
    });

    const validate = await schema.validate(req.body);
    req.body.active = true;


    const response = await api.post('pre_anesthetics/', req.body);
    res.send(response.data);
  } catch (err) {
    console.log(err?.response?.data.errors[0].fields);
    res.status(400).send(err)
  }

})

routes.get('/agendamentos', async (req, res) => {

  try {

    const response = await api.get('pre_anesthetics/');
    res.send(response.data);
  } catch (err) {
    console.log(JSON.stringify(err.response.data));
    res.status(400).send(err);
  }

})


export default routes;

/**
 * Module dependencies
 */
const Joi = require('joi');

/**
 * User Data Schema
 */
const TasksSchema = Joi.object().keys({
  title: Joi.string().trim().default('').required(),
  description: Joi.string().default('').required(),
  user: Joi.string().trim().default(''),
});

module.exports = {
  Task: TasksSchema,
};
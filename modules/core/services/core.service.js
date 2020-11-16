/**
 * Module dependencies
 */
const axios = require('axios');
const path = require('path');
const _ = require('lodash');
const base64 = require('js-base64').Base64;

const UserService = require(path.resolve('./modules/users/services/user.service'));
const config = require(path.resolve('./config'));
const CoreRepository = require('../repositories/core.repository');

/**
 * @desc Function to get all versions
 * @return {Promise} All versions
 */
exports.releases = async () => {
  const requests = config.repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/releases`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  let results = await axios.all(requests);
  results = results.map((result, i) => ({
    title: config.repos[i].title,
    list: result.data.map((release) => ({
      name: release.name,
      prerelease: release.prerelease,
      published_at: release.published_at,
    })),
  }));
  return Promise.resolve(results);
};

/**
 * @desc Function to get all changelogs
 * @return {Promise} All changelogs
 */
exports.changelogs = async () => {
  const repos = _.filter(config.repos, (repo) => repo.changelog);
  const requests = repos.map((item) => axios.get(`https://api.github.com/repos/${item.owner}/${item.repo}/contents/${item.changelog}`, {
    headers: item.token ? { Authorization: `token ${item.token}` } : {},
  }));
  let results = await axios.all(requests);
  results = results.map((result, i) => ({
    title: config.repos[i].title,
    markdown: base64.decode(result.data.content),
  }));
  return Promise.resolve(results);
};

/**
 * @desc Function to get all admin users in db
 * @return {Promise} All users
 */
exports.team = async () => {
  const result = await CoreRepository.team();
  return Promise.resolve(result.map((user) => UserService.removeSensitive(user)));
};

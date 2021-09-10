/*
 * Title: Environments
 * Description:
 * Author: Naimur Rahaman
 * Date: 01/09/2021
 *
 */

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'mnbvcxz',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'asdfghjkl',
};

// determine which environment was passted
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'stagging';

// export corresponding environment

const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// expord module

module.exports = environmentToExport;

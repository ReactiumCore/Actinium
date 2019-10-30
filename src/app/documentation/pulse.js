/**
 * @api {Object} Actinium.Pulse Pulse
 * @apiVersion 3.0.3
 * @apiName Pulse
 * @apiGroup Actinium
 * @apiDescription Pulse allows you to schedule tasks in Actinium using full [crontab](http://www.nncron.ru/help/EN/working/cron-format.htm) syntax.
 */

/**
 * @api {Array} Actinium.Pulse.definitions Pulse.definitions
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.definitions
 * @apiDescription List of defined Pulse cron jobs.
 */

/**
 * @api {Function} Actinium.Pulse.define(id,params,options,callback) Pulse.define()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.define
 * @apiDescription Define and scheudle a Pulse cron job.
 *
 * @apiParam {String} id ID of the cron job.
 * @apiParam {Mixed} [params] If the value is an `{Object}`, the value will be passed to the callback function excluding the `schedule` and `order` parameters.
 *
 * If the value is a `{String}`, the value will be used as the crontab schedule value.
 * @apiParam {String} [params.schedule="* * * * *"] The crontab syntax for job scheduling.
 * @apiParam {Number} [params.order=100] The index of the job. Used to prioritize jobs. The lower the value the higher the priority.
 * @apiParam {Object} [options] Optional configuration for job scheduling.
 * @apiParam {Boolean} [options.scheduled=true] A boolean to set if the created task is schaduled.
 * @apiParam {String} [options.timezone] The timezone that is used for job scheduling.

  Example: `America/Sao_Paulo`
 * @apiParam {Promise} callback Function to execute when the job is run. The `params` object will be passed to the callback function. Your callback function should return a promise.
 *
 * @apiExample Example Usage:
 * // 1. Log the current timestamp every minute.
 * Actinium.Pulse.define('timestamp', () => {
 *   console.log(Date.now());
 * });
 *
 * // 2. Log the current timestamp at 5 minutes into the hour.
 * Actinium.Pulse.define('timestamp', '5 * * * *', () => {
 *   console.log(Date.now());
 * });
 *
 * // 3. Say Hello every 5 seconds then wait for 30 seconds before restarting.
 * Actinium.Pulse.define(
 *   'hello',
 *   {
 *     schedule: '0,5,10,15,20,25,30 * * * * *',
 *     name: 'Todd'
 *   },
 *   ({ name }) => console.log(`Hello ${name}`)
 * );
 *
 * // 4. Create a job but don't start it.
 * Actinium.Pulse.define('timestamp', '* * * * *', { scheduled: false }, () => {
 *   console.log(Date.now());
 * });
 *
 * @apiSuccessExample {json} Returns:
 * {
      id: '{String} id of the job',
      order: '{Number} The index of the job.'
      task: {
          start: '{Function} Starts the scheduled task.',
          stop: '{Function} Stops the scheduled task. You will be able to restart the task.',
          destroy: '{Function} Stops and destroys the task. You will not be able to restart the task.'
      },
      warn: '{String} Warning message indicating if the task has already been defined.'
 * }
 */

/**
 * @api {Function} Actinium.Pulse.replace(id,params,options,callback) Pulse.replace()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.replace
 * @apiDescription Place a Pulse cron job. If the task is duplicated, all instances are removed and replaced with the newly defined task. See [Pulse.define()](#api-Actinium-Pulse_define) for deatils.
 */

/**
 * @api {Function} Actinium.Pulse.remove(id) Pulse.remove()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.remove
 * @apiDescription Remove a Pulse cron job. If the task is duplicated, all instances are removed.
 *
 * @apiParam {String} id ID of the cron job.
 */

/**
 * @api {Function} Actinium.Pulse.start(id) Pulse.start()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.start
 * @apiDescription Start a Pulse cron job. If the task is duplicated, all instances are started.
 *
 * @apiParam {String} id ID of the cron job.
 */

/**
 * @api {Function} Actinium.Pulse.stop(id) Pulse.stop()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.stop
 * @apiDescription Stop a Pulse cron job. If the task is duplicated, all instances are stoped.
 *
 * @apiParam {String} id ID of the cron job.
 */

/**
 * @api {Function} Actinium.Pulse.log(id,status,params,user) Pulse.log()
 * @apiVersion 3.0.3
 * @apiGroup Actinium
 * @apiName Pulse.log
 * @apiDescription Manually log activity related to a job.
 *
 * @apiParam {String} id ID of the cron job.
 * @apiParam {String} status The status you wish to log.
 * @apiParam {Object} [params] Key value pairs of additional data to log.
 * @apiParam {User} [user] Parse.User object who the cron job is acting on the behalf of.
 */

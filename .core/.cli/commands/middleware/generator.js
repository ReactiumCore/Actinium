import Actions from './actions.js';

export default ({ params, props }) => {
    const { ActionSequence, ora } = arcli;
    console.log('');
    const spinner = ora({
        spinner: 'dots',
        color: 'cyan',
    });

    spinner.start();

    const actions = Actions(spinner);

    return ActionSequence({
        actions,
        options: { params, props },
    })
        .then((success) => {
            spinner.succeed('complete!');
            console.log('');
            return success;
        })
        .catch((error) => {
            spinner.fail('error!');
            return error;
        });
};
